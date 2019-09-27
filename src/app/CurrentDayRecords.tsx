import { WorkTrackRecord } from "./WorkTrackStorage";
import React from "react";

interface Props {
  records: WorkTrackRecord[];
}

const CurrentDayRecords: React.FunctionComponent<Props> = ({ records }) => {
  const recordList = records.map((r, i) => {
    return (
      <>
        <h3 key={i}>
          {r.s} - {r.e}
        </h3>
      </>
    );
  });

  return <>{recordList}</>;
};

export default CurrentDayRecords;
