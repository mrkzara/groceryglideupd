import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Category from './Category';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import ItemListCollection from '../../components/Home/ItemListCollection';
import { useNavigation } from '@react-navigation/native';

export default function ItemsbyCategory() {
  const [itemList, setItemList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // State to hold selected items
  const [selectedItemsCount, setSelectedItemsCount] = useState(0); // State to hold the count from Firestore
  const navigation = useNavigation();

  // Default category fetching when component mounts
  useEffect(() => {
    GetItemList('Canned'); // Default category
  }, []);

  // Fetch items by category from Firestore
  const GetItemList = async (category) => {
    setItemList([]); // Clear current item list
    const q = query(collection(db, 'Items'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => doc.data());
    setItemList(items);
  };

  // Add item to local selectedItems state
  const handleAddItem = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]); // Add the item to the selectedItems state
  };

  // Navigate to List Screen and pass selectedItems state
  const goToListScreen = () => {
    navigation.navigate('list', { selectedItems }); // Pass the selectedItems to the list screen
  };

  // Listen to real-time updates from Firestore's SelectedItems collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SelectedItems'), (snapshot) => {
      const items = snapshot.docs.map((doc) => doc.data());
      setSelectedItemsCount(items.length); // Set the count based on Firestore data
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

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
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginVertical: 10,
  }
});
