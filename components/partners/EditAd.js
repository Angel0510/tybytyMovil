
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Checkbox from 'expo-checkbox';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../Languages';


export default function NewAd() {


  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const route = useRoute();

  const [loader, setLoader] = useState(false);

  const [user, setUser] = useState(null);

  const [page, setPage] = useState(1);


  const [search, setSearch] = useState(false);

  const [offer, setOffer] = useState(false);

  const [women, setWomen] = useState(false);

  const [men, setMen] = useState(false);

  const [couples, setCouples] = useState(false);

  const [title, setTitle] = useState("");

  const [name, setName] = useState("");

  const [location, setLocation] = useState("");

  const [locationData, setLocationData] = useState({

    lat: "",
    lon: ""
  });

  const [province, setProvince] = useState("");

  const [whatsapp, setWhatsapp] = useState("");

  const [phone, setPhone] = useState("");

  const [facebook, setFacebook] = useState("");

  const [instagram, setInstagram] = useState("");

  const [twitter, setTwitter] = useState("");

  const [tiktok, setTiktok] = useState("");

  const [onlyfans, setOnlyfans] = useState("");

  const [others, setOthers] = useState("");

  const [detail, setDetail] = useState("");

  const [age, setAge] = useState("");

  const [preference, setPreference] = useState([]);

  const [preferences, setPreferences] = useState([]);

  const [category, setCategory] = useState(null);

  const [categories, setCategories] = useState([]);

  const [optionsCategory, setOptionsCategory] = useState([]);

  const [subcategory, setSubcategory] = useState([]);

  const [countryWhatsapp, setCountryWhatsapp] = useState(null);

  const [countryPhone, setCountryPhone] = useState(null);

  const [countries, setCountries] = useState([]);

  const [height, setHeight] = useState(null);

  const [heights, setHeights] = useState([]);

  const [weight, setWeight] = useState(null);

  const [weights, setWeights] = useState([]);

  const [hairColor, setHairColor] = useState(null);

  const [hairColors, setHairColors] = useState([]);

  const [eyeColor, setEyeColor] = useState(null);

  const [eyeColors, setEyeColors] = useState([]);

  const [nationality, setNationality] = useState(null);

  const [nationalities, setNationalities] = useState([]);

  const [aspect, setAspect] = useState(null);

  const [aspects, setAspects] = useState([]);

  const [pictures, setPictures] = useState([]);

  const [photos, setPhotos] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);

  const [video, setVideo] = useState(null);

  const [send1, setSend1] = useState(false);

  const [send3, setSend3] = useState(false);

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
        url: 'https://ws.tybyty.com/anuncio/eliminar/foto',
        data: {
          "id": newPictures[photoIndex].id,
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



  const deleteVideo = () => {

    if (video) {

      if (video.file) {

        setVideo(null);

      } else {

        setLoader(true);

        axios({
          method: 'delete',
          url: 'https://ws.tybyty.com/anuncio/eliminar/video',
          data: {
            "id": video.id,
          },
          responseType: 'json',
          responseEncoding: 'utf8',
          headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {

          if (response.status == 200) {

            setVideo(null);
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

  }




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



  const pickVideo = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1
    });

    if (!result.canceled) {

      setVideo({ url: result.assets[0].uri, file: { "name": result.assets[0].fileName, "type": result.assets[0].mimeType, "uri": result.assets[0].uri } });
    }
  };


  const save = () => {

    setLoader(true);

    const formData = new FormData();

    if (pictures.length > 0) {

      for (let i = 0; i < pictures.length; i++) {

        if (pictures[i].file) {

          formData.append("fotos", pictures[i].file);
        }
      }
    }

    if (video) {

      if (video.file) {

        formData.append('video', video.file);
      }
    }

    formData.append("id_anuncio", route.params.id);
    formData.append("categoria", category);
    formData.append("busco", search);
    formData.append("ofresco", offer);
    formData.append("hombres", men);
    formData.append("mujeres", women);
    formData.append("parejas", couples);
    formData.append("preferencias", JSON.stringify(preference));
    formData.append("subcategorias", JSON.stringify(optionsCategory));
    formData.append("titulo", title);
    formData.append("nombre", name);
    formData.append("lat", locationData.lat);
    formData.append("lon", locationData.lon);
    formData.append("lugar", location);
    formData.append("provincia", province);
    formData.append("cod_Whatsapp", countryWhatsapp);
    formData.append("whatsapp", whatsapp);
    formData.append("cod_telefono", countryPhone);
    formData.append("telefono", phone);
    formData.append("edad", age);
    formData.append("email_anuncio", user.email);
    formData.append("facebook", facebook);
    formData.append("instagram", instagram);
    formData.append("twitter", twitter);
    formData.append("tiktok", tiktok);
    formData.append("onlyfans", onlyfans);
    formData.append("otras", others);
    formData.append("descripcion", detail);
    formData.append("altura", height);
    formData.append("peso", weight);
    formData.append("color_pelo", hairColor);
    formData.append("color_ojos", eyeColor);
    formData.append("aspecto", aspect);
    formData.append("nacionalidad", nationality);
    formData.append("externo", "");

    axios({

      method: 'put',
      url: 'https://ws.tybyty.com/anuncios',
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
          textBody: Language.get(language, 'Anuncio editado'),
          button: Language.get(language, 'Cerrar')
        });
      }

    }).catch((e) => {

      setLoader(false);

      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: Language.get(language, 'Atención'),
        textBody: Language.get(language, 'Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte'),
        button: Language.get(language, 'Cerrar')
      });

    });

  };




  const verifyPage = () => {

    if (page == 1) {

      setSend1(true);

      if (category) {

        if (subcategory.length > 0) {

          let newOptionsCategory = optionsCategory;

          for (let i = 0; i < subcategory.length; i++) {

            for (let j = 0; j < newOptionsCategory.length; j++) {

              if (subcategory[i].id_subcategoria_anuncio == newOptionsCategory[j].id) {

                newOptionsCategory[j].valor = true;
              }

            }
          }

          setSubcategory([]);

          setOptionsCategory([...newOptionsCategory]);
        }

        setPage(2);
      }

    } else if (page == 2) {

      setPage(3);

    } else if (page == 3) {

      setSend3(true);

      if (title && name && (location && (locationData.lat && locationData.lon)) && province && (countryPhone != null && phone) && detail && age && nationality) {

        if (parseInt(age) >= 18) {

          if (countryWhatsapp != null || whatsapp) {

            if (countryWhatsapp != null && whatsapp) {

              setPage(4);
            }

          } else {

            setPage(4);
          }
        }

      }

    } else if (page == 4) {

      save();
    }
  }



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



  const changeOption = (index) => {

    let newOptions = optionsCategory;

    newOptions[index].valor = !newOptions[index].valor;

    setOptionsCategory([...newOptions]);
  }

  const clear = () => {

    setCategory(null);

    setSearch(false);

    setOffer(false);

    setWomen(false);

    setMen(false);

    setCouples(false);

    setPreference([]);

    setOptionsCategory([]);

    setTitle("");

    setName("");

    setLocation("");

    setLocationData({

      lat: "",
      lon: ""
    });

    setProvince("");

    setDetail("");

    setAge("");

    setCountryWhatsapp(null);

    setWhatsapp("");

    setCountryPhone(null);

    setPhone("");

    setFacebook("");

    setInstagram("");

    setTwitter("");

    setTiktok("");

    setOnlyfans("");

    setOthers("");

    setHeight(null);

    setWeight(null);

    setHairColor(null);

    setEyeColor(null);

    setNationality(null);

    setAspect(null);

    setPictures([]);

    setVideo(null);

    setSend1(false);

    setSend3(false);

    setPage(1);

  }


  const getAd = () => {

    setLoader(true);

    axios({
      method: 'get',
      url: 'https://ws.tybyty.com/anuncio/' + route.params.id,
      data: {},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {


      if (response.status == 200) {

        let dt_anuncio = response.data.anuncio;

        setCategory(dt_anuncio.id_categoria);
        setSearch(dt_anuncio.busco);
        setOffer(dt_anuncio.ofresco);
        setMen(dt_anuncio.hombres);
        setWomen(dt_anuncio.mujeres);
        setCouples(dt_anuncio.parejas);

        if (response.data.preferencias.length > 0) {

          let dt_preferencias = [];

          response.data.preferencias.map((x) => {

            dt_preferencias.push(x.id_preferencia);

          });

          setPreference([...dt_preferencias]);
        }


        if (response.data.subcategorias.length > 0) {

          setSubcategory([...response.data.subcategorias]);
        }


        setTitle(dt_anuncio.titulo);
        setName(dt_anuncio.nombre);
        setLocation(dt_anuncio.lugar);
        setLocationData({ lat: dt_anuncio.latitud, lon: dt_anuncio.longitud });
        setProvince(dt_anuncio.provincia);
        setCountryWhatsapp((dt_anuncio.id_cod_whatsapp) ? parseInt(dt_anuncio.id_cod_whatsapp) : null);
        setWhatsapp(dt_anuncio.whatsapp);
        setCountryPhone((dt_anuncio.id_cod_telefono) ? parseInt(dt_anuncio.id_cod_telefono) : null);
        setPhone(dt_anuncio.telefono);
        setAge(dt_anuncio.edad);
        setFacebook(dt_anuncio.facebook);
        setInstagram(dt_anuncio.instagram);
        setTwitter(dt_anuncio.twitter);
        setTiktok(dt_anuncio.tiktok);
        setOnlyfans(dt_anuncio.onlyfans);
        setOthers(dt_anuncio.otras);
        setDetail(dt_anuncio.descripcion);
        setHeight(dt_anuncio.id_altura);
        setWeight(dt_anuncio.id_peso);
        setHairColor(dt_anuncio.id_color_pelo);
        setEyeColor(dt_anuncio.id_color_ojos);
        setAspect(dt_anuncio.id_aspecto);
        setNationality(dt_anuncio.id_nacionalidad);

        if (response.data.fotos.length > 0) {

          let dt_fotos = [];

          response.data.fotos.map((x) => {

            dt_fotos.push({ id: x.id, url: "https://ws.tybyty.com/temp/" + x.src, file: null });

          });

          setPictures([...dt_fotos]);
        }

        if (response.data.video.length > 0) {

          setVideo({ id: response.data.video[0].id, url: (response.data.video[0].externo) ? response.data.video[0].src : "https://ws.tybyty.com/temp/" + response.data.video[0].src, file: null });
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
      method: 'get',
      url: 'https://ws.tybyty.com/anuncios/opciones',
      data: {},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }

    }).then((response) => {


      if (response.status == 200) {

        let dt_categorias = response.data.categorias;

        setCategories([...dt_categorias]);


        let dt_preferencias = response.data.preferencias;

        setPreferences([...dt_preferencias]);


        let dt_codigos = response.data.codigos;

        let ct_codigos = [];

        for (let i = 0; i < dt_codigos.length; i++) {

          ct_codigos.push({ "id": parseInt(dt_codigos[i].value), "text": dt_codigos[i].text, "lon": dt_codigos[i].longitud });
        }

        setCountries([...ct_codigos]);


        let dt_nacionalidades = response.data.nacionalidades;

        setNationalities([...dt_nacionalidades]);


        let dt_alturas = response.data.altura;

        setHeights([...dt_alturas]);


        let dt_pesos = response.data.peso;

        setWeights([...dt_pesos]);


        let dt_colores_pelos = response.data.colores_pelo;

        setHairColors([...dt_colores_pelos]);


        let dt_colores_ojos = response.data.colores_ojos;

        setEyeColors([...dt_colores_ojos]);


        let dt_aspectos = response.data.aspecto;

        setAspects([...dt_aspectos]);


      }

      getAd();

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

    if (category) {

      axios({
        method: 'get',
        url: 'https://ws.tybyty.com/anuncios/subcategorias/' + category,
        data: {},
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }

      }).then((response) => {


        if (response.status == 200) {

          if (response.data.subcategorias.length > 0) {

            let subcategorias = [];

            response.data.subcategorias.map((x) => {

              subcategorias.push({ "id": x.id, "nombre": x.nombre, "valor": false });

            });

            setOptionsCategory([...subcategorias]);

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


  }, [category]);




  useEffect(() => {

    if (!search && !offer) {

      setMen(false);

      setWomen(false);

      setCouples(false);
    }

  }, [search, offer]);




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

      <KeyboardAwareScrollView style={{ margin: 5 }}>

        <AlertNotificationRoot theme="dark">

          <View style={{ flexDirection: "row", marginBottom: 10 }}>

            <View style={{ flex: 1, alignItems: "center" }}>

              <View style={{ ...styles.buttonContainer, backgroundColor: (page == 1) ? "#e75e8d" : "#111314" }} >

                <Text style={styles.buttonText}>1</Text>

              </View>

            </View>

            <View style={{ flex: 1, alignItems: "center" }}>

              <View style={{ ...styles.buttonContainer, backgroundColor: (page == 2) ? "#e75e8d" : "#111314" }} >

                <Text style={styles.buttonText}>2</Text>

              </View>

            </View>

            <View style={{ flex: 1, alignItems: "center" }}>

              <View style={{ ...styles.buttonContainer, backgroundColor: (page == 3) ? "#e75e8d" : "#111314" }} >

                <Text style={styles.buttonText}>3</Text>

              </View>

            </View>

            <View style={{ flex: 1, alignItems: "center" }}>

              <View style={{ ...styles.buttonContainer, backgroundColor: (page == 4) ? "#e75e8d" : "#111314" }} >

                <Text style={styles.buttonText}>4</Text>

              </View>

            </View>

          </View>

          {(page == 1) && <View>

            <View style={{ ...styles.form }}>

              <Text style={styles.title}>{Language.get(language, "Datos")}</Text>


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Categorías")}
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
                placeholder={Language.get(language, "Seleccione una categoría")}
                searchPlaceholder={Language.get(language, "Buscar minuto")}
                value={category}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
                onChange={item => {
                  setCategory(item.id);
                }}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} color="black" />
                )}
              />

              {(send1 && !category) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo categoría es requerido")}
              </Text>}


              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>

                <Checkbox
                  color={search ? '#e75e8d' : undefined}
                  value={search}
                  onValueChange={() => setSearch(!search)}
                />


                <Text style={{ ...styles.text, margin: 10 }}>{Language.get(language, "Busco")}</Text>

              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>

                <Checkbox
                  color={offer ? '#e75e8d' : undefined}
                  value={offer}
                  onValueChange={() => setOffer(!offer)}
                />


                <Text style={{ ...styles.text, margin: 10 }}>{Language.get(language, "Ofresco")}</Text>

              </View>

              {(search || offer) && <View>

                <Text style={styles.title}>{Language.get(language, "Opciones")}</Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>

                  <Checkbox
                    color={women ? '#e75e8d' : undefined}
                    value={women}
                    onValueChange={() => setWomen(!women)}
                  />


                  <Text style={{ ...styles.text, margin: 10 }}>{Language.get(language, "Mujeres")}</Text>

                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  <Checkbox
                    color={men ? '#e75e8d' : undefined}
                    value={men}
                    onValueChange={() => setMen(!men)}
                  />


                  <Text style={{ ...styles.text, margin: 10 }}>{Language.get(language, "Hombres")}</Text>

                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>

                  <Checkbox
                    color={couples ? '#e75e8d' : undefined}
                    value={couples}
                    onValueChange={() => setCouples(!couples)}
                  />


                  <Text style={{ ...styles.text, margin: 10 }}>{Language.get(language, "Parejas")}</Text>

                </View>

              </View>}

              <TouchableOpacity
                onPress={() => verifyPage()}
                style={{ ...styles.buttonContainer, marginTop: 20 }}
              >
                <Text style={styles.buttonText}>{Language.get(language, "Guardar y continuar")}</Text>
              </TouchableOpacity>

            </View>

          </View>}


          {(page == 2) && <View>

            <View style={{ ...styles.form }}>

              <Text style={styles.title}>{Language.get(language, "Preferencias")}</Text>


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Preferencia")}
              </Text>

              <MultiSelect
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                activeColor="#414344"
                search
                data={preferences}
                labelField="text"
                valueField="id"
                placeholder={Language.get(language, "selecciona preferencias")}
                searchPlaceholder={Language.get(language, "Buscar preferencias")}
                value={preference}
                onChange={(item) => setPreference(item)}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />
                )}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
              />


              <Text style={{ ...styles.buttonText, marginTop: 20 }}>{Language.get(language, "Virtuales")}</Text>

              {optionsCategory.map((x, index) => <View key={index} style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginTop: 20 }}>

                <Text style={styles.text}>{x.nombre}</Text>

                <Checkbox
                  color={x.valor ? '#e75e8d' : undefined}
                  value={x.valor}
                  onValueChange={() => changeOption(index)}
                />

              </View>)}

              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginTop: 20 }}>

                <TouchableOpacity
                  onPress={() => setPage(1)}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>{Language.get(language, "Volver")}</Text>

                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => verifyPage()}
                  style={{ ...styles.buttonContainer }}
                >
                  <Text style={styles.buttonText}>{Language.get(language, "Guardar y continuar")}</Text>
                </TouchableOpacity>

              </View>

            </View>

          </View>}


          {(page == 3) && <View>

            <View style={{ ...styles.form }}>

              <Text style={styles.title}>{Language.get(language, "Presentación")}</Text>

              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Titulo Anuncio")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Titulo Anuncio")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={title}
                onChangeText={text => setTitle(text)}
                style={styles.input}
              />

              {(send3 && !title) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo titulo es requerido")}
              </Text>}

              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Nombre Completo")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Nombre Completo")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
              />

              {(send3 && !name) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo nombre es requerido")}
              </Text>}

              <Text style={{ ...styles.text, marginTop: 20 }}>
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

              {(send3 && !location) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo lugar es requerido")}
              </Text>}

              {(send3 && location && (locationData.lat == "" && locationData.lon == "")) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "No se ubican coordenadas del lugar")}
              </Text>}

              <Text style={{ ...styles.text, marginTop: 20 }}>
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

              {(send3 && !province) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo provincia es requerido")}
              </Text>}

              <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Whatsapp")}
              </Text>


              <View style={{ flexDirection: "row" }}>

                <View style={{ flex: 1 }}>

                  <Dropdown
                    style={stylesDropdown.dropdown}
                    placeholderStyle={stylesDropdown.placeholderStyle}
                    selectedTextStyle={stylesDropdown.selectedTextStyle}
                    inputSearchStyle={stylesDropdown.inputSearchStyle}
                    iconStyle={stylesDropdown.iconStyle}
                    activeColor="#414344"
                    data={countries}
                    search
                    maxHeight={300}
                    labelField="text"
                    valueField="id"
                    placeholder={Language.get(language, "Cod Pais")}
                    searchPlaceholder={Language.get(language, "Buscar pais")}
                    value={countryWhatsapp}
                    containerStyle={stylesDropdown.containerStyle}
                    itemTextStyle={stylesDropdown.itemTextStyle}
                    onChange={item => {
                      setCountryWhatsapp(item.id);
                    }}
                    renderLeftIcon={() => (

                      <FontAwesome style={stylesDropdown.icon} name="flag" size={20} />

                    )}
                  />

                </View>

                <View style={{ flex: 1.2 }}>

                  <TextInput
                    placeholder={Language.get(language, "Número de teléfono")}
                    placeholderTextColor="#b1b1b1"
                    selectionColor="#b1b1b1"
                    keyboardType="phone-pad"
                    value={whatsapp}
                    onChangeText={text => setWhatsapp(text)}
                    style={styles.input}
                  />

                </View>

              </View>


              {(send3 && (countryWhatsapp != null || whatsapp) && (countryWhatsapp == null || !whatsapp)) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo whatsapp es requerido")}
              </Text>}


              <Text style={{ ...styles.text, marginTop: 10 }}>
                {Language.get(language, "Teléfono")}
              </Text>


              <View style={{ flexDirection: "row" }}>

                <View style={{ flex: 1 }}>

                  <Dropdown
                    style={stylesDropdown.dropdown}
                    placeholderStyle={stylesDropdown.placeholderStyle}
                    selectedTextStyle={stylesDropdown.selectedTextStyle}
                    inputSearchStyle={stylesDropdown.inputSearchStyle}
                    iconStyle={stylesDropdown.iconStyle}
                    activeColor="#414344"
                    data={countries}
                    search
                    maxHeight={300}
                    labelField="text"
                    valueField="id"
                    placeholder={Language.get(language, "Cod Pais")}
                    searchPlaceholder={Language.get(language, "Buscar pais")}
                    value={countryPhone}
                    containerStyle={stylesDropdown.containerStyle}
                    itemTextStyle={stylesDropdown.itemTextStyle}
                    onChange={item => {
                      setCountryPhone(item.id);
                    }}
                    renderLeftIcon={() => (

                      <FontAwesome style={stylesDropdown.icon} name="flag" size={20} />

                    )}
                  />

                </View>

                <View style={{ flex: 1.2 }}>

                  <TextInput
                    placeholder={Language.get(language, "Número de teléfono")}
                    placeholderTextColor="#b1b1b1"
                    selectionColor="#b1b1b1"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={text => setPhone(text)}
                    style={styles.input}
                  />

                </View>

              </View>

              {(send3 && (countryPhone == null || !phone)) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo teléfono es requerido")}
              </Text>}


              <Text style={{ ...styles.buttonText, marginTop: 20 }}>{Language.get(language, "Redes Sociales")}</Text>


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Facebook")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Facebook")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={facebook}
                onChangeText={text => setFacebook(text)}
                style={styles.input}
              />


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Instagram")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Instagram")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={instagram}
                onChangeText={text => setInstagram(text)}
                style={styles.input}
              />

              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Twitter")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Twitter")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={twitter}
                onChangeText={text => setTwitter(text)}
                style={styles.input}
              />

              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Tik tok")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Tik tok")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={tiktok}
                onChangeText={text => setTiktok(text)}
                style={styles.input}
              />

              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Only fans")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Only fans")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={onlyfans}
                onChangeText={text => setOnlyfans(text)}
                style={styles.input}
              />


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Otras")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Otras")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={others}
                onChangeText={text => setOthers(text)}
                style={styles.input}
              />

              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Descripción")}
              </Text>

              <TextInput
                multiline
                numberOfLines={4}
                placeholder={Language.get(language, "Descripción")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                value={detail}
                onChangeText={text => setDetail(text)}
                style={styles.textarea}
              />

              {(send3 && !detail) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo descripción es requerido")}
              </Text>}

              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Edad")}
              </Text>

              <TextInput
                placeholder={Language.get(language, "Edad")}
                placeholderTextColor="#b1b1b1"
                selectionColor="#b1b1b1"
                keyboardType="phone-pad"
                value={age}
                onChangeText={text => setAge(text)}
                style={styles.input}
              />

              {(send3 && !age) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo edad es requerido")}
              </Text>}

              {(send3 && parseInt(age) < 18) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo edad debe ser mayor a 17")}
              </Text>}


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Nacionalidad")}
              </Text>

              <Dropdown
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                activeColor="#414344"
                data={nationalities}
                search
                maxHeight={300}
                labelField="text"
                valueField="id"
                placeholder={Language.get(language, "Nacionalidad")}
                searchPlaceholder="Buscar nacionalidad"
                value={nationality}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
                onChange={item => {
                  setNationality(item.id);
                }}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />

                )}
              />

              {(send3 && !nationality) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                {Language.get(language, "El campo nacionalidad es requerido")}
              </Text>}


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Altura")}
              </Text>

              <Dropdown
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                activeColor="#414344"
                data={heights}
                search
                maxHeight={300}
                labelField="text"
                valueField="id"
                placeholder={Language.get(language, "Altura")}
                searchPlaceholder={Language.get(language, "Buscar altura")}
                value={height}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
                onChange={item => {
                  setHeight(item.id);
                }}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />

                )}
              />



              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Peso")}
              </Text>

              <Dropdown
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                activeColor="#414344"
                data={weights}
                search
                maxHeight={300}
                labelField="text"
                valueField="id"
                placeholder={Language.get(language, "Peso")}
                searchPlaceholder={Language.get(language, "Buscar peso")}
                value={weight}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
                onChange={item => {
                  setWeight(item.id);
                }}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />

                )}
              />


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Color de pelo")}
              </Text>

              <Dropdown
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                activeColor="#414344"
                data={hairColors}
                search
                maxHeight={300}
                labelField="text"
                valueField="id"
                placeholder={Language.get(language, "Color de pelo")}
                searchPlaceholder={Language.get(language, "Buscar color de pelo")}
                value={hairColor}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
                onChange={item => {
                  setHairColor(item.id);
                }}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />

                )}
              />


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Color de ojos")}
              </Text>

              <Dropdown
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                activeColor="#414344"
                data={eyeColors}
                search
                maxHeight={300}
                labelField="text"
                valueField="id"
                placeholder={Language.get(language, "Color de ojos")}
                searchPlaceholder={Language.get(language, "Buscar color de ojos")}
                value={eyeColor}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
                onChange={item => {
                  setEyeColor(item.id);
                }}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />

                )}
              />


              <Text style={{ ...styles.text, marginTop: 20 }}>
                {Language.get(language, "Aspecto")}
              </Text>

              <Dropdown
                style={stylesDropdown.dropdown}
                placeholderStyle={stylesDropdown.placeholderStyle}
                selectedTextStyle={stylesDropdown.selectedTextStyle}
                inputSearchStyle={stylesDropdown.inputSearchStyle}
                iconStyle={stylesDropdown.iconStyle}
                activeColor="#414344"
                data={aspects}
                search
                maxHeight={300}
                labelField="text"
                valueField="id"
                placeholder={Language.get(language, "Aspecto")}
                searchPlaceholder={Language.get(language, "Buscar aspecto")}
                value={aspect}
                containerStyle={stylesDropdown.containerStyle}
                itemTextStyle={stylesDropdown.itemTextStyle}
                onChange={item => {
                  setAspect(item.id);
                }}
                renderLeftIcon={() => (

                  <FontAwesome style={stylesDropdown.icon} name="list-alt" size={20} />

                )}
              />


              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginTop: 20 }}>

                <TouchableOpacity
                  onPress={() => setPage(2)}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>{Language.get(language, "Volver")}</Text>

                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => verifyPage()}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>{Language.get(language, "Guardar y continuar")}</Text>
                </TouchableOpacity>

              </View>

            </View>

          </View>}

          {(page == 4) && <View>



            <View style={{ ...styles.form }}>

              <Text style={styles.title}>{Language.get(language, "Fotos y video")}</Text>


              <Text style={{ ...styles.buttonText, marginTop: 20 }}>{Language.get(language, "Fotos del Anuncio")}</Text>


              <Text style={{ ...styles.text, textAlign: 'justify', lineHeight: 25, marginTop: 20 }}>
                {Language.get(language, "No hay nada mejor para completar tu anuncio que colocar las mejores fotos que tengas estas fotos podran ser editadas de igual manera dentro de tu perfil una vez creado el anuncio y cuenta. Recuerda no utilizar fotos que no sean tuyas.")}
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
                style={{ ...styles.buttonContainer, backgroundColor: "#27292A", marginTop: 20 }}
              >
                <Text style={styles.buttonText}>{Language.get(language, "Seleccionar Imágenes")}</Text>

              </TouchableOpacity>


              <Text style={{ ...styles.buttonText, marginTop: 20 }}>{Language.get(language, "Video del anuncio")}</Text>


              <Text style={{ ...styles.text, textAlign: 'justify', lineHeight: 25, marginTop: 20 }}>
                {Language.get(language, "No hay nada mejor para completar tu anuncio que colocar un video que tengas este video podra ser editado de igual manera dentro de tu perfil una vez creado el anuncio y cuenta. Recuerda no utilizar un video que no sea tuyo.")}
              </Text>


              {(video && video.url) && <View>

                <Video
                  source={{ uri: video.url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  shouldPlay={false}
                  isLooping={false}
                  useNativeControls
                  style={styles.video}
                />

                <TouchableOpacity
                  onPress={() => deleteVideo()}
                  style={{ ...styles.buttonContainer, backgroundColor: "#DB3737" }}
                >

                  <Text style={styles.buttonText}>{Language.get(language, "Eliminar")}</Text>

                </TouchableOpacity>

              </View>}


              <TouchableOpacity
                onPress={() => pickVideo()}
                style={{ ...styles.buttonContainer, backgroundColor: "#27292A", marginTop: 20 }}
              >
                <Text style={styles.buttonText}>{Language.get(language, "Seleccionar Vídeo")}</Text>

              </TouchableOpacity>



              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'space-between', marginTop: 20 }}>

                <TouchableOpacity
                  onPress={() => setPage(3)}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>{Language.get(language, "Volver")}</Text>

                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => verifyPage()}
                  style={styles.buttonContainer}
                >
                  <Text style={styles.buttonText}>{Language.get(language, "Guardar")}</Text>
                </TouchableOpacity>

              </View>

            </View>

          </View>}

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
  form: {
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
    backgroundColor: '#e75e8d',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 24,
    alignItems: 'center',
    margin: 5
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  text: {

    color: "#CCC",
    fontSize: 15
  },
  video: {

    width: "100%",
    height: 300,
    marginTop: 20
  },

})