import React, { useEffect, useState } from "react";
import "./employeeForm.css";

function EmployeeForm({ setOpenForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/roles")
      .then((response) => response.json())
      .then((data) => setRoles(data))
      .catch((error) => console.log(error));
  }, []);

  const handleFormSubmision = () => {
    const postData = {
      name,
      email,
      phone,
      role: roleId,
      status,
    };
    console.log(postData);

    fetch("http://localhost:5001/api/employees", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));
    setOpenForm(false);
  };

  const handleCancelFormSubmision = () => {
    setOpenForm(false);
  };
  return (
    <div className="employee-registration-form">
      <div className="employee-registration-form-container">
        <div className="employee-registration-form-header">
          <h3>New Epmloyee</h3>
          <span onClick={() => setOpenForm(false)}>x</span>
        </div>
        <form action="">
          <div className="employee-registratiion-form-control">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="employee-registratiion-form-control">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="example@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="employee-registratiion-form-control">
            <label htmlFor="email">Phone Number</label>
            <input
              type="text"
              placeholder="+255xxxxxxxxx"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div className="employee-registratiion-form-control">
            <label htmlFor="role">Role</label>
            <select
              value={roleId}
              onChange={(event) => setRoleId(event.target.value)}
            >
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="employee-registratiion-form-control">
            <label htmlFor="role">Role</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="active">Active</option>
              <option value="pending">Panding</option>
            </select>
          </div>
        </form>
        <div className="employee-registration-form-action">
          <button onClick={handleCancelFormSubmision}>Cancel</button>
          <button className="primary" onClick={handleFormSubmision}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;
