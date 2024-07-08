import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function ActionSelection({ label, data, setAction }) {
  return (
    <Autocomplete
      disablePortal
      onChange={(value, reason) => setAction(reason.name)}
      id="combo-box-demo"
      options={data}
      getOptionLabel={(option) => `${option.name}`}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
