import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebaseconfig';
import { useNavigation } from '@react-navigation/native'; // Make sure you're importing this

interface SelectedItem {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  quantity: number;
}

export default function ListScreen() {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const navigation = useNavigation();

  // Fetch selected items from Firestore in real-time
  const fetchSelectedItems = () => {
    const q = query(collection(db, 'SelectedItems'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        category: doc.data().category,
      }));

      // Aggregate items with the same name
      const aggregatedItems = items.reduce((acc, item) => {
        if (acc[item.name]) {
          acc[item.name].quantity += 1;
        } else {
          acc[item.name] = { ...item, quantity: 1 };
        }
        return acc;
      }, {} as { [key: string]: SelectedItem });

      // Set the state with aggregated items
      setSelectedItems(Object.values(aggregatedItems));
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    const unsubscribe = fetchSelectedItems();
    return () => unsubscribe();
  }, []);

  const handleButtonPress = () => {
    Alert.alert(
      "Start Navigation", 
      "Are you sure you want to start navigation?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Navigation cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate('map'), // Navigate using the correct name
        },
      ],
      { cancelable: false }
    );
  };

  const handleRemoveItem = async (itemId: string, itemName: string) => {
    await deleteDoc(doc(db, 'SelectedItems', itemId));
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item
      ).filter((item) => item.quantity > 0)
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Items</Text>
      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>
              {item.name} x{item.quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item.id, item.name)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity onPress={handleButtonPress} style={styles.button}>
        <Text style={styles.buttonText}>Start Navigation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
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
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
