import React, { useState } from "react";
import { GrShieldSecurity } from "react-icons/gr";
import { IoNotificationsOutline } from "react-icons/io5";
import { TbSocial, TbTimelineEvent } from "react-icons/tb";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Security from "../../components/security/Security";

const EmployeeView = () => {
  const [active, setActive] = useState("timeline");
  const { state } = useLocation();
  console.log(state);
  return (
    <Wrapper>
      <ProfileDetails>
        <ProfileImage src={state.profileImage} alt="Profile Image" />
        <h2 style={{ textAlign: "center" }}>{state.name}</h2>
        <TaskList>
          <span>Task 1</span>
          <span>Task 2</span>
        </TaskList>
        Details
        <Line />
        <Details>
          Email: {state.email}
          <br />
          Phone: {state.phone}
          <br />
          Status: {state.status}
          <br />
          Role: {state.role?.name}
        </Details>
        <Actions>
          <Button>Edit</Button>
          <Button>
            {state.status === "active" ? "Deactivate" : "Activate"}
          </Button>
        </Actions>
      </ProfileDetails>
      <Main>
        <Navbar>
          <LinkItem
            style={{
              backgroundColor:
                active === "timeline" ? "#007bff" : "transparent",
              color: active === "timeline" ? "#fff" : "#333",
            }}
            onClick={() => setActive("timeline")}
          >
            <TbTimelineEvent />
            <span> Timeline</span>
          </LinkItem>
          <LinkItem
            style={{
              backgroundColor:
                active === "security" ? "#007bff" : "transparent",
              color: active === "security" ? "#fff" : "#333",
            }}
            onClick={() => setActive("security")}
          >
            <GrShieldSecurity />
            <span>Security</span>
          </LinkItem>
          <LinkItem
            style={{
              backgroundColor: active === "social" ? "#007bff" : "transparent",
              color: active === "social" ? "#fff" : "#333",
            }}
            onClick={() => setActive("social")}
          >
            <TbSocial />
            <span>Social</span>
          </LinkItem>
          <LinkItem
            style={{
              backgroundColor:
                active === "notifications" ? "#007bff" : "transparent",
              color: active === "notifications" ? "#fff" : "#333",
            }}
            onClick={() => setActive("notifications")}
          >
            <IoNotificationsOutline />
            <span>Notifications</span>
          </LinkItem>
        </Navbar>
        <LinkContent>
          {active === "timeline" && (
            <div
              style={{
                backgroundColor: "#fff",
                color: "#000",
                padding: "10px",
              }}
            >
              Timeline
            </div>
          )}
          {active === "security" && <Security email={state.email} />}
          {active === "social" && <h1>Social</h1>}
          {active === "notifications" && <h1>Notifications</h1>}
        </LinkContent>
      </Main>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
`;
const Main = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
`;
const Navbar = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const LinkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 5px;
  background-color: transparent;
  color: #333;
  transition: color 0.3s ease-in-out;
  &:hover {
    color: #007bff;
    transform: translateY(-0.75px);
  }
`;
const LinkContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 20px;
`;

const ProfileDetails = styled.div`
  display: flex;
  width: 340px;
  flex-direction: column;
  margin-right: 20px;
  background-color: #fff;
  padding: 20px;
  height: fit-content;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;
const Line = styled.hr`
  width: 100%;
  height: 0.15px;
  background-color: #ccc;
  margin: 8px 0;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 20px auto;
`;
const TaskList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin: 30px;
`;
const Details = styled.div`
  margin-bottom: 20px;
`;
const Actions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;
const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
  &:last-of-type {
    border: 1px solid #007bff;
    background-color: #fff;
    color: #007bff;
    &:hover {
      background-color: #007bff;
      color: #fff;
    }
  }
`;

export default EmployeeView;
