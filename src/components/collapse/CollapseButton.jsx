import React, { Children, useCallback, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdOutlineAccountBalanceWallet, MdOutlineSell } from "react-icons/md";
import "./collapse.css";

function CollapseButton({ children, icon, name }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleIsExpanded = useCallback(() => {
    setIsExpanded((isExpanded) => !isExpanded);
  }, []);

  return (
    <div>
      <div onClick={toggleIsExpanded} className="collapse-container">
        <div className="title">
          {icon}
          <span>{name}</span>
        </div>
        <div>{isExpanded ? <FiChevronDown /> : <FiChevronUp />}</div>
      </div>
      <div
        className="collapse"
        style={{
          height: isExpanded ? "auto" : "0px",
          visibility: isExpanded ? "visible" : "hidden",
          backgroundColor: "inherit",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default CollapseButton;
