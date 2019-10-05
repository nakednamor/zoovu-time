export class WorkTrackRecord {
  start: string;
  end: string | null;

  constructor(start: string, end?: string) {
    this.start = start;
    this.end = end || null;
  }
}
