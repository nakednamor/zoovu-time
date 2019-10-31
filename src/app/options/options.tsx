import React, { useState } from "react";
import ReactDOM from "react-dom";
import { WorkTrackStore } from "../WorkTrackStorage";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";

const MonthlyOverview: React.FunctionComponent<{}> = ({}) => {
  const store = new WorkTrackStore(chrome.storage.local, chrome.runtime);
  const now = new Date(Date.now());

  const [records, setRecords] = useState<WorkTrackDayRecord[]>([]);

  store.getRecordsOfMonth(
    now.getFullYear(),
    now.getMonth() + 1,
    data => {
      if (records.length === 0) {
        setRecords(data);
      }
    },
    err => alert("error happened: " + err)
  );

  return (
    <>
      <h2>here should records of month show up</h2>
      <table>
        <thead>
          <th>day</th>
          <th>records</th>
          <th>total</th>
        </thead>
        <tbody>
          {records.map(rec => {
            return (
              <>
                <tr>
                  <td>{rec.date}</td>
                  <td>
                    {rec.records.map(r => {
                      return (
                        <>
                          <span>
                            {r.start}:{r.end ? r.end : ""}
                          </span>
                        </>
                      );
                    })}
                  </td>
                  <td>{rec.getWorkedTimeString()}</td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

ReactDOM.render(<MonthlyOverview />, document.getElementById("root"));
