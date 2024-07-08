import React, { useState } from "react";
import styled from "styled-components";
import General from "../../components/general/General";
import FinancialYear from "../../components/financial/FinancialYear";
import { PiUserList } from "react-icons/pi";
import { CiMoneyCheck1 } from "react-icons/ci";
import { GrList } from "react-icons/gr";

function Business() {
  const [selected, setSelected] = useState("general");
  return (
    <Wrapper>
      <Menu>
        <ListItem
          style={
            selected === "general"
              ? {
                  backgroundColor: "hsl(243deg 50% 21%",
                  color: "#fff",
                }
              : {}
          }
          onClick={() => setSelected("general")}
        >
          <PiUserList size={23} />
          General
        </ListItem>
        <ListItem
          style={
            selected === "financial"
              ? {
                  backgroundColor: "hsl(243deg 50% 21%",
                  color: "#fff",
                }
              : {}
          }
          onClick={() => setSelected("financial")}
        >
          <GrList size={23} />
          Financial Years
        </ListItem>
      </Menu>
      <Content>
        {selected == "general" ? <General /> : <FinancialYear />}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 30px;
`;
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
`;
const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 20px;
  gap: 20px;
  cursor: pointer;
  border-radius: 7px;
`;
const Content = styled.div`
  flex: 5;
  background-color: #fff;
  padding: 20px;
`;

export default Business;
