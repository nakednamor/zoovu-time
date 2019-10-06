import StorageArea = chrome.storage.StorageArea;
import { WorkTrackStore } from "../WorkTrackStorage";

const mockChromeStorage = () => {
  return {
    set: jest.fn(),
    get: jest.fn(),
    getBytesInUse: jest.fn(),
    clear: jest.fn(),
    remove: jest.fn()
  };
};

const setupSystemUnderTest = (storage: StorageArea): WorkTrackStore => {
  return new WorkTrackStore(storage);
};

describe("WorkTrackStorage", () => {
  let storageArea: StorageArea;
  let systemUnderTest;

  beforeEach(() => {
    storageArea = mockChromeStorage();
    systemUnderTest = setupSystemUnderTest(storageArea);
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
});
