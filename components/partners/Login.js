import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AnimatedLoader from 'react-native-animated-loader';
import { useState, useEffect } from 'react';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import Language from '../Languages';

export default function Login() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const [recoverKey, setRecoverKey] = useState(false);

  const [loader, setLoader] = useState(false);

  const [send, setSend] = useState(false);

  const [sendPing, setSendPing] = useState(false);

  const [user, setUser] = useState("");

  const [pass, setPass] = useState("");

  const [ping, setPing] = useState("");

  const [dataKey, setDataKey] = useState(null);

  const [language, setLanguage] = useState("spanish");


  const _storeData = async (data) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.log(error)
    }
  };



  const reset = () => {

    setUser("");
    setPass("");
    setSend(false);

  }


  const verifyForm = () => {

    setSend(true);

    if (!user || !pass) {

      return false;
    }

    return true;
  }


  const resetPing = () => {

    setPing("");

    setSendPing(false);
  }


  const verifyFormPing = () => {

    setSendPing(true);

    if (!ping) {

      return false;
    }

    return true;
  }


  const openRecoverKey = () => {

    resetPing();

    setDataKey(null);

    setRecoverKey(true);
  }



  const getKey = () => {

    if (verifyFormPing()) {

      setLoader(true);

      axios({
        method: 'post',
        url: 'https://ws.tybyty.com/usuarios/ping',
        data: {
          "ping": ping
        },
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }

      }).then((response) => {


        if (response.status == 200) {

          resetPing();

          setDataKey(response.data.usuario);

        } else if (response.status == 204) {

          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: Language.get(language, 'Atención'),
            textBody: Language.get(language, 'Ping incorrecto'),
            button: Language.get(language, 'Cerrar')
          });
        }

        setLoader(false);

      }).catch((e) => {

        setLoader(false);

        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: Language.get(language, 'Atención'),
          textBody: Language.get(language, 'Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte'),
          button: Language.get(language, 'Cerrar')
        });


      });
    }

  }



  const login = () => {

    if (verifyForm()) {

      setLoader(true);

      axios({
        method: 'post',
        url: 'https://ws.tybyty.com/usuarios/login',
        data: {
          "usuario": user,
          "clave": pass
        },
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }

      }).then((response) => {


        if (response.status == 200) {

          console.log(response.data.usuario);

          _storeData(response.data.usuario);

          reset();

          navigate("MyMenu");

        } else if (response.status == 204) {

          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: Language.get(language, 'Atención'),
            textBody: Language.get(language, 'Usuario o clave incorrectos'),
            button: Language.get(language, 'Cerrar')
          });
        }

        setLoader(false);

      }).catch((e) => {

        setLoader(false);

        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: Language.get(language, 'Atención'),
          textBody: Language.get(language, 'Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte'),
          button: Language.get(language, 'Cerrar')
        });

      });
    }

  }


  const retrieveData = async () => {

    try {

      const getUser = await AsyncStorage.getItem('user');

      if (getUser !== null) {

        let newUser = JSON.parse(getUser);

        if (newUser.tipo == "socio") {

          navigate("MyMenu");

        } else {

          navigate("AdsMain");
        }
      }

    } catch (error) {
      console.error('Error al recuperar sesión', error);
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

      reset();
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


      <Modal isVisible={recoverKey} onBackdropPress={() => setRecoverKey(false)} backdropOpacity={0.70}>

        <View>

          <View style={modal.title}>

            <Text style={{ ...styles.text, color: "white", fontSize: 17, fontWeight: "bold" }}>

              {Language.get(language, "Recuperar Cuenta")}

            </Text>

            <TouchableOpacity
              onPress={() => setRecoverKey(false)}
              style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
            >

              <AntDesign name="closecircleo" size={24} color="white" />

            </TouchableOpacity>

          </View>

          <KeyboardAwareScrollView style={modal.body}>

            <View style={modal.content}>

              {(!dataKey) && <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "PING SEGURIDAD")}:
              </Text>}

              {(!dataKey) && <TextInput
                placeholder="PING"
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                style={styles.input}
                value={ping}
                onChangeText={text => setPing(text)}
              />}

              {(sendPing && !ping) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo ping es requerido")}
              </Text>}

              {(dataKey) && <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Usuario")}: {dataKey.usuario}
              </Text>}

              {(dataKey) && <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Clave")}: {dataKey.clave}
              </Text>}

            </View>

          </KeyboardAwareScrollView>

          {(!dataKey) && <View style={modal.footer}>

            <TouchableOpacity
              onPress={() => getKey()}
              style={{ ...styles.buttonContainer }}
            >

              <Text style={styles.buttonText}>{Language.get(language, "Enviar")}</Text>

            </TouchableOpacity>

          </View>}

        </View>

      </Modal>

      <View>

        <KeyboardAwareScrollView>

          <AlertNotificationRoot theme="dark">

            <View style={{ ...styles.login }}>
              <Text style={styles.title}>{Language.get(language, "Bienvenido")}</Text>

              <TextInput
                placeholder={Language.get(language, "Usuario")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                style={styles.input}
                value={user}
                onChangeText={text => setUser(text)}
              />

              {(send && !user) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo usuario es requerido")}
              </Text>}


              <TextInput
                placeholder={Language.get(language, "Clave")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                style={styles.input}
                value={pass}
                onChangeText={text => setPass(text)}
              />

              {(send && !pass) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo clave es requerido")}
              </Text>}

              <TouchableOpacity
                onPress={() => login()}
                style={{ ...styles.buttonContainer, marginTop: 20 }}
              >
                <Text style={styles.buttonText}>{Language.get(language, "Iniciar sesión")}</Text>
              </TouchableOpacity>


              <View style={{ alignItems: "center" }}>


                <Text style={{ ...styles.text, marginTop: 20 }} onPress={() => openRecoverKey()}>
                  {Language.get(language, "Has olvidado tus datos")}?
                </Text>

                <Text style={{ ...styles.text, marginTop: 20 }} onPress={() => navigate("NewPartner")}>
                  {Language.get(language, "Registrarme")}
                </Text>

              </View>

            </View>

          </AlertNotificationRoot>

        </KeyboardAwareScrollView>

      </View>



    </SafeAreaView>
  );
}



const modal = StyleSheet.create({


  title: {

    width: "100%",
    position: 'absolute',
    top: 0,
    zIndex: 1,
    height: 65,
    flexDirection: "row",
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: "center",
    backgroundColor: "#5E3647",
    padding: 10
  },

  body: {

    padding: 10,
    backgroundColor: "#111314"

  },

  content: {

    marginTop: 65,
    marginBottom: 70
  },

  footer: {

    width: "100%",
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    padding: 10,
    height: 60,
    backgroundColor: "#111314"
  }
});


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#27292A",
    padding: 10,
    justifyContent: "center"
  },
  login: {
    backgroundColor: "#111314",
    padding: 20,
    borderRadius: 20

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
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

  buttonContainer: {

    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: '#e75e8d',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
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