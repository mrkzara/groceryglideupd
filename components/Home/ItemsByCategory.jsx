import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Category from '../../components/Home/Category';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig';
import ItemListCollection from '../../components/Home/ItemListCollection';

export default function ItemsbyCategory() {

    const [itemList, setItemList] = useState([]);

    useEffect(() => {
      GetItemList('Canned'); 
    },[]);

  
    const GetItemList = async (category) => {

      setItemList([]);
      const q = query(collection(db, 'Items'), where('category', '==', category));
      const querySnapshot = await getDocs(q);
    
      querySnapshot.forEach(doc=>{
        setItemList(itemList=>[...itemList,doc.data()])
      })
    }

  return (
    <View>
      <Category category={(value) => GetItemList(value)} />
      <Text style={styles.title}>View All</Text>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={itemList}
        horizontal={true}
        renderItem={({ item,index }) => (
          <ItemListCollection product={item}  />
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginVertical: 10,
  }
})

