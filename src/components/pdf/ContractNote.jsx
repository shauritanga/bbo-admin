import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import backgroundImage from "../../assets/watermark.png";
import dayjs from "dayjs";
import { calculateFees } from "../../utils/getFees";

const Contract = ({ data }) => {
  const fees = calculateFees(data.amount);

  return (
    <Document pageMode="full-screen">
      <Page size="A4">
        <View fixed={true} style={{ flex: 1 }}>
          <Image src={backgroundImage} style={styles.pageBackground} />
          <View style={styles.body}>
            <Text
              style={{
                textAlign: "right",
                fontSize: 12,
                marginTop: 100,
                marginBottom: 24,
              }}
            >
              FORM NO: ADGT6545
            </Text>
            <Text
              style={{ textAlign: "center", fontSize: 11, marginBottom: 8 }}
            >
              CONTRACT NOTE – PURCHASE
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginBottom: 24,
                fontSize: 10,
              }}
            >
              Subject to these Rules of the DSE
            </Text>
            <View style={styles.table}>
              <Text
                style={[
                  styles.cell,
                  { borderRight: "none", borderTop: "1px solid grey" },
                ]}
              >
                DSE Trading Slip No: {data.slip}
              </Text>
              <Text
                style={[
                  styles.cell,
                  { borderRight: "none", borderTop: "1px solid grey" },
                ]}
              >
                Trade Date: {dayjs(data.date).format("DD-MM-YYYY")}
              </Text>
              <Text style={[styles.cell, { borderTop: "1px solid grey" }]}>
                Settlement Date: {dayjs(data.date).format("DD-MM-YYYY")}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>
                Name of client: {data.customer?.name}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>Client Address: -</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>Client's Ref: 611770</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>Security: {data.security?.name}</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>Quantity: {data.executed}</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>Price per share: TZS {data.price}</Text>
            </View>
            <View style={styles.table}>
              <Text style={styles.cell}>
                Consideration (TZS) - Quantinty x Price: {data.amount}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                Add
              </Text>
              <Text style={styles.cell}>TZS</Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                Brokerage Commission up to TZS 10mn @ 1.7%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.commissionTier1 + Number.EPSILON) * 100) /
                  100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                Brokerage Commission for the next TZS 40mn @ 1.5%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.commissionTier2 + Number.EPSILON) * 100) /
                  100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                Brokerage Commission for the sum above TZS 70mn @ 0.8%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.commissionTier3 + Number.EPSILON) * 100) /
                  100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                Total Brokerage Commission
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.totalCommission + Number.EPSILON) * 100) /
                  100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                VAT @ 18%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.vat + Number.EPSILON) * 100) / 100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                DSE Fee @ 0.14%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.dseFee + Number.EPSILON) * 100) / 100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                CMSA Fee @ 0.14%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.cmsaFee + Number.EPSILON) * 100) / 100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                Fidelity Fee @ 0.02%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.fidelityFee + Number.EPSILON) * 100) / 100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                CDS Fee @ 0.06%
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.cdsFee + Number.EPSILON) * 100) / 100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                Total Charges
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.totalCharges + Number.EPSILON) * 100) / 100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text style={[styles.cell, { flex: 2, borderRight: "none" }]}>
                TOTAL CONSIDERATION
              </Text>
              <Text style={styles.cell}>
                {Math.round((fees.totalConsideration + Number.EPSILON) * 100) /
                  100}
              </Text>
            </View>
            <View style={styles.table}>
              <Text
                style={[
                  styles.cell,
                  { flex: 2, borderRight: "1px solid black" },
                ]}
              ></Text>
            </View>
            <View style={styles.table}>
              <Text
                style={[
                  styles.cell,
                  { flex: 2, borderRight: "1px solid black" },
                ]}
              >
                This is electronic generated document, it is valid without a
                seal
              </Text>
            </View>
            <View style={{ paddingBottom: 180 }}></View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 35,
  },
  page: {
    height: "100%",
    width: "100%",
  },
  pageBackground: {
    position: "absolute",
    minWidth: "100%",
    minHeight: "100%",
    display: "block",
    height: "100%",
    width: "100%",
  },
  table: {
    flexDirection: "row",
    height: 28,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Oswald",
  },
  cell: {
    flex: 1,
    borderBottom: "1px solid black",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    justifyContent: "center",
    padding: 8,
    fontSize: 9.5,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

export default Contract;
