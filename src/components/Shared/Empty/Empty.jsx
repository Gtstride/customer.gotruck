import React from "react";
// import "./Empty.scss";
import "../../../styles/css/Empty.scss";
import Spinner from "../Spinner/Spinner";

function Empty(props) {
  return (
    <div className={`empty ${props.className || ""}`}>
      {props.loading ? (
        <Spinner />
      ) : props.description ? (
        <>
          {props.icon ? <img src={props.icon} alt="empty icon" /> : ""}
          <p>{props.description}</p>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Empty;
