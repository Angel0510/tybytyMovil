import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import AnimatedLoader from 'react-native-animated-loader';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Logout() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const [loader, setLoader] = useState(true);


  const removeStoreData = async () => {
    try {

      await AsyncStorage.removeItem('user');

      navigate("Login");
     
    } catch (error) {
      console.error('Error al eliminar el elemento:', error);
    }
  };

  
  useEffect(() => {
    if (isFocused) {
      
        removeStoreData();
    }
  }, [isFocused]);


  return (

    <SafeAreaView style={styles.container}>

      <AnimatedLoader
        visible={loader}
        source={require('../animations/loader.json')}
        overlayColor="rgba(31,33,34,1)"
        animationStyle={{ width: 200, height: 200 }}
        speed={1}
      />

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#27292A",
    padding: 10,
    justifyContent: "center"
  }
  
})