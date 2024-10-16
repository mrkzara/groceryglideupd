import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView } from 'react-native';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig'; 

const storeLayoutImage = require('../../assets/images/store.png');

// Define marker positions by category
const markerPositions = [
  { id: '1', category: 'Canned', location: { x: 50, y: 100 } }, 
  { id: '2', category: 'Drinks', location: { x: 330, y: 80 } },  // This will match with Coke's category
  { id: '4', category: 'Homecare', location: { x: 37, y: 87 } },
  { id: '6', category: 'Snacks', location: { x: 263, y: 84 } },
];

export default function MapScreen() {
  const [items, setItems] = useState([]); 
  const [activeItem, setActiveItem] = useState(null);  
  const [markerAnimation] = useState(new Animated.Value(1)); 

  useEffect(() => {
    fetchItemsFromList();
  }, []);

  const fetchItemsFromList = async () => {
    const q = query(collection(db, 'SelectedItems')); 
    const querySnapshot = await getDocs(q);
    const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); 
    setItems(fetchedItems);
  };

  const handleItemPress = (item) => {
    setActiveItem(item); 
    startBlinking(); 
  };

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(markerAnimation, {
          toValue: 0.5, 
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(markerAnimation, {
          toValue: 1,  
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Create a function to find the marker for the active item's category
  const renderActiveMarker = () => {
    if (!activeItem) return null; // No active item, so no marker

    // Find the marker by category
    const marker = markerPositions.find(m => m.category === activeItem.category);
    
    if (!marker) return null; // No marker for this category

    return (
      <Animated.View
        style={[
          styles.marker,
          {
            left: marker.location.x,
            top: marker.location.y,
            opacity: markerAnimation, // Blinking effect
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Display the store layout */}
      <Image source={storeLayoutImage} style={styles.storeLayout} />

      {/* Show blinking marker only when an item is selected */}
      {renderActiveMarker()}

      {/* List of items below the store layout */}
      <ScrollView style={styles.itemList}>
        {items.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleItemPress(item)} style={styles.itemButton}>
            <Text style={styles.itemName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  storeLayout: {
    width: Dimensions.get('window').width,
    height: 250, // Adjust based on your image aspect ratio
    marginBottom: 20,
    resizeMode: 'contain',
  },
  itemList: {
    width: '100%',
  },
  itemButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
});
