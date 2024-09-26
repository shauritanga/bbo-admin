import { Dropdown, Avatar } from "rsuite";
import { jwtDecode } from "jwt-decode";

const renderToggle = (props) => (
  <Avatar
    circle
    {...props}
    src="https://i.pravatar.cc/150?u=git@rsutiejs.com"
    size="sm"
  />
);

const LoginUser = () => {
  const user = jwtDecode(localStorage.getItem("token"));
  return (
    <Dropdown renderToggle={renderToggle} placement="bottomEnd">
      <Dropdown.Item
        panel
        style={{ padding: 10, width: 160, color: "#656281" }}
      >
        <p>Signed in as</p>
        <span className="text-blue-800">{user?.name}</span>
      </Dropdown.Item>
      <Dropdown.Item>My Profile</Dropdown.Item>
      <Dropdown.Item onClick={() => logOut()}>Sign out</Dropdown.Item>
    </Dropdown>
  );
};

export default LoginUser;
