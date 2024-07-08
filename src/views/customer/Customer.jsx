import React, { useState } from "react";
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
  const [fileType, setFileType] = useState("");
  const [isActive, setIsActive] = useState("account");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [openMigrationShare, setOpenMigrationShare] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state;

  const sendActivationEmail = async (email) => {
    try {
      await axios.post(
        "https://admin.alphafunds.co.tz/api/v1/emails/send-activation-email",
        { email }
      );
      alert("Activation email sent successfully!");
    } catch (error) {
      console.error("Error sending activation email:", error);
      alert("Failed to send activation email. Please try again later.");
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    plainFiles.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    try {
      const response = await fetch("YOUR_API_ENDPOINT", {
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
        return <Statement id={customer._id} />;
        break;
      case "security":
        return <Security email={customer.email} />;
        break;
    }
  };
  return (
    <Wrapper>
      <Main>
        <Links>
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
        </Links>
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
                    style={{ width: "50%", textAlign: "left", padding: "10px" }}
                  >
                    File Name
                  </th>
                  <th
                    style={{ width: "25%", textAlign: "left", padding: "10px" }}
                  >
                    File Type
                  </th>
                  <th
                    style={{ width: "25%", textAlign: "left", padding: "10px" }}
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
      </Main>
      <Portfolio>
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
                <TableRowCell>647482</TableRowCell>
              </TableDataRow>
              <TableDataRow>
                <TableRowCell>Shares</TableRowCell>
                <TableRowCell>56</TableRowCell>
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
        <Actions>
          <Button
            onClick={() => openFilePicker()}
            style={{ backgroundColor: "var(--color-button)" }}
          >
            Add Documents (PDF,JPG,GIF,PNG)
          </Button>
          <Button
            onClick={() => setOpenMigrationShare(true)}
            style={{ backgroundColor: "var(--color-reject)" }}
          >
            Migrate Shares
          </Button>
          <Button style={{ backgroundColor: "var(--color-disapprove)" }}>
            {customer.status === "active" ? "Set Pending" : "Set Active"}
          </Button>
          <Button
            onClick={() => sendActivationEmail("shauritangaathanas@gmail.com")}
            style={{ backgroundColor: "var(--color-reject)" }}
          >
            Send Activation Email
          </Button>
          <Button
            style={{ backgroundColor: "var(--color-button)" }}
            onClick={() => navigate("/statement", { state: customer })}
          >
            Print Statement (PDF)
          </Button>
        </Actions>
      </Portfolio>
      {isModalOpen && <SelectionModal />}
      <ShareMigrationForm
        open={openMigrationShare}
        setOpen={setOpenMigrationShare}
      />
    </Wrapper>
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
  padding: 10px 20px;
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
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: var(--color-white);
  gap: 15px;
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
