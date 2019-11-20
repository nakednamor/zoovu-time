import { WorkTrackRecord } from "./WorkTrackRecord";
import { addMissingZero } from "./util/Utilities";

export class WorkTrackDayRecord {
  private readonly _date: string;
  private _dateObject: Date | null = null;
  private readonly _records: WorkTrackRecord[];

  constructor(date: string, records?: WorkTrackRecord[]) {
    this._date = date;
    this._records = records || [];
  }

  get date(): string {
    return this._date;
  }

  get dateObject(): Date {
    if (this._dateObject !== null) {
      return this._dateObject;
    }

    const dateArray = this._date.split("_");
    this._dateObject = new Date(
      +dateArray[0],
      +dateArray[1] - 1,
      +dateArray[2]
    );
    return this._dateObject;
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
    const startTime: string | null = this._getFirstStartTime();
    if (startTime) {
      return this._timeStringTo12HourFormat(startTime);
    } else {
      return null;
    }
  };

  public getZohoEndTime = (): string | null => {
    const startTimeString: string | null = this._getFirstStartTime();

    if (startTimeString === null || this._getEndOfLastRecord() === null) {
      return null;
    }

    if (this._records.length === 1) {
      return this.records[0].end;
    }

    const endTimeMinutes: number =
      this._timeStringToMinutes(startTimeString) + this.getWorkingTime();
    const endTimeString: string = this._minutesToTimeString(endTimeMinutes);
    return this._timeStringTo12HourFormat(endTimeString);
  };

  public validMaxWorkingTimeDuration = (): boolean => {
    return this.getWorkingTime() <= 10 * 60;
  };

  public validMinWorkingTimeDuration = (): boolean => {
    return this.isWeekend() || this.getWorkingTime() >= 5 * 60;
  };

  public isWeekend = (): boolean => {
    return this.dateObject.getDay() === 0 || this.dateObject.getDay() === 6;
  };

  public validEndTime = (): boolean => {
    const lastEndTime: string | null = this._getEndOfLastRecord();
    return lastEndTime === null || !/2\d:\d\d/.test(lastEndTime);
  };

  public isValid = (): boolean => {
    return (
      this.validMinWorkingTimeDuration() &&
      this.validMaxWorkingTimeDuration() &&
      this.validEndTime()
    );
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

  private _timeStringToMinutes = (time: string): number => {
    const array: string[] = time.split(":");
    return +array[0] * 60 + +array[1];
  };

  private _timeStringTo12HourFormat = (time: string): string => {
    const minutes: number = this._timeStringToMinutes(time);
    const minutesToUse: number = minutes - 720 < 0 ? minutes : minutes - 720;
    const suffix: string = minutes - 720 < 0 ? " AM" : " PM";

    const timeString: string = this._minutesToTimeString(minutesToUse);
    return timeString.replace(/^0/, "") + suffix;
  };

  private _getFirstStartTime = (): string | null => {
    return this._records.length === 0 ? null : this._records[0].start;
  };
}
