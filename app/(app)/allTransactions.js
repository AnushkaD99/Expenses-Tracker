import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../../context/authContext';
import { useSpace } from '../../context/spaceContext';
import { getTransactionsBySpaceId } from '../../helpers/transactionsHelper';

export default function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const { user } = useAuth();
  const { selectedSpaceId } = useSpace();

  useEffect(() => {
    getTransactionsBySpaceId(selectedSpaceId, setTransactions);
  }, [user?.userId, selectedSpaceId]);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.description}</Text>
      <Text style={styles.cell}>{item.totalAmount}</Text>

      {/* Paid By Section */}
      <View style={styles.amountCell}>
        {item.paidBy.map((payer, index) => (
          <Text key={index} style={styles.subCell}>{payer.username} - Rs.{payer.amount}</Text>
        ))}
      </View>

      {/* Paid For Section */}
      <View style={styles.amountCell}>
        {item.paidFor.map((payee, index) => (
          <Text key={index} style={styles.subCell}>{payee.username} - Rs.{payee.amount}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} horizontal={true}>
      <View>
        {/* Table Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Category</Text>
          <Text style={styles.headerCell}>Description</Text>
          <Text style={styles.headerCell}>Total Amount (LKR)</Text>
          <Text style={styles.headerAmountCell}>Paid By</Text>
          <Text style={styles.headerAmountCell}>Paid For</Text>
        </View>

        {/* Table Body */}
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    width: wp(20),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerAmountCell: {
    width: wp(40),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cell: {
    width: wp(20),
    textAlign: 'center',
  },
  amountCell: {
    width: wp(40),
    textAlign: 'center',
  },
  subCell: {
    fontSize: wp(3.5),
  },
});
