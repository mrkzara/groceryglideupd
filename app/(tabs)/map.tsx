import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Dimensions } from 'react-native';

const shelves = [
  { id: '1', name: 'Fruits', position: { top: '20%', left: '30%' } },
  { id: '2', name: 'Vegetables', position: { top: '40%', left: '50%' } },
  { id: '3', name: 'Canned Goods', position: { top: '60%', left: '70%' } },
  // Add more shelves as needed
];

export default function MapScreen() {
  // Get the dimensions of the screen
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Layout</Text>
      <View style={styles.mapContainer}>
        <Image 
          source={require('../../assets/images/store.png')} 
          style={[styles.mapImage, { width, height: height * 0.8 }]} 
          resizeMode="contain" 
        />
        {shelves.map((shelf) => (
          <View key={shelf.id} style={[styles.marker, shelf.position]}>
            <Text style={styles.markerText}>{shelf.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  mapContainer: {
    position: 'relative', // Make this container relative for absolute positioning of markers
    width: '100%',
    height: '80%',
  },
  mapImage: {
    width: '100%',
    height: '100%', // Ensure it fills the container
  },
  marker: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 0, 0, 0.7)', // Semi-transparent red for visibility
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: '#fff',
    fontSize: 12,
  },
});
