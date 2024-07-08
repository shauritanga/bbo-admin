import React from "react";
import styled from "styled-components";

const FilterButton = ({
  name,
  activeFilter,
  onClick,
  children,
  setOpen,
  ...props
}) => {
  const handleClick = () => {
    if (name == "custom") {
      onClick(name);
      setOpen(true);
    } else {
      onClick(name); // call the onClick prop
    }
  };
  return (
    <Filter
      onClick={handleClick}
      style={
        activeFilter === name
          ? { backgroundColor: "hsl(243deg, 20%, 70%)" }
          : {}
      }
      {...props}
    >
      {children}
    </Filter>
  );
};

const Filter = styled.button`
  display: flex;
  align-items: center;

  padding: 8px 20px;
  background-color: inherit;
  border: 1px solid hsl(243deg, 50%, 50%);
  &:not(:first-of-type) {
    border-left: 0;
  }
  &:first-of-type {
    border-radius: 5px 0 0 5px;
  }
  &:last-of-type {
    border-radius: 0 5px 5px 0;
    padding: 8px 10px;
  }
`;

export default FilterButton;
