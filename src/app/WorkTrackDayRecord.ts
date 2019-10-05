import { WorkTrackRecord } from "./WorkTrackRecord";

export class WorkTrackDayRecord {
  date: string;
  records: WorkTrackRecord[];

  constructor(date: string, records?: WorkTrackRecord[]) {
    this.date = date;
    this.records = records || [];
  }
}
