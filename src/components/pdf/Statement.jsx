import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const Statement = ({ data, customer }) => {
  const [executions, setExecutions] = useState([]);
  const [profiles, setProfiles] = useState([]);
  let formatter = new Intl.NumberFormat("sw-TZ", {
    style: "currency",
    currency: "TZS",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const [executionResponse, profileResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/executions`),
        axios.get(`${import.meta.env.VITE_BASE_URL}/profiles`),
      ]);
      setExecutions(executionResponse.data);
      setProfiles(profileResponse.data);
    };
    fetchOrders();
  }, []);
  if (executions.length === 0 || profiles.length === 0) {
    return <div>Loading ...</div>;
  }

  const itemsPerPage = 25; // Adjust this value as needed for your layout
  const pages = Math.ceil((data.length + 1) / itemsPerPage);

  const userProfile = profiles.filter(
    (profile) => profile.user_id === data[0]?.client_id
  )[0];
  const number = userProfile.identity.split("").length;
  const identification =
    number === 9 ? "Passport" : number > 15 ? "National ID" : "Driving Lisence";

  console.log(identification);
  return (
    <Document pageMode="full-screen">
      {Array.from({ length: pages }).map((_, pageIndex) => (
        <Page size="A4" orientation="landscape" key={pageIndex}>
          <View fixed={true} style={{ flex: 1, paddingHorizontal: 65 }}>
            {pageIndex === 0 && (
              <>
                <Text style={styles.title}>CLIENT ACCOUNT STATEMENT</Text>
                <Text style={styles.header}>Full name: {customer.name}</Text>
                <Text style={styles.header}>
                  CDS Number: {customer.dse_account}
                </Text>
                <Text style={styles.header}>
                  Telephone Number(s): {userProfile.mobile}
                </Text>
                <Text style={styles.header}>
                  Identiication: {identification}
                </Text>
                <Text style={styles.header}>
                  ID Number: {userProfile.identity}
                </Text>
                <Text style={styles.header}>
                  Nationality: {userProfile.nationality}
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
                .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                .map((item, itemIndex) => {
                  const order = executions?.filter(
                    (exec) => exec.order_id === item?.order_id
                  );

                  return (
                    <View style={styles.tableData} key={itemIndex}>
                      <Text style={styles.tableDataCell}>
                        {dayjs(item.transaction_date).format("MM/DD/YYYY")}
                      </Text>
                      <Text style={styles.tableDataCell}>{item.action}</Text>
                      <Text style={styles.tableDataCell}>{item.reference}</Text>
                      {/* <Text style={[styles.tableDataCell, { flex: 2 }]}></Text> */}
                      <Text style={[styles.tableDataCell, { flex: 2 }]}>
                        {item.description}
                      </Text>
                      <Text style={styles.tableDataCell}>
                        {order[0]?.executed}
                      </Text>
                      <Text style={styles.tableDataCell}>
                        {order[0]?.price}
                      </Text>
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
