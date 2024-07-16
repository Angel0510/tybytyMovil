import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { View, Text, Image, Linking, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import axios from 'axios';


const Banners = () => {

    const [images, setImages] = useState([]);

    const windowWidth = Dimensions.get('window').width;

    const imageWidth = windowWidth * 0.3333;

    const [currentIndex, setCurrentIndex] = useState(0);


    const handleLinkPress = (url) => {

        if (url) {

            Linking.openURL(url);
        }
    };


    useEffect(() => {

        if (currentIndex>0) {

            let nextIndex= currentIndex % images.length;

            if ((images.length - 2) == nextIndex) {

                setCurrentIndex(0);

                flatListRef.scrollToOffset({ offset: 0, animated: true });

            } else {

                flatListRef.scrollToIndex({ index: nextIndex });
            }
        }

    }, [currentIndex])


    useEffect(() => {

        const interval = setInterval(() => {

            if (images.length > 0) {

                setCurrentIndex(prev => (prev + 1));
            }

        }, 6000);


        return () => clearInterval(interval);

    }, [images])


    useEffect(() => {

        setCurrentIndex(0);

        setImages([]);

        axios({

            method: 'post',
            url: 'https://ws.tybyty.com/admin/info/carrusel',
            data: { "lat": "", "lon": "" },
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }

        }).then((response) => {

            if (response.status == 200) {


                let data = response.data.images;

                if (data.length > 0) {

                    let newImages = [];

                    for (let i = 0; i < data.length; i++) {

                        newImages.push({ id: (i + 1), url: data[i].url, image: data[i].image });
                    }

                    setImages([...newImages]);
                }

            }

        }).catch((e) => {


            console.log(e);
        });


    }, []);

    return (

        <Fragment>

            <FlatList
                ref={(ref) => (flatListRef = ref)}
                style={{ position: "absolute", bottom: 0 }}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (

                    <View style={{ flexDirection: "row" }}>

                        <TouchableOpacity style={{ width: imageWidth, height: 75 }} onPress={() => handleLinkPress(item.url)}>

                            <Image source={{ uri: "https://ws.tybyty.com/temp/" + item.image }} style={{ width: '100%', height: "100%" }} />

                        </TouchableOpacity>

                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            
            />

        </Fragment>
    );
};

export default Banners;