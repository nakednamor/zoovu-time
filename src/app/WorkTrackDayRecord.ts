import { WorkTrackRecord } from "./WorkTrackRecord";
import { addMissingZero } from "./util/Utilities";

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

  public getWorkedTimeString = (): string => {
    const minutesWorked: number = this.getWorkingTime();

    return (
      addMissingZero(Math.floor(minutesWorked / 60)) +
      ":" +
      addMissingZero(minutesWorked % 60)
    );
  };

  public getWorkingTime = (): number => {
    return this.records
      .map(record => record.getWorkingTime())
      .reduce((total: number, currentVal: number) => {
        return total + currentVal;
      }, 0);
  };
}
