import { WorkTrackRecord } from "./WorkTrackRecord";

export class WorkTrackDayRecord {
  private _date: string;
  private _records: WorkTrackRecord[];

  constructor(date: string, records?: WorkTrackRecord[]) {
    this._date = date;
    this._records = records || [];
  }

  get date(): string {
    return this._date;
  }

  get records(): WorkTrackRecord[] {
    return this._records;
  }
}
