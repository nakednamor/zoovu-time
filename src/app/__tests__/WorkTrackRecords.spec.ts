import { WorkTrackRecord } from "../WorkTrackRecord";

describe("getWorkingTime()", () => {
  const testGetWorkingTime = (
    expected: number,
    start: string,
    end?: string
  ): void => {
    // given
    const record = new WorkTrackRecord(start, end);

    // when
    const actual = record.getWorkingTime();

    // then
    expect(actual).toEqual(expected);
  };

  const testSetup = [
    { expected: 0, start: "08:30", end: undefined },
    { expected: 210, start: "08:30", end: "12:00" },
    { expected: 159, start: "07:20", end: "9:59" },
    { expected: 461, start: "09:40", end: "17:21" },
    { expected: 516, start: "13:14", end: "21:50" },
    { expected: 36, start: "13:14", end: "13:50" }
  ];

  testSetup.forEach(setup => {
    test(`should return ${setup.expected} for start: ${setup.start} and end: ${setup.end}`, () => {
      testGetWorkingTime(setup.expected, setup.start, setup.end);
    });
  });
});
