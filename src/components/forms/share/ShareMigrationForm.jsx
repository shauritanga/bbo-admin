import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Modal, Placeholder } from "rsuite";
import styled from "styled-components";
//import Select from "../../select";

const customStyles = {
  control: (base) => ({
    ...base,
    height: 42,
    width: "100%",
    minHeight: 35,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const ShareMigrationForm = ({ open, setOpen }) => {
  const [securities, setSecurities] = useState("");
  const handleSubmit = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetch("https://api.alphafunds.co.tz/api/v1/securities")
      .then((response) => response.json())
      .then((data) => setSecurities(data))
      .catch((error) => console.log(error));
  }, []);
  if (!securities) {
    return <div>Loading ...</div>;
  }

  const securityOptions = securities?.map((security) => {
    return {
      label: security.name,
      value: security.name,
    };
  });

  return (
    <Modal backdrop="static" open={open} onClose={() => setOpen(false)}>
      <Modal.Header>
        <Modal.Title>Migrate Share</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormControl>
            <label htmlFor="Security">Security</label>
            <Select
              className="basic-single"
              classNamePrefix="select"
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              isClearable={true}
              isSearchable={true}
              styles={customStyles}
              name="color"
              options={securityOptions}
            />
          </FormControl>
          <FormControl>
            <label htmlFor="Security">Volume</label>
            <TextInput type="text" placeholder="Volume" />
          </FormControl>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} appearance="primary">
          Ok
        </Button>
        <Button onClick={() => setOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const TextInput = styled.input`
  padding: 9px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;
export default ShareMigrationForm;
