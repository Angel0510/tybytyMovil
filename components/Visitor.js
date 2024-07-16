
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import AnimatedLoader from 'react-native-animated-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Dialog, Toast, ALERT_TYPE, AlertNotificationRoot } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Language from './Languages';

export default function Visitor() {


    const { navigate } = useNavigation();

    const isFocused = useIsFocused();

    const [year, setYear] = useState(null);

    const [month, setMonth] = useState(null);

    const [day, setDay] = useState(null);

    const [years, setYears] = useState([]);

    const [months, setMonths] = useState([]);

    const [days, setDays] = useState([]);

    const [isChecked, setChecked] = useState(false);

    const [send, setSend] = useState(false);

    const [loader, setLoader] = useState(false);

    const [language, setLanguage] = useState("spanish");


    const _storeData = async (data) => {

        try {
            await AsyncStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            console.log(error)
        }
    };



    const reset=()=>{

        setYear(null);
        setMonth(null);
        setDay(null);
        setChecked(false);
        setSend(false);
    }



    const verifyForm = () => {

        setSend(true);

        if (!year || !month || !day || !isChecked) {

            return false;
        }

        return true;
    }


    const calculateAge = (a, m, d) => {

        const birthDate = new Date(a, m - 1, d);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const differenceMonths = today.getMonth() - birthDate.getMonth();
        if (differenceMonths < 0 || (differenceMonths === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }


    const generateYears = () => {

        const max = new Date().getFullYear();
        const min = max - 100;
        const y = [];

        for (let i = max; i >= min; i--) {
            y.push({ "label": i.toString(), "value": i });
        }

        return y;
    }


    const generateMonths = () => {

        const m = [];

        for (let i = 1; i <= 12; i++) {
            m.push({ "label": i.toString(), "value": i });
        }

        return m;
    }


    const generateDays = () => {

        const d = [];

        for (let i = 1; i <= 31; i++) {
            d.push({ "label": i.toString(), "value": i });
        }

        return d;
    }


    const login = () => {

        if (verifyForm()) {

            let age = calculateAge(year, month, day);

            if (parseInt(age) > 17) {

                _storeData({

                    "id": 0,
                    "tipo": "visitante",
                    "usuario": "",
                    "email": ""
                });

                reset();

                navigate("AdsMain");

            } else {

                Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: Language.get(language, 'Atención'),
                    textBody: Language.get(language, 'Solo se admiten visitantes que tengan 18 años o más.'),
                    button: Language.get(language, 'Cerrar')
                });
            }
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
          reset();
        }
    }, [isFocused]);


    useEffect(() => {

        const newYears = generateYears();

        const newMonths = generateMonths();

        const newDays = generateDays();

        setYears([...newYears]);

        setMonths([...newMonths]);

        setDays([...newDays]);

        checkLanguage();
    
        const lg = setInterval(checkLanguage, 1000);
    
        return () => {
    
          clearInterval(lg);
        };

    }, [])



    return (
        <SafeAreaView style={styles.container}>

            <AnimatedLoader
                visible={loader}
                source={require('../animations/loader.json')}
                overlayColor="rgba(31,33,34,1)"
                animationStyle={{ width: 200, height: 200 }}
                speed={1}
            />

            <View>

                <KeyboardAwareScrollView>

                    <AlertNotificationRoot theme="dark">

                        <View style={{ ...styles.confirmation }}>


                            <Text style={styles.title}>{Language.get(language, "Confirma tu edad")}</Text>

                            <Text style={{ ...styles.text, marginTop: 20 }}>
                                {Language.get(language, "Fecha de nacimiento")}
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
                                labelField="label"
                                valueField="value"
                                placeholder={Language.get(language, "Seleccione un año")}
                                searchPlaceholder={Language.get(language, "Buscar año")}
                                value={year}
                                containerStyle={stylesDropdown.containerStyle}
                                itemTextStyle={stylesDropdown.itemTextStyle}
                                onChange={item => {
                                    setYear(item.value);
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
                                labelField="label"
                                valueField="value"
                                placeholder={Language.get(language, "Seleccione un mes")}
                                searchPlaceholder={Language.get(language, "Buscar mes")}
                                value={month}
                                containerStyle={stylesDropdown.containerStyle}
                                itemTextStyle={stylesDropdown.itemTextStyle}
                                onChange={item => {
                                    setMonth(item.value);
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
                                labelField="label"
                                valueField="value"
                                placeholder={Language.get(language, "Seleccione un día")}
                                searchPlaceholder={Language.get(language, "Buscar día")}
                                value={day}
                                containerStyle={stylesDropdown.containerStyle}
                                itemTextStyle={stylesDropdown.itemTextStyle}
                                onChange={item => {
                                    setDay(item.value);
                                }}
                                renderLeftIcon={() => (

                                    <FontAwesome style={stylesDropdown.icon} name="calendar" size={20} color="black" />
                                )}
                            />


                            {(send && !day) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                                {Language.get(language, "El campo día es requerido")}
                            </Text>}


                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>

                                <Checkbox
                                    color={isChecked ? '#e75e8d' : undefined}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                />


                                <Text style={{ ...styles.text, margin: 10 }}>
                                    {Language.get(language, "Acepto")} <Text style={{ ...styles.text, color: "#e75e8d" }} onPress={() => null}>{Language.get(language, "Terminos y Condiciones")}</Text>
                                </Text>

                            </View>

                            
                            {(send && !isChecked) && <Text style={{ ...styles.text, marginTop: 10, color: "red" }}>
                                {Language.get(language, "Se deben aceptar los terminos y condiciones.")}
                            </Text>}


                            <TouchableOpacity
                                onPress={() => login()}
                                style={{ ...styles.buttonContainer, marginTop: 20 }}
                            >
                                <Text style={styles.buttonText}>{Language.get(language, "Ingresar")}</Text>
                            </TouchableOpacity>



                            <StatusBar style="auto" />
                        </View>

                    </AlertNotificationRoot>

                </KeyboardAwareScrollView>

            </View>

        </SafeAreaView>
    );
}


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
        backgroundColor: "#27292A",
        padding: 10,
        justifyContent: "center"
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
        fontSize: 15
    }
})