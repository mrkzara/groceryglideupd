import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, ScrollView, Alert } from 'react-native';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebaseconfig'; 

const storeLayoutImage = require('../../assets/images/store.png');


const markerPositions = [
  { id: '1', category: 'Canned', location: { x: 50, y: 100 } }, 
  { id: '2', category: 'Drinks', location: { x: 330, y: 80 } },
  { id: '3', category: 'Homecare', location: { x: 37, y: 87 } },
  { id: '4', category: 'Ice Cream', location: { x: 150, y: 170 } },
  { id: '5', category: 'Snacks', location: { x: 263, y: 84 } },
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
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(fetchedItems);
    });

    return () => unsubscribe();
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

  const renderActiveMarker = () => {
    if (!activeItem) return null; 

    const marker = markerPositions.find(m => m.category === activeItem.category);
    
    if (!marker) return null; 

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

  const handleItemAcquired = async (itemId: string, itemName: string) => {
    Alert.alert(
      'Item Acquired',
      `Have you acquired ${itemName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            await deleteDoc(doc(db, 'SelectedItems', itemId));
            // Clear the active item if it's the one being acquired
            if (activeItem && activeItem.id === itemId) {
              setActiveItem(null); // Clear marker
            }
          }
        }
      ]
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
          <View key={item.id} style={styles.itemContainer}>
            <TouchableOpacity 
              onPress={() => handleItemPress(item)} 
              style={[styles.itemButton, activeItem && activeItem.id === item.id ? styles.activeItemButton : null]}
            >
              <Text style={[styles.itemName, activeItem && activeItem.id === item.id ? styles.activeItemText : null]}>
                {item.name}
              </Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleItemAcquired(item.id, item.name)} style={styles.checkButton}>
                <Text style={styles.buttonText}>✔</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    height: 250,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  itemList: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flex: 1,
  },
  itemName: {
    fontSize: 18,
  },
  activeItemButton: {
    backgroundColor: '#f0f0f0',
  },
  activeItemText: {
    fontWeight: 'bold',
    color: '#ff6347',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  marker: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
  },
});
