import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

const allShelfMarkers = [
  { id: 'Home Care', position: { top: '41%', left: '5%' } },
  { id: 'Personal Care', position: { top: '24%', left: '27%' } },
  { id: 'Wine/Liquor', position: { top: '24%', left: '67%' } },
  { id: 'Drinks', position: { top: '40%', left: '90%' } },
  { id: 'Frozen', position: { top: '65%', left: '93%' } },
  { id: 'Ice Cream', position: { top: '60%', left: '57%' } },
  { id: 'Water Section', position: { top: '74%', left: '80%' } },
  { id: 'Candies', position: { top: '40%', left: '55%' } },
  { id: 'Snacks', position: { top: '40%', left: '70%' } }
];

const MapScreen = () => {
  const route = useRoute();
  const { selectedCategories } = route.params;



  // Filter markers to only show those that are in selectedCategories
  const filteredMarkers = allShelfMarkers.filter(marker =>
    selectedCategories.includes(marker.id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/store.png')}
          style={styles.mapImage}
          resizeMode="contain"
        />
        {filteredMarkers.map((marker) => (
          <TouchableOpacity
            key={marker.id}
            style={[styles.marker, marker.position]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    backgroundColor: 'red', // Pin color
    width: 10, // Pin width
    height: 20, // Pin height
    borderRadius: 5,
  },
});

export default MapScreen;
