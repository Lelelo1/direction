import React, { Component, Fragment } from 'react';
import { View, SafeAreaView, Text, PixelRatio } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ArrowPageModel from './ArrowPageModel';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale, moderateScale } from 'react-native-size-matters';
import { inject, observer } from 'mobx-react';

class ArrowPage extends Component {
    renderView() {
        return <View style={{ backgroundColor: 'grey', height: 200 }}></View>
    }
    render() {
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0 }} />
                <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', }}>
                    <GooglePlacesAutocomplete
                        placeholder='search'
                        renderDescription={row => row.description}
                        query={{
                            key: 'AIzaSyBIHuu2CVqTKLmahKCE4wmHL3dStmIuViY',
                            radius: 1000,
                            location: '57.708870,11.974560',
                            strictbounds: 'strictbounds',
                            sessiontoken: 'aqse34fr5hnj78l9g4s2svfbm377912kde'
                        }}
                        styles={{
                            // to place suggestions on top
                            container: {
                                flex: 0,
                                position: 'absolute',
                                width: '100%',
                                zIndex: 1,
                            },
                            listView: {
                                backgroundColor: 'white'
                            },
                            // just for styling
                            textInputContainer: {
                                backgroundColor: 'white',
                                height: 44,
                                borderTopColor: '#7e7e7e',
                                borderBottomColor: '#b5b5b5',
                                borderTopWidth: 1 / PixelRatio.get(),
                                borderBottomWidth: 1 / PixelRatio.get(),
                                flexDirection: 'row',
                            },
                            row: {
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                backgroundColor: '#f9f9f9'
                            },
                            poweredContainer: {
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                backgroundColor: '#efefef',
                            }
                            }}
                            fetchDetails={true}
                            onPress={(data, details) => {
                                console.log(data, details);
                                console.log('location: ' +  JSON.stringify(details.geometry.location));
                                ArrowPageModel.getInstance().setDestination(details.geometry.location);
                            }
                        }
                    />
                    <View style={{ flex: 1, width: '93%', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                        <View style={{ height: scale(250) * (3/4) }}>
                        <AutoHeightImage source={require('./arrow.png')} width={scale(250)} style={{ transform: [{ rotate: this.props.arrowPageModel.rotate }] }} />
                        </View>
                        <Text style={{ fontSize: moderateScale(20) }} >amount of meters</Text>
                    </View>
                    <View style={{ width: '93%', alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Left</Text>
                            <Text>Right</Text>
                        </View>
                    </View>

                </SafeAreaView>
            </Fragment>
        );
    }
}

export default inject('arrowPageModel')(observer(ArrowPage));
