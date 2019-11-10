import React from "react";
import { WorkTrackDayRecord } from "../WorkTrackDayRecord";
import {ArrowRightAlt, CheckCircle, Error} from "@material-ui/icons";

interface Props {
  record: WorkTrackDayRecord;
}

const DayRecord: React.FunctionComponent<Props> = ({ record }) => {
  return (
    <tr className="day-record">
      <td>{record.isValid() ? <CheckCircle htmlColor="green"/> : <Error color="error"/>}</td>
      <td>{record.date}</td>
      <td>
        {record.records.map((r, i) => {
          return (
              <div key={"record-" + i} className="day-record__partial">
                <input
                  type="text"
                  defaultValue={r.start}
                  maxLength={5}
                  minLength={5}
                />
                <ArrowRightAlt className="icon--centered"/>
                <input
                  type="text"
                  defaultValue={r.end ? r.end : ""}
                  maxLength={5}
                  minLength={5}
                />
              </div>
          );
        })}
      </td>
      <td>{record.getWorkedTimeString()}</td>
      <td>
        <div className="day-record__all-day">
          <input type="text" defaultValue={"" + record.getZohoStartTime()} />
          <ArrowRightAlt className="icon--centered"/>
          <input type="text" defaultValue={"" + record.getZohoEndTime()} />
        </div>
      </td>
    </tr>
  );
};

export default DayRecord;
