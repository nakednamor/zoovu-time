export class WorkTrackRecord {
  private _start: string;
  private _end: string | null;

  constructor(start: string, end?: string) {
    this._start = start;
    this._end = end || null;
  }

  get start(): string {
    return this._start;
  }

  get end(): string | null {
    return this._end;
  }

  set end(val: string | null) {
    this._end = val;
  }

  public getWorkingTime = (): number => {
    if (this.end === null) {
      return 0;
    }

    const startArr = this.start.split(":");
    const endArr = this.end.split(":");

    const hourDiff = +endArr[0] - +startArr[0];
    const minDiff = +endArr[1] - +startArr[1];

    return hourDiff * 60 + minDiff;
  };
}
