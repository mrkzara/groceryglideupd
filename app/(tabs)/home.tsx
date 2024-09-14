import React from 'react';
import { View, Text } from 'react-native';
import Slider from '../../components/Home/Slider'; // Adjust the import path to your components folder
import ItemsByCategory from '../../components/Home/ItemsByCategory'
export default function HomeScreen() {
  return (
    <View style={{
      padding:20,
      marginTop:20
    }}>
      
      <Slider /> 

      <ItemsByCategory />
    </View>
  );
}