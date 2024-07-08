import React from "react";
import { FiGift } from "react-icons/fi";
import "./card.css";

const Card = ({ title, icon, size, percent }) => {
  return (
    <div className="card">
      <div className="card_title">
        <h3>{title}</h3>
        <FiGift />
      </div>
      <p>{size}</p>
      <div className="card_info">
        <span>{`+${percent}%`}</span>
        <span>Since last month</span>
      </div>
    </div>
  );
};

export default Card;
