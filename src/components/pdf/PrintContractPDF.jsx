import Contract from "./ContractNote";
import { PDFDownloadLink } from "@react-pdf/renderer";

const ContractNoteDownload = ({ data }) => (
  <>
    <PDFDownloadLink
      document={<Contract data={data} />}
      fileName={`contract.pdf`}
    >
      {({ loading }) => (loading ? "loading..." : "Download PDF")}
    </PDFDownloadLink>
  </>
);

export default ContractNoteDownload;
