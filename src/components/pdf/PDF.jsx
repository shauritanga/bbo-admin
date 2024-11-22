import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import Statement from "./Statement";

const PDF = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    document.title = "CLIENT STATEMENT ACCOUNT";

    const storedData = localStorage.getItem("statements");

    if (storedData) {
      const statements = JSON.parse(storedData);
      console.log({ statements });
      setData(statements);
      localStorage.removeItem("statements"); // Optional: Clean up if data is only needed once
    }
  }, []);

  if (data === null) {
    return <p>loading</p>;
  }

  console.log({ data });
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <PDFViewer style={{ flex: 1, height: "100%", width: "100%" }}>
        <Statement data={data} />
      </PDFViewer>
    </div>
  );
};

export default PDF;
