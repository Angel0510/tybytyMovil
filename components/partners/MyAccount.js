import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../Languages';


export default function MyAccount() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const [loader, setLoader] = useState(false);

  const [user, setUser] = useState(null);

  const [year, setYear] = useState(null);

  const [month, setMonth] = useState(null);

  const [day, setDay] = useState(null);

  const [years, setYears] = useState([]);

  const [months, setMonths] = useState([

    { id: "01", text: "01" },
    { id: "02", text: "02" },
    { id: "03", text: "03" },
    { id: "04", text: "04" },
    { id: "05", text: "05" },
    { id: "06", text: "06" },
    { id: "07", text: "07" },
    { id: "08", text: "08" },
    { id: "09", text: "09" },
    { id: "10", text: "10" },
    { id: "11", text: "11" },
    { id: "12", text: "12" }

  ]);

  const [days, setDays] = useState([

    { id: "01", text: "01" },
    { id: "02", text: "02" },
    { id: "03", text: "03" },
    { id: "04", text: "04" },
    { id: "05", text: "05" },
    { id: "06", text: "06" },
    { id: "07", text: "07" },
    { id: "08", text: "08" },
    { id: "09", text: "09" },
    { id: "10", text: "10" },
    { id: "11", text: "11" },
    { id: "12", text: "12" },
    { id: "13", text: "13" },
    { id: "14", text: "14" },
    { id: "15", text: "15" },
    { id: "16", text: "16" },
    { id: "17", text: "17" },
    { id: "18", text: "18" },
    { id: "19", text: "19" },
    { id: "20", text: "20" },
    { id: "21", text: "21" },
    { id: "22", text: "22" },
    { id: "23", text: "23" },
    { id: "24", text: "24" },
    { id: "25", text: "25" },
    { id: "26", text: "26" },
    { id: "27", text: "27" },
    { id: "28", text: "28" },
    { id: "29", text: "29" },
    { id: "30", text: "30" },
    { id: "31", text: "31" }
  ]);

  const [pictures, setPictures] = useState([]);

  const [photos, setPhotos] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);

  const [ping, setPing] = useState("");

  const [userName, setUserName] = useState("");

  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");

  const [send, setSend] = useState(false);

  const [language, setLanguage] = useState("spanish");


  const setPhotosIndex = (index) => {

    setPhotoIndex(index);

    setPhotos(true);
  }



  const deletePhoto = () => {

    let newPictures = pictures;

    if (newPictures[photoIndex].file) {

      newPictures.splice(photoIndex, 1);

      setPhotos(false);

      setPictures([...newPictures]);

    } else {

      setLoader(true);

      axios({
        method: 'delete',
        url: 'https://ws.tybyty.com/usuario/foto',
        data: {
          "id_usuario": user.id
        },
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }

      }).then((response) => {


        if (response.status == 200) {

          newPictures.splice(photoIndex, 1);

          setPhotos(false);

          setPictures([...newPictures]);

          let newUser = user;

          newUser.foto = "";
     
          _storeData(newUser);

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


  const _storeData = async (data) => {
    try {

      await AsyncStorage.setItem('user', JSON.stringify(data));

      setUser({...data});

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



  const pickImages = async () => {


    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true
    });

    if (!result.canceled) {

      let newPictures = [];

      result.assets.map(async (x) => {

        newPictures.push({ url: x.uri, file: { "name": x.fileName, "type": x.mimeType, "uri": x.uri } });

      });

      setPictures([...newPictures]);
    }

  };

  const adjust = (v) => {

    if (v > 9) {

      return v.toString();

    } else {

      return '0' + v.toString();
    }
  }


  const generateYears = () => {

    const max = new Date().getFullYear();
    const min = max - 100;
    const y = [];

    for (let i = max; i >= min; i--) {
      y.push({ "text": i.toString(), "id": i });
    }

    return y;
  }

  const getYear = (d) => {

    var today = new Date(d);

    return today.getUTCFullYear();
  }

  const getMonth = (d) => {

    var today = new Date(d);

    return adjust(today.getUTCMonth() + 1);
  }


  const getDate = (d) => {

    var today = new Date(d);

    return adjust(today.getUTCDate());
  }


  const clear = () => {

    setPictures([]);
    setPing("");
    setUserName("");
    setDay("");
    setPassword("");
    setEmail("");
    setSend(false);
  }


  const verify = () => {

    setSend(true);

    if (!ping || !userName || !day || !password || !email) {

      return false;
    }


    return true;
  }


  const save = () => {

    if (verify()) {

      setLoader(true);

      const formData = new FormData();

      if (pictures.length > 0) {

        for (let i = 0; i < pictures.length; i++) {

          if (pictures[i].file) {

            formData.append("foto", pictures[i].file);
          }
        }
      }


      formData.append("id_usuario", user.id);
      formData.append("usuario", userName);
      formData.append("clave", password);
      formData.append("email", email);
      formData.append("fecha_nacimiento", year + "/" + month + "/" + day);


      axios({

        method: 'put',
        url: 'https://ws.tybyty.com/usuario',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {

        setLoader(false);

        if (response.status == 200) {

          let data = response.data;

          let newUser = user;

          newUser.email = data.email;

          newUser.usuario = data.usuario;

          if(data.foto){

            newUser.foto = data.foto;

            let newPictures = [];

            newPictures.push({ url: "https://ws.tybyty.com/temp/" + newUser.foto, file: null });
  
            setPictures([...newPictures]);
          }

          _storeData(newUser);

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: Language.get(language, 'Exito'),
            textBody: Language.get(language, 'Cuenta editada'),
            button: Language.get(language, 'Cerrar')
          });

        } else {

          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: Language.get(language, 'Atención'),
            textBody: Language.get(language, 'El usuario ya existe en el sistema'),
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

        setPing(usuario.ping);

        setUserName(usuario.usuario);

        setPassword(usuario.clave);

        setEmail(usuario.email);

        setYear(parseInt(getYear(usuario.fecha_nacimiento)));

        setMonth(getMonth(usuario.fecha_nacimiento));

        setDay(getDate(usuario.fecha_nacimiento));


        if (usuario.foto) {

          let newPictures = [];

          newPictures.push({ url: "https://ws.tybyty.com/temp/" + usuario.foto, file: null });

          setPictures([...newPictures]);
        }

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

      const newYears = generateYears();

      setYears([...newYears]);

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
            source={{ uri: (user.foto)?'https://ws.tybyty.com/temp/'+user.foto:'https://tybyty.com/icons/user.jpg' }}
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

          <View style={{ ...styles.login }}>

            <Text style={{ ...styles.title, marginTop: 20 }}>
              {Language.get(language, "Datos de usuario")}
            </Text>


            <Text style={{ ...styles.text }}>
              {Language.get(language, "Ping Seguridad")}
            </Text>

            <TextInput
              placeholder={Language.get(language, "Ping Seguridad")}
              placeholderTextColor="#b1b1b1"
              selectionColor="#b1b1b1"
              value={ping}
              onChangeText={text => setPing(text)}
              editable={false}
              style={styles.input}
            />

            {(send && !ping) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "El campo ping es requerido")}
            </Text>}

            <Text style={{ ...styles.text, marginTop: 20 }}>
              {Language.get(language, "Usuario")}
            </Text>

            <TextInput
              placeholder={Language.get(language, "Usuario")}
              placeholderTextColor="#b1b1b1"
              selectionColor="#b1b1b1"
              value={userName}
              onChangeText={text => setUserName(text)}
              style={styles.input}
            />

            {(send && !userName) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "El campo usuario es requerido")}
            </Text>}

            <Text style={{ ...styles.text, marginTop: 20 }}>
              {Language.get(language, "Clave")}
            </Text>

            <TextInput
              placeholder={Language.get(language, "Clave")}
              placeholderTextColor="#b1b1b1"
              selectionColor="#b1b1b1"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
            />

            {(send && !password) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "El campo clave es requerido")}
            </Text>}

            <Text style={{ ...styles.text, marginTop: 20 }}>
              {Language.get(language, "Correo")}
            </Text>

            <TextInput
              placeholder={Language.get(language, "Correo")}
              placeholderTextColor="#b1b1b1"
              selectionColor="#b1b1b1"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />

            {(send && !email) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "El campo correo es requerido")}
            </Text>}


            <Text style={{ ...styles.title, marginTop: 20 }}>
              {Language.get(language, "Fecha de nacimiento")}
            </Text>


            <Text style={{ ...styles.text, marginTop: 20 }}>
              {Language.get(language, "Año")}
            </Text>

            <Dropdown
              style={stylesDropdown.dropdown}
              placeholderStyle={stylesDropdown.placeholderStyle}
              selectedTextStyle={stylesDropdown.selectedTextStyle}
              inputSearchStyle={stylesDropdown.inputSearchStyle}
              iconStyle={stylesDropdown.iconStyle}
              activeColor="#414344"
              data={years}
              search
              maxHeight={300}
              labelField="text"
              valueField="id"
              placeholder={Language.get(language, "Seleccione un año")}
              searchPlaceholder={Language.get(language, "Buscar año")}
              value={year}
              containerStyle={stylesDropdown.containerStyle}
              itemTextStyle={stylesDropdown.itemTextStyle}
              onChange={item => {
                setYear(item.id);
              }}
              renderLeftIcon={() => (

                <FontAwesome style={stylesDropdown.icon} name="calendar" size={20} color="black" />
              )}
            />

            {(send && !year) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "El campo año es requerido")}
            </Text>}


            <Text style={{ ...styles.text, marginTop: 20 }}>
              {Language.get(language, "Mes")}
            </Text>

            <Dropdown
              style={stylesDropdown.dropdown}
              placeholderStyle={stylesDropdown.placeholderStyle}
              selectedTextStyle={stylesDropdown.selectedTextStyle}
              inputSearchStyle={stylesDropdown.inputSearchStyle}
              iconStyle={stylesDropdown.iconStyle}
              activeColor="#414344"
              data={months}
              search
              maxHeight={300}
              labelField="text"
              valueField="id"
              placeholder={Language.get(language, "Seleccione un mes")}
              searchPlaceholder={Language.get(language, "Buscar mes")}
              value={month}
              containerStyle={stylesDropdown.containerStyle}
              itemTextStyle={stylesDropdown.itemTextStyle}
              onChange={item => {
                setMonth(item.id);
              }}
              renderLeftIcon={() => (

                <FontAwesome style={stylesDropdown.icon} name="calendar" size={20} color="black" />
              )}
            />

            {(send && !month) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "El campo mes es requerido")}
            </Text>}

            <Text style={{ ...styles.text, marginTop: 20 }}>
              {Language.get(language, "Día")}
            </Text>

            <Dropdown
              style={stylesDropdown.dropdown}
              placeholderStyle={stylesDropdown.placeholderStyle}
              selectedTextStyle={stylesDropdown.selectedTextStyle}
              inputSearchStyle={stylesDropdown.inputSearchStyle}
              iconStyle={stylesDropdown.iconStyle}
              activeColor="#414344"
              data={days}
              search
              maxHeight={300}
              labelField="text"
              valueField="id"
              placeholder={Language.get(language, "Seleccione un día")}
              searchPlaceholder={Language.get(language, "Buscar día")}
              value={day}
              containerStyle={stylesDropdown.containerStyle}
              itemTextStyle={stylesDropdown.itemTextStyle}
              onChange={item => {
                setDay(item.id);
              }}
              renderLeftIcon={() => (

                <FontAwesome style={stylesDropdown.icon} name="calendar" size={20} color="black" />
              )}
            />


            {(send && !day) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
              {Language.get(language, "El campo día es requerido")}
            </Text>}


            <Text style={{ ...styles.title, marginTop: 20 }}>
              {Language.get(language, "Foto")}

            </Text>

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
              onPress={() => pickImages()}
              style={{ ...styles.buttonContainer, backgroundColor: "#27292A" }}
            >
              <Text style={styles.buttonText}>{Language.get(language, "Seleccionar Imágen")}</Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => save()}
              style={{ ...styles.buttonContainer, marginTop: 20 }}
            >
              <Text style={styles.buttonText}>{Language.get(language, "Guardar")}</Text>
            </TouchableOpacity>


          </View>

        </AlertNotificationRoot>

      </KeyboardAwareScrollView>


    </SafeAreaView>
  );
}


const stylesDropdown = StyleSheet.create({

  dropdown: {
    marginTop: 10,
    height: 50,
    backgroundColor: '#1a1e20',
    borderColor: '#515455',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,

  },
  icon: {
    marginRight: 5,
    color: "#b1b1b1"
  },

  placeholderStyle: {
    fontSize: 16,
    color: "#b1b1b1"
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#b1b1b1"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    margin: 1,
    backgroundColor: "#1a1e20",
    color: "#b1b1b1"
  },
  containerStyle: {
    backgroundColor: "#1a1e20",
    borderWidth: 0
  },
  itemTextStyle: {
    color: "#b1b1b1"
  }

});



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