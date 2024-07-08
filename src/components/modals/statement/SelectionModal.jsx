import React, { useState } from "react";
import { DateRangePicker } from "rsuite";
import { useNavigate } from "react-router";
import styled from "styled-components";
import useSWR from "swr";
import format from "date-fns/format";
import "rsuite/DateRangePicker/styles/index.css";
import { formatDate } from "date-fns/format";
const fetcher = (url) => fetch(url).then((res) => res.json());

const SelectionModal = () => {
  const [dateSelected, setDateSelected] = useState(() => {
    return { startDate: Date.now(), endDate: Date.now() };
  });
  const navigate = useNavigate();

  const { data, error, loading } = useSWR(
    `https://api.alphafunds.co.tz/api/v1/statements?startDate=${new Date(
      dateSelected.startDate
    ).toISOString()}&endDate=${new Date(dateSelected.endDate).toISOString()}`,
    fetcher
  );
  if (error) {
    console.log(error);
  }

  if (!error && !loading) {
    console.log(`data ${data}`);
  }

  return (
    <Wrapper>
      <FormWrapper>
        <DateRangePicker
          placeholder="Select Date Range"
          renderValue={([start, end]) => {
            return (
              formatDate(start, "EEE, d MMM") +
              " - " +
              format(end, "EEE, d MMM")
            );
          }}
          onChange={(range) =>
            setDateSelected({ startDate: range[0], endDate: range[1] })
          }
        />
        <Actions>
          <SecondaryButton>Cancel</SecondaryButton>
          <PrimaryButton
            onClick={
              data ? () => navigate("/statement", { state: data }) : null
            }
          >
            Ok
          </PrimaryButton>
        </Actions>
      </FormWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: hsl(250deg 40% 80% /0.5);
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  background-color: hsl(250deg 100% 100%);
  border-radius: 7px;
`;
const Actions = styled.div`
  display: flex;
  gap: 30px;
`;
const SecondaryButton = styled.button`
  flex: 1;
  border: 1px solid hsl(250deg 50% 21%);
  color: hsl(250deg 50% 21%);
  border-radius: 7px;
  padding: 10px 20px;
`;
const PrimaryButton = styled.button`
  flex: 1;
  background-color: hsl(250deg 50% 21%);
  color: #fff;
  border-radius: 7px;
  padding: 10px 20px;
`;
export default SelectionModal;
