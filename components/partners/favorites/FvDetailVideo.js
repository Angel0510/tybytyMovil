import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Dimensions, Linking, StyleSheet, Text, Image, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from "react-native-modal";
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { Video } from 'expo-av';
import axios from 'axios';
import Language from '../../Languages';

export default function FvDetailVideo() {

    const { navigate } = useNavigation();

    const isFocused = useIsFocused();

    const route = useRoute();

    const [reload, setReload] = useState(true);

    const [loader, setLoader] = useState(false);

    const [buy, setBuy] = useState(false);

    const [video, setVideo] = useState(null);

    const [report, setReport] = useState(false);

    const [subject, setSubject] = useState("");

    const [email, setEmail] = useState("");

    const [details, setDetails] = useState("");

    const [sendReport, setSendReport] = useState(false);

    const [user, setUser] = useState(null);

    const [language, setLanguage] = useState("spanish");


    const notReloadNavigate = (view, params = null) => {

        setReload(false);

        if (params) {

            navigate(view, params);

        } else {

            navigate(view);
        }

    }


    const pushFavorite = () => {

        setLoader(true);

        axios({
            method: 'put',
            url: 'https://ws.tybyty.com/videos/favorito',
            data: { "id_usuario": user.id, "id_video": video.id, "estado": !video.favorito },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {


            if (response.status == 200) {

                setVideo({ ...video, favorito: !video.favorito });
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
                url: 'https://ws.tybyty.com/video/denuncia',
                data: {

                    id: video.id,
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

    const pushBuy = () => {

        setLoader(true);

        axios({
            method: 'post',
            url: 'https://ws.tybyty.com/usuario/comprar',
            data: {
                "id_usuario": user.id,
                "id_contenido": video.id,
                "precio": video.precio,
                "tipo": "video"
            },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {

            setLoader(false);

            if (response.status == 200) {

                setBuy(false);

                setVideo({ ...video, comprado: 1 });


                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: Language.get(language, 'Exito'),
                    textBody: Language.get(language, 'Contenido adquirido'),
                    button: Language.get(language, 'Cerrar')
                });

            } else if (response.status == 204) {

                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: Language.get(language, 'Atención'),
                    textBody: Language.get(language, 'No posees creditos suficientes para comprar este contenido'),
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

    }



    const options = (getUser) => {

        axios({
            method: 'get',
            url: 'https://ws.tybyty.com/video/info/' + route.params.id + '/' + getUser.id,
            data: {},
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {

            if (response.status == 200) {

                setVideo({ ...response.data.video });
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

        if (isFocused) {

            if (reload) {

                setVideo(null);

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



            <Modal isVisible={buy} onBackdropPress={() => setBuy(false)} backdropOpacity={0.70}>

                <View>

                    <View style={modal.title}>

                        <Text style={{ ...styles.text, color: "white", fontSize: 17, fontWeight: "bold" }}>
                            {Language.get(language, "Comprar")}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setBuy(false)}
                            style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
                        >

                            <AntDesign name="closecircleo" size={24} color="white" />

                        </TouchableOpacity>

                    </View>

                    <KeyboardAwareScrollView style={modal.body}>

                        <View style={modal.content}>



                            <View style={{ justifyContent: "center", alignItems: "center" }}>

                                <FontAwesome6 name="coins" size={30} color="#FEFF00" />

                                {(video && user) &&<Text style={{ ...styles.text, color: "white", fontSize: 24 }}>CDT {video.precio}</Text>}

                                <Text style={{ ...styles.text, textAlign: 'justify', lineHeight: 25 }}>{Language.get(language, "Deseas transferir creditos para optener el contenido?")}</Text>

                            </View>



                        </View>



                    </KeyboardAwareScrollView>

                    <View style={modal.footer}>

                        <TouchableOpacity
                            onPress={() => pushBuy()}
                            style={{ ...styles.buttonContainer }}
                        >

                            <Text style={styles.buttonText}>{Language.get(language, "Comprar")}</Text>

                        </TouchableOpacity>

                    </View>

                </View>


            </Modal>




            {(video && user) && <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center", padding: 10, backgroundColor: "#1A1E20" }}>

                <Image
                    style={{ width: 30, height: 30, borderRadius: 100 }}
                    source={{ uri: (video.foto) ? 'https://ws.tybyty.com/temp/' + video.foto : 'https://tybyty.com/icons/user.jpg' }}
                    resizeMode="contain"
                />

                <Text style={{ ...styles.text, marginTop: 10, marginLeft: 20, color: "white", fontWeight: 'bold', fontSize: 16 }}>
                    {video.usuario}
                </Text>

                <Text style={{ ...styles.text, marginTop: 10, marginLeft: 20, color: "#d63384", fontWeight: 'bold' }} onPress={() => notReloadNavigate("Profile", { "id_usuario": video.id_usuario, "usuario": video.usuario, "foto": video.foto })}>

                    <FontAwesome name="external-link" size={15} color="#d63384" /> {Language.get(language, "Ver Perfil")}

                </Text>

            </View>}

            {(video && user) && <KeyboardAwareScrollView style={{ padding: 10, marginBottom: 10 }}>

                <AlertNotificationRoot theme="dark">

                    <View style={{ justifyContent: "center", alignItems: "center" }}>

                        <Text style={{ ...styles.text, marginTop: 10, color: "white", fontWeight: "bold", fontSize: 17 }}>
                            {video.titulo}
                        </Text>

                    </View>


                    <View>


                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 10, backgroundColor: "#1F2122" }}>


                            {(video.pago && video.id_usuario != user.id && video.comprado == 0) && <Image resizeMode="contain" source={{ uri: "https://tybyty.com/themes/club/assets/images/difuso.png" }} style={{ width: '100%', height: 300 }} />}

                            {(video.src && (!video.pago || video.id_usuario == user.id || video.comprado > 0)) && <Video
                                source={{ uri: (video.externo == 0) ? 'https://ws.tybyty.com/temp/' + video.src : video.src }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="contain"
                                shouldPlay={false}
                                isLooping={false}
                                useNativeControls
                                style={styles.video}
                            />}

                        </View>

                    </View>

                </AlertNotificationRoot>

            </KeyboardAwareScrollView>}

            {(!video || !user) && <View style={{ marginTop: 10, marginBottom: 50, justifyContent: "center", alignItems: "center" }}>

                <ActivityIndicator size="x-large" color="#d63384" />

            </View>}


            {(video && user) && <View style={{ flexDirection: "row", flexWrap: 'wrap', marginTop: 10, justifyContent: "center", alignItems: "center", backgroundColor: "#1F2122" }}>

                {((user.tipo == "socio" && video.pago && video.id_usuario != user.id && video.comprado == 0)) && <Text style={{ ...styles.text, margin:5}} onPress={() => setBuy(true)}>
                    <FontAwesome6 name="coins" size={15} color="#FEFF00" /> CDT {video.precio}
                </Text>}

                {(user.tipo == "socio") && <Text style={{ ...styles.text, margin:5}} onPress={() => pushFavorite()}>
                    <FontAwesome name="heart" size={15} color={(video.favorito) ? "red" : "#CCC"} /> {Language.get(language, "Favorito")}
                </Text>}

                <Text style={{ ...styles.text, margin:5}} onPress={() => openReport()}>
                    <AntDesign name="closecircle" size={15} color="#b71c1c" /> {Language.get(language, "Denunciar")}
                </Text>

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

    video: {

        width: "100%",
        height: 300
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
        paddingHorizontal: 24
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },



})