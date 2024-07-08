import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function StatusSelection({label, data, setAction}) {
  return (
    <Autocomplete
      disablePortal
      onChange={(value,reason)=>setAction(reason.name)}
      id="combo-box-demo"
      options={data}
      getOptionLabel={(option) => `${option.name}`}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}