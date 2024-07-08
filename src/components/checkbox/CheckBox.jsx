import React from "react";
import "./checkbox.css";

function CheckBox({
  name,
  value = false,
  updateValue = () => {},
  visible,
  selected,
  setVisible,
}) {
  const handleChange = () => {
    updateValue(!value, name);
  };

  return (
    <div className="checkbox">
      <input
        type="checkbox"
        name={name._id}
        checked={value}
        onChange={() => {
          value || !visible ? setVisible(!visible) : null;
          handleChange();
        }}
      />
    </div>
  );
}

export default CheckBox;
