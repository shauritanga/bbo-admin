import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import styled from "styled-components";

const Security = ({ email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailValue, setEmailValue] = useState(email);
  const [showNewPassword, setNewShowPassword] = useState(false);
  console.log(emailValue);
  return (
    <Wrapper>
      <PasswordWrapper>
        <Title>Change Password</Title>
        <PasswordHint>
          Minimum 8 character long, uppercase and symbol
        </PasswordHint>
        <PawwordLableWrapper>
          <Password>
            <Label htmlFor="password"> New Password </Label>
            <InputWrapper>
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
              />
              {showPassword ? (
                <FaRegEye
                  size={18}
                  style={{
                    position: "absolute",
                    top: 11,
                    right: 10,
                    cursor: "pointer",
                  }}
                  color="grey"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaRegEyeSlash
                  size={18}
                  style={{
                    position: "absolute",
                    top: 11,
                    right: 10,
                    cursor: "pointer",
                  }}
                  color="grey"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </InputWrapper>
          </Password>
          <Password>
            <Label htmlFor="confirm-password"> Confirm Password </Label>
            <InputWrapper>
              <TextInput
                type={showNewPassword ? "text" : "password"}
                placeholder="Password"
                id="confirm-password"
              />
              {showNewPassword ? (
                <FaRegEye
                  size={18}
                  style={{
                    position: "absolute",
                    top: 11,
                    right: 10,
                    cursor: "pointer",
                  }}
                  color="grey"
                  onClick={() => setNewShowPassword(!showNewPassword)}
                />
              ) : (
                <FaRegEyeSlash
                  size={18}
                  style={{
                    position: "absolute",
                    top: 11,
                    right: 10,
                    cursor: "pointer",
                  }}
                  color="grey"
                  onClick={() => setNewShowPassword(!showNewPassword)}
                />
              )}
            </InputWrapper>
          </Password>
        </PawwordLableWrapper>
        <Button>Change Password</Button>
      </PasswordWrapper>
      <EmailWrapper>
        <Title>Change Email</Title>
        <EmailLableWrapper>
          <Label htmlFor="email">Login Email</Label>
          <EmailInputWrapper>
            <EmailTextInput
              type="email"
              id="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
            />
            <Spacer />
          </EmailInputWrapper>
        </EmailLableWrapper>
        <Button>Change Email</Button>
      </EmailWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const PasswordWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  gap: 30px;
  border-radius: 7px;
  padding: 20px;
`;
const Title = styled.p`
  font-size: 1.2rem;
`;
const PasswordHint = styled.p`
  background-color: hsl(30deg 50% 50% /0.2);
  border-radius: 4px;
  color: hsl(30deg 54% 52%);
  padding: 10px;
`;
const Button = styled.button`
  width: max-content;
  padding: 10px 20px;
  background-color: hsl(243deg, 50%, 21%);
  border-radius: 7px;
  color: #fff;
  cursor: pointer;
`;
const PawwordLableWrapper = styled.div`
  display: flex;
  gap: 30px;
`;
const Password = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;
const Label = styled.label`
  display: flex;
  flex-direction: column;
  padding-right: 30px;
  gap: 4px;
`;
const TextInput = styled.input`
  width: 100%;
  height: 100%;
  color: inherit;
  background-color: inherit;
`;
const InputWrapper = styled.div`
  position: relative;
  border: 1px solid grey;
  border-radius: 5px;
  padding: 10px 20px;
  overflow: hidden;
`;

const EmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: 7px;
  gap: 30px;
  padding: 20px;
`;

const EmailLableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmailInputWrapper = styled.div`
  display: flex;
  gap: 90px;
`;
const EmailTextInput = styled.input`
  flex: 1;
  border: 1px solid grey;
  border-radius: 5px;
  padding: 10px 20px;
  color: inherit;
  background-color: inherit;
`;

const Spacer = styled.div`
  flex: 1;
`;
export default Security;
