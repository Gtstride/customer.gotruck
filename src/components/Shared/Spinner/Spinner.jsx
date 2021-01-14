import * as React from "react";
// import "./Spinner.scss";
import "../../../styles/css/Spinner.scss";

function Spinner({ className }) {
  return <div className={`custom-spinner ${className ? className : ""}`} />;
}

export default Spinner;
