import React from "react";
import "./Modal.scss";

function Modal({ children, onClick, onNullClick, className }) {
  return (
    <div
      className={`custom-modal ${className ? className : ""}`}
      onClick={(e) => onClick && onClick(e)}
    >
      <div className="customModalBlock">
        <ModelContentBlock
          onClick={(e) => onClick && onClick(e)}
          onNullClick={onNullClick}
        >
          {children}
        </ModelContentBlock>
      </div>
    </div>
  );
}

const ModelContentBlock = ({ children, onNullClick, onClick }) => {
  return (
    <div className="modalWrapper position-relative">
      <div className="closeModal position-absolute">
        <img
          src={require("../../../assets/icons/close.svg")}
          alt="cancel"
          onClick={onClick}
        />
      </div>
      <div
        className="customModalBlock-content"
        onClick={(e) => onNullClick && onNullClick(e)}
      >
        {children}
      </div>
    </div>
  );
};

Modal.ContentBlock = ModelContentBlock;

export default Modal;
