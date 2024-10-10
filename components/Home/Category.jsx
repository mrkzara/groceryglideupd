import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';
import { FlatList } from 'react-native-gesture-handler';

export default function Category({ category }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Canned');

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const categoryArray = [];
    const snapshot = await getDocs(collection(db, 'Category'));
    snapshot.forEach((doc) => {
      categoryArray.push(doc.data());
    });
    setCategoryList(categoryArray);
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
              setSelectedCategory(item.name);
              category(item.name);
            }}
            style={styles.categoryItem}
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
        keyExtractor={(item) => item.name} // Use item name for keys
        contentContainerStyle={styles.flatListContainer} // Add styling for the FlatList content
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryWrapper: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  flatListContainer: {
    paddingBottom: 20, // Add some padding to the bottom
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
  categoryItem: {
    flex: 1,
    maxWidth: '30%',
    margin: 5,
  },
  container: {
    backgroundColor: '#F3D0D7',
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#F3D0D7',
    justifyContent: 'center',
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
