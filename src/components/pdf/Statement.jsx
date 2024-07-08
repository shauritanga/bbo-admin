import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const Statement = ({ data }) => {
  return (
    <Document pageMode="full-screen">
      <Page size="A4" orientation="landscape">
        <View fixed={true} style={{ flex: 1, paddingHorizontal: 65 }}>
          <Text style={styles.title}>CLIENT ACCOUNT STATEMENT</Text>
          <Text style={styles.header}>Full name: {data.name}</Text>
          <Text style={styles.header}>CDS Number: 647482</Text>
          <Text style={styles.header}>Telephone Number(s): {data.phone}</Text>
          <Text style={styles.header}>Identiication: {data.idType}</Text>
          <Text style={styles.header}>ID Number: {data.idNumber}</Text>
          <Text style={styles.header}>Nationality: Tanzania</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>date</Text>
              <Text style={styles.tableHeaderCell}>type</Text>
              {/* <Text style={styles.tableHeaderCell}>category</Text> */}
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                reference
              </Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                particulars
              </Text>
              <Text style={styles.tableHeaderCell}>quantity</Text>
              <Text style={styles.tableHeaderCell}>price</Text>
              <Text style={styles.tableHeaderCell}>debit</Text>
              <Text style={styles.tableHeaderCell}>credit</Text>
              <Text style={styles.tableHeaderCell}>balance</Text>
            </View>
            {/* <View style={styles.tableData}>
              <Text style={styles.tableDataCell}></Text>
              <Text style={styles.tableDataCell}>{item.type}</Text>
              <Text style={styles.tableDataCell}>{item.category}</Text>
              <Text style={[styles.tableDataCell, { flex: 2 }]}></Text>
              <Text style={[styles.tableDataCell, { flex: 2 }]}></Text>
              <Text style={styles.tableDataCell}></Text>
              <Text style={styles.tableDataCell}></Text>
              <Text style={styles.tableDataCell}></Text>
              <Text style={styles.tableDataCell}></Text>
              <Text style={styles.tableDataCell}></Text>
            </View> */}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    textAlign: "center",
    marginVertical: 40,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "hsl(243deg, 50%, 21%)",
    color: "#fff",
    border: "none",
  },
  tableData: {
    flexDirection: "row",
    borderLeft: "1px solid hsl(243deg, 50%, 21%)",
    borderRight: "1px solid hsl(243deg, 50%, 21%)",
    borderBottom: "1px solid hsl(243deg, 50%, 21%)",
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8.5,
    textTransform: "uppercase",
    padding: 3,
  },
  tableDataCell: {
    flex: 1,
    fontSize: 8.5,
    paddingHorizontal: 4,
    paddingVertical: 4,
    textAlign: "left",
  },
  header: {
    fontSize: 10,
  },
});

export default Statement;
