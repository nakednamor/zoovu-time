import React, { useState } from "react";
import ReactDOM from "react-dom";
import { WorkTrackStore } from "../WorkTrackStorage";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import DayRecord from "./DayRecord";

const MonthlyOverview: React.FunctionComponent<{}> = ({}) => {
  const store = new WorkTrackStore(chrome.storage.local, chrome.runtime);

  const getDateWithFirstDayOfCurrentMonth = (): Date => {
    const now = new Date(Date.now());
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const [records, setRecords] = useState<WorkTrackDayRecord[]>([]);
  const [currentReportDate, setCurrentReportDate] = useState<Date>(
    getDateWithFirstDayOfCurrentMonth()
  );

  const dateArray = store.buildKeyFromDate(currentReportDate).split("_");
  store.getRecordsOfMonth(
    +dateArray[0],
    +dateArray[1],
    data => {
      if (records.length === 0 || data[0].date !== records[0].date) {
        setRecords(data);
      }
    },
    err => alert("error happened: " + err)
  );

  const showPreviousMonth = () => {
    currentReportDate.setMonth(currentReportDate.getMonth() - 1);
    setCurrentReportDate(currentReportDate);
  };

  const showNextMonth = () => {
    currentReportDate.setMonth(currentReportDate.getMonth() + 1);
    setCurrentReportDate(currentReportDate);
  };

  return (
    <>
      <h2>
        records of month:{" "}
        {currentReportDate.getFullYear() +
          "-" +
          (currentReportDate.getMonth() + 1)}
      </h2>
      <button id="month-back" onClick={showPreviousMonth}>
        &lt; &lt; previous month &lt; &lt;
      </button>
      <button id="month-next" onClick={showNextMonth}>
        >> next month >>
      </button>
      <table>
        <thead>
          <th>valid</th>
          <th>day</th>
          <th>records</th>
          <th>total</th>
          <th>zoho time</th>
        </thead>
        <tbody>
          {records.map(rec => (
            <DayRecord key={rec.date} record={rec} />
          ))}
        </tbody>
      </table>
    </>
  );
};

ReactDOM.render(<MonthlyOverview />, document.getElementById("root"));
