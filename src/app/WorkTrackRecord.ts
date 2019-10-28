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
}
