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
  ): string => {
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

  const getSingleRecords = (
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

  function getRecords(keys: string[]): Promise<WorkTrackRecord[]> {
    return new Promise<WorkTrackRecord[]>((resolve, reject) => {
      chrome.storage.local.get(keys, val => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        console.log("found multiple values by keys");

        const result: WorkTrackRecord[] = [];
        Object.keys(val).forEach(key => {
          if (val[key]) {
            result.push(result[key]);
          }
        });

        console.log(result);
        resolve(result);
      });
    });
  }

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
    getSingleRecords(now.getFullYear(), now.getMonth() + 1, now.getDate()).then(
      success,
      error
    );
  };

  function buildKeys(year: number, month: number): string[] {
    const keys: string[] = [];
    for (let i = 1; i <= 31; i++) {
      keys.push(buildKey(year, month, i));
    }

    return keys;
  }

  const getMonthlyRecords = (year: number, month: number, callback) => {
    function success(val) {
      console.log("im success");
      console.log(val);
      callback(val);
    }

    function error(data) {
      console.log("im error");
      console.log(data);
    }

    const keys = buildKeys(year, month);
    console.log(keys);

    getRecords(keys).then(success, error);
  };

  return {
    saveRecords,
    getRecords: getSingleRecords,
    buildKey,
    getTodaysRecords,
    getMonthlyRecords
  };
}
