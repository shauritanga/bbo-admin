import { PDFViewer } from "@react-pdf/renderer";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Statement from "./Statement";

const PDF = () => {
  const location = useLocation();

  const dataFromPreviousPage = location.state;
  useEffect(() => {
    document.title = "CLIENT STATEMENT ACCOUNT";
  }, []);
  return (
    <PDFViewer width="100%" height="100%">
      <Statement data={dataFromPreviousPage} />
    </PDFViewer>
  );
};

export default PDF;
