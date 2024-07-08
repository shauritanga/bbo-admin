import React from "react";
import "./employeeTable.css";

function EmployeeTable({ columns, rows, style }) {
  const deducedRows = (row) => {
    const list = [];
    for (let key in row) {
      list.push(
        <td style={{ padding: "8px" }} key={key}>
          {row[key]}
        </td>
      );
    }
    return list;
  };
  return (
    <div>
      <table style={style}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                style={{
                  width: `${column.width}px`,
                  textAlign: "left",
                  padding: "8px",
                  backgroundColor: "hsl(0deg 0% 90%",
                }}
                key={column.id}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>{deducedRows(row)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
