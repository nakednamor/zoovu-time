import React, { useState } from "react";
import ReactDOM from "react-dom";
import { WorkTrackStore } from "../WorkTrackStorage";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import DayRecord from "./DayRecord";
import "../scss/style.scss";
import { NavigateNext, NavigateBefore } from "@material-ui/icons";

const formatOptions = {
  weekday: "short",
  day: "2-digit"
};

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

  const locale = navigator.language;

  return (
    <div className="records">
      <h2>
        Records of{" "}
        {currentReportDate.toLocaleString(locale, {
          year: "numeric",
          month: "long"
        })}
      </h2>
      <div className="records__navigation-buttons">
        <button id="month-back" onClick={showPreviousMonth}>
          <NavigateBefore fontSize="small" className="icon--before" />
          previous month
        </button>
        <button id="month-next" onClick={showNextMonth}>
          next month
          <NavigateNext fontSize="small" className="icon--after" />
        </button>
      </div>
      <div className="records__table-wrapper">
        <table className="records__table">
          <thead>
            <tr>
              <th>valid</th>
              <th>day</th>
              <th>records</th>
              <th>total</th>
              <th>zoho time</th>
            </tr>
          </thead>
          <tbody>
            {records.map(rec => (
              <DayRecord
                key={rec.date}
                record={rec}
                locale={locale}
                formatOptions={formatOptions}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ReactDOM.render(<MonthlyOverview />, document.getElementById("root"));
