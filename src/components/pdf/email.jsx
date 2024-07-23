import React, { useState } from "react";
import { Document, Page, Text, pdf } from "@react-pdf/renderer";

import axios from "axios";

const EmailWithPDF = () => {
  const [pdfBlob, setPdfBlob] = useState(null);

  const generatePDF = async () => {
    // Create a PDF document
    const MyDocument = () => (
      <Document>
        <Page size="A4">
          <Text>Hello, this is a PDF!</Text>
          <Text>Next time you will receive money</Text>
        </Page>
      </Document>
    );

    // Generate PDF as Blob
    const blob = await pdf(MyDocument()).toBlob();
    setPdfBlob(blob);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generatePDF();
    if (!pdfBlob) {
      alert("Please generate the PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("email", "shauritangaathanas@gmail.com");
    formData.append("subject", "PDF Attachment");
    formData.append("pdf", pdfBlob, "file.pdf");

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/emails/send-email-with-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Send Email with PDF</button>
      </form>
    </div>
  );
};

export default EmailWithPDF;
