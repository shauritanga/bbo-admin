import { PDFViewer } from "@react-pdf/renderer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Contract from "./ContractNote";

const PrintContractPDF = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const executionData = JSON.parse(searchParams.get("execution"));
  console.log(executionData);
  const state = {
    executionData,
  };

  useEffect(() => {
    document.title = "Contract Note";
  }, []);
  return (
    <PDFViewer width="100%" height="100%">
      <Contract data={state.executionData} />
    </PDFViewer>
  );
};

export default PrintContractPDF;
