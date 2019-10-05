import { addMissingZero, log } from "./util/Utilities";

export interface WorkTrackRecord {
  start: string;
  end: string | null;
}

export interface WorkTrackDayRecord {
  date: string;
  records: WorkTrackRecord[];
}

export class WorkTrackStore {
  buildKey = (
    year: number = new Date(Date.now()).getFullYear(),
    month: number = new Date(Date.now()).getMonth() + 1,
    day: number = new Date(Date.now()).getDate()
  ): string => {
    const partYear = addMissingZero(year);
    const partMonth = addMissingZero(month);
    const partDay = addMissingZero(day);

    return partYear + "_" + partMonth + "_" + partDay;
  };

  saveRecords = (
    year: number,
    month: number,
    day: number,
    records: WorkTrackRecord[]
  ): Promise<WorkTrackRecord[]> => {
    const key = this.buildKey(year, month, day);

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: records }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        log("saved records", records);
        resolve(records);
      });
    });
  };

  getSingleRecords = (
    year: number,
    month: number,
    day: number
  ): Promise<WorkTrackRecord[]> => {
    const key = this.buildKey(year, month, day);
    return new Promise<WorkTrackRecord[]>((resolve, reject) => {
      chrome.storage.local.get(key, val => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        resolve(val[key]);
      });
    });
  };

  getRecords = (keys: string[]): Promise<WorkTrackRecord[]> => {
    return new Promise<WorkTrackRecord[]>((resolve, reject) => {
      chrome.storage.local.get(keys, val => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }

        const result: WorkTrackRecord[] = [];
        Object.keys(val).forEach(key => {
          if (val[key]) {
            result.push(result[key]);
          }
        });

        resolve(result);
      });
    });
  };

  getTodaysRecords = callback => {
    function success(val) {
      callback(val);
    }

    function error(data) {
      log("inside error handler", data);
      callback([]);
    }

    const now = new Date(Date.now());
    this.getSingleRecords(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    ).then(success, error);
  };
  buildKeys = (year: number, month: number): string[] => {
    const keys: string[] = [];
    for (let i = 1; i <= 31; i++) {
      keys.push(this.buildKey(year, month, i));
    }

    return keys;
  };

  getMonthlyRecords = (year: number, month: number, callback) => {
    function success(val) {
      callback(val);
    }

    function error(data) {
      log("error handler", data);
    }

    const keys = this.buildKeys(year, month);
    this.getRecords(keys).then(success, error);
  };
}
