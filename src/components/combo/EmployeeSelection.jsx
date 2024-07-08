import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function EmployeeSelection({label, data, setAction}) {
  return (
    <Autocomplete
      disablePortal
      onChange={(value,reason)=>setAction(reason._id)}
      id="combo-box-demo"
      options={data}
      getOptionLabel={(option) => `${option.name}`}
      sx={{width:"100%"}}
      renderInput={(params) => <TextField {...params} label={label}/>}
    />
  );
}