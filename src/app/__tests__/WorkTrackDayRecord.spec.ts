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

describe("getZohoStartTime()", () => {
  const testSetup = [
    { expected: null, records: [] },
    { expected: "08:10", records: [["08:10", "12:05"], ["13:00", "17:23"]] },
    { expected: "08:25", records: [["08:25", "11:55"], ["12:59"]] }
  ];

  const testGetZohoStartTime = (
    expected: string | null,
    records: string[][]
  ): void => {
    // given
    const record = new WorkTrackDayRecord("2017_03_28", []);
    records.forEach(arr => {
      const rec = new WorkTrackRecord(arr[0], arr[1]);
      record.records.push(rec);
    });

    // when
    const actual = record.getZohoStartTime();

    // then
    expect(actual).toEqual(expected);
  };

  testSetup.forEach(setup => {
    test(`should return start of first record: ${setup.expected}`, () => {
      testGetZohoStartTime(setup.expected, setup.records);
    });
  });
});

describe("getZohoEndTime()", () => {
  const testSetup = [
    { expected: null, records: [] },
    { expected: null, records: [["07:30"]] },
    { expected: "16:28", records: [["08:10", "12:05"], ["13:00", "17:23"]] },
    {
      expected: "17:00",
      records: [["08:00", "11:00"], ["12:00", "16:00"], ["18:00", "20:00"]]
    },
    { expected: null, records: [["08:25", "11:55"], ["12:59"]] }
  ];

  const testGetZohoEndTime = (
    expected: string | null,
    records: string[][]
  ): void => {
    // given
    const record = new WorkTrackDayRecord("1985_01_18", []);
    records.forEach(arr => {
      const rec = new WorkTrackRecord(arr[0], arr[1]);
      record.records.push(rec);
    });

    // when
    const actual = record.getZohoEndTime();

    // then
    expect(actual).toEqual(expected);
  };

  testSetup.forEach(setup => {
    test(`should return start time + worked time: ${setup.expected}`, () => {
      testGetZohoEndTime(setup.expected, setup.records);
    });
  });
});

describe("validMaxWorkingTimeDuration()", () => {
  const testSetup = [
    { expected: true, records: [] },
    { expected: true, records: [["07:30"]] },
    { expected: true, records: [["08:10", "12:05"], ["13:00", "17:23"]] },
    {
      expected: true,
      records: [["08:00", "11:00"], ["12:00", "16:00"], ["18:00", "20:00"]]
    },
    { expected: true, records: [["08:25", "11:55"], ["12:59"]] },
    { expected: false, records: [["08:00", "23:30"]] },
    {
      expected: true,
      records: [["08:00", "12:00"], ["12:30", "17:00"], ["20:00", "21:29"]]
    },
    {
      expected: false,
      records: [["08:00", "12:00"], ["12:30", "17:00"], ["20:00", "21:30"]]
    }
  ];

  const testValidMaxWorkingTimeDuration = (
    expected: boolean,
    records: string[][]
  ): void => {
    // given
    const record = new WorkTrackDayRecord("1985_04_16", []);
    records.forEach(arr => {
      const rec = new WorkTrackRecord(arr[0], arr[1]);
      record.records.push(rec);
    });

    // when
    const actual: boolean = record.validMaxWorkingTimeDuration();

    // then
    expect(actual).toEqual(expected);
  };

  testSetup.forEach(setup => {
    test(`should return: ${setup.expected}`, () => {
      testValidMaxWorkingTimeDuration(setup.expected, setup.records);
    });
  });
});

describe("validEndTime()", () => {
  const testSetup = [
    { expected: true, records: [] },
    { expected: true, records: [["07:30"]] },
    { expected: true, records: [["08:10", "12:05"]] },
    { expected: true, records: [["08:10", "12:05"], ["13:00", "17:23"]] },
    { expected: false, records: [["08:10", "20:00"]] },
    { expected: false, records: [["08:10", "12:05"], ["13:00", "20:00"]] }
  ];

  const testValidEndTime = (expected: boolean, records: string[][]): void => {
    // given
    const record = new WorkTrackDayRecord("1985_01_18", []);
    records.forEach(arr => {
      const rec = new WorkTrackRecord(arr[0], arr[1]);
      record.records.push(rec);
    });

    // when
    const actual = record.validEndTime();

    // then
    expect(actual).toEqual(expected);
  };

  testSetup.forEach(setup => {
    test(`should return: ${setup.expected}`, () => {
      testValidEndTime(setup.expected, setup.records);
    });
  });
});

describe("validMinWorkingTimeDuration()", () => {
  const testSetup = [
    { expected: false, records: [] },
    { expected: false, records: [["07:30"]] },
    { expected: false, records: [["08:00", "12:00"], ["13:00", "16:41"]] },
    { expected: true, records: [["08:00", "12:00"], ["13:00", "16:42"]] }
  ];

  const testValidMinWorkingTimeDuration = (
    expected: boolean,
    records: string[][]
  ): void => {
    // given
    const record = new WorkTrackDayRecord("1985_04_16", []);
    records.forEach(arr => {
      const rec = new WorkTrackRecord(arr[0], arr[1]);
      record.records.push(rec);
    });

    // when
    const actual: boolean = record.validMinWorkingTimeDuration();

    // then
    expect(actual).toEqual(expected);
  };

  testSetup.forEach(setup => {
    test(`should return: ${setup.expected}`, () => {
      testValidMinWorkingTimeDuration(setup.expected, setup.records);
    });
  });
});
