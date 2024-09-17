import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Category from './Category';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import ItemListCollection from '../../components/Home/ItemListCollection';
import { useNavigation } from '@react-navigation/native';

export default function ItemsbyCategory() {
  const [itemList, setItemList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // State to hold selected items
  const navigation = useNavigation();

  useEffect(() => {
    GetItemList('Canned'); // Default category
  }, []);

  const GetItemList = async (category) => {
    setItemList([]);
    const q = query(collection(db, 'Items'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => doc.data());
    setItemList(items);
  };

  const handleAddItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]); // Add the item to the selectedItems state
  };

  const goToListScreen = () => {
    navigation.navigate('list', { selectedItems }); // Pass the selectedItems to the list screen
  };

  return (
    <View style={styles.container}>
      <Category category={(value) => GetItemList(value)} />
      <Text style={styles.title}>View All</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={itemList}
        horizontal={true}
        renderItem={({ item }) => (
          <ItemListCollection product={item} onAdd={handleAddItem} />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity onPress={goToListScreen} style={styles.viewListButton}>
        <Text style={styles.viewListText}>View List ({selectedItems.length})</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginVertical: 10,
  },
  viewListButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    borderRadius: 5,
  },
  viewListText: {
    color: '#fff',
    fontSize: 16,
  },
});
