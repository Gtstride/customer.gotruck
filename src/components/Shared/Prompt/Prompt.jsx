import React from "react";
// import "./Prompt.scss";
import "../../../styles/css/Prompt.scss";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";

function Prompt({
  heading,
  description,
  loading,
  onClosePrompt,
  onNullClick,
  children,
  onYes,
  onNo,
}) {
  return (
    <Modal
      className={"prompt-modal"}
      onNullClick={onNullClick}
      onClick={onClosePrompt}
    >
      <div className="prompt p-2 text-center">
        <strong className="mb-1">{heading}</strong>
        <p className="mb-1">{description}</p>
        {children}
        <div className="d-flex justify-space-around">
          <Button
            loading={loading}
            onClick={onYes}
            type={"button"}
            className={"button--sm button--green"}
            title={"yes"}
          />
          <Button
            type={"button"}
            className={"button--sm button--red"}
            onClick={onNo}
            title={"cancel"}
          />
        </div>
      </div>
    </Modal>
  );
}

export default Prompt;
