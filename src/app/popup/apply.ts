import { log } from "../util/Utilities";
import Port = chrome.runtime.Port;
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import { WorkTrackRecord } from "../WorkTrackRecord";

const getSelectedMonth = (): Date => {
  const input = document.getElementById(
    "ZPAtt_reg_fromDate"
  ) as HTMLInputElement;

  return new Date(Date.parse(input.value));
};

// tslint:disable-next-line:no-console
console.log("hier");

const getRecord = (
  tableDate: string,
  records: WorkTrackDayRecord[]
): WorkTrackDayRecord => {
  const tableDateDay: string = tableDate.replace(/-.+/, "");

  const parseDay = (dateString: string): string => {
    const arr = dateString.split("_");
    return arr[2];
  };
  // tslint:disable-next-line:no-console
  console.debug(records[0]);
  const a: WorkTrackDayRecord = records[0];
  const b: string = a.date;
  // tslint:disable-next-line:no-console
  console.debug(a);
  // tslint:disable-next-line:no-console
  console.log(b);
  return records.filter(rec => tableDateDay === parseDay(rec.date))[0];
};

const fillInRecords = (records: WorkTrackDayRecord[]): void => {
  log("records", records);

  const selector =
    "#addRegularizationPage table#attRegTable tbody tr:not(#attDetailsListRow)";
  const dataRows = document.querySelectorAll(selector);
  dataRows.forEach(row => {
    const record: WorkTrackDayRecord = getRecord(row.id, records);

    if (record.isValid()) {
      const inputFrom = row.querySelector(
        "input#ZPAtt_reg_fromTime"
      ) as HTMLInputElement;
      const inputTo = row.querySelector(
        "input#ZPAtt_reg_toTime"
      ) as HTMLInputElement;

      const startTime: string | null = record.getZohoStartTime();
      if (inputFrom && startTime) {
        inputFrom.value = startTime;
      }

      const endTime: string | null = record.getZohoEndTime();
      if (inputTo && endTime) {
        inputTo.value = endTime;
      }
    }
  });
};

const selectedMonth = getSelectedMonth();

const port: Port = chrome.runtime.connect({
  name: "ZoovuTime Apply ContentScript"
});

port.onMessage.addListener((message: any): void => {
  const jsonRecords = message.records;
  const records: WorkTrackDayRecord[] = jsonRecords.map(rec => {
    const workTrackRecords: WorkTrackRecord[] = rec._records.map(
      r => new WorkTrackRecord(r._start, r._end)
    );
    return new WorkTrackDayRecord(rec._date, workTrackRecords);
  });
  fillInRecords(records);
});

log("sending message");
port.postMessage({ date: selectedMonth });
