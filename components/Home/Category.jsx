import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs} from 'firebase/firestore'
import { db } from '@/config/firebaseconfig'
import { FlatList } from 'react-native-gesture-handler'
export default function Category({category}) {

    const [categoryList,setCategoryList]=useState([]);
    const [selecetedCategory,setSelectedCategory]=useState('Canned')
    useEffect(()=>{
        GetCategories();
    },[])
    const GetCategories=async()=>{
        setCategoryList([]);
        const snapshot=await getDocs(collection(db,'Category'));
        snapshot.forEach((doc)=>{
            
            setCategoryList(categoryList=>[...categoryList,doc.data()])
        })
    }

  return (
    
    <View style={{
        marginTop:20
    }}>
      <Text
      style={styles.categoryText}
      >Category</Text>

      <FlatList
      data={categoryList}
      numColumns={3}
      renderItem={({item,index})=>(
        <TouchableOpacity
            onPress={()=>{
                setSelectedCategory(item.name);
                category(item.name)

            }}
        style={{
            flex:1
        }}>
            <View style={[styles.container,selecetedCategory==item.name&&styles.selecetedCategoryContainer]}>
                <Image source={{uri:item?.imageUrl}}
                style={styles.categoryImage}
                />
            </View>
            <Text style={styles.itemName}>{item?.name}</Text>
        </TouchableOpacity>
      )}
      
      />
    </View>
  )
}

const styles= StyleSheet.create({
    categoryImage:{
        marginTop:20,
        width:70,
        height:70,
    },
    categoryText:{
        fontSize:30,
        fontWeight:'bold'
    },
    container:{
        backgroundColor:'#F3D0D7',
        padding:15,
        alignItems: 'center',
        borderWidth:1,
        borderRadius:15,
        borderColor:'#F3D0D7',
        margin:5
    },
    itemName:{
        textAlign:'center',
        fontWeight:'bold'
    },
    selecetedCategoryContainer:{
        backgroundColor:'lightblue',
        borderColor:'lightblue'
    }
})
