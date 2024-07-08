import React from "react";
import "./pie.css";

const PieCard = ({ title, percent, data }) => {
  return (
    <div className="pie">
      <div className="pie-title">{title}</div>
      <div className="pie-details">
        <div className="pie-details-text">
          <div className="pie-details-text_group">
            <p>This month</p>
            <span>12,350,500.25</span>
          </div>
          <p>{percent}% more earnings than last month</p>
        </div>
        <div className="pie-details-graph"></div>
      </div>
    </div>
  );
};

export default PieCard;
