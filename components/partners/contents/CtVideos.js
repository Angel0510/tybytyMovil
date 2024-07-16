
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AntDesign, FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';
import * as VideoThumbnails from 'expo-video-thumbnails';
import AnimatedLoader from 'react-native-animated-loader';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Language from '../../Languages';

export default function FvVideos() {

    const { navigate } = useNavigation();

    const isFocused = useIsFocused();

    const [reload, setReload] = useState(true);

    const [filters, setFilters] = useState(false);

    const [category, setCategory] = useState(null);

    const [categories, setCategories] = useState([]);

    const [loader, setLoader] = useState(false);

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



    const retrieveData = async (restart) => {

        try {

            const getUser = await AsyncStorage.getItem('user');

            if (getUser !== null) {

                let newUser = JSON.parse(getUser);

                setUser(newUser);

                if (newUser.tipo == "socio") {

                    getCredit(newUser, false);
                }

                if (restart) {

                    clearData(newUser);

                } else {

                    active(data, page, user, {

                        "categoria": (category) ? category : 0
                    }, false);
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

        active(data, newPage, user, {

            "categoria": (category) ? category : 0
        }, true);
    }



    const active = (newData, newPage, getUser, newFilters, load) => {

        if (load) {

            setLoaderData(true);
        }

        axios({

            method: 'post',
            url: "https://ws.tybyty.com/videos/lista",
            data: {

                "id_usuario": getUser.id,
                "filters": newFilters,
                "page": (load) ? newPage : 1,
                "perPage": (load) ? 12 : 12 * newPage
            },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {

            if (response.status == 200) {

                let dt = newData;

                console.log((load) ? newPage : 1);

                console.log((load) ? 12 : 12 * newPage);

                console.log(dt);

                console.log(response.data.data)

                if (load) {

                    for (let i = 0; i < response.data.data.length; i++) {

                        dt.push({ ...response.data.data[i], imageUrl: "" });
                    }

                }else{

                    let imageUrl="";

                    let newDt=[];

                    for (let i = 0; i < response.data.data.length; i++) {

                        imageUrl="";

                        for (let j = 0; j < dt.length; j++) {
                            
                            if(response.data.data[i].src == dt[j].src){

                                imageUrl=dt[j].imageUrl;

                                break;
                            }
                            
                        }

                        newDt.push({ ...response.data.data[i], imageUrl:imageUrl });
                    }

                    dt=newDt;
                }

                console.log(dt);

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

                if(currentPage==0){

                    currentPage=1;
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



    const search = (getUser) => {

        setFilters(false);

        setData([]);

        active([], 1, getUser, {

            "categoria": (category) ? category : 0
        }, true);
    }


    const clearData = (getUser) => {

        setCategory(null);

        setData([]);

        active([], 1, getUser, {

            "categoria": 0
        }, true);
    }



    const options = () => {

        setLoader(true);

        axios({
            method: 'get',
            url: 'https://ws.tybyty.com/videos/categorias',
            data: {},
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {


            if (response.status == 200) {


                var dt = response.data.categorias;

                if (dt.length > 0) {

                    var new_categories = [{ "id": "0", "text": "todas" }];

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

                options();

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

            <AnimatedLoader
                visible={loader}
                source={require('../../../animations/loader.json')}
                overlayColor="rgba(31,33,34,1)"
                animationStyle={{ width: 200, height: 200 }}
                speed={1}
            />


            <Modal isVisible={filters} onBackdropPress={() => setFilters(false)} backdropOpacity={0.20}>


                <View>

                    <View style={modal.title}>

                        <Text style={{ ...styles.text, color: "white", fontSize: 17, fontWeight: "bold" }}>
                            {Language.get(language, "Filtros")}
                        </Text>

                        <TouchableOpacity
                            onPress={() => setFilters(false)}
                            style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
                        >

                            <AntDesign name="closecircleo" size={24} color="white" />

                        </TouchableOpacity>

                    </View>

                    <KeyboardAwareScrollView style={modal.body}>

                        <View style={modal.content}>

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

                        </View>

                    </KeyboardAwareScrollView>

                    <View style={modal.footer}>

                        {(user) && <TouchableOpacity
                            onPress={() => search(user)}
                            style={{ ...styles.buttonContainer }}
                        >

                            <Text style={styles.buttonText}>{Language.get(language, "Buscar")}</Text>

                        </TouchableOpacity>}

                    </View>


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


            <View style={{ flexDirection: "row" }}>

                <View style={{ flex: 1 }}>

                    <TouchableOpacity
                        onPress={() => setFilters(true)}
                        style={{ ...styles.buttonContainer }}
                    >
                        <AntDesign name="filter" size={24} color="white" />

                        <Text style={styles.buttonText}>{Language.get(language, "Filtrar")}</Text>

                    </TouchableOpacity>

                </View>

                <View style={{ flex: 1 }}>

                    <TouchableOpacity
                        onPress={() => notReloadNavigate("NewVideo")}
                        style={{ ...styles.buttonContainer }}
                    >
                        <AntDesign name="plus" size={24} color="white" />

                        <Text style={styles.buttonText}>{Language.get(language, "Video")}</Text>

                    </TouchableOpacity>

                </View>

            </View>



            <KeyboardAwareScrollView>

                <AlertNotificationRoot theme="dark">

                    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 5 }}>

                        {(data.length > 0) && data.map((x, index) =>

                            <TouchableOpacity
                                key={index}
                                onPress={() => notReloadNavigate("CtDetailVideo", { "id_usuario": x.id_usuario, "usuario": x.usuario, "foto": x.foto, "id": x.id })}
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

                    </View>


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