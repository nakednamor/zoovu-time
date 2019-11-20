import React from "react";
import { WorkTrackRecord } from "../WorkTrackRecord";

interface Props {
  records: WorkTrackRecord[];
}

const CurrentDayRecords: React.FunctionComponent<Props> = ({ records }) => {
  return (
    <div className="current-day-records">
      {records.map((r, i) => {
        return (
          <h3 key={i}>
            {r.start} - {r.end}
          </h3>
        );
      })}
    </div>
  );
};

export default CurrentDayRecords;
