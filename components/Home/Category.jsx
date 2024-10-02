import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebaseconfig'
import { FlatList } from 'react-native-gesture-handler'

export default function Category({ category }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Canned');

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const categoryArray = []; // Collect categories in this array
    const snapshot = await getDocs(collection(db, 'Category'));
    snapshot.forEach((doc) => {
      categoryArray.push(doc.data()); // Push the document data to the array
    });
    setCategoryList(categoryArray); // Set state once with the full array
  };

  return (
    <View style={styles.categoryWrapper}>
      <Text style={styles.categoryText}>Category</Text>

      <FlatList
        data={categoryList}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.name); // Set selected category
              category(item.name); // Trigger the parent callback to fetch items
            }}
            style={{ flex: 1 }}
          >
            <View style={[styles.container, selectedCategory === item.name && styles.selectedCategoryContainer]}>
              <Image
                source={{ uri: item?.imageUrl }}
                style={styles.categoryImage}
              />
            </View>
            <Text style={styles.itemName}>{item?.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()} // Add keyExtractor to avoid warnings
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryWrapper: {
    marginTop: 20,
  },
  categoryImage: {
    marginTop: 20,
    width: 70,
    height: 70,
  },
  categoryText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#F3D0D7',
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#F3D0D7',
    margin: 5,
  },
  itemName: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedCategoryContainer: {
    backgroundColor: 'lightblue',
    borderColor: 'lightblue',
  },
});
