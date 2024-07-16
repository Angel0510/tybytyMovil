import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../Languages';


export default function EditCite() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const route = useRoute();

  const [loader, setLoader] = useState(false);

  const [user, setUser] = useState(null);

  const [year, setYear] = useState(null);

  const [month, setMonth] = useState(null);

  const [day, setDay] = useState(null);

  const [hour, setHour] = useState(null);

  const [minute, setMinute] = useState(null);

  const [category, setCategory] = useState(null);

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
    { id: "12", text: "12" }]);

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

  const [hours, setHours] = useState([
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
    { id: "24", text: "24" }
  ]);

  const [minutes, setMinutes] = useState([
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
    { id: "31", text: "31" },
    { id: "32", text: "32" },
    { id: "33", text: "33" },
    { id: "34", text: "34" },
    { id: "35", text: "35" },
    { id: "36", text: "36" },
    { id: "37", text: "37" },
    { id: "38", text: "38" },
    { id: "39", text: "39" },
    { id: "40", text: "40" },
    { id: "41", text: "41" },
    { id: "42", text: "42" },
    { id: "43", text: "43" },
    { id: "44", text: "44" },
    { id: "45", text: "45" },
    { id: "46", text: "46" },
    { id: "47", text: "47" },
    { id: "48", text: "48" },
    { id: "49", text: "49" },
    { id: "50", text: "50" },
    { id: "51", text: "51" },
    { id: "52", text: "52" },
    { id: "53", text: "53" },
    { id: "54", text: "54" },
    { id: "55", text: "55" },
    { id: "56", text: "56" },
    { id: "57", text: "57" },
    { id: "58", text: "58" },
    { id: "59", text: "59" }
  ]);

  const [location, setLocation] = useState("");

  const [locationData, setLocationData] = useState({

    lat: "",
    lon: ""
  });

  const [categories, setCategories] = useState([]);

  const [pictures, setPictures] = useState([]);

  const [province, setProvince] = useState("");

  const [title, setTitle] = useState("");

  const [detail, setDetail] = useState("");

  const [send, setSend] = useState(false);

  const [photos, setPhotos] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);

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
        url: 'https://ws.tybyty.com/cita/eliminar/foto',
        data: {
          "id": newPictures[photoIndex].id,
          "src": newPictures[photoIndex].url
        },
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }

      }).then((response) => {

        if (response.status == 200) {

          newPictures.splice(photoIndex, 1);

          setPhotos(false);

          setPictures([...newPictures]);
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


  const verify = () => {

    setSend(true);

    if (!year || !month || !day || !hour || !minute || !category || !location || !province || !title || !detail) {

      return false;
    }

    if (!locationData.lat || !locationData.lon) {

      return false;
    }

    return true;
  }


  const save = () => {

    if (verify()) {

      setLoader(true);

      let copias = [];

      const formData = new FormData();

      if (pictures.length > 0) {

        for (let i = 0; i < pictures.length; i++) {

          if (pictures[i].file) {

            formData.append("fotos", pictures[i].file);
          }
        }
      }

      formData.append("id_cita", route.params.id);
      formData.append("categoria", category);
      formData.append("fecha", year + "/" + month + "/" + day + " " + hour + ":" + minute + ":00");
      formData.append("lat", locationData.lat);
      formData.append("lon", locationData.lon);
      formData.append("lugar", location);
      formData.append("provincia", province);
      formData.append("titulo", title);
      formData.append("descripcion", detail);
      formData.append("copias", JSON.stringify(copias));

      axios({

        method: 'put',
        url: 'https://ws.tybyty.com/citas',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {

        setLoader(false);

        if (response.status == 201) {

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: Language.get(language, 'Exito'),
            textBody: Language.get(language, 'Cita editada'),
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



  const pickImages = async () => {


    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true
    });

    if (!result.canceled) {

      let newPictures = pictures;

      result.assets.map(async (x) => {

        newPictures.push({ url: x.uri, file: { "name": x.fileName, "type": x.mimeType, "uri": x.uri } });

      });

      setPictures([...newPictures]);
    }

  };


  const geoSearch = async (text) => {

    setLocation(text);

    if (text) {

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {

        const result = await Location.geocodeAsync(text);

        if (result.length > 0) {

          const { latitude, longitude } = result[0];

          setLocationData({

            lat: latitude,
            lon: longitude
          });

        } else {

          setLocationData({
            lat: "",
            lon: ""
          });
        }

      }

    } else {

      setLocationData({
        lat: "",
        lon: ""
      });

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



  const clear = () => {

    setPictures([]);

    setLocation("");

    setLocationData({

      lat: "",
      lon: ""
    });

    setYear(null);

    setMonth(null);

    setDay(null);

    setHour(null);

    setMinute(null);

    setCategory(null);

    setProvince("");

    setTitle("");

    setDetail("");

    setSend(false);

  }


  const adjust = (v) => {

    if (v > 9) {

      return v.toString();

    } else {

      return '0' + v.toString();
    }
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


  const getHour = (d) => {

    var today = new Date(d);

    return adjust(today.getUTCHours());
  }

  const getMinute = (d) => {

    var today = new Date(d);

    return adjust(today.getUTCMinutes());
  }



  const getCite = () => {

    setLoader(true);

    axios({
      method: 'get',
      url: 'https://ws.tybyty.com/cita/' + route.params.id,
      data: {},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {


      if (response.status == 200) {

        let dt_cita = response.data.cita;

        setYear(getYear(dt_cita.fecha));

        setMonth(getMonth(dt_cita.fecha));

        setDay(getDate(dt_cita.fecha));

        setHour(getHour(dt_cita.fecha));

        setMinute(getMinute(dt_cita.fecha));

        setTitle(dt_cita.titulo);

        setDetail(dt_cita.descripcion);

        setProvince(dt_cita.provincia);

        setCategory(dt_cita.id_categoria);

        setLocation(dt_cita.lugar);

        setLocationData({

          lat: dt_cita.latitud,
          lon: dt_cita.longitud
        });


        if (response.data.fotos.length > 0) {

          let dt_fotos = [];

          response.data.fotos.map((x) => {

            dt_fotos.push({ id: x.id, url: "https://ws.tybyty.com/temp/" + x.src, file: null });

          });

          setPictures([...dt_fotos]);
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


  const options = () => {

    setLoader(true);

    axios({
      method: 'post',
      url: 'https://ws.tybyty.com/citas/opciones',
      data: {},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {


      if (response.status == 200) {

        var dt = response.data.categorias;

        if (dt.length > 0) {

          var new_categories = [];

          for (var i = 0; i < dt.length; i++) {

            new_categories.push({ "id": dt[i].id, "text": dt[i].text });
          }

          setCategories([...new_categories]);
        }

        const newYears = generateYears();

        setYears([...newYears]);

      }

      getCite();


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

      options();
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



      <KeyboardAwareScrollView>

        <AlertNotificationRoot theme="dark">

          <Text style={{ ...styles.title, marginTop: 20 }}>
            {Language.get(language, "¿Cuando?")}

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

          <Text style={{ ...styles.text, marginTop: 20 }}>
            {Language.get(language, "Horas")}
          </Text>

          <Dropdown
            style={stylesDropdown.dropdown}
            placeholderStyle={stylesDropdown.placeholderStyle}
            selectedTextStyle={stylesDropdown.selectedTextStyle}
            inputSearchStyle={stylesDropdown.inputSearchStyle}
            iconStyle={stylesDropdown.iconStyle}
            activeColor="#414344"
            data={hours}
            search
            maxHeight={300}
            labelField="text"
            valueField="id"
            placeholder={Language.get(language, "Seleccione una hora")}
            searchPlaceholder={Language.get(language, "Buscar hora")}
            value={hour}
            containerStyle={stylesDropdown.containerStyle}
            itemTextStyle={stylesDropdown.itemTextStyle}
            onChange={item => {
              setHour(item.id);
            }}
            renderLeftIcon={() => (

              <FontAwesome style={stylesDropdown.icon} name="calendar" size={20} color="black" />
            )}
          />

          {(send && !hour) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo hora es requerido")}
          </Text>}

          <Text style={{ ...styles.text, marginTop: 20 }}>
            {Language.get(language, "Minutos")}
          </Text>

          <Dropdown
            style={stylesDropdown.dropdown}
            placeholderStyle={stylesDropdown.placeholderStyle}
            selectedTextStyle={stylesDropdown.selectedTextStyle}
            inputSearchStyle={stylesDropdown.inputSearchStyle}
            iconStyle={stylesDropdown.iconStyle}
            activeColor="#414344"
            data={minutes}
            search
            maxHeight={300}
            labelField="text"
            valueField="id"
            placeholder={Language.get(language, "Seleccione un minuto")}
            searchPlaceholder={Language.get(language, "Buscar minuto")}
            value={minute}
            containerStyle={stylesDropdown.containerStyle}
            itemTextStyle={stylesDropdown.itemTextStyle}
            onChange={item => {
              setMinute(item.id);
            }}
            renderLeftIcon={() => (

              <FontAwesome style={stylesDropdown.icon} name="calendar" size={20} color="black" />
            )}
          />

          {(send && !minute) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo minuto es requerido")}
          </Text>}


          <Text style={{ ...styles.title, marginTop: 20 }}>
            {Language.get(language, "¿Donde?")}

          </Text>

          <Text style={{ ...styles.text }}>
            {Language.get(language, "Lugar")}
          </Text>

          <TextInput
            placeholder={Language.get(language, "Buscar dirección")}
            placeholderTextColor="#b1b1b1"
            selectionColor="#b1b1b1"
            value={location}
            onChangeText={text => geoSearch(text)}
            style={styles.input}
          />

          {(send && !location) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo lugar es requerido")}
          </Text>}

          {(send && location && (locationData.lat == "" && locationData.lon == "")) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "No se ubican coordenadas del lugar")}
          </Text>}

          <Text style={{ ...styles.text }}>
            {Language.get(language, "Provincia")}
          </Text>

          <TextInput
            placeholder={Language.get(language, "Provincia")}
            placeholderTextColor="#b1b1b1"
            selectionColor="#b1b1b1"
            value={province}
            onChangeText={text => setProvince(text)}
            style={styles.input}
          />

          {(send && !province) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo provincia es requerido")}
          </Text>}

          <Text style={{ ...styles.title, marginTop: 20 }}>
            {Language.get(language, "Descripción")}

          </Text>

          <Text style={{ ...styles.text }}>
            {Language.get(language, "Titulo")}
          </Text>

          <TextInput
            placeholder={Language.get(language, "Titulo")}
            placeholderTextColor="#b1b1b1"
            selectionColor="#b1b1b1"
            value={title}
            onChangeText={text => setTitle(text)}
            style={styles.input}
          />

          {(send && !title) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo titulo es requerido")}
          </Text>}

          <Text style={{ ...styles.text, marginTop: 10 }}>
            {Language.get(language, "Texto")}
          </Text>

          <TextInput
            multiline
            numberOfLines={4}
            placeholder={Language.get(language, "Detalles")}
            placeholderTextColor="#b1b1b1"
            selectionColor="#b1b1b1"
            value={detail}
            onChangeText={text => setDetail(text)}
            style={styles.textarea}
          />

          {(send && !detail) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo texto es requerido")}
          </Text>}

          <Text style={{ ...styles.text, marginTop: 20 }}>
            {Language.get(language, "Categoría")}
          </Text>

          <Dropdown
            style={stylesDropdown.dropdown}
            placeholderStyle={stylesDropdown.placeholderStyle}
            selectedTextStyle={stylesDropdown.selectedTextStyle}
            inputSearchStyle={stylesDropdown.inputSearchStyle}
            iconStyle={stylesDropdown.iconStyle}
            activeColor="#414344"
            data={categories}
            search
            maxHeight={300}
            labelField="text"
            valueField="id"
            placeholder={Language.get(language, "Seleccione un Categoría")}
            searchPlaceholder={Language.get(language, "Buscar Categoría")}
            value={category}
            containerStyle={stylesDropdown.containerStyle}
            itemTextStyle={stylesDropdown.itemTextStyle}
            onChange={item => {
              setCategory(item.id);
            }}
            renderLeftIcon={() =>

              <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />
            }
          />

          {(send && !category) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo categoría es requerido")}
          </Text>}

          <Text style={{ ...styles.title, marginTop: 20 }}>
            {Language.get(language, "Subir fotos")}

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
            style={{ ...styles.buttonContainer, backgroundColor: "#27292A", marginBottom: 30 }}
          >
            <Text style={styles.buttonText}>{Language.get(language, "Seleccionar Imágenes")}</Text>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => save()}
            style={{ ...styles.buttonContainer, marginTop: 20, marginBottom: 30 }}
          >

            <Text style={styles.buttonText}>{Language.get(language, "Guardar")}</Text>

          </TouchableOpacity>

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
    backgroundColor: "#111314",
    padding: 5,
    justifyContent: "center"
  },
  login: {
    backgroundColor: "#111314",
    padding: 10,
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
    paddingVertical: 12,
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
    fontSize: 15,
    marginTop: 20
  }
})