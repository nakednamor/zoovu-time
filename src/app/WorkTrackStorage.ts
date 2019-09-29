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
  const buildKey = (
    year: number = new Date(Date.now()).getFullYear(),
    month: number = new Date(Date.now()).getMonth() + 1,
    day: number = new Date(Date.now()).getDate()
  ) => {
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

  const saveRecords = (
    year: number,
    month: number,
    day: number,
    records: WorkTrackRecord[]
  ): Promise<WorkTrackRecord[]> => {
    const key = buildKey(year, month, day);

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: records }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        console.log("saved");
        console.log(records);
        resolve(records);
      });
    });
  };

  const getRecords = (
    year: number,
    month: number,
    day: number
  ): Promise<WorkTrackRecord[]> => {
    const key = buildKey(year, month, day);
    return new Promise<WorkTrackRecord[]>((resolve, reject) => {
      chrome.storage.local.get(key, val => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        console.log("found");
        console.log(val);
        resolve(val[key]);
      });
    });
  };

  const getTodaysRecords = callback => {
    function success(val) {
      console.log("im success");
      console.log(val);
      callback(val);
    }

    function error(data) {
      console.log("im error");
      console.log(data);
    }

    const now = new Date(Date.now());
    getRecords(now.getFullYear(), now.getMonth() + 1, now.getDate()).then(
      success,
      error
    );
  };

  return {
    saveRecords,
    getRecords,
    buildKey,
    getTodaysRecords
  };
}
