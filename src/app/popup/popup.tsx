import React, { useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";
import { WorkTrackRecord } from "../WorkTrackStorage";
import CurrentDayRecords from "../../popup/CurrentDayRecords";

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const [workTrackStarted, setWorkTrackStarted] = useState(false);
  const [records] = useState<WorkTrackRecord[]>([
    { s: "08:00", e: "10:00" },
    { s: "12:00", e: "12:00" }
  ]);

  const handlers = {
    onTrackWorkButtonClick: () => {
      records.push({ e: "20:00", s: "15:30" });
      setWorkTrackStarted(!workTrackStarted);
    }
  };

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
