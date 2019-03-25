import React, { Component, Fragment } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    PixelRatio,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AutoHeightImage from 'react-native-auto-height-image';
import ArrowPageModel from './ArrowPageModel';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale, moderateScale } from 'react-native-size-matters';
import { inject, observer } from 'mobx-react';
import Utils from './Utils';


class ArrowPage extends Component {
    /*
    static navigationOptions = {
        title: 'Arrow'
    }
    */
    state = {
        canClear: false
    }
    render() {
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                keyboardDismissMode={'none'} // 
                keyboardShouldPersistTaps={'handled'} // neccesary to prevent listview items to have to be pressed twice
                scrollEnabled={false}
            >
                <GooglePlacesAutocomplete
                    ref={(g) => { this.googlePlacesAutocomplete = g; }}
                    placeholder='search'
                    renderDescription={row => row.description}
                    nearbyPlacesAPI='GooglePlacesSearch'
                    query={{
                        key: Utils.getInstance().key,
                        radius: this.props.arrowPageModel.getRadius(),
                        location: '57.708870,11.974560',
                        strictbounds: this.props.arrowPageModel.getRadius() ? 'strictbounds' : undefined,
                        sessiontoken: 'aqse34fr5hnj78l9g4s2svfbm377912kde'
                    }}
                    /* can't use this
                    https://github.com/FaridSafi/react-native-google-places-autocomplete/issues/373
                    GooglePlacesSearchQuery={{
                        type: 'cafe',
                        locationbias: this.props.arrowPageModel.radius
                    }}
                    */
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
                    // predefinedPlaced={this.props.arrowPageModel.predefinedPlaced} dont work
                    listViewDisplayed={false}
                    fetchDetails={true}
                    onPress={(data, details) => {
                        console.log(data, details);
                        ArrowPageModel.getInstance().setDestination(details.geometry.location);
                        this.setState({ canClear: true });
                    }}
                    onClear={() => {
                        ArrowPageModel.getInstance().setDestination(null);
                        this.setState({ canClear: false });
                    }}
                    textInputProps={{ clearButtonMode: 'never' }}
                />

                <View style={{ height: 44, width: '100%' }} />

                <View style={{ alignItems: 'flex-end', paddingTop: moderateScale(11), paddingRight: moderateScale(11) }}>
                    <TouchableOpacity
                        disabled={!this.state.canClear}
                        onPress={() => {
                            this.googlePlacesAutocomplete.setAddressText('');
                            this.setState({ canClear: false });
                        }}
                    >
                        <Icon name={'clear'} size={scale(33)} color={this.state.canClear ? 'black' : 'transparent'} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, width: '93%', alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>

                    <View style={{ height: scale(200) * (3 / 4) }}>
                        <AutoHeightImage
                            source={require('./arrow.png')}
                            width={scale(200)}
                            style={{
                                transform: [{ rotate: this.props.arrowPageModel.rotate }]
                            }}
                        />
                    </View>
                    <Text style={{ fontSize: moderateScale(20) }}>amount of meters</Text>
                </View>
                <View style={{ width: '93%', alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Left</Text>
                        <Text>Right</Text>
                    </View>
                </View>
            </ScrollView>
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

    hiding listview when keyboard dismissed:
    _keyboardDidHide() {
    console.log('hid keyboard');
    this.setState({ listViewDisplayed: false });

    componentWillMound
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    componentWillUnmount
    this.keyboardDidHideListener.remove();
  }
 */
