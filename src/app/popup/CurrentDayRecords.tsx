import React from "react";
import { WorkTrackRecord } from "../WorkTrackRecord";
import { addMissingZero } from "../util/Utilities";

interface Props {
  records: WorkTrackRecord[];
}

const CurrentDayRecords: React.FunctionComponent<Props> = ({ records }) => {
  const minutesWorked: number = records
    .map(record => record.getWorkingTime())
    .reduce((total: number, currentVal: number) => {
      return total + currentVal;
    }, 0);

  const workingTimeString =
    addMissingZero(Math.floor(minutesWorked / 60)) +
    ":" +
    addMissingZero(minutesWorked % 60);

  return (
    <>
      <h2>Currently Worked: {workingTimeString}</h2>
      <div className="current-day-records">
      {records.map((r, i) => {
        return (
          <>    
            <h3 key={i}>
              {r.start} - {r.end}
            </h3>
          </>
        );
      })}
      </div>
    </>
  );
};

export default CurrentDayRecords;
