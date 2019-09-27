import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";
import CurrentDayRecords from "../CurrentDayRecords";
import { WorkTrackRecord } from "../WorkTrackStorage";

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const [workTrackStarted, setWorkTrackStarted] = useState(false);
  const [records] = useState<WorkTrackRecord[]>([
    { s: "08:00", e: "10:00" },
    { s: "12:00", e: "12:00" }
  ]);

  const handlers = useMemo(
    () => ({
      onTrackWorkButtonClick: () => {
        records.push({ e: "20:00", s: "15:30" });
        // setRecords(records);
        setWorkTrackStarted(!workTrackStarted);
      }
    }),
    [workTrackStarted]
  );

  return (
    <>
      <Title />
      <button id="track-work" onClick={handlers.onTrackWorkButtonClick}>
        {workTrackStarted ? "STOP" : "START"} Work
      </button>
      <CurrentDayRecords records={records} />
    </>
  );
};

ReactDOM.render(<CurrentDayTracker />, document.getElementById("root"));

export default CurrentDayTracker;
