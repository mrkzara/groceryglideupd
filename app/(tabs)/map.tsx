import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, Modal } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRoute } from '@react-navigation/native';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';

const storeLayoutImage = require('../../assets/images/store.png');

// Hardcoded category markers with coordinates and unique colors
const markerPositions = [
  { id: '1', name: 'Canned', category: 'Canned', location: { x: 170, y: 160 }, color: 'blue' },
  { id: '2', name: 'Drinks', category: 'Drinks', location: { x: 350, y: 150 }, color: 'green' },
  { id: '3', name: 'Homecare', category: 'Homecare', location: { x: 150, y: 80 }, color: 'purple' },
  { id: '4', name: 'Ice Cream', category: 'Ice Cream', location: { x: 260, y: 315 }, color: 'orange' },
  { id: '5', name: 'Snacks', category: 'Snacks', location: { x: 290, y: 160 }, color: 'red' },
  { id: '6', name: 'Dairy', category: 'Dairy', location: { x: 350, y: 113 }, color: 'yellow' },
  { id: '7', name: 'Tissue', category: 'Tissue', location: { x: 180, y: 80 }, color: 'red' },
  { id: '8', name: 'Sandwich Spread', category: 'Sandwich Spread', location: { x: 217, y: 160 }, color: 'teal' },
  { id: '9', name: 'Noodles', category: 'Noodles', location: { x: 200, y: 160 }, color: 'brown' },
  { id: '10', name: 'Body Products', category: 'Body Products', location: { x: 60, y: 160 }, color: 'pink' },
  { id: '11', name: 'Chips', category: 'Chips', location: { x: 310, y: 160 }, color: 'lime' },
  { id: '12', name: 'Liquor', category: 'Liquor', location: { x: 325, y: 80 }, color: 'navy' },
  { id: '13', name: 'Hair Products', category: 'Hair Products', location: { x: 80, y: 160 }, color: 'violet' },
  { id: '14', name: 'Nuts', category: 'Nuts', location: { x: 263, y: 160 }, color: 'olive' },
  { id: '15', name: 'Sweets', category: 'Sweets', location: { x: 245, y: 160 }, color: 'cyan' },
  { id: '16', name: 'Sauces', category: 'Sauces', location: { x: 155, y: 160 }, color: 'magenta' },
  { id: '17', name: 'Health Care', category: 'Health Care', location: { x: 35, y: 80 }, color: 'maroon' },
  { id: '18', name: 'Ice Cream Big', category: 'Ice Cream Big', location: { x: 315, y: 315 }, color: 'orange' },
  { id: '19', name: 'Sugar/Rice', category: 'Sugar/Rice', location: { x: 125, y: 160 }, color: 'black' },
];

export default function MapScreen() {
  const route = useRoute();
  const { selectedCategories = [] } = route.params || {}; // Set a default empty array
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected image URL
  const [showAllMarkers, setShowAllMarkers] = useState(false); // New state for showing all markers

  // Fetch selected items in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SelectedItems'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Group items by name and category, and sum quantities
      const groupedItems = items.reduce((acc, item) => {
        const key = `${item.name}-${item.category}`;
        if (!acc[key]) {
          acc[key] = { ...item, quantity: 1 };
        } else {
          acc[key].quantity += 1;
        }
        return acc;
      }, {});

      // Convert object to array
      setSelectedItems(Object.values(groupedItems).filter(item => selectedCategories.includes(item.category)));
    });
    return () => unsubscribe();
  }, [selectedCategories]);

  // Filter markers based on unique categories in selectedItems
  const filteredMarkers = Array.from(
    new Set(selectedItems.map(item => item.category)) // Filter unique categories
  ).map(category => markerPositions.find(marker => marker.category === category))
    .filter(Boolean); // Remove any undefined entries

  // Function to handle item removal
  const handleRemoveItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'SelectedItems', itemId));
      setSelectedItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Handle marker tap to display image
  const handleMarkerPress = (marker) => {
    const selectedItem = selectedItems.find(item => item.category === marker.category);
    if (selectedItem?.imageUrl) { // Ensure the item has an image URL
      setSelectedImage(selectedItem.imageUrl);  // Set the image URL
      setShowModal(true);  // Open the modal
    }
  };

  // Render markers on the map based on the selected items' categories
  const renderMarkers = () => {
    const markersToRender = showAllMarkers ? markerPositions : filteredMarkers;
    return markersToRender.map((marker) => (
      <Circle
        key={`${marker.id}-${marker.category}`}  // Ensure uniqueness
        cx={marker.location.x}
        cy={marker.location.y}
        r="6"
        fill={marker.color}
        onPress={() => handleMarkerPress(marker)} // Handle marker tap
      />
    ));
  };

  // Toggle the visibility of all markers
  const toggleShowAllMarkers = () => {
    setShowAllMarkers(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <Image source={storeLayoutImage} style={styles.storeLayout} />

      <Svg style={styles.svgOverlay}>
        {renderMarkers()}
      </Svg>

      <View style={styles.itemList}>
        {selectedItems.length === 0 ? (
          <Text style={styles.emptyText}>No items selected.</Text>
        ) : (
          selectedItems.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemContainer}>
              <Text style={styles.itemText}>
                {item.name} ({item.category}) {item.quantity > 1 ? `${item.quantity}x` : ''}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Button to toggle visibility of all markers */}
      <TouchableOpacity onPress={toggleShowAllMarkers} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {showAllMarkers ? 'Show Only Selected Markers' : 'Show All Markers'}
        </Text>
      </TouchableOpacity>

      {/* Modal for displaying the image */}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  storeLayout: {
    width: Dimensions.get('window').width - 20,
    height: 400,
    resizeMode: 'contain',
  },
  svgOverlay: {
    position: 'absolute',
    top: 40,
    left: 10,
    width: Dimensions.get('window').width - 20,
    height: 400,
  },
  itemList: {
    marginTop: 20,
    padding: 10,
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
  toggleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
