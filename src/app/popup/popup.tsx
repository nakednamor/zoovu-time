import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import Title from "./title";

const CurrentDayTracker: React.FunctionComponent<{}> = ({}) => {
  const [workTrackStarted, setWorkTrackStarted] = useState(false);

  const handlers = useMemo(
    () => ({
      onTrackWorkButtonClick: () => {
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
    </>
  );
};

ReactDOM.render(<CurrentDayTracker />, document.getElementById("root"));

export default CurrentDayTracker;
