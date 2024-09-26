import React, { useEffect, useState } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileTypeValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { LiaFileContractSolid } from "react-icons/lia";
import { SlUser } from "react-icons/sl";
import styled from "styled-components";
import Account from "../../components/account/Account";
import Contract from "../../components/contract/Contract";
import Statement from "../../components/statement/Statement";
import { GrShieldSecurity } from "react-icons/gr";
import { FaRegFileLines } from "react-icons/fa6";
import Security from "../../components/security/Security";
import SelectionModal from "../../components/modals/statement/SelectionModal";
import ShareMigrationForm from "../../components/forms/share/ShareMigrationForm";
import Select from "../../components/select";
import { Delete } from "@mui/icons-material";
import { CiTrash } from "react-icons/ci";
import { Notification, toaster } from "rsuite";
import { DataProvider } from "../../context/userContext";
import ActionLinks from "@/components/actions";
import { axiosInstance } from "@/utils/axiosConfig";

const CustomerView = () => {
  const { openFilePicker, filesContent, loading, errors } = useFilePicker({
    // readAs: "DataURL",
    accept: "image/*",
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["jpg", "png"]),
      new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
      new ImageDimensionsValidator({
        maxHeight: 900, // in pixels
        maxWidth: 1600,
        minHeight: 600,
        minWidth: 768,
      }),
    ],
    onFilesSuccessfullySelected: ({ plainFiles, filesContent }) => {
      // this callback is called when there were no validation errors
      console.log("onFilesSuccessfullySelected", plainFiles, filesContent);
      setFiles((prevFiles) => [...prevFiles, ...filesContent]);
    },
  });
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [fileType, setFileType] = useState("");
  const [isActive, setIsActive] = useState("account");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [files, setFiles] = useState([]);
  const [openMigrationShare, setOpenMigrationShare] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { customer } = location.state;

  const sendActivationEmail = async (email) => {
    try {
      const response = await axiosInstance.post(
        `/emails/send-activation-email`,
        { email }
      );
    } catch (error) {
      alert("Failed to send activation email. Please try again later.");
    }
  };

  const sendResetPasswordEmail = async (email) => {
    try {
      const response = await axiosInstance.post(
        `/auth/clients/request-reset-password`,
        { email }
      );
      await toaster.push(
        <Notification header="Success" type="success">
          {response.data.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
    } catch (error) {
      await toaster.push(
        <Notification header="Error" type="error">
          {error.response.data.message}
        </Notification>,
        { duration: 3000, placement: "topCenter" }
      );
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    plainFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/uploads`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Files uploaded successfully");
        clear();
      } else {
        console.error("Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const content = () => {
    switch (isActive) {
      case "account":
        return <Account customer={customer} />;
        break;
      case "contract":
        return <Contract id={customer._id} />;
        break;
      case "statement":
        return (
          <Statement
            id={customer._id}
            transactions={transactions}
            orders={orders}
          />
        );
        break;
      case "security":
        return <Security email={customer.email} />;
        break;
    }
  };

  return (
    <DataProvider customerId={customer._id}>
      <div className="flex my-4 gap-4">
        <div className="flex flex-col gap-4 w-10/12">
          <div className="flex bg-white p-2 rounded shadow-sm">
            <ListItem
              style={
                isActive === "account"
                  ? { backgroundColor: "hsl(243deg, 50%, 21%)", color: "#fff" }
                  : {}
              }
              onClick={() => setIsActive("account")}
            >
              <SlUser />
              Account
            </ListItem>
            <ListItem
              style={
                isActive === "contract"
                  ? { backgroundColor: "hsl(243deg, 50%, 21%)", color: "#fff" }
                  : {}
              }
              onClick={() => setIsActive("contract")}
            >
              <LiaFileContractSolid />
              Contract Note
            </ListItem>
            <ListItem
              style={
                isActive === "statement"
                  ? { backgroundColor: "hsl(243deg, 50%, 21%)", color: "#fff" }
                  : {}
              }
              onClick={() => setIsActive("statement")}
            >
              <FaRegFileLines />
              Statement
            </ListItem>
            <ListItem
              style={
                isActive === "security"
                  ? { backgroundColor: "hsl(243deg, 50%, 21%)", color: "#fff" }
                  : {}
              }
              onClick={() => setIsActive("security")}
            >
              <GrShieldSecurity />
              Security
            </ListItem>
          </div>
          {content()}
          {files.length > 0 && (
            <UploadView>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "hsl(243deg, 0%, 80%)",

                      marginBottom: "20px",
                    }}
                  >
                    <th
                      style={{
                        width: "50%",
                        textAlign: "left",
                        padding: "10px",
                      }}
                    >
                      File Name
                    </th>
                    <th
                      style={{
                        width: "25%",
                        textAlign: "left",
                        padding: "10px",
                      }}
                    >
                      File Type
                    </th>
                    <th
                      style={{
                        width: "25%",
                        textAlign: "left",
                        padding: "10px",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.name} style={{ borderTop: "1px solid #ccc" }}>
                      <td style={{ padding: "10px" }}>{file.name}</td>
                      <td style={{ padding: "10px" }}>
                        <Select
                          value={fileType}
                          width={340}
                          onChange={(e) => setFileType(e.target.value)}
                        >
                          <option value="" disabled>
                            Select File Type
                          </option>
                          <option value="identity">Identity</option>
                          <option value="passport">Passport</option>
                          <option value="other">Bank Slip</option>
                        </Select>
                      </td>
                      <td style={{ padding: "10px" }}>
                        <CiTrash
                          size={38}
                          onClick={() => {}}
                          style={{ cursor: "pointer", color: "red" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button
                onClick={handleUpload}
                style={{
                  backgroundColor: "var(--color-button)",
                  alignSelf: "flex-end",
                  padding: "10px 20px",
                  borderBottom: "20px",
                }}
              >
                Upload
              </Button>
            </UploadView>
          )}
        </div>
        <Portfolio className="w-2/12">
          <CustomerInfo>
            <Avatar></Avatar>
            <Table>
              <tbody>
                <TableDataRow>
                  <TableRowCell colSpan={2}>Customer Portfolio</TableRowCell>
                </TableDataRow>
                <TableDataRow>
                  <TableRowCell colSpan={2}>{customer.name}</TableRowCell>
                </TableDataRow>
                <TableDataRow>
                  <TableRowCell>CDS</TableRowCell>
                  <TableRowCell>{customer?.dse_account}</TableRowCell>
                </TableDataRow>
                <TableDataRow>
                  <TableRowCell>Balance</TableRowCell>
                  <TableRowCell>
                    {Intl.NumberFormat().format(customer.wallet)}
                  </TableRowCell>
                </TableDataRow>
                <TableDataRow>
                  <TableRowCell>Status</TableRowCell>
                  <TableRowCell style={{ textTransform: "capitalize" }}>
                    <span
                      style={{
                        padding: "4px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#f5f5f5",
                        color:
                          customer.status === "active"
                            ? "green"
                            : "var(--color-disapprove)",
                      }}
                    >
                      {customer.status}
                    </span>
                  </TableRowCell>
                </TableDataRow>
              </tbody>
            </Table>
          </CustomerInfo>
          <ActionLinks customerId={customer._id} />
          {/* <div className="flex flex-col gap-2 bg-white rounded shadow-md p-2">
            <Button
              onClick={() => openFilePicker()}
              className="bg-blue-800 text-xs w-full"
            >
              Add Documents (PDF,PNG)
            </Button>
            <Button
              onClick={() => setOpenMigrationShare(true)}
              className="bg-red-400 w-full rounded-md text-xs"
            >
              Migrate Shares
            </Button>
            <Button style={{ backgroundColor: "var(--color-disapprove)" }}>
              {customer.status === "active" ? "Set Pending" : "Set Active"}
            </Button>
            <Button
              onClick={() =>
                sendActivationEmail("shauritangaathanas@gmail.com")
              }
              style={{ backgroundColor: "var(--color-reject)" }}
            >
              Send Activation Email
            </Button>
            <Button
              onClick={() =>
                sendResetPasswordEmail("leah.gabriel@alphacapital.co.tz")
              }
              style={{ backgroundColor: "var(--color-reject)" }}
            >
              Send reset password email
            </Button>
            <Button
              onClick={() =>
                navigate("/statement", {
                  state: { transactions: displayedTransactions, customer },
                })
              }
              className="bg-sky-400"
            >
              Print Statement (PDF)
            </Button>
          </div> */}
        </Portfolio>
        {isModalOpen && <SelectionModal />}
        <ShareMigrationForm
          open={openMigrationShare}
          setOpen={setOpenMigrationShare}
        />
      </div>
    </DataProvider>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const Main = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Links = styled.div`
  display: flex;
  gap: 30px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 15px;
  border-radius: 7px;
  gap: 12px;
  cursor: pointer;
`;

const UploadView = styled.div`
  display: flex;
  background: #fff;
  flex-direction: column;
  border-radius: 7px;
  padding: 10px;
  max-height: fit-content;
  gap: 20px;
`;

const Portfolio = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
  background-color: var(--color-white);
  justify-content: center;
`;
const Avatar = styled.div`
  height: 72px;
  width: 72px;
  border-radius: 50%;
  background-color: red;
`;

const Button = styled.button`
  border-radius: 7px;
  color: white;
  height: 32px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const TableDataRow = styled.tr``;
const TableRowCell = styled.td`
  text-align: center;
  padding: 10px;
  border: 0.2px solid hsl(0deg 20% 10%);
`;
export default CustomerView;
