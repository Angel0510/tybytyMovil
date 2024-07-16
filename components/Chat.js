
import { useState, useEffect } from 'react';
import { SafeAreaView, Linking, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Language from './Languages';

export default function Chat() {

    const [language, setLanguage] = useState("spanish");

    const [msg, setMsg] = useState('');


    const share = () => {

        const text = msg;
        const message = encodeURIComponent(text);
        const whatsappLink = 'whatsapp://send?text=' + message + '&phone=+34641181096';

        Linking.canOpenURL(whatsappLink).then(supported => {
            if (supported) {
                return Linking.openURL(whatsappLink);
            } else {
                alert('No se puede abrir WhatsApp');
            }
        });
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
    


    useEffect(() => {

        checkLanguage();

        const lg = setInterval(checkLanguage, 1000);

        return () => {

            clearInterval(lg);
        };

    }, [])

    return (

        <SafeAreaView style={styles.container}>

            <KeyboardAwareScrollView>

                <View style={styles.support}>


                    <View style={{ flexDirection: "row", flexWrap: 'wrap', alignItems: "center" }}>


                        <FontAwesome name="user-circle" size={24} color="white" />

                        <Text style={{ ...styles.text, marginTop: 10, marginLeft: 20, color: "white", fontWeight: 'bold', fontSize: 16 }}>
                            {Language.get(language, 'Operador')}
                        </Text>

                    </View>



                    <Text style={{ ...styles.text, textAlign: 'justify', lineHeight: 25 }}>
                        {Language.get(language, '¡Hola! 👋 ¿En qué puedo ayudarte hoy? Estamos aquí para resolver tus dudas y hacer tu experiencia en Tybyty.com aún mejor. 😊')}
                    </Text>

                </View>





            </KeyboardAwareScrollView>


            <View style={{ flexDirection: "row" }}>



                <TextInput
                    placeholder={Language.get(language, "Mensaje")}
                    placeholderTextColor="#b1b1b1"
                    selectionColor="#b1b1b1"
                    style={styles.input}
                    onChangeText={setMsg}
                    value={msg}
                />

                <TouchableOpacity
                    onPress={() => share()}
                    style={styles.buttonContainer}
                >

                    <Ionicons name="send" size={18} color="white" />

                </TouchableOpacity>

            </View>


        </SafeAreaView>
    );
}



const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: "#27292A",
    },


    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "white"
    },

    buttonContainer: {

        width: "15%",
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: '#e75e8d'
    },
    input: {
        width: '85%',
        backgroundColor: "#1a1e20",
        color: "#b1b1b1",
        borderColor: '#515455',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 4,
        height: 60,
        fontSize: 15
    },

    support: {
        backgroundColor: '#E43B8E',
        borderRadius: 8,
        padding: 10,
        margin: 10
    },

    user: {
        backgroundColor: '#1a1e20',
        borderRadius: 8,
        padding: 10,
        margin: 10
    },
    text: {

        color: "white",
        fontSize: 15,
        fontWeight: "bold"
    }
})