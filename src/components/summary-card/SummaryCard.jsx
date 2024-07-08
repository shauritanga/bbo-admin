import React from "react";
import { IoTimerOutline } from "react-icons/io5";
import styled from "styled-components";

function SummaryCard({ total, info, icon, backgroundColor }) {
  return (
    <Wrapper style={{ "--backgroundColor": backgroundColor }}>
      <Details>
        <span>{total}</span>
        {info}
      </Details>
      <Icon>{icon}</Icon>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--backgroundColor);
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: none;
    transform: translateY(-3px);
  }
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  & span {
    font-size: 1.2rem;
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccc;
  padding: 15px;
  border-radius: 50%;
`;
export default SummaryCard;
