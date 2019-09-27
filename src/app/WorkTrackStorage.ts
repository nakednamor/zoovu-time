export interface WorkTrackRecord {
  s: string;
  e: string | null;
}

export interface WorkTrackDayRecord {
  day: string;
  records: WorkTrackRecord[];
}

export interface WorkTrackMonthRecord {
  month: string;
  records: WorkTrackDayRecord[];
}

export interface WorkTrackYearRecord {
  year: string;
  records: WorkTrackMonthRecord[];
}

export function workTrackStore() {
  const getRecordsOfDay = (
    year: number,
    month: number,
    day: number
  ): WorkTrackDayRecord => {
    const recordKey = buildKey(year, month, day);

    // tslint:disable-next-line:no-console
    console.log(recordKey);

    return { day: addMissingZero(day), records: [] };
  };

  const buildKey = (year: number, month: number, day: number) => {
    const partYear = addMissingZero(year);
    const partMonth = addMissingZero(month);
    const partDay = addMissingZero(day);

    return partYear + "_" + partMonth + "_" + partDay;
  };

  const addMissingZero = (val: number, expectedLength: number = 2): string => {
    let result = "" + val;
    while (result.length < expectedLength) {
      result = "0" + result;
    }
    return result;
  };

  return { getRecordsOfDay };
}
