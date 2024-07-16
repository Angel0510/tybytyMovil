import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import AnimatedLoader from 'react-native-animated-loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import axios from 'axios';
import Language from '../Languages';


export default function Record() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const [user, setUser] = useState(null);

  const [loader, setLoader] = useState(false);

  const [language, setLanguage] = useState("spanish");



  const _storeData = async (data) => {
    try {

      await AsyncStorage.setItem('user', JSON.stringify(data));

      setUser(data);

    } catch (error) {
      console.log(error)
    }
  };


  const getCredit = (getUser, load) => {

    if (load) {

      setLoader(true);
    }

    axios({
      method: 'get',
      url: 'https://ws.tybyty.com/usuario/creditos/' + getUser.id,
      data: {},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {


      if (response.status == 200) {

        let newUser = getUser;

        if (newUser.creditos != response.data.creditos) {

          newUser.creditos = response.data.creditos;

          _storeData(newUser);
        }
      }

      if (load) {

        setLoader(false);

      }

    }).catch((e) => {

      if (load) {

        setLoader(false);
      }

      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: Language.get(language, 'Atención'),
        textBody: Language.get(language, 'Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte'),
        button: Language.get(language, 'Cerrar')
      });

    });


  }


  const retrieveData = async () => {

    try {

      const getUser = await AsyncStorage.getItem('user');

      if (getUser !== null) {

        setUser(JSON.parse(getUser));

        getCredit(JSON.parse(getUser), false);

      } else {

        setUser(null);

      }

    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  }




  const checkLanguage = async () => {

    try {

      const lg = await AsyncStorage.getItem('language');

      if (lg !== null) {

        setLanguage(lg);

      } else {

        setLanguage("spanish");

      }

    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  }



  useEffect(() => {

    if (isFocused) {

      retrieveData();
    }

  }, [isFocused]);


  useEffect(() => {

    checkLanguage();

    const lg = setInterval(checkLanguage, 1000);

    return () => {

      clearInterval(lg);
    };

  }, []);


  return (



    <SafeAreaView style={styles.container}>

      <AnimatedLoader
        visible={loader}
        source={require('../../animations/loader.json')}
        overlayColor="rgba(31,33,34,1)"
        animationStyle={{ width: 200, height: 200 }}
        speed={1}
      />

      <View style={{ padding: 10, backgroundColor: "#1A1E20" }}>

        <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center" }}>

          {(user) && <Image
            style={{ width: 30, height: 30, borderRadius: 100 }}
            source={{ uri: (user.foto) ? 'https://ws.tybyty.com/temp/' + user.foto : 'https://tybyty.com/icons/user.jpg' }}
            resizeMode="contain"
          />}

          {(user) && <Text style={{ ...styles.text, marginLeft: 20, color: "white", fontWeight: 'bold', fontSize: 16 }}>
            {user.usuario}
          </Text>}

          {(user) &&

            <TouchableOpacity onPress={() => getCredit(user, true)} style={{ marginLeft: 20 }}>

              <Text style={{ ...styles.text, color: "#d63384", fontWeight: 'bold' }}>
                CDT {user.creditos} <AntDesign name="retweet" size={15} color="#d63384" />
              </Text>

            </TouchableOpacity>}

        </View>

        <TouchableOpacity
          onPress={() => navigate("Menu")}
          style={{ ...styles.buttonContainer, flexDirection: "row", justifyContent: "center", backgroundColor: "#E3417A", marginTop: 20 }}
        >

          <Ionicons name="menu" size={20} color="white" style={{ marginEnd: 10 }} />

          <Text style={styles.buttonText}>{Language.get(language, "Mi Menu")}</Text>

        </TouchableOpacity>


      </View>

      <KeyboardAwareScrollView style={{ margin: 5 }}>


        <View style={{ ...styles.login }}>

          <Text style={{ ...styles.title }}>

            {Language.get(language, "No se encontraron registros")}

          </Text>
        </View>

      </KeyboardAwareScrollView>


    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#27292A"
  },
  login: {

    backgroundColor: "#111314",
    padding: 20,
    borderRadius: 20,
    marginTop: "20%",
    alignItems: "center"

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  input: {
    height: 40,
    width: '100%',
    backgroundColor: "#1a1e20",
    color: "#b1b1b1",
    borderColor: '#515455',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
    height: 50,
    marginTop: 10,
    fontSize: 15
  },

  textarea: {

    width: '100%',
    backgroundColor: "#1a1e20",
    color: "#b1b1b1",
    borderColor: '#515455',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
    height: 100,
    marginTop: 10,
    fontSize: 15,
    paddingTop: 10,
    textAlignVertical: 'top'
  },

  buttonContainer: {
    backgroundColor: '#e75e8d',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {

    color: "#CCC",
    fontSize: 15
  }
})