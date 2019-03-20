import React, { Component, Fragment } from 'react';
import { View, SafeAreaView, Text, PixelRatio, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import ArrowPageModel from './ArrowPageModel';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale, moderateScale } from 'react-native-size-matters';
import { inject, observer } from 'mobx-react';

class ArrowPage extends Component {
    
    render() {
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0 }} />
                <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <ScrollView contentContainerStyle={{ flex: 1 }}>
                        <GooglePlacesAutocomplete
                            ref={(g) => this.googlePlacesAutocomplete = g}
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
                            listViewDisplayed={false}
                            fetchDetails={true}
                            onPress={(data, details) => {
                                console.log(data, details);
                                ArrowPageModel.getInstance().setDestination(details.geometry.location);
                            }}
                            onClear={() => {
                                console.log('cleared/unselected');
                            }}
                            textInputProps={{ clearButtonMode: 'never' }}
                        />

                        <View style={{ height: 44, width: '100%' }} />
                        <Text>I am below</Text>
                        <TextInput placeholder={'heeeya'} />
                        <View style={{ flex: 1, width: '93%', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>

                            <View style={{ height: scale(200) * (3 / 4) }}>
                                <AutoHeightImage source={require('./arrow.png')} width={scale(200)} style={{ transform: [{ rotate: this.props.arrowPageModel.rotate }] }} />
                            </View>
                            <Text style={{ fontSize: moderateScale(20) }} >amount of meters</Text>
                        </View>
                        <View style={{ width: '93%', alignSelf: 'center' }}>
                            <Text
                                onPress={() => {
                                    console.log('pressed');
                                    this.googlePlacesAutocomplete.setAddressText('');
                                }}
                            >clear</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Left</Text>
                                <Text>Right</Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Fragment>
        );
    }
}

export default inject('arrowPageModel')(observer(ArrowPage));

/**
 * in googleplacesautcomplete
 * make following:
 * setAddressText = address => {
    this.setState({ text: address })
    if(!address) {
      this.props.onClear();
    }
  }

  textinput:
  onChangeText={(text) => {
                this._handleChangeText(text);
                if (!text) {
                  this.props.onClear();
                  console.log('text cleared');
                }
              }}

              so that unselect/clear is detected

              onsubmitediting should close listview:
              onSubmitEditing={() => {
                this.props.onSubmitEditing()
                this.setState({listViewDisplayed: false});
              }}
 */
