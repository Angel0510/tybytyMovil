import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as ImagePicker from 'expo-image-picker';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../Languages';


export default function VerifyAccount() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const [loader, setLoader] = useState(false);

  const [user, setUser] = useState(null);

  const [pictures, setPictures] = useState([]);

  const [frontId, setFrontId] = useState(false);

  const [afterId, setAfterId] = useState(false);

  const [face, setFace] = useState(false);

  const [send, setSend] = useState(false);

  const [photos, setPhotos] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);

  const [verified, setVerified] = useState(0);

  const [language, setLanguage] = useState("spanish");

  const setPhotosIndex = (index) => {

    setPhotoIndex(index);

    setPhotos(true);
  }


  const verify = () => {

    setSend(true);

    if (!frontId || !afterId || !face) {

      return false;
    }


    return true;
  }


  const save = () => {

    if (verify()) {

      setLoader(true);

      const formData = new FormData();

      formData.append("id_usuario", user.id);

      if (pictures.length > 0) {

        for (let i = 0; i < pictures.length; i++) {

          if (pictures[i].type == "frontId") {

            formData.append("fotoDniFrontal", pictures[i].file);

          } else if (pictures[i].type == "afterId") {

            formData.append("fotoDniPosterior", pictures[i].file);

          } else if (pictures[i].type == "face") {

            formData.append("fotoRostro", pictures[i].file);
          }

        }
      }

      axios({

        method: 'post',
        url: 'https://ws.tybyty.com/usuario/verificar',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {

        setLoader(false);

        if (response.status == 200) {

          setVerified(2);

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: Language.get(language, 'Exito'),
            textBody: Language.get(language, 'Recaudos enviados'),
            button: Language.get(language, 'Cerrar')
          });
        }

      })
        .catch((e) => {

          console.log(e);

          setLoader(false);

          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: Language.get(language, 'Atención'),
            textBody: Language.get(language, 'Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte'),
            button: Language.get(language, 'Cerrar')
          });

        });

    }

  };




  const deletePhoto = () => {

    let newPictures = pictures;

    if (newPictures[photoIndex].type == "frontId") {

      setFrontId(false);

    } else if (newPictures[photoIndex].type == "afterId") {

      setAfterId(false);

    } else if (newPictures[photoIndex].type == "face") {

      setFace(false);
    }

    newPictures.splice(photoIndex, 1);

    setPhotos(false);

    setPictures([...newPictures]);
  }


  const pickImages = async (type) => {


    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });

    if (!result.canceled) {

      if (result.assets.length > 0) {

        let newPictures = pictures;

        let exist = false;

        for (let i = 0; i < newPictures.length; i++) {

          if (newPictures[i].type == type) {

            exist = true;

            newPictures[i] = { "url": result.assets[0].uri, "type": type, "file": { "name": result.assets[0].fileName, "type": result.assets[0].mimeType, "uri": result.assets[0].uri } };

          }

        }

        if (!exist) {

          newPictures.push({ "url": result.assets[0].uri, "type": type, "file": { "name": result.assets[0].fileName, "type": result.assets[0].mimeType, "uri": result.assets[0].uri } });
        }

        if (type == "frontId") {

          setFrontId(true);

        } else if (type == "afterId") {

          setAfterId(true);

        } else if (type == "face") {

          setFace(true);
        }

        setPictures([...newPictures]);
      }

    }

  };


  const clear = () => {

    setPictures([]);

    setFrontId(null);

    setAfterId(null);

    setFace(null);

    setSend(false);
  }


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



  const option = (getUser) => {

    setLoader(true);

    axios({
      method: 'post',
      url: 'https://ws.tybyty.com/usuario',
      data: { "id_usuario": getUser.id },
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {


      if (response.status == 200) {

        let usuario = response.data.usuario;

        setVerified(usuario.verificado)

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




  const retrieveData = async () => {

    try {

      const getUser = await AsyncStorage.getItem('user');

      if (getUser !== null) {

        let newUser = JSON.parse(getUser);

        setUser(newUser);

        getCredit(newUser, false);

        option(newUser);

      } else {

        setUser(null);

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

      clear();

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


      <Modal isVisible={photos} onBackdropPress={() => setPhotos(false)} backdropOpacity={0.70}>

        <View style={{ flex: 1, backgroundColor: "black" }}>

          <TouchableOpacity
            onPress={() => setPhotos(false)}
            style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
          >

            <AntDesign name="closecircleo" size={24} color="white" />

          </TouchableOpacity>

          <ImageViewer imageUrls={pictures} onChange={(index) => setPhotoIndex(index)} backgroundColor="black" index={photoIndex} />

          <TouchableOpacity
            onPress={() => deletePhoto()}
            style={{ ...styles.buttonContainer, backgroundColor: "#DB3737" }}
          >

            <Text style={styles.buttonText}>{Language.get(language, "Eliminar")}</Text>

          </TouchableOpacity>

        </View>

      </Modal>



      {(user && user.tipo == "socio") && <View style={{ padding: 10, backgroundColor: "#1A1E20" }}>

        <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center" }}>

          <Image
            style={{ width: 30, height: 30, borderRadius: 100 }}
            source={{ uri: (user.foto) ? 'https://ws.tybyty.com/temp/' + user.foto : 'https://tybyty.com/icons/user.jpg' }}
            resizeMode="contain"
          />

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


      </View>}


      <KeyboardAwareScrollView style={{ margin: 5 }}>


        <AlertNotificationRoot theme="dark">


          {(verified == 0) && <View style={{ ...styles.login }}>


            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>

              {pictures.map((x, index) => (

                <TouchableOpacity
                  key={index}
                  onPress={() => setPhotosIndex(index)}
                  style={{ margin: 5 }}
                >
                  <Image source={{ uri: x.url }} style={{ width: 80, height: 80 }} />

                </TouchableOpacity>

              ))}

            </View>



            <TouchableOpacity
              onPress={() => pickImages("frontId")}
              style={{ ...styles.buttonContainer, backgroundColor: "#27292A", marginBottom: 10 }}
            >
              <Text style={styles.buttonText}>{Language.get(language, "Foto DNI o Documento Identidad (Frontal)")}</Text>

            </TouchableOpacity>

            {(send && !frontId) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "Foto DNI o Documento Identidad (Frontal) requerido")}
            </Text>}

            <TouchableOpacity
              onPress={() => pickImages("afterId")}
              style={{ ...styles.buttonContainer, backgroundColor: "#27292A", marginBottom: 10 }}
            >
              <Text style={styles.buttonText}>{Language.get(language, "Foto DNI o Documento Identidad (Posterior)")}</Text>

            </TouchableOpacity>

            {(send && !afterId) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "Foto DNI o Documento Identidad (Posterior) requerido")}
            </Text>}

            <TouchableOpacity
              onPress={() => pickImages("face")}
              style={{ ...styles.buttonContainer, backgroundColor: "#27292A", marginBottom: 10 }}
            >
              <Text style={styles.buttonText}>{Language.get(language, "Foto Selfie (Rostro)")}</Text>

            </TouchableOpacity>

            {(send && !face) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "Foto Selfie (Rostro) requerido")}
            </Text>}

            <TouchableOpacity
              onPress={() => save()}
              style={{ ...styles.buttonContainer, marginTop: 20, marginBottom: 30 }}
            >

              <Text style={styles.buttonText}>{Language.get(language, "Guardar")}</Text>

            </TouchableOpacity>

          </View>}



          {(verified == 2) && <View style={{ ...styles.login }}>

            <View style={{ alignItems: "center", justifyContent: "center" }}>

              <Text style={styles.title}>{Language.get(language, "Cuenta en proceso de verificación")}</Text>

            </View>

          </View>}


          {(verified == 1) && <View style={{ ...styles.login }}>

            <View style={{ alignItems: "center", justifyContent: "center" }}>

              <Text style={styles.title}>{Language.get(language, "Cuenta verificada")}</Text>

            </View>

          </View>}

        </AlertNotificationRoot>

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
    marginTop: 20,
    marginBottom: 30

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