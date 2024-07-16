import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useState, useEffect } from 'react';

import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AsyncStorage from '@react-native-async-storage/async-storage';


import Login from "./partners/Login";

import Logout from "./Logout";

import Register from "./partners/Register";

import Visitor from "./Visitor";

import Ads from './home/Ads';

import DetailAd from './home/DetailAd';

import Cites from './home/Cites';

import DetailCite from './home/DetailCite';

import Events from './home/Events';

import DetailEvent from './home/DetailEvent';

import Photos from './home/Photos';

import DetailPhoto from './home/DetailPhoto';

import Videos from './home/Videos';

import DetailVideo from './home/DetailVideo';


import PfAds from './profile/PfAds';

import PfDetailAd from './profile/PfDetailAd';

import PfPhotos from './profile/PfPhotos';

import PfDetailPhoto from './profile/PfDetailPhoto';

import PfVideos from './profile/PfVideos';

import PfDetailVideo from './profile/PfDetailVideo';


import CtAds from './partners/contents/CtAds';

import CtDetailAd from './partners/contents/CtDetailAd';

import CtCites from './partners/contents/CtCites';

import CtDetailCite from './partners/contents/CtDetailCite';

import CtEvents from './partners/contents/CtEvents';

import CtDetailEvent from './partners/contents/CtDetailEvent';

import CtPhotos from './partners/contents/CtPhotos';

import CtDetailPhoto from './partners/contents/CtDetailPhoto';

import CtVideos from './partners/contents/CtVideos';

import CtDetailVideo from './partners/contents/CtDetailVideo';


import FvAds from './partners/favorites/FvAds';

import FvDetailAd from './partners/favorites/FvDetailAd'

import FvCites from './partners/favorites/FvCites';

import FvDetailCite from './partners/favorites/FvDetailCite';

import FvEvents from './partners/favorites/FvEvents';

import FvDetailEvent from './partners/favorites/FvDetailEvent';

import FvPhotos from './partners/favorites/FvPhotos';

import FvDetailPhoto from './partners/favorites/FvDetailPhoto';

import FvVideos from './partners/favorites/FvVideos';

import FvDetailVideo from './partners/favorites/FvDetailVideo';


import NewAd from './partners/NewAd';

import EditAd from './partners/EditAd';

import NewCite from './partners/NewCite';

import EditCite from './partners/EditCite';

import NewEvent from './partners/NewEvent';

import EditEvent from './partners/EditEvent';

import NewPhoto from './partners/NewPhoto';

import NewVideo from './partners/NewVideo';

import BuyCredit from './partners/BuyCredit';
import GetCredit from './partners/GetCredit';
import MyAccount from './partners/MyAccount';
import VerifyAccount from './partners/VerifyAccount';
import Record from './partners/Record';


import MyMenu from './partners/MyMenu';

import Chat from './Chat';

import { Entypo, MaterialCommunityIcons, FontAwesome, FontAwesome5, MaterialIcons, Fontisto } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Language from './Languages';


//Drawer


const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();



function StackAds() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="Ads">

            <Stack.Screen name="Ads" options={{ title: Language.get(language, 'Anuncios'), headerShown: false }} component={Ads} />
            <Stack.Screen name="DetailAd" options={{ title: Language.get(language, 'Detalle del anuncio'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={DetailAd} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="NewAd" options={{ title: Language.get(language, 'Nuevo Anuncio'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewAd} />

        </Stack.Navigator>
    );

}



function StackCites() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="Cites">

            <Stack.Screen name="Cites" options={{ title: Language.get(language, 'Citas'), headerShown: false }} component={Cites} />
            <Stack.Screen name="DetailCite" options={{ title: Language.get(language, 'Detalle de la cita'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={DetailCite} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="NewCite" options={{ title: Language.get(language, 'Nueva Cita'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewCite} />

        </Stack.Navigator>
    );

}


function StackEvents() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="Events">

            <Stack.Screen name="Events" options={{ title: Language.get(language, 'Eventos'), headerShown: false }} component={Events} />
            <Stack.Screen name="DetailEvent" options={{ title: Language.get(language, 'Detalle del evento'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={DetailEvent} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="NewEvent" options={{ title: Language.get(language, 'Nuevo Evento'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewEvent} />

        </Stack.Navigator>
    );

}


function StackPhotos() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="Photos">

            <Stack.Screen name="Photos" options={{ title: Language.get(language, 'Fotos'), headerShown: false }} component={Photos} />
            <Stack.Screen name="DetailPhoto" options={{ title: Language.get(language, 'Detalle de la foto'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={DetailPhoto} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />

        </Stack.Navigator>
    );

}


function StackVideos() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="Videos">

            <Stack.Screen name="Videos" options={{ title: Language.get(language, 'Videos'), headerShown: false }} component={Videos} />
            <Stack.Screen name="DetailVideo" options={{ title: Language.get(language, 'Detalle del video'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={DetailVideo} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />

        </Stack.Navigator>
    );

}



function StackBuyCredit() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="BuyCredit">

            <Stack.Screen name="BuyCredit" options={{ title: Language.get(language, 'Comprar Creditos'), headerShown: false }} component={BuyCredit} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}


function StackGetCredit() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="GetCredit">

            <Stack.Screen name="GetCredit" options={{ title: Language.get(language, 'Retirar Creditos'), headerShown: false }} component={GetCredit} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}


function StackMyAccount() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="MyAccount">

            <Stack.Screen name="MyAccount" options={{ title: Language.get(language, 'Mi Cuenta'), headerShown: false }} component={MyAccount} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}


function StackVerifyAccount() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="VerifyAccount">

            <Stack.Screen name="VerifyAccount" options={{ title: Language.get(language, 'Verificar Cuenta'), headerShown: false }} component={VerifyAccount} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}


function StackRecord() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="Record">

            <Stack.Screen name="Record" options={{ title: Language.get(language, 'Historial'), headerShown: false }} component={Record} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}




function StackCtAds() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="CtAds">

            <Stack.Screen name="CtAds" options={{ title:  Language.get(language, 'Anuncios'), headerShown: false }} component={CtAds} />
            <Stack.Screen name="CtDetailAd" options={{ title:  Language.get(language, 'Detalle del anuncio'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={CtDetailAd} />
            <Stack.Screen name="Menu" options={{ title:  Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />
            <Stack.Screen name="NewAd" options={{ title:  Language.get(language, 'Nuevo Anuncio'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewAd} />
            <Stack.Screen name="EditAd" options={{ title:  Language.get(language, 'Editar Anuncio'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={EditAd} />

        </Stack.Navigator>
    );

}



function StackCtCites() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="CtCites">

            <Stack.Screen name="CtCites" options={{ title: Language.get(language, 'Citas'), headerShown: false }} component={CtCites} />
            <Stack.Screen name="CtDetailCite" options={{ title: Language.get(language, 'Detalle de la cita'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={CtDetailCite} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />
            <Stack.Screen name="NewCite" options={{ title: Language.get(language, 'Nueva Cita'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewCite} />
            <Stack.Screen name="EditCite" options={{ title: Language.get(language, 'Editar Cita'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={EditCite} />

        </Stack.Navigator>
    );

}


function StackCtEvents() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="CtEvents">

            <Stack.Screen name="CtEvents" options={{ title: Language.get(language, 'Eventos'), headerShown: false }} component={CtEvents} />
            <Stack.Screen name="CtDetailEvent" options={{ title: Language.get(language, 'Detalle del evento'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={CtDetailEvent} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />
            <Stack.Screen name="NewEvent" options={{ title: Language.get(language, 'Nuevo Evento'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewEvent} />
            <Stack.Screen name="EditEvent" options={{ title: Language.get(language, 'Editar Evento'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={EditEvent} />

        </Stack.Navigator>
    );

}


function StackCtPhotos() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="CtPhotos">

            <Stack.Screen name="CtPhotos" options={{ title: Language.get(language, 'Fotos'), headerShown: false }} component={CtPhotos} />
            <Stack.Screen name="CtDetailPhoto" options={{ title: Language.get(language, 'Detalle de la foto'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={CtDetailPhoto} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />
            <Stack.Screen name="NewPhoto" options={{ title: Language.get(language, 'Nueva Foto'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewPhoto} />

        </Stack.Navigator>
    );

}


function StackCtVideos() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="CtVideos">

            <Stack.Screen name="CtVideos" options={{ title: Language.get(language, 'Videos'), headerShown: false }} component={CtVideos} />
            <Stack.Screen name="CtDetailVideo" options={{ title: Language.get(language, 'Detalle del video'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={CtDetailVideo} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />
            <Stack.Screen name="NewVideo" options={{ title: Language.get(language, 'Nuevo Video'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={NewVideo} />

        </Stack.Navigator>
    );

}



function StackFvAds() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="FvAds">

            <Stack.Screen name="FvAds" options={{ title: Language.get(language, 'Anuncios'), headerShown: false }} component={FvAds} />
            <Stack.Screen name="FvDetailAd" options={{ title: Language.get(language, 'Detalle del anuncio'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={FvDetailAd} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}



function StackFvCites() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="FvCites">

            <Stack.Screen name="FvCites" options={{ title: Language.get(language, 'Citas'), headerShown: false }} component={FvCites} />
            <Stack.Screen name="FvDetailCite" options={{ title: Language.get(language, 'Detalle de la cita'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={FvDetailCite} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}


function StackFvEvents() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="FvEvents">

            <Stack.Screen name="FvEvents" options={{ title: Language.get(language, 'Eventos'), headerShown: false }} component={FvEvents} />
            <Stack.Screen name="FvDetailEvent" options={{ title: Language.get(language, 'Detalle del evento'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={FvDetailEvent} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}


function StackFvPhotos() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="FvPhotos">

            <Stack.Screen name="FvPhotos" options={{ title: Language.get(language, 'Fotos'), headerShown: false }} component={FvPhotos} />
            <Stack.Screen name="FvDetailPhoto" options={{ title: Language.get(language, 'Detalle de la foto'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={FvDetailPhoto} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}


function StackFvVideos() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="FvVideos">

            <Stack.Screen name="FvVideos" options={{ title: Language.get(language, 'Videos'), headerShown: false }} component={FvVideos} />
            <Stack.Screen name="FvDetailVideo" options={{ title: Language.get(language, 'Detalle del video'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={FvDetailVideo} />
            <Stack.Screen name="Profile" options={{ title: Language.get(language, 'Perfil'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={TabProfile} />
            <Stack.Screen name="Menu" options={{ title: Language.get(language, 'Mi menu'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={MyMenu} />

        </Stack.Navigator>
    );

}





function TabCitesEvents() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Tab.Navigator screenOptions={{

            headerShown: false,
            tabBarStyle: {
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0
            },
            tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
            tabBarIndicatorStyle: {
                backgroundColor: 'red'
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarActiveBackgroundColor: "#d63384",
            tabBarInactiveBackgroundColor: "#1A1E20",
        }}>

            <Tab.Screen name="CitesMain" component={StackCites} options={{

                title: Language.get(language, 'Citas'),

                tabBarIcon: () => <Fontisto name="date" size={24} color="white" />

            }} />

            <Tab.Screen name="EventsMain" component={StackEvents} options={{

                title: Language.get(language, 'Eventos'),
                tabBarIcon: () => <MaterialCommunityIcons name="party-popper" size={24} color="white" />

            }} />

        </Tab.Navigator>
    );
}



function TabPhotosVideos() {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Tab.Navigator screenOptions={{

            headerShown: false,
            tabBarStyle: {
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0
            },
            tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
            tabBarIndicatorStyle: {
                backgroundColor: 'red'
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarActiveBackgroundColor: "#d63384",
            tabBarInactiveBackgroundColor: "#1A1E20",
        }}>

            <Tab.Screen name="PhotosMain" component={StackPhotos} options={{

                title: Language.get(language, 'Fotos'),

                tabBarIcon: () => <FontAwesome5 name="images" size={24} color="white" />

            }} />

            <Tab.Screen name="VideosMain" component={StackVideos} options={{

                title: Language.get(language, 'Videos'),
                tabBarIcon: () => <MaterialIcons name="video-collection" size={24} color="white" />

            }} />



        </Tab.Navigator>
    );
}





function StackPfAds({ route }) {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);

    return (

        <Stack.Navigator initialRouteName="PfAds">

            <Stack.Screen name="PfAds" options={{ title: Language.get(language, 'Anuncios'), headerShown: false }} component={PfAds} initialParams={route.params} />
            <Stack.Screen name="PfDetailAd" options={{ title: Language.get(language, 'Detalle del anuncio'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={PfDetailAd} />

        </Stack.Navigator>
    );

}



function StackPfPhotos({ route }) {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="PfPhotos">

            <Stack.Screen name="PfPhotos" options={{ title: Language.get(language, 'Fotos'), headerShown: false }} component={PfPhotos} initialParams={route.params} />
            <Stack.Screen name="PfDetailPhoto" options={{ title: Language.get(language, 'Detalle de la foto'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={PfDetailPhoto} />

        </Stack.Navigator>
    );

}


function StackPfVideos({ route }) {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Stack.Navigator initialRouteName="PfVideos">

            <Stack.Screen name="PfVideos" options={{ title: Language.get(language, 'Videos'), headerShown: false }} component={PfVideos} initialParams={route.params} />
            <Stack.Screen name="PfDetailVideo" options={{ title: Language.get(language, 'Detalle del video'), headerStyle: { backgroundColor: "#5E3647" }, headerTintColor: "white", headerTitleStyle: { fontSize: 18 }, animation: 'slide_from_right', presentation: "transparentModal" }} component={PfDetailVideo} />

        </Stack.Navigator>
    );

}





function TabProfile({ route }) {

    const [language, setLanguage] = useState("spanish");


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

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };
    
    }, []);


    return (

        <Tab.Navigator screenOptions={{

            headerShown: false,
            tabBarStyle: {
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0
            },
            tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
            tabBarIndicatorStyle: {
                backgroundColor: 'red'
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "white",
            tabBarActiveBackgroundColor: "#d63384",
            tabBarInactiveBackgroundColor: "#1A1E20",
        }}>

            <Tab.Screen name="PhotosPerfilMain" component={StackPfPhotos} initialParams={route.params} options={{

                title: Language.get(language, 'Fotos'),

                tabBarIcon: () => <FontAwesome5 name="images" size={24} color="white" />

            }} />

            <Tab.Screen name="VideosPerfilMain" component={StackPfVideos} initialParams={route.params} options={{

                title: Language.get(language, 'Videos'),
                tabBarIcon: () => <MaterialIcons name="video-collection" size={24} color="white" />

            }} />

            <Tab.Screen name="AdsPerfilMain" component={StackPfAds} initialParams={route.params} options={{

                title: Language.get(language, 'Anuncios'),
                tabBarIcon: () => <MaterialCommunityIcons name="card-text" size={24} color="white" />

            }} />

        </Tab.Navigator>
    );
}





export default function Navigation() {


    const [user, setUser] = useState(null);

    const [language, setLanguage] = useState("spanish");


    const _storeData = async (data) => {

        try {

            await AsyncStorage.setItem('user', JSON.stringify(data));

            setUser(data);

        } catch (error) {
            console.log(error)
        }
    };


    const changeLanguage = async (lg) => {

        try {

            await AsyncStorage.setItem('language', lg);

            setLanguage(lg);

        } catch (error) {
            console.log(error)
        }
    };



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


    const retrieveData = async () => {

        try {

            const getUser = await AsyncStorage.getItem('user');

            if (getUser !== null) {

                _storeData(JSON.parse(getUser));

            } else {

                setUser(null);

            }

        } catch (error) {
            console.error('Error al recuperar datos:', error);
        }


        checkLanguage();
    }


    useEffect(() => {

        retrieveData();

        const subscription = setInterval(retrieveData, 1000);

        return () => {

            clearInterval(subscription);
        };

    }, []);


    return (<NavigationContainer>

        <Drawer.Navigator
            drawerContent={

                (props) => {

                    return (

                        <SafeAreaView>

                            <View style={{

                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"

                            }}>

                                <Image
                                    style={{ width: 100, height: 100 }}
                                    source={{ uri: 'https://tybyty.com/themes/club/assets/images/logo-club.png' }}
                                    resizeMode="cover"
                                />

                            </View>


                            <View style={{

                                flexDirection: "row",
                                marginBottom:10
                            }}>

                                <View style={{flex: 1}}>

                                    <TouchableOpacity style={{
                                        
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: (language=="spanish")?"#5F5F5F":"#111314",
                                        padding: 5,
                                        marginLeft:10
                                    }} onPress={() => changeLanguage("spanish")}>

                                        <Image
                                            style={{ width: 30, height: 30 }}
                                            source={require('../images/spanish.png')}
                                            resizeMode="cover"
                                        />

                                    </TouchableOpacity>

                                </View>


                                <View style={{flex: 1}}>

                                    <TouchableOpacity style={{
                                    
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backgroundColor: (language=="english")?"#5F5F5F":"#111314",
                                        padding: 5,
                                        marginRight:10
                                    }} onPress={() => changeLanguage("english")}>

                                        <Image
                                            style={{ width: 30, height: 30 }}
                                            source={require('../images/english.jpg')}
                                            resizeMode="cover"
                                        />

                                    </TouchableOpacity>

                                </View>

                            </View>


                            <DrawerItemList {...props} />


                        </SafeAreaView>
                    )
                }
            }
            screenOptions={{
                drawerStyle: {
                    backgroundColor: "#1A1E20"
                },
                headerStyle: {
                    backgroundColor: "#1A1E20"
                },
                headerTintColor: "#d63384",
                headerTitleStyle: {

                    fontSize: 18,
                    color: 'white'
                },
                headerRight: () => (
                    <Image
                        style={{ width: 80, height: 50, marginRight: 10 }}
                        source={{ uri: 'https://tybyty.com/themes/club/assets/images/logo-club.png' }}
                        resizeMode="cover"
                    />
                ),
                drawerActiveTintColor: '#d63384',
                drawerInactiveTintColor: '#777',
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            }}
        >


            <Drawer.Screen
                name="Login"
                options={(!user) ? {
                    drawerLabel: Language.get(language, "Iniciar sesión"),
                    title: Language.get(language, "Iniciar sesión"),
                    drawerIcon: () => (
                        <Entypo name="login" size={20} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Iniciar sesión"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={Login}

            />


            <Drawer.Screen
                name="MyMenu"
                options={(user && user.tipo == "socio") ? {
                    drawerLabel: Language.get(language, "Mi Menu"),
                    title: Language.get(language, "Mi Menu"),
                    drawerIcon: () => (

                        <MaterialCommunityIcons name="microsoft-xbox-controller-menu" size={20} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Mi Menu"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={MyMenu}

            />




            <Drawer.Screen
                name="NewPartner"
                options={(!user) ? {
                    drawerLabel: Language.get(language, "Nuevo Socio"),
                    title: Language.get(language, "Nuevo Socio"),
                    drawerIcon: () => (
                        <FontAwesome5 name="user-plus" size={17} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Nuevo Socio"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={Register}

            />


            <Drawer.Screen
                name="Visitor"
                options={(!user) ? {
                    drawerLabel: Language.get(language, "Visitante"),
                    title: Language.get(language, "Visitante"),
                    drawerIcon: () => (
                        <FontAwesome5 name="user-secret" size={20} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Visitante"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={Visitor}

            />

            <Drawer.Screen
                name="AdsMain"
                options={(user) ? {
                    drawerLabel: Language.get(language, "Anuncios"),
                    title: Language.get(language, "Anuncios"),
                    drawerIcon: () => (

                        <MaterialCommunityIcons name="card-text" size={20} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Anuncios"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={StackAds}

            />


            <Drawer.Screen
                name="CitesEventsMain"
                options={(user) ? {
                    drawerLabel: Language.get(language, "Citas y eventos"),
                    title: Language.get(language, "Citas y eventos"),
                    drawerIcon: () => (

                        <MaterialIcons name="event" size={20} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Citas y eventos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={TabCitesEvents}

            />


            <Drawer.Screen
                name="PhotosVideosMain"
                options={(user) ? {
                    drawerLabel: Language.get(language, "Fotos y vídeos"),
                    title: Language.get(language, "Fotos y vídeos"),
                    drawerIcon: () => (

                        <FontAwesome5 name="photo-video" size={17} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Fotos y vídeos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={TabPhotosVideos}

            />


            <Drawer.Screen
                name="Chat"
                options={{
                    drawerLabel: Language.get(language, "Soporte"),
                    title: Language.get(language, "Soporte"),
                    drawerIcon: () => (


                        <MaterialIcons name="support-agent" size={20} color="#d63384" />
                    )
                }}
                component={Chat}

            />


            <Drawer.Screen
                name="Logout"
                options={(user) ? {
                    drawerLabel: Language.get(language, "Cerrar Sesión"),
                    title: "",
                    drawerIcon: () => (

                        <FontAwesome name="share" size={20} color="#d63384" />
                    )
                } : {
                    title: Language.get(language, "Cerrar Sesión"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
                component={Logout}

            />




            <Drawer.Screen
                name="AdsMenu"
                component={StackCtAds}
                options={{
                    title: Language.get(language, "Mis Anuncios"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="CitesMenu"
                component={StackCtCites}
                options={{
                    title: Language.get(language, "Mis Citas"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="EventsMenu"
                component={StackCtEvents}
                options={{
                    title: Language.get(language, "Mis Eventos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="PhotosMenu"
                component={StackCtPhotos}
                options={{
                    title: Language.get(language, "Mis Fotos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="VideosMenu"
                component={StackCtVideos}
                options={{
                    title: Language.get(language,"Mis Videos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />


            <Drawer.Screen
                name="AdsFavoriteMenu"
                component={StackFvAds}
                options={{
                    title: Language.get(language,"Mis Anuncios Favoritos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="CitesFavoriteMenu"
                component={StackFvCites}
                options={{
                    title: Language.get(language,"Mis Citas Favoritas"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="EventsFavoriteMenu"
                component={StackFvEvents}
                options={{
                    title: Language.get(language,"Mis Eventos Favoritos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="PhotosFavoriteMenu"
                component={StackFvPhotos}
                options={{
                    title: Language.get(language,"Mis Fotos Favoritos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="VideosFavoriteMenu"
                component={StackFvVideos}
                options={{
                    title: Language.get(language,"Mis Videos Favoritos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />


            <Drawer.Screen
                name="BuyCreditMenu"
                component={StackBuyCredit}
                options={{
                    title: Language.get(language,"Comprar Creditos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />


            <Drawer.Screen
                name="GetCreditMenu"
                component={StackGetCredit}
                options={{
                    title: Language.get(language,"Retirar Creditos"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />


            <Drawer.Screen
                name="MyAccountMenu"
                component={StackMyAccount}
                options={{
                    title: Language.get(language,"Mi Cuenta"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="VerifyAccountMenu"
                component={StackVerifyAccount}
                options={{
                    title: Language.get(language,"Verificar Cuenta"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />

            <Drawer.Screen
                name="RecordMenu"
                component={StackRecord}
                options={{
                    title: Language.get(language,"Historial"),
                    drawerItemStyle: {
                        display: 'none'
                    },
                    drawerLabel: () => null
                }}
            />



        </Drawer.Navigator>

    </NavigationContainer>);

}


