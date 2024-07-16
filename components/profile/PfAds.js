
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import Banners from '../Banners';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../Languages';

export default function PfAds() {

    const { navigate } = useNavigation();

    const isFocused = useIsFocused();

    const route = useRoute();

    const [reload, setReload] = useState(true);

    const [photos, setPhotos] = useState(false);

    const [photoIndex, setPhotoIndex] = useState(0);

    const [loaderData, setLoaderData] = useState(false);

    const [user, setUser] = useState(null);

    const [totalPages, setTotalPages] = useState(1);

    const [page, setPage] = useState(1);

    const [data, setData] = useState([]);

    const [photosUrl, setPhotosUrl] = useState([]);

    const [language, setLanguage] = useState("spanish");



    const setPhotosIndex = (index) => {

        let newPhotosUrl = [];

        for (let i = 0; i < data[index].fotos.length; i++) {

            newPhotosUrl.push({ url: 'https://ws.tybyty.com/temp/' + data[index].fotos[i].src });
        }

        setPhotosUrl(newPhotosUrl);

        setPhotoIndex(0);

        setPhotos(true);
    }


    const notReloadNavigate = (view, params = null) => {

        setReload(false);

        if (params) {

            navigate(view, params);

        } else {

            navigate(view);
        }


    }



    const retrieveData = async (restart) => {

        try {

            const getUser = await AsyncStorage.getItem('user');

            if (getUser !== null) {

                let newUser = JSON.parse(getUser);

                setUser(newUser);

                if (restart) {

                    clearData(newUser);

                } else {

                    active([], page, user, false);
                }

            } else {

                setUser(null);

            }

        } catch (error) {
            console.error('Error al recuperar sesión', error);
        }
    }



    const next = () => {

        let newPage = page + 1;

        active(data, newPage, user, true);
    }



    const active = (newData, newPage, getUser, load) => {

        if (load) {

            setLoaderData(true);
        }

        axios({

            method: 'post',
            url: "https://ws.tybyty.com/anuncios/perfil",
            data: {

                "id_user": getUser.id,
                "id_perfil": route.params.id_usuario,
                "page": (load) ? newPage : 1,
                "perPage": (load) ? 5 : 5 * newPage
            },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {


            //console.log(response.data);


            if (response.status == 200) {

                let dt = newData;

                for (let i = 0; i < response.data.data.length; i++) {


                    dt.push(response.data.data[i]);
                }

                let newRow = parseInt(response.data.total);

                let newTotalPages = parseFloat(newRow / 5);

                if (parseFloat(newTotalPages) > parseInt(newTotalPages)) {

                    setTotalPages(parseInt(newTotalPages) + 1);

                } else {

                    setTotalPages(parseInt(newTotalPages));
                }



                let currentPage = parseFloat(parseInt(dt.length) / 5);

                if (parseFloat(currentPage) > parseInt(currentPage)) {

                    currentPage = parseInt(currentPage) + 1;

                } else {

                    currentPage = parseInt(currentPage);
                }

                setPage(currentPage);

                setData([...dt]);

            }

            if (load) {

                setLoaderData(false);
            }

        }).catch((e) => {

            if (load) {

                setLoaderData(false);
            }

            Dialog.show({
                type: ALERT_TYPE.WARNING,
                title: Language.get(language, 'Atención'),
                textBody: Language.get(language, 'Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte'),
                button: Language.get(language, 'Cerrar')
            });
        });

    }



    const clearData = (getUser) => {

        setData([]);

        active([], 1, getUser, true);
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

                retrieveData(true);

            } else {

                retrieveData(false);
            }

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


            <Modal isVisible={photos} onBackdropPress={() => setPhotos(false)} backdropOpacity={0.70}>

                <View style={{ flex: 1, backgroundColor: "black" }}>

                    <TouchableOpacity
                        onPress={() => setPhotos(false)}
                        style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
                    >

                        <AntDesign name="closecircleo" size={24} color="white" />

                    </TouchableOpacity>

                    <ImageViewer imageUrls={photosUrl} onChange={(index) => setPhotoIndex(index)} backgroundColor="black" index={photoIndex} />
                </View>

            </Modal>


            {(route.params) && <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center", padding: 10, backgroundColor: "#1A1E20" }}>

                <Image
                    style={{ width: 30, height: 30, borderRadius: 100 }}
                    source={{ uri: (route.params.foto) ? 'https://ws.tybyty.com/temp/' + route.params.foto : 'https://tybyty.com/icons/user.jpg' }}
                    resizeMode="contain"
                />

                <Text style={{ ...styles.text, marginLeft: 20, color: "white", fontWeight: 'bold', fontSize: 16 }}>
                    {route.params.usuario}
                </Text>

            </View>}




            <KeyboardAwareScrollView>


                <AlertNotificationRoot theme="dark">


                    {(data.length > 0) && data.map((x, index) => <View key={index} style={(x.autorenueva == 1) ? { ...stylesCard.body, borderColor: '#09a958' } : { ...stylesCard.body, borderColor: '#e75e8d' }}>

                        <View style={(x.autorenueva == 1) ? { ...stylesCard.title, backgroundColor: '#63BD90' } : { ...stylesCard.title, backgroundColor: "#e75e8d4a" }}>

                            <Text style={{ ...styles.text, color: "white", fontSize: 14, fontWeight: "bold" }}>
                                {x.categoria}
                            </Text>

                            <Text style={{ ...styles.text, color: "white", fontSize: 14, fontWeight: "bold" }}>
                                ref{x.id}
                            </Text>

                        </View>



                        <View style={{ flexDirection: "row" }}>


                            <View style={{ flex: 1 }}>

                                <View style={stylesCard.content}>

                                    {(x.fotos.length > 0) && <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                                        <TouchableOpacity style={{ width: "100%", height: 70 }} onPress={() => setPhotosIndex(index)}>
                                            <Image resizeMode="contain" source={{ uri: "https://ws.tybyty.com/temp/" + x.fotos[0].src }} style={{ width: '100%', height: "100%", borderRadius: 10 }} />
                                        </TouchableOpacity>

                                    </View>}

                                </View>

                            </View>

                            <View style={{ flex: 1.5 }}>


                                <View style={{ flexDirection: "row", flexWrap: 'wrap', padding: 10 }}>


                                    <Text style={{ ...styles.text, fontSize: 13, fontWeight: 'bold', color: "white", textAlign: 'justify' }}>
                                        {x.titulo}
                                    </Text>

                                    <Text style={{ ...styles.text, fontSize: 13, marginLeft: 5, color: "#d63384", fontWeight: 'bold' }} onPress={() => notReloadNavigate("PfDetailAd", { "id_usuario": x.id_usuario, "usuario": x.usuario, "foto":x.foto, "id": x.id })}>

                                        <FontAwesome name="external-link" size={13} color="#d63384" /> {Language.get(language, "Ver Anuncio")}
                                    </Text>

                                </View>


                            </View>



                        </View>

                    </View>)}


                    {(!loaderData && data.length == 0) && <View style={{ marginTop: 50, marginBottom: 50, justifyContent: "center", alignItems: "center" }}>

                        <Text style={{ ...styles.text, fontSize: 18, fontWeight: 'bold', color: "white" }}>
                            {Language.get(language, "No se encontraron resultados")}
                        </Text>

                    </View>}


                    {(!loaderData && page < totalPages) && <View style={{ marginTop: 10, marginBottom: 50, justifyContent: "center", alignItems: "center" }}>

                        <TouchableOpacity
                            onPress={() => next()}
                            style={{ ...styles.buttonContainer, backgroundColor: "#1A1E20", width: 150, borderColor: '#CCC', borderWidth: 1 }}
                        >

                            <Text style={styles.buttonText}> <AntDesign name="circledowno" size={16} color="white" />  {Language.get(language, "Ver Mas")}</Text>

                        </TouchableOpacity>

                    </View>}


                    {(loaderData) && <View style={{ marginTop: 10, marginBottom: 50, justifyContent: "center", alignItems: "center" }}>

                        <ActivityIndicator size="x-large" color="#d63384" />

                    </View>}


                </AlertNotificationRoot>


            </KeyboardAwareScrollView>

            <Banners />

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




const stylesCard = StyleSheet.create({

    body: {

        marginTop: 10,
        borderRadius: 20,
        borderWidth: 1

    },

    title: {

        flexDirection: "row",
        justifyContent: 'space-between',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 5
    },

    content: {

        borderRadius: 20,
        padding: 5

    },

    image: {

        width: '50%',
        height: 200,
    },

    item: {

        borderColor: '#CCC',
        borderWidth: 1,
        marginTop: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center"
    }


});


const stylesDropdown = StyleSheet.create({

    dropdown: {
        marginTop: 10,
        height: 50,
        backgroundColor: '#1a1e20',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
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
        paddingVertical: 5,
        paddingHorizontal: 24,
        margin: 5
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    text: {

        color: "#CCC",
        fontSize: 15
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
    },
})