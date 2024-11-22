import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";

import React from "react";

const Statement = ({ data }) => {
  const itemsPerPage = 15; // Adjust this value as needed for your layout
  const pages = Math.ceil((data.length + 1) / itemsPerPage);

  return (
    <Document pageMode="full-screen">
      {Array.from({ length: pages }).map((_, pageIndex) => (
        <Page size="A4" orientation="landscape" key={pageIndex}>
          <View style={{ flex: 1 }}>
            <View fixed={true} style={{ flex: 1, paddingHorizontal: 65 }}>
              {pageIndex === 0 && (
                <>
                  <Text style={styles.title}>CLIENT ACCOUNT STATEMENT</Text>
                  <Text style={styles.header}>
                    Full name: {data[0].user.name}
                  </Text>
                  <Text style={styles.header}>
                    CDS Number: {data[0].user.dseAccount}
                  </Text>
                  <Text style={styles.header}>
                    Telephone Number(s): {data[0].user.phone}
                  </Text>
                  <Text style={styles.header}>
                    Identiication: {data[0].user.idType}
                  </Text>
                  <Text style={styles.header}>
                    ID Number: {data[0].user.idNumber}
                  </Text>
                  <Text style={styles.header}>
                    Nationality: {data[0].user.nationality}
                  </Text>
                </>
              )}
              <View style={[styles.table, { marginBottom: "40px" }]}>
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

                {data
                  .slice(
                    pageIndex * itemsPerPage,
                    (pageIndex + 1) * itemsPerPage
                  )
                  .map((item, itemIndex) => {
                    return (
                      <View style={styles.tableData} key={itemIndex}>
                        <Text style={styles.tableDataCell}>
                          {dayjs(item.transaction_date).format("MM/DD/YYYY")}
                        </Text>
                        <Text style={styles.tableDataCell}>{item.action}</Text>
                        <Text style={styles.tableDataCell}>
                          {item.reference}
                        </Text>
                        {/* <Text style={[styles.tableDataCell, { flex: 2 }]}></Text> */}
                        <Text style={[styles.tableDataCell, { flex: 2 }]}>
                          {item.description}
                        </Text>
                        <Text style={styles.tableDataCell}>
                          {item.quantity}
                        </Text>
                        <Text style={styles.tableDataCell}>{item.price}</Text>
                        <Text style={styles.tableDataCell}>
                          {new Intl.NumberFormat("sw-TZ", {
                            style: "currency",
                            currency: "TZS",
                          }).format(item.debit)}
                        </Text>
                        <Text style={styles.tableDataCell}>
                          {new Intl.NumberFormat("sw-TZ", {
                            style: "currency",
                            currency: "TZS",
                          }).format(item.credit)}
                        </Text>
                        <Text style={styles.tableDataCell}>
                          {new Intl.NumberFormat("sw-TZ", {
                            style: "currency",
                            currency: "TZS",
                          }).format(item.balance)}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        </Page>
      ))}
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
    fontSize: 7.5,
    paddingHorizontal: 4,
    paddingVertical: 4,
    textAlign: "justify",
    borderRight: "1px solid hsl(243deg, 50%, 21%)",
  },
  header: {
    fontSize: 10,
    marginBottom: 5,
  },
});

export default Statement;
