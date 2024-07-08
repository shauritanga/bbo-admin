import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Breadcrumbs = ({ data }) => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      {data.map((item) => (
        <ListItem onClick={()=> navigate(item==="Home"?"/dashboard":`/${item}`)} key={item}>{item}</ListItem>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.ol`
  display: flex;
  align-items: center;
  list-style: none;
`;

const ListItem = styled.li`
  color: hsl(0deg 0% 45%);
  &:not(:first-of-type)::before {
    display: inline-block;
    border: 0.5px solid hsl(0deg 0% 70%);
    transform: rotate(0.6turn) translateY(-5px);
    margin-left: 16px;
    margin-right: 8px;
    height: 1rem;
    content: "";
  }
  &:not(:last-of-type):hover {
    color: red;
    cursor: pointer;
  }
`;
export default Breadcrumbs;
