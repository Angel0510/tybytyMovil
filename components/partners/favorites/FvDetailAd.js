import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Linking, StyleSheet, Text, Image, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import PagerView from 'react-native-pager-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import Language from '../../Languages';


export default function FvDetailAd() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const route = useRoute();

  const [reload, setReload] = useState(true);

  const [loader, setLoader] = useState(false);

  const [photos, setPhotos] = useState(false);

  const [contact, setContact] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);

  const [user, setUser] = useState(null);

  const [ad, setAd] = useState(null);

  const pagerRef = useRef(null);

  const [images, setImages] = useState([]);

  const [report, setReport] = useState(false);

  const [subject, setSubject] = useState("");

  const [email, setEmail] = useState("");

  const [details, setDetails] = useState("");

  const [sendReport, setSendReport] = useState(false);

  const [language, setLanguage] = useState("spanish");


  const notReloadNavigate = (view, params = null) => {

    setReload(false);

    if (params) {

      navigate(view, params);

    } else {

      navigate(view);
    }

  }


  const handleLinkPress = (url) => {

    Linking.openURL(url);
  };



  const openReport = () => {

    setSubject("");

    setEmail("");

    setDetails("");

    setSendReport(false);

    setReport(true);
  }

  const verifyReport = () => {

    setSendReport(true);

    if (!subject || !email || !details) {

      return false;
    }

    return true;
  }



  const pushFavorite = () => {

    setLoader(true);

    axios({
      method: 'put',
      url: 'https://ws.tybyty.com/anuncios/favorito',
      data: { "id_usuario": user.id, "id_anuncio": route.params.id, "estado": !ad.favorito },
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {


      if (response.status == 200) {


        let newAd = ad;

        newAd.favorito = !ad.favorito;

        setAd({ ...newAd });

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



  const pushReport = () => {


    if (verifyReport()) {

      setLoader(true);

      axios({
        method: 'post',
        url: 'https://ws.tybyty.com/anuncio/denuncia',
        data: {

          id: route.params.id,
          asunto: subject,
          correo: email,
          detalles: details
        },
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }

      }).then((response) => {

        if (response.status == 201) {

          setReport(false);

          setSendReport(false);

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: Language.get(language,'Exito'),
            textBody: Language.get(language,'Denuncia completada'),
            button: Language.get(language,'Cerrar')
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



  const share = (url) => {

    const text = 'Hola, echa un vistazo a este link: ';
    const message = encodeURIComponent(text + url);
    const whatsappLink = 'whatsapp://send?text=' + message;

    Linking.canOpenURL(whatsappLink).then(supported => {
      if (supported) {
        return Linking.openURL(whatsappLink);
      } else {
        alert('No se puede abrir WhatsApp');
      }
    });
  };


  const call = (phoneNumber) => {

    const phoneUrl = `tel:${phoneNumber}`;

    Linking.canOpenURL(phoneUrl).then(supported => {
      if (supported) {
        return Linking.openURL(phoneUrl);
      } else {
        alert('No se puede realizar la llamada');
      }
    });
  };


  const whatappMessage = (phoneNumber) => {

    const text = 'Hola, estoy interesado en tu anuncio'; // Reemplaza esto con el mensaje que deseas enviar
    const message = encodeURIComponent(text);
    const whatsappLink = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    Linking.canOpenURL(whatsappLink).then(supported => {
      if (supported) {
        return Linking.openURL(whatsappLink);
      } else {
        console.log('No se puede abrir WhatsApp');
      }
    });
  }


  const setPhotosIndex = (index) => {

    setPhotoIndex(index);

    setPhotos(true);
  }


  const handlePageSelected = (e) => {
    setPhotoIndex(e.nativeEvent.position);
  };


  const options = (getUser) => {

    axios({
      method: 'get',
      url: 'https://ws.tybyty.com/anuncio/info/' + route.params.id + '/' + getUser.id,
      data: {},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {

      if (response.status == 200) {

        setAd({ ...response.data.anuncio });

        if (response.data.anuncio.fotos.length > 0) {

          let newImages = [];

          for (let i = 0; i < response.data.anuncio.fotos.length; i++) {

            newImages.push({ url: 'https://ws.tybyty.com/temp/' + response.data.anuncio.fotos[i].src });
          }

          setImages([...newImages]);

        } else {

          setImages([]);
        }
      }

    }).catch((e) => {

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

        options(newUser);

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

    if (images.length > 0) {

      pagerRef.current.setPage(photoIndex);
    }

  }, [photoIndex])


  useEffect(() => {

    if (isFocused) {

      if (reload) {

        setAd(null);

        setImages([]);
      }

      retrieveData();

      setReload(true);
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
        source={require('../../../animations/loader.json')}
        overlayColor="rgba(31,33,34,1)"
        animationStyle={{ width: 200, height: 200 }}
        speed={1}
      />


      <Modal isVisible={report} onBackdropPress={() => setReport(false)} backdropOpacity={0.70}>

        <View>

          <View style={modal.title}>

            <Text style={{ ...styles.text, color: "white", fontSize: 17, fontWeight: "bold" }}>
              {Language.get(language, "Denunciar")}
            </Text>

            <TouchableOpacity
              onPress={() => setReport(false)}
              style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
            >

              <AntDesign name="closecircleo" size={24} color="white" />

            </TouchableOpacity>

          </View>

          <KeyboardAwareScrollView style={modal.body}>

            <View style={modal.content}>

              <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Asunto")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Asunto")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                style={styles.input}
                value={subject}
                onChangeText={text => setSubject(text)}
              />

              {(sendReport && !subject) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo asunto es requerido")}
              </Text>}

              <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Correo")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Correo")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                style={styles.input}
                value={email}
                onChangeText={text => setEmail(text)}
              />

              {(sendReport && !email) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo correo es requerido")}
              </Text>}

              <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Detalles")}
              </Text>

              <TextInput
                multiline
                numberOfLines={4}
                placeholder={Language.get(language, "Detalles")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                style={styles.textarea}
                value={details}
                onChangeText={text => setDetails(text)}
              />

              {(sendReport && !details) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo detalles es requerido")}
              </Text>}

            </View>

          </KeyboardAwareScrollView>

          <View style={modal.footer}>

            <TouchableOpacity
              onPress={() => pushReport()}
              style={{ ...styles.buttonContainer }}
            >

              <Text style={styles.buttonText}>{Language.get(language, "Enviar")}</Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>


      <Modal isVisible={contact} onBackdropPress={() => setContact(false)} backdropOpacity={0.70}>

        <View>

          <View style={modal.title}>

            <Text style={{ ...styles.text, color: "white", fontSize: 17, fontWeight: "bold" }}>
              {Language.get(language, "Contacto")}
            </Text>

            <TouchableOpacity
              onPress={() => setContact(false)}
              style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
            >

              <AntDesign name="closecircleo" size={24} color="white" />

            </TouchableOpacity>

          </View>

          {(ad) && <KeyboardAwareScrollView style={modal.body}>

            <View style={modal.content}>

              {(ad.nombre) && <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Nombre")}: {ad.nombre}
              </Text>}

              {(ad.codigo_telefono && ad.telefono) && <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Teléfono")}: <Text style={{ ...styles.text, color: "#d63384" }} onPress={() => call(ad.codigo_telefono + ad.telefono)}>{ad.codigo_telefono + ad.telefono}</Text>
              </Text>}

              {(ad.codigo_whatsapp && ad.whatsapp) && <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Whatsapp")}: <Text style={{ ...styles.text, color: "#d63384" }} onPress={() => whatappMessage(ad.codigo_whatsapp + ad.whatsapp)}>{ad.codigo_whatsapp + ad.whatsapp}</Text>
              </Text>}

              {(ad.facebook) && <Text style={{ ...styles.text, color: "#d63384" }} onPress={() => handleLinkPress(ad.facebook)}>{Language.get(language, "Ver Facebook")}</Text>}
              {(ad.instagram) && <Text style={{ ...styles.text, color: "#d63384" }} onPress={() => handleLinkPress(ad.instagram)}>{Language.get(language, "Ver Instagram")}</Text>}
              {(ad.onlyfans) && <Text style={{ ...styles.text, color: "#d63384" }} onPress={() => handleLinkPress(ad.onlyfans)}>{Language.get(language, "Ver Onlyfans")}</Text>}
              {(ad.tiktok) && <Text style={{ ...styles.text, color: "#d63384" }} onPress={() => handleLinkPress(ad.tiktok)}>{Language.get(language, "Ver Tik Tok")}</Text>}
              {(ad.twitter) && <Text style={{ ...styles.text, color: "#d63384" }} onPress={() => handleLinkPress(ad.twitter)}>{Language.get(language, "ver Twitter")}</Text>}


            </View>

          </KeyboardAwareScrollView>}


        </View>

      </Modal>



      <Modal isVisible={photos} onBackdropPress={() => setPhotos(false)} backdropOpacity={0.70}>

        <View style={{ flex: 1, backgroundColor: "black" }}>

          <TouchableOpacity
            onPress={() => setPhotos(false)}
            style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
          >

            <AntDesign name="closecircleo" size={24} color="white" />

          </TouchableOpacity>

          <ImageViewer imageUrls={images} onChange={(index) => setPhotoIndex(index)} backgroundColor="black" index={photoIndex} />
        </View>

      </Modal>

      {(ad && route.params) && <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center", padding: 10, backgroundColor: "#1A1E20" }}>

        <Image
          style={{ width: 30, height: 30, borderRadius: 100 }}
          source={{ uri: (route.params.foto) ? 'https://ws.tybyty.com/temp/' + route.params.foto : 'https://tybyty.com/icons/user.jpg' }}
          resizeMode="contain"
        />

        <Text style={{ ...styles.text, marginTop: 10, marginLeft: 20, color: "white", fontWeight: 'bold', fontSize: 16 }}>
          {route.params.usuario}
        </Text>

        <Text style={{ ...styles.text, marginTop: 10, marginLeft: 20, color: "#d63384", fontWeight: 'bold' }} onPress={() => notReloadNavigate("Profile", { "id_usuario": route.params.id_usuario, "usuario": route.params.usuario, "foto": route.params.foto })}>

          <FontAwesome name="external-link" size={15} color="#d63384" /> {Language.get(language, "Ver Perfil")}

        </Text>

      </View>}

      {(ad && route.params) && <KeyboardAwareScrollView style={{ padding: 10, marginBottom: 10 }}>


        <AlertNotificationRoot theme="dark">

          <View style={{ flexDirection: "row", justifyContent: 'space-between', flexWrap: 'wrap', }}>

            {(ad.categoria) && <Text style={{ ...styles.text, marginTop: 10 }}>
              {ad.categoria}
            </Text>}

            {(ad.id) && <Text style={{ ...styles.text, marginTop: 10 }}>
              ref{ad.id}
            </Text>}

          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>

            {(ad.titulo) && <Text style={{ ...styles.text, marginTop: 10, color: "white", fontWeight: "bold", fontSize: 17 }}>
              {ad.titulo}
            </Text>}

          </View>


          {(images.length > 0) && <PagerView style={{ height: 330, marginTop: 20 }} ref={pagerRef} onPageSelected={handlePageSelected}>

            {images.map((x, index) => <View style={{ justifyContent: 'center', alignItems: 'center' }} key={index}>

              <Text style={{ ...styles.text, marginLeft: 20, color: "white" }}>
                {index + 1}/{images.length}
              </Text>

              <TouchableOpacity style={{ width: '100%', height: 300 }} onPress={() => setPhotosIndex(index)}>
                <Image resizeMode="contain" source={{ uri: x.url }} style={{ width: '100%', height: "100%" }} />
              </TouchableOpacity>

            </View>)}

          </PagerView>}

          {(images.length > 0) && <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            {images.map((x, index) => <TouchableOpacity onPress={() => setPhotoIndex(index)} key={index}>
              <Image resizeMode="contain" source={{ uri: x.url }} style={(photoIndex == index) ? { ...styles.imageItem, borderColor: '#e75e8d', borderWidth: 1 } : { ...styles.imageItem }} />
            </TouchableOpacity>)}
          </View>}

          {(ad.descripcion) && <Text style={{ ...styles.text, textAlign: 'justify', lineHeight: 25, marginTop: 20 }}>
            {ad.descripcion}
          </Text>}



          {(ad.nombre || ad.categoria || ad.edad || ad.nacionalidad) && <View style={{ marginTop: 10, marginBottom: 10 }}>


            <View style={{ backgroundColor: "#303436", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text, fontWeight: "bold" }}>
                {Language.get(language, "Datos Personales")}
              </Text>

            </View>

            {(ad.nombre) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Nombre")}: {ad.nombre}
              </Text>

            </View>}

            {(ad.categoria) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Soy")}: {ad.categoria}
              </Text>

            </View>}

            {(ad.edad) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Edad")}: {ad.edad}
              </Text>

            </View>}

            {(ad.nacionalidad) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Pais")}: {ad.nacionalidad}
              </Text>

            </View>}

          </View>}


          {(ad.altura || ad.peso || ad.color_pelo || ad.color_ojos || ad.aspecto) && <View style={{ marginTop: 10, marginBottom: 10 }}>


            <View style={{ backgroundColor: "#303436", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text, fontWeight: "bold" }}>
                {Language.get(language, "Aspecto")}
              </Text>

            </View>

            {(ad.altura) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Altura")}: {ad.altura}
              </Text>

            </View>}

            {(ad.peso) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Peso")}: {ad.peso}
              </Text>

            </View>}

            {(ad.color_pelo) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Color de pelo")}: {ad.color_pelo}
              </Text>

            </View>}

            {(ad.color_ojos) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Color de ojos")}: {ad.color_ojos}
              </Text>

            </View>}

            {(ad.aspecto) && <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {Language.get(language, "Aspecto")}: {ad.aspecto}
              </Text>

            </View>}

          </View>}


          {(ad.preferencias.length > 0) && <View style={{ marginTop: 10, marginBottom: 10 }}>


            <View style={{ backgroundColor: "#303436", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text, fontWeight: "bold" }}>
                {Language.get(language, "Preferencias")}
              </Text>

            </View>

            {ad.preferencias.map((x, index) => <View key={index} style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

              <Text style={{ ...styles.text }}>
                {x.preferencia}
              </Text>

            </View>)}

          </View>}

        </AlertNotificationRoot>

      </KeyboardAwareScrollView>}

      {(ad && route.params) && <View style={{ flexDirection: "row", flexWrap: 'wrap', marginTop: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#1F2122" }}>

        <Text style={{ ...styles.text, margin: 5 }} onPress={() => setContact(true)}>
          <FontAwesome name="phone" size={15} color="#128f03" /> {Language.get(language, "Contactar")}
        </Text>

        <Text style={{ ...styles.text, margin: 5 }} onPress={() => share("https://tybyty.com/socios/anuncios/compartir/" + ad.id)}>
          <FontAwesome name="users" size={15} color="#b3ad00" /> {Language.get(language, "Compartir")}
        </Text>

        {(ad && user && user.tipo == "socio") && <Text style={{ ...styles.text, margin: 5 }} onPress={() => pushFavorite()}>
          <FontAwesome name="heart" size={15} color={(ad.favorito) ? "red" : "#CCC"} /> {Language.get(language, "Favorito")}
        </Text>}

        <Text style={{ ...styles.text, margin: 5 }} onPress={() => openReport()}>
          <AntDesign name="closecircle" size={15} color="#b71c1c" /> {Language.get(language, "Denunciar")}
        </Text>

      </View>}


      {(!ad) && <View style={{ marginTop: 10, marginBottom: 50, justifyContent: "center", alignItems: "center" }}>

        <ActivityIndicator size="x-large" color="#d63384" />

      </View>}

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
    justifyContent: "center"
  },

  text: {

    color: "#CCC",
    fontSize: 15
  },

  imageItem: {

    width: 100,
    height: 100,
    margin: 5
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

  input: {

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
    fontWeight: 'bold'
  },

  modalTitle: {

    flexDirection: "row",
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: "center",
    backgroundColor: "#5E3647",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10
  }

})