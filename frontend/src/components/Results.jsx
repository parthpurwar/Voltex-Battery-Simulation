import React from "react";

export default function Results({ data }) {
  return (
    <div>
      <h2>Simulation Output</h2>
      <img src={`data:image/png;base64,${data.plot_base64}`} alt="Result" />
      <pre>{data.summary}</pre>
    </div>
  );
}
