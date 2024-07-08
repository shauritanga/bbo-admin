import React, { useState } from "react";
import { Button, Modal, Placeholder } from "rsuite";
import Editor from "../../editor/Editor";
import styled from "styled-components";
import { addReport } from "../../../reducers/reportSlice";
import { useDispatch } from "react-redux";

const CreateReportForm = ({ open, setOpen }) => {
  const [title, setTitle] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const dispatch = useDispatch();

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleSubmit = () => {
    const formData = {
      title,
      editorHtml,
    };
    dispatch(addReport(formData));
    setOpen(false);
  };

  return (
    <Modal
      backdrop="static"
      open={open}
      onClose={() => setOpen(false)}
      size="lg"
    >
      <Modal.Header>
        <Modal.Title>New Report</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%", height: "500px" }}>
        <form>
          <FormControl>
            <label htmlFor="title">Title</label>
            <TextInput
              value={title}
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
        </form>
        <p style={{ marginBottom: "8px" }}>Description</p>
        <Editor editorHtml={editorHtml} handleChange={handleChange} />
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

const TextInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  margin-bottom: 16px;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export default CreateReportForm;
