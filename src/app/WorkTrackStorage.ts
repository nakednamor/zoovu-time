import { addMissingZero, log, removeLeadingZeros } from "./util/Utilities";
import { WorkTrackRecord } from "./WorkTrackRecord";
import { WorkTrackDayRecord } from "./WorkTrackDayRecord";
import StorageArea = chrome.storage.StorageArea;

export class WorkTrackStore {
  // @ts-ignore
  private storageArea;

  constructor(storageArea: StorageArea) {
    this.storageArea = storageArea;
  }

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

  removeAllRecords = callback => {
    chrome.storage.local.clear(callback);
  };

  buildKey = (year: number, month: number, day: number): string => {
    const partYear = addMissingZero(year, 4);
    const partMonth = addMissingZero(month);
    const partDay = addMissingZero(day);

    return partYear + "_" + partMonth + "_" + partDay;
  };

  // @ts-ignore
  private _convertFromStorage = (
    key: string,
    records: number[] | undefined
  ): WorkTrackDayRecord => {
    const dayRecord = new WorkTrackDayRecord(key);

    if (!records) {
      return dayRecord;
    }

    // tslint:disable-next-line:prefer-for-of
    for (const i = 0; i < records.length; i + 2) {
      const record = new WorkTrackRecord(
        addMissingZero(records[i], 4),
        addMissingZero(records[1 + 1], 4)
      );
      dayRecord.records.push(record);
    }

    if (records.length % 2 !== 0) {
      dayRecord.records.push(
        new WorkTrackRecord(addMissingZero(records[records.length - 1], 4))
      );
    }

    return dayRecord;
  };

  // @ts-ignore
  private _convertForStorage = (records: WorkTrackDayRecord[]): any => {
    const items = {};
    records.forEach(rec => {
      const dayRecords: number[] = [];

      rec.records.forEach(r => {
        dayRecords.push(removeLeadingZeros(r.start));
        if (r.end) {
          dayRecords.push(removeLeadingZeros(r.end));
        }
      });

      items[rec.date] = dayRecords;
    });

    return items;
  };
}
