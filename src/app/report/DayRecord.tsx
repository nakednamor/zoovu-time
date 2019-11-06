import React from "react";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";

interface Props {
  record: WorkTrackDayRecord;
}

const DayRecord: React.FunctionComponent<Props> = ({ record }) => {
  return (
    <>
      <tr>
        <td>{record.isValid() ? "yes" : "no"}</td>
        <td>{record.date}</td>
        <td>
          {record.records.map(r => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={r.start}
                    maxLength={5}
                    minLength={5}
                  />
                  -->
                  <input
                    type="text"
                    value={r.end ? r.end : ""}
                    maxLength={5}
                    minLength={5}
                  />
                </div>
              </>
            );
          })}
        </td>
        <td>{record.getWorkedTimeString()}</td>
      </tr>
    </>
  );
};

export default DayRecord;
