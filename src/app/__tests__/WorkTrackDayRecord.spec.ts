import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import { WorkTrackRecord } from "../WorkTrackRecord";

describe("getWorkingTime()", () => {
  const testGetWorkingTime = (expected: number, records: string[][]): void => {
    // given
    const record = new WorkTrackDayRecord("2019_10_31", []);
    records.forEach(arr => {
      const rec = new WorkTrackRecord(arr[0], arr[1]);
      record.records.push(rec);
    });

    // when
    const actual = record.getWorkingTime();

    // then
    expect(actual).toEqual(expected);
  };

  const testSetup = [
    { expected: 0, records: [] },
    { expected: 498, records: [["08:10", "12:05"], ["13:00", "17:23"]] },
    { expected: 210, records: [["08:25", "11:55"], ["12:59"]] }
  ];

  testSetup.forEach(setup => {
    test(`should return ${setup.expected}`, () => {
      testGetWorkingTime(setup.expected, setup.records);
    });
  });
});

describe("getWorkedTimeString()", () => {
  const testSetup = [
    { expected: "00:00", records: [] },
    { expected: "08:18", records: [["08:10", "12:05"], ["13:00", "17:23"]] },
    { expected: "03:30", records: [["08:25", "11:55"], ["12:59"]] }
  ];

  const getWorkedTimeString = (expected: string, records: string[][]): void => {
    // given
    const record = new WorkTrackDayRecord("2019_10_31", []);
    records.forEach(arr => {
      const rec = new WorkTrackRecord(arr[0], arr[1]);
      record.records.push(rec);
    });

    // when
    const actual = record.getWorkedTimeString();

    // then
    expect(actual).toEqual(expected);
  };

  testSetup.forEach(setup => {
    test(`should return ${setup.expected}`, () => {
      getWorkedTimeString(setup.expected, setup.records);
    });
  });
});
