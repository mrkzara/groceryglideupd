import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
    <Tabs.Screen name="home" options={{ title: 'Home', headerShown:false}} />
    <Tabs.Screen name="list" options={{ title: 'List', headerShown:false }} />
    <Tabs.Screen name="map" options={{ title: 'Map', headerShown:false }} />
  </Tabs>
  )
}