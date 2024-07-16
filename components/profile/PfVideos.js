
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import Checkbox from 'expo-checkbox';
import Modal from "react-native-modal";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AntDesign, FontAwesome, Entypo } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Banners from '../Banners';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../Languages';

export default function PfVideos() {

    const { navigate } = useNavigation();

    const isFocused = useIsFocused();

    const route = useRoute();

    const [reload, setReload] = useState(true);

    const [loaderData, setLoaderData] = useState(false);

    const [user, setUser] = useState(null);

    const [totalPages, setTotalPages] = useState(1);

    const [page, setPage] = useState(1);

    const [data, setData] = useState([]);

    const [language, setLanguage] = useState("spanish");


    const notReloadNavigate = (view, params = null) => {

        setReload(false);

        if (params) {

            navigate(view, params);

        } else {

            navigate(view);
        }
    }


    generateThumbnail = async (index) => {

        let videoListNew = data;

        if (videoListNew.length > 0 && videoListNew[index] && !videoListNew[index].imageUrl) {

            try {

                let videoUrl = (videoListNew[index].externo == 0) ? 'https://ws.tybyty.com/temp/' + videoListNew[index].src : videoListNew[index].src

                const { uri } = await VideoThumbnails.getThumbnailAsync(
                    videoUrl,
                    {
                        time: 1000
                    }
                );

                videoListNew[index].imageUrl = uri;

                setData([...videoListNew]);

            } catch (e) {

                console.warn(e);
            }
        }

    };



    const event = async (name) => {

        try {

            const getEvent = await AsyncStorage.getItem(name);

            if (getEvent !== null) {

                if (name == "updateVideo") {

                    let detail = JSON.parse(getEvent);

                    if (data.length > 0) {

                        for (let i = 0; i < data.length; i++) {

                            if (data[i].id == detail.id && data[i].comprado == 0) {

                                let newData = data;

                                newData[i].comprado = 1;

                                setData([...newData]);

                                break;
                            }
                        }

                    }

                }

            }

        } catch (error) {
            console.error('Error al recuperar sesión', error);
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

                    active(data, page, user, false);
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
            url: "https://ws.tybyty.com/videos/perfil",
            data: {

                "id_user": getUser.id,
                "id_perfil": route.params.id_usuario,
                "page": (load) ? newPage : 1,
                "perPage": (load) ? 12 : 12 * newPage
            },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {

            if (response.status == 200) {

                let dt = newData;

                if (load) {

                    for (let i = 0; i < response.data.data.length; i++) {

                        dt.push({ ...response.data.data[i], imageUrl: "" });
                    }

                } else {

                    let imageUrl = "";

                    let newDt = [];

                    for (let i = 0; i < response.data.data.length; i++) {

                        imageUrl = "";

                        for (let j = 0; j < dt.length; j++) {

                            if (response.data.data[i].src == dt[j].src) {

                                imageUrl = dt[j].imageUrl;

                                break;
                            }

                        }

                        newDt.push({ ...response.data.data[i], imageUrl: imageUrl });
                    }

                    dt = newDt;
                }

                let newRow = parseInt(response.data.total);

                let newTotalPages = parseFloat(newRow / 12);

                if (parseFloat(newTotalPages) > parseInt(newTotalPages)) {

                    setTotalPages(parseInt(newTotalPages) + 1);

                } else {

                    setTotalPages(parseInt(newTotalPages));
                }


                let currentPage = parseFloat(parseInt(dt.length) / 12);

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

                    {(data.length > 0) && <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 5 }}>

                        {data.map((x, index) =>

                            <TouchableOpacity
                                key={index}
                                onPress={() => notReloadNavigate("PfDetailVideo", { ...x, "index": index, "usuario": route.params.usuario, "foto":route.params.foto })}
                            >

                                {(x.pago && x.id_usuario != user.id && x.comprado == 0) && <View style={{ width: 120, height: 120, margin: 1 }}>

                                    <Image key={index} resizeMode="cover" source={{ uri: "https://tybyty.com/themes/club/assets/images/difuso.png" }} style={{ width: "100%", height: "100%" }} />

                                    <Entypo name="video" style={{ position: 'absolute', top: 10, right: 10 }} size={24} color="white" />

                                </View>}


                                {(x.src && (!x.pago || x.id_usuario == user.id || x.comprado > 0)) && <View style={{ width: 120, height: 120, margin: 1 }}>

                                    <Image key={index} resizeMode="cover" source={{ uri: (x.imageUrl) ? x.imageUrl : "https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_square_small.gif" }} style={{ width: "100%", height: "100%" }} onLoad={() => generateThumbnail(index)} />
                                    <Entypo name="video" style={{ position: 'absolute', top: 10, right: 10 }} size={24} color="white" />

                                </View>}


                            </TouchableOpacity>


                        )}

                    </View>}


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
    },

});




const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#27292A",
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

    imageContainer: {

        overflow: 'hidden',
    },

    image: {
        width: 120,
        height: 120,
        resizeMode: "stretch",
    },
    video: {
        margin: 1,
        width: 120,
        height: 120
    },

})