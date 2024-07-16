import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import Modal from "react-native-modal";
import ImageViewer from 'react-native-image-zoom-viewer';
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';


export default function UploadPhotos(props) {

    const [pictures, setPictures] = useState([]);

    const [photos, setPhotos] = useState(false);

    const [photoIndex, setPhotoIndex] = useState(0);

    const [title, setTitle] = useState(null);

    const [config, setConfig] = useState(null);


    const setPhotosIndex = (index) => {

        setPhotoIndex(index);

        setPhotos(true);
    }



    const deletePhoto = () => {

        let newPictures = pictures;

        newPictures.splice(photoIndex, 1);

        setPhotos(false);

        setPictures([...newPictures]);

    }



    const pickImages = async () => {


        const result = await ImagePicker.launchImageLibraryAsync(config);

        if (!result.canceled) {

            let newPictures = [];

            result.assets.map(async (x) => {

                newPictures.push({ url: x.uri });

            });

            setPictures([...newPictures]);
        }

    };


    useEffect(()=>{

        if(props.data){

            setTitle(props.data.title);

            setConfig(props.data.config);

        }


    },[props])


    return (



        <View>


            <Modal isVisible={photos} onBackdropPress={() => setPhotos(false)} backdropOpacity={0.70}>

                <View style={{ flex: 1, backgroundColor: "black" }}>

                    <TouchableOpacity
                        onPress={() => setPhotos(false)}
                        style={{ padding: 10, justifyContent: 'center', alignItems: 'flex-end' }}
                    >

                        <AntDesign name="closecircleo" size={24} color="white" />

                    </TouchableOpacity>

                    <ImageViewer imageUrls={pictures} onChange={(index) => setPhotoIndex(index)} backgroundColor="black" index={photoIndex} />


                    <TouchableOpacity
                        onPress={() => deletePhoto()}
                        style={{ ...styles.buttonContainer, backgroundColor: "#DB3737" }}
                    >

                        <Text style={styles.buttonText}>Eliminar</Text>

                    </TouchableOpacity>

                </View>

            </Modal>

            <Text style={{ ...styles.title, marginTop: 20 }}>
                {title}

            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>

                {pictures.map((x, index) => (

                    <TouchableOpacity
                        key={index}
                        onPress={() => setPhotosIndex(index)}
                        style={{ margin: 5 }}
                    >
                        <Image source={{ uri: x.url }} style={{ width: 80, height: 80 }} />

                    </TouchableOpacity>

                ))}

            </View>



            <TouchableOpacity
                onPress={() => pickImages()}
                style={{ ...styles.buttonContainer, backgroundColor: "#27292A" }}
            >
                <Text style={styles.buttonText}>Seleccionar Imágen</Text>

            </TouchableOpacity>


        </View>

    );
}






const styles = StyleSheet.create({


    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "white"
    },

    buttonContainer: {
        backgroundColor: '#e75e8d',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})