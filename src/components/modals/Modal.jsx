import React from "react";
import { Modal, Button, DateRangePicker } from "rsuite";

const ModalView = ({
  open,
  setOpen,
  body,
  size,
  title,
  dateRnge,
  setDateRange,
}) => {
  return (
    <Modal
      backdrop="static"
      open={open}
      onClose={() => setOpen(false)}
      size={size}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ width: "100%", height: "50px" }}>
        <DateRangePicker
          style={{ width: "100%" }}
          onChange={(value) => {
            setDateRange(value);
            setOpen(false);
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setOpen(false)} appearance="primary">
          Ok
        </Button>
        <Button onClick={() => setOpen(false)} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalView;
