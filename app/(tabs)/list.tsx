import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

// Define the type of the route params
type ListScreenRouteProp = RouteProp<{ params: { selectedItems?: { name: string }[] } }, 'params'>;

export default function ListScreen() {
  const route = useRoute<ListScreenRouteProp>();

  // Extract selectedItems from route params
  const selectedItems = route?.params?.selectedItems ?? [];

  // State to store items with quantities
  const [itemsWithQuantities, setItemsWithQuantities] = useState<{ name: string; quantity: number }[]>([]);

  // Calculate items with quantities whenever selectedItems changes
  useEffect(() => {
    const itemMap = selectedItems.reduce((acc: { [key: string]: { name: string; quantity: number } }, item) => {
      if (acc[item.name]) {
        acc[item.name].quantity += 1;
      } else {
        acc[item.name] = { name: item.name, quantity: 1 };
      }
      return acc;
    }, {});

    setItemsWithQuantities(Object.values(itemMap));
  }, [selectedItems]); // Only re-run if selectedItems changes

  // Handle item removal
  const handleRemoveItem = (itemName: string) => {
    setItemsWithQuantities((prevItems) => {
      const updatedItems = prevItems
        .map((item) =>
          item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      return updatedItems;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Items</Text>
      {itemsWithQuantities.length > 0 ? (
        <FlatList
          data={itemsWithQuantities}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>
                {item.name} x{item.quantity}
              </Text>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.name)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.name}
        />
      ) : (
        <Text>No items selected.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
