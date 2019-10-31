import StorageArea = chrome.storage.StorageArea;
import { ChromeRuntime, WorkTrackStore } from "../WorkTrackStorage";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import { WorkTrackRecord } from "../WorkTrackRecord";
const buildKeyFromDate = (date: Date): string => {
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
      expect(successCallback).toBeCalledTimes(1);
      const actualWorkTrackDayRecord = successCallback.mock.calls[0][0];
      expect(JSON.stringify(actualWorkTrackDayRecord)).toEqual(
        JSON.stringify(expectedWorktrackDayRecord)
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
      expect(successCallback).toHaveBeenCalledTimes(1);
      const actualWorkTrackDayRecord = successCallback.mock.calls[0][0];
      expect(JSON.stringify(actualWorkTrackDayRecord)).toEqual(
        JSON.stringify(expectedWorktrackDayRecord)
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
      expect(successCallback).toHaveBeenCalledTimes(1);
      const actualWorkTrackDayRecord = successCallback.mock.calls[0][0];
      expect(JSON.stringify(actualWorkTrackDayRecord)).toEqual(
        JSON.stringify(expectedWorktrackDayRecord)
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
      expect(successCallback).toHaveBeenCalledTimes(1);
      const actualWorkTrackDayRecord = successCallback.mock.calls[0][0];
      expect(JSON.stringify(actualWorkTrackDayRecord)).toEqual(
        JSON.stringify(expectedWorktrackDayRecord)
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

  describe("saveRecord(..)", () => {
    test("should resolve", () => {
      // given
      const record = new WorkTrackDayRecord("2018_09_22", [
        new WorkTrackRecord("08:15", "12:30"),
        new WorkTrackRecord("13:40")
      ]);

      storageArea.set = jest
        .fn()
        .mockImplementation((_items, callback) => callback());

      // expect
      return expect(systemUnderTest.saveRecord(record)).resolves.toEqual(
        record
      );
    });

    test("should resolve with error message", () => {
      // given
      const errorMessage = "ups, something bad happened";
      chromeRuntime.lastError = { message: errorMessage };
      storageArea.set = jest
        .fn()
        .mockImplementation((_items, callback) => callback(errorMessage));

      // expect
      return expect(
        systemUnderTest.saveRecord(new WorkTrackDayRecord("2023_01_10", []))
      ).rejects.toEqual(errorMessage);
    });
  });

  describe("getRecordsOfMonth(..)", () => {
    let successCallback;
    let errorCallback;

    beforeEach(() => {
      successCallback = jest.fn();
      errorCallback = jest.fn();
    });

    const getDatesOfMonth = (year: number, month: number): string[] => {
      const date = new Date(year, month, 0);
      const result: string[] = [];

      for (let i = 1; i <= date.getDate(); i++) {
        const dateString = systemUnderTest.buildKey(year, month, i);

        result.push(dateString);
      }
      return result;
    };

    test("when no entries exist, should return one WorkTrackDays with empty records for each day of month", async () => {
      // given
      const year = 2019;
      const month = 3;
      const datesOfMonth = getDatesOfMonth(year, month);

      const existingRecords = {};
      datesOfMonth.forEach(date => (existingRecords[date] = undefined));

      const mockFunction = jest.fn();
      mockFunction.mockImplementation((_keys, callback) =>
        callback(existingRecords)
      );
      storageArea.get = mockFunction;

      // when
      await systemUnderTest.getRecordsOfMonth(
        year,
        month,
        successCallback,
        errorCallback
      );

      // then
      expect(storageArea.get).toHaveBeenCalledTimes(1);
      const actualKeys = mockFunction.mock.calls[0][0];
      expect(actualKeys).toEqual(datesOfMonth);

      expect(errorCallback).not.toHaveBeenCalled();
      expect(successCallback).toBeCalledTimes(1);
      const actual = successCallback.mock.calls[0][0];

      expect(actual.length).toEqual(datesOfMonth.length);
      for (let i = 0; i < datesOfMonth.length; i++) {
        const expectedDate = datesOfMonth[i];

        expect(actual[i].date).toEqual(expectedDate);
        expect(actual[i].records.length).toEqual(0);
      }
    });

    test("should return WorkTrackDays", async () => {
      // given
      const year = 2020;
      const month = 2;
      const datesOfMonth = getDatesOfMonth(year, month);

      const existingRecords = {};
      datesOfMonth.forEach(date => (existingRecords[date] = undefined));
      existingRecords["2020_02_02"] = [800, 1200, 1230, 1700];
      existingRecords["2020_02_10"] = [932, 1310, 1400];
      existingRecords["2020_02_29"] = [800];

      const expectedWorkTrackDays = {
        "2020_02_02": new WorkTrackDayRecord("2020_02_02", [
          new WorkTrackRecord("08:00", "12:00"),
          new WorkTrackRecord("12:30", "17:00")
        ]),
        "2020_02_10": new WorkTrackDayRecord("2020_02_10", [
          new WorkTrackRecord("09:32", "13:10"),
          new WorkTrackRecord("14:00")
        ]),
        "2020_02_29": new WorkTrackDayRecord("2020_02_29", [
          new WorkTrackRecord("08:00")
        ])
      };

      const mockFunction = jest.fn();
      mockFunction.mockImplementation((_keys, callback) =>
        callback(existingRecords)
      );
      storageArea.get = mockFunction;

      // when
      await systemUnderTest.getRecordsOfMonth(
        year,
        month,
        successCallback,
        errorCallback
      );

      // then
      expect(storageArea.get).toHaveBeenCalledTimes(1);
      const actualKeys = mockFunction.mock.calls[0][0];
      expect(actualKeys).toEqual(datesOfMonth);

      expect(errorCallback).not.toHaveBeenCalled();
      expect(successCallback).toBeCalledTimes(1);
      const actual: WorkTrackDayRecord[] = successCallback.mock.calls[0][0];

      expect(actual.length).toEqual(datesOfMonth.length);
      for (let i = 0; i < datesOfMonth.length; i++) {
        const expectedDate = datesOfMonth[i];

        expect(actual[i].date).toEqual(expectedDate);

        if (existingRecords[expectedDate] === undefined) {
          expect(actual[i].records.length).toEqual(0);
        } else {
          const actualWorkDayTrack = actual[i];
          expect(JSON.stringify(actualWorkDayTrack)).toEqual(
            JSON.stringify(expectedWorkTrackDays[expectedDate])
          );
        }
      }
    });

    test("error callback", async () => {
      // given
      const errorMessage = "ups, error occured";
      chromeRuntime.lastError = { message: errorMessage };
      storageArea.get = jest
        .fn()
        .mockImplementation((_keys, callback) => callback(errorMessage));

      // when
      await systemUnderTest.getRecordsOfMonth(
        2020,
        8,
        successCallback,
        errorCallback
      );

      // then
      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenNthCalledWith(1, errorMessage);
    });
  });
});
