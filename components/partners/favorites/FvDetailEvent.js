import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Linking, StyleSheet, Text, Image, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import PagerView from 'react-native-pager-view';
import ImageViewer from 'react-native-image-zoom-viewer';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Language from '../../Languages';


export default function FvDetailEvent() {

    const { navigate } = useNavigation();

    const isFocused = useIsFocused();

    const route = useRoute();

    const [reload, setReload] = useState(true);

    const [loader, setLoader] = useState(false);

    const [photos, setPhotos] = useState(false);

    const [report, setReport] = useState(false);

    const [subject, setSubject] = useState("");

    const [email, setEmail] = useState("");

    const [details, setDetails] = useState("");

    const [sendReport, setSendReport] = useState(false);




    const [register, setRegister] = useState(false);

    const [countries, setCountries] = useState([]);

    const [name, setName] = useState("");

    const [lastName, setLastName] = useState("");

    const [registerEmail, setRegisterEmail] = useState("");

    const [countryWhatsapp, setCountryWhatsapp] = useState(null);

    const [countryPhone, setCountryPhone] = useState(null);

    const [registerWhatsapp, setRegisterWhatsapp] = useState("");

    const [registerPhone, setRegisterPhone] = useState("");

    const [sendRegister, setSendRegister] = useState(false);



    const [images, setImages] = useState([]);

    const [user, setUser] = useState(null);

    const [event, setEvent] = useState(null);

    const [photoIndex, setPhotoIndex] = useState(0);

    const pagerRef = useRef(null);

    const [language, setLanguage] = useState("spanish");




    const notReloadNavigate = (view, params = null) => {

        setReload(false);

        if (params) {

            navigate(view, params);

        } else {

            navigate(view);
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


    const setPhotosIndex = (index) => {

        setPhotoIndex(index);

        setPhotos(true);
    }


    const handlePageSelected = (e) => {
        setPhotoIndex(e.nativeEvent.position);
    };


    const adjust = (v) => {

        if (v > 9) {

            return v.toString();

        } else {

            return '0' + v.toString();
        }
    }



    const fecha_info = (d) => {

        var today = new Date(d);
        var date = today.getUTCFullYear() + '-' + adjust(today.getUTCMonth() + 1) + '-' + adjust(today.getUTCDate());
        return `${date}`;
    }


    const hora_info = (d) => {

        console.log(d);

        var today = new Date(d);
        var time = adjust(today.getUTCHours()) + ":" + adjust(today.getUTCMinutes());

        return `${time}`;
    }




    const pushFavorite = () => {

        setLoader(true);

        axios({
            method: 'put',
            url: 'https://ws.tybyty.com/eventos/favorito',
            data: { "id_usuario": user.id, "id_evento": route.params.id, "estado": !event.favorito },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {


            if (response.status == 200) {

                let newEvent = event;

                newEvent.favorito = !event.favorito;

                setEvent({ ...newEvent });

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


    const pushReport = () => {


        if (verifyReport()) {

            setLoader(true);

            axios({
                method: 'post',
                url: 'https://ws.tybyty.com/evento/denuncia',
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
                        title: Language.get(language, 'Exito'),
                        textBody: Language.get(language, 'Denuncia completada'),
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


    const openRegister = () => {

        setName("");

        setLastName("");

        setRegisterEmail("");

        setCountryWhatsapp("0");

        setRegisterWhatsapp("");

        setCountryPhone("0");

        setRegisterPhone("");

        setSendRegister(false);

        setRegister(true);
    }

    const verifyRegister = () => {

        setSendRegister(true);

        if (!name || !lastName || !registerEmail || countryWhatsapp == "0" || !registerWhatsapp || countryPhone == "0" || !registerPhone) {

            return false;
        }

        return true;
    }


    const pushRegister = () => {


        if (verifyRegister()) {

            setLoader(true);

            axios({
                method: 'post',
                url: 'https://ws.tybyty.com/evento/registrarse',
                data: {

                    id: route.params.id,
                    nombre: name,
                    apellido: lastName,
                    correo: registerEmail,
                    codigo_whatsapp: countryWhatsapp,
                    whatsapp: registerWhatsapp,
                    codigo_telefono: countryPhone,
                    telefono: registerPhone
                },
                responseType: 'json',
                responseEncoding: 'utf8',
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }

            }).then((response) => {

                if (response.status == 201) {

                    setRegister(false);

                    setSendRegister(false);

                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: Language.get(language, 'Exito'),
                        textBody: Language.get(language, 'Registro completado'),
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



    const options = (getUser) => {

        axios({
            method: 'get',
            url: 'https://ws.tybyty.com/evento/info/' + route.params.id + '/' + getUser.id,
            data: {},
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {

            if (response.status == 200) {

                var arrayCodes = (response.data.evento.codigos.length > 0) ? response.data.evento.codigos : [];

                arrayCodes.unshift({ id: "0", text: "Cod Pais" });

                setCountries([...arrayCodes]);

                setEvent({ ...response.data.evento });

                if (response.data.evento.fotos.length > 0) {

                    let newImages = [];

                    for (let i = 0; i < response.data.evento.fotos.length; i++) {

                        newImages.push({ url: 'https://ws.tybyty.com/temp/' + response.data.evento.fotos[i].src });
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

                setEvent(null);

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


            <Modal isVisible={register} onBackdropPress={() => setRegister(false)} backdropOpacity={0.70}>


                <View>

                    <View style={modal.title}>

                        <Text style={{ ...styles.text, color: "white", fontSize: 17, fontWeight: "bold" }}>
                            {Language.get(language, "Registrarse en esta cita")}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setRegister(false)}
                            style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
                        >

                            <AntDesign name="closecircleo" size={24} color="white" />

                        </TouchableOpacity>

                    </View>

                    <KeyboardAwareScrollView style={modal.body}>

                        <View style={modal.content}>

                            <Text style={{ ...styles.text, marginTop: 10 }}>
                                {Language.get(language, "Nombre")}
                            </Text>

                            <TextInput
                                placeholder={Language.get(language, "Nombre")}
                                placeholderTextColor="#b1b1b1"
                                selectionColor="#b1b1b1"
                                style={styles.input}
                                value={name}
                                onChangeText={text => setName(text)}
                            />

                            {(sendRegister && !name) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                                {Language.get(language, "El campo nombre es requerido")}
                            </Text>}

                            <Text style={{ ...styles.text, marginTop: 10 }}>
                                {Language.get(language, "Apellido")}
                            </Text>

                            <TextInput
                                placeholder={Language.get(language, "Apellido")}
                                placeholderTextColor="#b1b1b1"
                                selectionColor="#b1b1b1"
                                style={styles.input}
                                value={lastName}
                                onChangeText={text => setLastName(text)}
                            />

                            {(sendRegister && !lastName) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                                {Language.get(language, "El campo apellido es requerido")}
                            </Text>}

                            <Text style={{ ...styles.text, marginTop: 10 }}>
                                {Language.get(language, "Correo")}
                            </Text>

                            <TextInput
                                placeholder={Language.get(language, "Correo")}
                                placeholderTextColor="#b1b1b1"
                                selectionColor="#b1b1b1"
                                style={styles.input}
                                value={registerEmail}
                                onChangeText={text => setRegisterEmail(text)}
                            />

                            {(sendRegister && !registerEmail) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                                {Language.get(language, "El campo correo es requerido")}
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
                                        style={styles.input}
                                        keyboardType="phone-pad"
                                        value={registerWhatsapp}
                                        onChangeText={text => setRegisterWhatsapp(text)}
                                    />

                                </View>

                            </View>

                            {(sendRegister && (countryWhatsapp == "0" || !registerWhatsapp)) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
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
                                        style={styles.input}
                                        keyboardType="phone-pad"
                                        value={registerPhone}
                                        onChangeText={text => setRegisterPhone(text)}
                                    />

                                </View>

                            </View>

                            {(sendRegister && (countryPhone == "0" || !registerPhone)) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                                {Language.get(language, "El campo Teléfono es requerido")}
                            </Text>}

                        </View>

                    </KeyboardAwareScrollView>

                    <View style={modal.footer}>

                        <TouchableOpacity
                            onPress={() => pushRegister()}
                            style={{ ...styles.buttonContainer }}
                        >

                            <Text style={styles.buttonText}>{Language.get(language, "Enviar")}</Text>

                        </TouchableOpacity>

                    </View>

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

            {(event && route.params) && <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center", padding: 10, backgroundColor: "#1A1E20" }}>

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

            {(event && route.params) && <KeyboardAwareScrollView style={{ padding: 10, marginBottom: 10 }}>

                <AlertNotificationRoot theme="dark">

                    <View style={{ flexDirection: "row", justifyContent: 'space-between', flexWrap: 'wrap', }}>

                        <Text style={{ ...styles.text, marginTop: 10 }}>
                            {event.categoria}
                        </Text>

                        <Text style={{ ...styles.text, marginTop: 10 }}>
                            ref{event.id}
                        </Text>

                    </View>

                    <View style={{ justifyContent: "center", alignItems: "center" }}>

                        <Text style={{ ...styles.text, marginTop: 10, textAlign: 'justify', lineHeight: 25, color: "white", fontWeight: "bold", fontSize: 17 }}>
                            {event.nombre}
                        </Text>

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

                    <Text style={{ ...styles.text, textAlign: 'justify', lineHeight: 25, marginTop: 20 }}>
                        {event.descripcion}
                    </Text>



                    <View style={{ marginTop: 10, marginBottom: 10 }}>


                        <View style={{ backgroundColor: "#303436", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

                            <Text style={{ ...styles.text, fontWeight: "bold" }}>
                                {Language.get(language, "Datos")}
                            </Text>

                        </View>

                        <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

                            <Text style={{ ...styles.text }}>
                                {Language.get(language, "Fecha")}: {fecha_info(event.fecha)}
                            </Text>

                        </View>

                        <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

                            <Text style={{ ...styles.text }}>
                                {Language.get(language, "Hora")}: {hora_info(event.fecha)}
                            </Text>

                        </View>

                        <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

                            <Text style={{ ...styles.text }}>
                                {Language.get(language, "Para")}: {event.para}
                            </Text>

                        </View>


                        <View style={{ backgroundColor: "#1F2122", padding: 10, borderColor: '#303436', borderWidth: 2 }}>

                            <Text style={{ ...styles.text, textAlign: 'justify' }}>
                                {Language.get(language, "Lugar")}: {event.lugar}
                            </Text>

                        </View>


                    </View>

                </AlertNotificationRoot>

            </KeyboardAwareScrollView>}

            {(event && route.params) && <View style={{ flexDirection: "row", flexWrap: 'wrap', marginTop: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#1F2122" }}>

                <Text style={{ ...styles.text, margin: 5 }} onPress={() => openRegister()}>
                    <MaterialIcons name="mode-edit" size={15} color="#128f03" /> {Language.get(language, "Registrarme")}
                </Text>

                <Text style={{ ...styles.text, margin: 5 }} onPress={() => share("https://tybyty.com/socios/evento/compartir/" + cite.id)}>
                    <FontAwesome name="users" size={15} color="#b3ad00" /> {Language.get(language, "Compartir")}
                </Text>

                {(event && user && user.tipo == "socio") && <Text style={{ ...styles.text, margin: 5 }} onPress={() => pushFavorite()}>
                    <FontAwesome name="heart" size={15} color={(event.favorito) ? "red" : "#CCC"} /> {Language.get(language, "Favorito")}
                </Text>}

                <Text style={{ ...styles.text, margin: 5 }} onPress={() => openReport()}>
                    <AntDesign name="closecircle" size={15} color="#b71c1c" /> {Language.get(language, "Denunciar")}
                </Text>

            </View>}

            {(!event) && <View style={{ marginTop: 10, marginBottom: 50, justifyContent: "center", alignItems: "center" }}>

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