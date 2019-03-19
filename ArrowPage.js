import React, { Component, Fragment } from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale } from 'react-native-size-matters';

export default class ArrowPage extends Component {
    renderView() {
        return <View style={{ backgroundColor: 'grey', height: 200 }}></View>
    }
    render() {
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0 }} />
                <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', }}>
                    <GooglePlacesAutocomplete
                        placeholder='hey'
                        renderDescription={row => row.description}
                        query={{
                            key: 'AIzaSyBIHuu2CVqTKLmahKCE4wmHL3dStmIuViY',
                            radius: 1000,
                            location: '-33.8670522,151.1957362'
                        }}
                        styles={{
                            container: {
                                flex: 0,
                                position: 'absolute',
                                width: '100%',
                                zIndex: 1,
                            },
                            listView: {
                                backgroundColor: 'white'
                            }
                        }}
                    />
                    <View style={{ flex: 1, width: '95%', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                        <AutoHeightImage source={require('./arrow.png')} width={scale(250)} style={{ transform: [{ rotate: '180deg' }] }} />
                    </View>
                </SafeAreaView>
            </Fragment>
        );
    }
}
/*
<GooglePlacesAutocomplete
                placeholder='hey'
                renderDescription={row => row.description}
                query={{
                    key: 'AIzaSyBIHuu2CVqTKLmahKCE4wmHL3dStmIuViY',
                    radius: 1000,
                    location: '-33.8670522,151.1957362'
                }}
                styles={{
                    container: {
                        backgroundColor: 'purple',
                        // maxHeight: '100%'
                        flex: 0,
                    },
                    listView: {
                        height: 300,
                        backgroundColor: 'red'
                    },
                    poweredContainer: {
                        backgroundColor: 'blue'
                    },
                    row: {
                        backgroundColor: 'green'
                    }
                }}
                listViewDisplayed='false'
                />
*/
/** / ocupies area even though list view isen't displaying
 * <GooglePlacesAutocomplete
                placeholder='heeeey'
                renderDescription={row => row.description}
                query={{
                    key: 'AIzaSyBIHuu2CVqTKLmahKCE4wmHL3dStmIuViY',
                    radius: 1000,
                    location: '-33.8670522,151.1957362'
                }}
                style={{ backgroundColor: 'yellow', height: 300 }}
                />
 */