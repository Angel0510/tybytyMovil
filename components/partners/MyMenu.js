
import { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome, FontAwesome6, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import Modal from "react-native-modal";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../Languages';

export default function MyMenu({ navigation }) {

    const { navigate } = useNavigation();

    const isFocused = useIsFocused();

    const [user, setUser] = useState(null);

    const [loader, setLoader] = useState(false);

    const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

    const [language, setLanguage] = useState("spanish");


    const newNavigate = (view) => {

        navigation.goBack();

        navigate(view);
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


    const deleteAccount = () => {

        setLoader(true);

        axios({
            method: 'delete',
            url: 'https://ws.tybyty.com/usuario',
            data: {
                "id_usuario": route.params.user.id
            },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {


            if (response.status == 200) {

                navigate("Logout");
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

            <Modal isVisible={confirmDeleteAccount} onBackdropPress={() => setConfirmDeleteAccount(false)} backdropOpacity={0.70}>

                <View>

                    <View style={modal.title}>

                        <Text style={{ ...styles.text, color: "white", fontSize: 17, fontWeight: "bold" }}>
                            {Language.get(language, "Eliminar Cuenta")}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setConfirmDeleteAccount(false)}
                            style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
                        >

                            <AntDesign name="closecircleo" size={24} color="white" />

                        </TouchableOpacity>

                    </View>

                    <KeyboardAwareScrollView style={modal.body}>

                        <View style={modal.content}>

                            <Text style={{ ...styles.text, marginTop: 10, color: "white", fontWeight: 'bold' }}>

                                {Language.get(language, "Estas seguro de eliminar tu cuenta?")}

                            </Text>

                        </View>

                    </KeyboardAwareScrollView>

                    <View style={modal.footer}>

                        <View style={{ flexDirection: "row" }}>

                            <View style={{ flex: 1 }}>


                                <TouchableOpacity
                                    onPress={() => setConfirmDeleteAccount(false)}
                                    style={{ ...styles.buttonContainer, marginStart: 10, marginEnd: 10, backgroundColor: "#C0392B" }}
                                >

                                    <Text style={styles.buttonText}>{Language.get(language, "Cancelar")}</Text>

                                </TouchableOpacity>


                            </View>

                            <View style={{ flex: 1 }}>


                                <TouchableOpacity
                                    onPress={() => deleteAccount()}
                                    style={{ ...styles.buttonContainer, marginStart: 10, marginEnd: 10, backgroundColor: "#138D75" }}
                                >

                                    <Text style={styles.buttonText}>{Language.get(language, "Aceptar")}</Text>

                                </TouchableOpacity>


                            </View>


                        </View>



                    </View>

                </View>

            </Modal>


            <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center", padding: 10, backgroundColor: "#1A1E20" }}>

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

            <KeyboardAwareScrollView style={{ margin: 10 }}>


                <AlertNotificationRoot theme="dark">


                    <View style={{ marginTop: 20 }}>

                        <Text style={styles.title}>{Language.get(language, "Acerca de ti")} <FontAwesome name="user-circle" size={20} color="white" /></Text>

                        <TouchableOpacity
                            onPress={() => newNavigate("AdsMenu")}
                            style={styles.option}
                        >
                            <FontAwesome6 name="rectangle-list" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Mis Anuncios")} </Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("PhotosMenu")}
                            style={styles.option}
                        >

                            <MaterialIcons name="photo-size-select-actual" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Mis Fotos")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("VideosMenu")}
                            style={styles.option}
                        >

                            <FontAwesome name="video-camera" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Mis Videos")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("EventsMenu")}
                            style={styles.option}
                        >
                            <FontAwesome5 name="book" size={20} color="white" style={{ marginEnd: 10 }} />
                            <Text style={styles.buttonText}>{Language.get(language, "Mis Eventos")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("CitesMenu")}
                            style={styles.option}
                        >

                            <FontAwesome name="tag" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Mis Citas")}</Text>

                        </TouchableOpacity>

                    </View>



                    <View style={{ marginTop: 20 }}>

                        <Text style={styles.title}>{Language.get(language, "Favorito")} <FontAwesome name="heart" size={20} color="white" /></Text>

                        <TouchableOpacity
                            onPress={() => newNavigate("AdsFavoriteMenu")}
                            style={styles.option}
                        >

                            <FontAwesome6 name="rectangle-list" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Anuncios")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("PhotosFavoriteMenu")}
                            style={styles.option}
                        >

                            <MaterialIcons name="photo-size-select-actual" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Fotos")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("VideosFavoriteMenu")}
                            style={styles.option}
                        >

                            <FontAwesome name="video-camera" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Videos")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("EventsFavoriteMenu")}
                            style={styles.option}
                        >

                            <FontAwesome5 name="book" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Eventos")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("CitesFavoriteMenu")}
                            style={styles.option}
                        >

                            <FontAwesome name="tag" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Citas")}</Text>

                        </TouchableOpacity>

                    </View>


                    <View style={{ marginTop: 20 }}>

                        <Text style={styles.title}>{Language.get(language, "Creditos")} <FontAwesome6 name="money-bill-wave" size={20} color="white" style={{ marginEnd: 10 }} /></Text>

                        <TouchableOpacity
                            onPress={() => newNavigate("BuyCreditMenu")}
                            style={styles.option}
                        >

                            <FontAwesome6 name="money-bill-wave" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Comprar")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("GetCreditMenu")}
                            style={styles.option}
                        >

                            <FontAwesome6 name="money-bill-wave" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Retirar")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("RecordMenu")}
                            style={styles.option}
                        >

                            <FontAwesome name="bookmark" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Historial")}</Text>

                        </TouchableOpacity>

                    </View>


                    <View style={{ marginTop: 20, marginBottom: 20 }}>

                        <Text style={styles.title}>{Language.get(language, "Cuenta")} <FontAwesome name="user-circle" size={20} color="white" /></Text>

                        <TouchableOpacity
                            onPress={() => newNavigate("MyAccountMenu")}
                            style={styles.option}
                        >

                            <FontAwesome name="user-circle" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Mi cuenta")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => newNavigate("VerifyAccountMenu")}
                            style={styles.option}
                        >

                            <FontAwesome name="gear" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Verificar Cuenta")}</Text>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setConfirmDeleteAccount(true)}
                            style={styles.option}
                        >

                            <FontAwesome name="trash" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Eliminar cuenta")}</Text>

                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => navigate("Logout")}
                            style={styles.option}
                        >

                            <FontAwesome name="share" size={20} color="white" style={{ marginEnd: 10 }} />

                            <Text style={styles.buttonText}>{Language.get(language, "Cerrar Sesión")}</Text>

                        </TouchableOpacity>

                    </View>

                </AlertNotificationRoot>

            </KeyboardAwareScrollView>

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
        backgroundColor: "#27292A"
    },
    confirmation: {
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

    option: {

        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: '#1A1E20',
        borderWidth: 1,
        borderColor: "#303436",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 5
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