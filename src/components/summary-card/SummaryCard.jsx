import React from "react";
import { IoTimerOutline } from "react-icons/io5";
import styled from "styled-components";

function SummaryCard({ total, info, icon, backgroundColor }) {
  return (
    <div
      className={`flex flex-auto items-center cursor-pointer justify-between text-white rounded p-2 ${backgroundColor} hover:-translate-y-1 ease-in-out duration-300`}
    >
      <Details>
        <span>{total}</span>
        {info}
      </Details>
      <div className=" flex items-center justify-center h-6 w-6 rounded-full bg-white">
        {icon}
      </div>
    </div>
  );
}

const Details = styled.div`
  display: flex;
  flex-direction: column;
  & span {
    font-size: 1.2rem;
  }
`;
export default SummaryCard;
