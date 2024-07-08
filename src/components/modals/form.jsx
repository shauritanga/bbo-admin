import React, { useState } from "react";
import styled from "styled-components";

const Modal = ({ isOpen, onClose, onSubmit, initialValues, title }) => {
  const [formData, setFormData] = useState(initialValues || {});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper>
      <ModalContent>
        <ModalHeader>
          <h2>{title}</h2>
          <button onClick={onClose}>Close</button>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {/* Form fields here */}
            <button type="submit">Submit</button>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalBody = styled.div``;

export default Modal;
