import { Input, InputGroup, Grid, Row, Col } from "rsuite";
import SearchIcon from "@rsuite/icons/Search";

const CustomInputGroupWidthButton = ({ placeholder, ...props }) => {
  const container = {
    backgroundColor: "inherit",
    border: "1px solid hsl(250deg 0% 80%",
  };

  const input = {
    backgroundColor: "inherit",
    outline: "none",
  };
  return (
    <InputGroup {...props} inside style={container}>
      <Input placeholder={placeholder} style={input} />
      <InputGroup.Button>
        <SearchIcon />
      </InputGroup.Button>
    </InputGroup>
  );
};

export default CustomInputGroupWidthButton;
