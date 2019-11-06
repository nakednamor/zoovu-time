import { WorkTrackRecord } from "./WorkTrackRecord";
import { addMissingZero } from "./util/Utilities";

export class WorkTrackDayRecord {
  private readonly _date: string;
  private readonly _records: WorkTrackRecord[];

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
    return this._minutesToTimeString(minutesWorked);
  };

  public getWorkingTime = (): number => {
    return this.records
      .map(record => record.getWorkingTime())
      .reduce((total: number, currentVal: number) => {
        return total + currentVal;
      }, 0);
  };

  public getZohoStartTime = (): string | null => {
    return this._records.length === 0 ? null : this._records[0].start;
  };

  public getZohoEndTime = (): string | null => {
    const startTimeString: string | null = this.getZohoStartTime();
    const endTimeString: string | null = this._getEndOfLastRecord();

    if (startTimeString === null || endTimeString === null) {
      return null;
    }

    if (this._records.length === 1) {
      return this.records[0].end;
    }

    const startTimeArray: string[] = startTimeString.split(":");
    const startTimeInMinutes: number =
      +startTimeArray[0] * 60 + +startTimeArray[1];

    return this._minutesToTimeString(
      startTimeInMinutes + this.getWorkingTime()
    );
  };

  public validMaxWorkingTimeDuration = (): boolean => {
    return this.getWorkingTime() < 10 * 60;
  };

  public validMinWorkingTimeDuration = (): boolean => {
    return this.getWorkingTime() >= 7 * 60 + 42;
  };

  public validEndTime = (): boolean => {
    const lastEndTime: string | null = this._getEndOfLastRecord();
    return lastEndTime === null || !/2\d:\d\d/.test(lastEndTime);
  };

  private _getEndOfLastRecord = (): string | null => {
    if (this._records.length === 0) {
      return null;
    } else {
      return this._records[this._records.length - 1].end;
    }
  };

  private _minutesToTimeString = (minutes: number): string => {
    return (
      addMissingZero(Math.floor(minutes / 60)) +
      ":" +
      addMissingZero(minutes % 60)
    );
  };
}
