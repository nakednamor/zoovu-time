import StorageArea = chrome.storage.StorageArea;
import { ChromeRuntime, WorkTrackStore } from "../WorkTrackStorage";

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
    systemUnderTest = new WorkTrackStore(storageArea, chromeRuntime);
  });

  describe("buildKey", () => {
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

      test(`should call success handler with found records: ${storageResponse[key]}`, () => {
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
    test(`should call error handler with message: '${storageErrorMessage}'`, () => {
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
    test.todo("should return empty array when there are no records ");
    test.todo("should return single work-track records");
    test.todo("should return 2 work-track records");
    test.todo("should return 3 work-track records");
    test.todo("should call error callback in case storage error happens");
  });
});
