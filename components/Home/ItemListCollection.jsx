import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';

export default function ItemListCollection({ product, onAdd }) {
  
  const handleAdd = async (product) => {
    try {
      // Add the product to the "SelectedItems" collection
      await addDoc(collection(db, 'SelectedItems'), {
        name: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        addedAt: new Date(),
      });
      console.log('Item added to Firestore:', product.name);
      
      // Call the onAdd function to update local state
      onAdd(product);
      
    } catch (error) {
      console.error('Error adding item to Firestore:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product?.imageUrl }}
        style={styles.image}
      />
      <Text style={styles.name}>{product.name}</Text>
      <TouchableOpacity style={styles.button} onPress={() => handleAdd(product)}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  image: {
    width: 150,
    height: 135,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#a62639',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
