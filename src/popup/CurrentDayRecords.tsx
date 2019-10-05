import React from "react";
import { WorkTrackRecord } from "../app/WorkTrackStorage";

interface Props {
  records: WorkTrackRecord[];
}

const CurrentDayRecords: React.FunctionComponent<Props> = ({ records }) => {
  return (
    <>
      {records.map((r, i) => {
        return (
          <>
            <h3 key={i}>
              {r.start} - {r.end}
            </h3>
          </>
        );
      })}
    </>
  );
};

export default CurrentDayRecords;
