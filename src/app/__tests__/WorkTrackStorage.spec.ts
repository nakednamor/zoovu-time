import StorageArea = chrome.storage.StorageArea;
import { ChromeRuntime, WorkTrackStore } from "../WorkTrackStorage";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import { WorkTrackRecord } from "../WorkTrackRecord";

const buildKeyFromDate = (date: Date) => {
  return (
    date.getFullYear() + "_" + (date.getMonth() + 1) + "_" + date.getDate()
  );
};

const chromeRuntime: ChromeRuntime = {
  lastError: undefined
};

const mockChromeStorage = () => {
  return {
    set: jest.fn(),
    get: jest.fn(),
    getBytesInUse: jest.fn(),
    clear: jest.fn(),
    remove: jest.fn()
  };
};

describe("WorkTrackStorage", () => {
  let storageArea: StorageArea;
  let systemUnderTest;

  beforeEach(() => {
    storageArea = mockChromeStorage();
    chromeRuntime.lastError = undefined;
    systemUnderTest = new WorkTrackStore(storageArea, chromeRuntime);
  });

  describe("buildKey(..)", () => {
    const testBuildKey = (
      year: number,
      month: number,
      day: number,
      expected: string
    ): void => {
      test(`should return ${expected} for ${year}, ${month}, ${day}`, () => {
        const actual = systemUnderTest.buildKey(year, month, day);
        expect(actual).toEqual(expected);
      });
    };

    testBuildKey(2019, 11, 1, "2019_11_01");
    testBuildKey(2000, 3, 3, "2000_03_03");
    testBuildKey(863, 12, 1, "0863_12_01");
  });

  describe("getSingleRecords(..)", () => {
    const storageResponsesByKeys = {
      "2019_11_04": { "2019_11_04": undefined },
      "1999_04_24": { "1999_04_24": [] },
      "2003_10_31": { "2003_10_31": [730, 1200] }
    };

    Object.keys(storageResponsesByKeys).forEach(key => {
      const year: number = +key.split("_")[0];
      const month: number = +key.split("_")[1];
      const day: number = +key.split("_")[2];
      const storageResponse = storageResponsesByKeys[key];

      test(`should resolve with found records: ${storageResponse[key]}`, () => {
        // given
        storageArea.get = jest
          .fn()
          .mockImplementation((_keys, callback) => callback(storageResponse));

        // expect
        return expect(
          systemUnderTest.getSingleRecords(year, month, day)
        ).resolves.toEqual(storageResponse[[key]]);
      });
    });

    const storageErrorMessage = "error while getting objects";
    test(`should resolve with error-message: '${storageErrorMessage}'`, () => {
      // given
      chromeRuntime.lastError = { message: storageErrorMessage };
      storageArea.get = jest
        .fn()
        .mockImplementation((_keys, callback) => callback());

      // expect
      return expect(
        systemUnderTest.getSingleRecords(2000, 12, 12)
      ).rejects.toEqual(storageErrorMessage);
    });
  });

  describe("getTodaysRecords()", () => {
    const todaysDateString: string = buildKeyFromDate(new Date(Date.now()));
    let todaysRecords: { [key: string]: number[] };

    let successCallback;
    let errorCallback;

    beforeEach(() => {
      successCallback = jest.fn();
      errorCallback = jest.fn();

      todaysRecords = {
        [todaysDateString]: []
      };
    });

    test("should return WorktrackDayRecords object with empty array when there are no records", async () => {
      // given
      const expectedWorktrackDayRecord = new WorkTrackDayRecord(
        todaysDateString,
        []
      );
      storageArea.get = jest
        .fn()
        .mockImplementation((_keys, callback) => callback(todaysRecords));

      // when
      await systemUnderTest.getTodaysRecords(successCallback, errorCallback);

      // then
      expect(errorCallback).not.toHaveBeenCalled();
      expect(successCallback).toHaveBeenNthCalledWith(
        1,
        expectedWorktrackDayRecord
      );
    });
    test("should return single work-track records", async () => {
      // given
      todaysRecords[todaysDateString].push(825);
      const expectedWorktrackDayRecord = new WorkTrackDayRecord(
        todaysDateString,
        [new WorkTrackRecord("08:25")]
      );
      storageArea.get = jest
        .fn()
        .mockImplementation((_keys, callback) => callback(todaysRecords));

      // when
      await systemUnderTest.getTodaysRecords(successCallback, errorCallback);

      // then
      expect(errorCallback).not.toHaveBeenCalled();
      expect(successCallback).toHaveBeenNthCalledWith(
        1,
        expectedWorktrackDayRecord
      );
    });
    test("should return 2 work-track records", async () => {
      // given
      todaysRecords[todaysDateString].push(825);
      todaysRecords[todaysDateString].push(1205);
      const expectedWorktrackDayRecord = new WorkTrackDayRecord(
        todaysDateString,
        [new WorkTrackRecord("08:25", "12:05")]
      );
      storageArea.get = jest
        .fn()
        .mockImplementation((_keys, callback) => callback(todaysRecords));

      // when
      await systemUnderTest.getTodaysRecords(successCallback, errorCallback);

      // then
      expect(errorCallback).not.toHaveBeenCalled();
      expect(successCallback).toHaveBeenNthCalledWith(
        1,
        expectedWorktrackDayRecord
      );
    });

    test("should return 3 work-track records", async () => {
      // given
      todaysRecords[todaysDateString].push(700);
      todaysRecords[todaysDateString].push(1124);
      todaysRecords[todaysDateString].push(1320);
      const expectedWorktrackDayRecord = new WorkTrackDayRecord(
        todaysDateString,
        [new WorkTrackRecord("07:00", "11:24"), new WorkTrackRecord("13:20")]
      );
      storageArea.get = jest
        .fn()
        .mockImplementation((_keys, callback) => callback(todaysRecords));

      // when
      await systemUnderTest.getTodaysRecords(successCallback, errorCallback);

      // then
      expect(errorCallback).not.toHaveBeenCalled();
      expect(successCallback).toHaveBeenNthCalledWith(
        1,
        expectedWorktrackDayRecord
      );
    });
    test("should call error callback in case storage error happens", async () => {
      // given
      const storageErrorMessage = "some error happened";
      chromeRuntime.lastError = { message: storageErrorMessage };
      storageArea.get = jest
        .fn()
        .mockImplementation((_keys, callback) => callback());

      // when
      await systemUnderTest.getTodaysRecords(successCallback, errorCallback);

      // then
      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenNthCalledWith(1, storageErrorMessage);
    });
  });

  describe("saveRecords(..)", () => {
    test("should resolve with provided records", () => {
      // given
      const records: WorkTrackRecord[] = [
        new WorkTrackRecord("08:15", "12:30"),
        new WorkTrackRecord("13:40")
      ];
      storageArea.set = jest
        .fn()
        .mockImplementation((_keys, callback) => callback());

      // expect
      return expect(
        systemUnderTest.saveRecords(2018, 9, 22, records)
      ).resolves.toEqual(records);
    });

    test("should resolve with error message", () => {
      // given
      const errorMessage = "ups, something bad happened";
      chromeRuntime.lastError = { message: errorMessage };
      storageArea.set = jest
        .fn()
        .mockImplementation((_keys, callback) => callback(errorMessage));

      // expect
      return expect(
        systemUnderTest.saveRecords(2000, 1, 14, [])
      ).rejects.toEqual(errorMessage);
    });
  });
});
