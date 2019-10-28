import { addMissingZero, removeLeadingZeros } from "./util/Utilities";
import { WorkTrackRecord } from "./WorkTrackRecord";
import StorageArea = chrome.storage.StorageArea;
import LastError = chrome.runtime.LastError;
import { WorkTrackDayRecord } from "./WorkTrackDayRecord";

export interface ChromeRuntime {
  lastError: LastError | undefined;
}

export class WorkTrackStore {
  // @ts-ignore
  private storageArea: StorageArea;
  private chromeRuntime: ChromeRuntime;

  constructor(storageArea: StorageArea, chromeRuntime: ChromeRuntime) {
    this.storageArea = storageArea;
    this.chromeRuntime = chromeRuntime;
  }

  saveRecord = (record: WorkTrackDayRecord): Promise<WorkTrackDayRecord> => {
    return new Promise((resolve, reject) => {
      this.storageArea.set(this._convertForStorage(record), () => {
        if (this.chromeRuntime.lastError) {
          reject(this.chromeRuntime.lastError.message);
        }
        resolve(record);
      });
    });
  };

  getSingleRecords = (
    year: number,
    month: number,
    day: number
  ): Promise<number[]> => {
    const key = this.buildKey(year, month, day);
    return new Promise<number[]>((resolve, reject) => {
      this.storageArea.get(key, val => {
        if (this.chromeRuntime.lastError) {
          reject(this.chromeRuntime.lastError.message);
        }

        resolve(val[key]);
      });
    });
  };

  getTodaysRecords = (
    successCallback: (records: WorkTrackDayRecord) => void,
    errorCallback: (message: string) => void
  ) => {
    const now = new Date(Date.now());
    this.getSingleRecords(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    ).then(
      data => {
        successCallback(this._convertFromStorage(now, data));
      },
      error => errorCallback(error)
    );
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

  buildKeyFromDate = (date: Date): string => {
    return this.buildKey(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  };

  private _convertFromStorage = (
    date: Date,
    records: number[]
  ): WorkTrackDayRecord => {
    const key = this.buildKeyFromDate(date);
    const dayRecord = new WorkTrackDayRecord(key);

    if (!records) {
      return dayRecord;
    }

    const even = records.length % 2 === 0;
    const loopStop = even ? records.length : records.length - 1;

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < loopStop; i = i + 2) {
      const start = addMissingZero(records[i], 4);
      const end = addMissingZero(records[i + 1], 4);
      const record = new WorkTrackRecord(
        start.slice(0, 2) + ":" + start.slice(2),
        end.slice(0, 2) + ":" + end.slice(2)
      );
      dayRecord.records.push(record);
    }

    if (!even) {
      const start = addMissingZero(records[records.length - 1], 4);
      dayRecord.records.push(
        new WorkTrackRecord(start.slice(0, 2) + ":" + start.slice(2))
      );
    }

    return dayRecord;
  };

  private _convertForStorage = (
    record: WorkTrackDayRecord
  ): { [key: string]: number[] } => {
    const items = {};
    const dayRecords: number[] = [];
    record.records.forEach(rec => {
      dayRecords.push(removeLeadingZeros(rec.start));
      if (rec.end) {
        dayRecords.push(removeLeadingZeros(rec.end));
      }
    });

    items[record.date] = dayRecords;

    return items;
  };
}
