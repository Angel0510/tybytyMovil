import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Language from '../Languages';


export default function NewVideo() {

  const { navigate } = useNavigation();

  const isFocused = useIsFocused();

  const [loader, setLoader] = useState(false);

  const [user, setUser] = useState(null);

  const [title, setTitle] = useState("");

  const [price, setPrice] = useState("1");

  const [category, setCategory] = useState(null);

  const [categories, setCategories] = useState([]);

  const [video, setVideo] = useState(null);

  const [money, setMoney] = useState(false);

  const [send, setSend] = useState(false);

  const [language, setLanguage] = useState("spanish");



  const pickVideo = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1
    });

    if (!result.canceled) {

      setVideo({ "name": result.assets[0].fileName, "type": result.assets[0].mimeType, "uri": result.assets[0].uri });
    }
  };

  const clear = () => {

    setVideo(null);
    setCategory(null);
    setTitle("");
    setPrice("1");
    setMoney(false);
    setSend(false);
  }


  const verify = () => {

    setSend(true);

    if (!category || !title || !video) {

      return false;
    }

    if (money) {

      if (parseFloat(price) < 1) {

        return false;
      }
    }

    return true;
  }

  const save = () => {

    if (verify()) {

      setLoader(true);

      console.log({
        "video": [video],
        "id_usuario": user.id,
        "categoria": category,
        "titulo": title,
        "monetizar": money,
        "precio": price,
        "externo": ""
      })

      const formData = new FormData();

      if (video) {

        formData.append('video', video);
      }
      formData.append("id_usuario", user.id);
      formData.append("categoria", category);
      formData.append("titulo", title);
      formData.append("monetizar", money);
      formData.append("precio", price);
      formData.append("externo", "");

      axios({

        method: 'post',
        url: 'https://ws.tybyty.com/videos',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {

        setLoader(false);

        if (response.status == 201) {

          clear();

          Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: Language.get(language, 'Exito'),
            textBody: Language.get(language, 'video subido'),
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


  const options = () => {

    setLoader(true);

    axios({
      method: 'post',
      url: 'https://ws.tybyty.com/videos/opciones',
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

    setPrice("1");

  }, [money])



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


      <KeyboardAwareScrollView>

        <AlertNotificationRoot theme="dark">


          <Text style={{ ...styles.text, marginTop: 20 }}>
            {Language.get(language, "Título")}
          </Text>

          <TextInput
            placeholder={Language.get(language, "Título")}
            placeholderTextColor="#b1b1b1"
            selectionColor="#b1b1b1"
            value={title}
            onChangeText={text => setTitle(text)}
            style={styles.input}
          />

          {(send && !title) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo título es requerido")}
          </Text>}


          <Text style={{ ...styles.title, marginTop: 20 }}>
            {Language.get(language, "Subir video")}

          </Text>

          {(video && video.uri) && <View>

            <Video
              source={{ uri: video.uri }}
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
              onPress={() => setVideo(null)}
              style={{ ...styles.buttonContainer, backgroundColor: "#DB3737" }}
            >

              <Text style={styles.buttonText}>{Language.get(language, "Eliminar")}</Text>

            </TouchableOpacity>

          </View>}




          <TouchableOpacity
            onPress={() => pickVideo()}
            style={{ ...styles.buttonContainer, backgroundColor: "#27292A" }}
          >
            <Text style={styles.buttonText}>{Language.get(language, "Seleccionar video")}</Text>

          </TouchableOpacity>

          {(send && !video) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo video es requerido")}
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


          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>

            <Checkbox
              color={money ? '#e75e8d' : undefined}
              value={money}
              onValueChange={() => { setMoney(!money); setPrice("1"); }}
            />


            <Text style={{ ...styles.text, margin: 10 }}>{Language.get(language, "Monetizar el contenido")}</Text>

          </View>


          {(money) && <View>

            <Text style={{ ...styles.text }}>
              CDT
            </Text>

            <TextInput
              placeholder="1.00"
              placeholderTextColor="#b1b1b1"
              selectionColor="#b1b1b1"
              keyboardType="phone-pad"
              value={price}
              onChangeText={text => setPrice(text)}
              style={styles.input}
            />

          </View>}

          {(send && money && !price) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo CDT es requerido")}
          </Text>}

          {(send && money && price && parseFloat(price) < 1) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
            {Language.get(language, "El campo CDT no puede ser menor a 1")}
          </Text>}

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
  },
  video: {

    width: "100%",
    height: 300,
    marginTop: 20
  }
})