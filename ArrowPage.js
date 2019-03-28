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
// import Swipeout from 'react-native-swipeout';
import Qs from 'qs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlaceIcon from 'react-native-vector-icons/Foundation';
import AutoHeightImage from 'react-native-auto-height-image';
import ArrowPageModel from './ArrowPageModel';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale, moderateScale } from 'react-native-size-matters';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import Utils from './Utils';
import PlacePageModel from './PlacePageModel';

class ArrowPage extends Component {
    /*
    static navigationOptions = {
        title: 'Arrow'
    }
    */

    componentDidMount() {
        this.listener = this.props.navigation.addListener('didFocus', () => {
            if (!this.props.arrowPageModel.naigated !== 'SettingsPage') { // if placepage user should return to listview again if it was opened
                console.log('didFocus');
                this.googlePlacesAutocomplete.listViewDisplayed = true;
                this.googlePlacesAutocomplete.triggerFocus();
            }
        });
    }
    componentWillUnmount() {
        this.listener.remove();
    }
    renderSwipeoutButtons(rowData) {
        console.log('render');
        /*
        return [
            {
                text: 'press',
                onPress: () => {
                    console.log('rowData: ' + JSON.stringify(rowData));
                    fetch('https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
                        key: Utils.getInstance().key,
                        placeid: rowData.place_id
                        // language: this.props.query.language,
                    })).then((response) => response.json()).then((details) => {
                        console.log('details: ' + JSON.stringify(details));
                    });
                    
                    // console.log('details: ' + JSON.stringify(this.selectedItem.details));
                }
            }
        ];*/
        return [
            {
                component: (
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <PlaceIcon name={'info'} size={33} />
                    </View>
                )
                
            }
        ];
    }
    render() {
        // canClear might cause rerender so that googleplacestranslate is set to auto thus showing listview
        return (
            <View
                style={{ flex: 1 }}
            
                /*
                Srcollview not needed anymore
                contentContainerStyle={{ flex: 1 }}
                keyboardDismissMode={'none'} // 
                keyboardShouldPersistTaps={'handled'} // neccesary to prevent listview items to have to be pressed twice
                scrollEnabled={false}
                */
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
                    predefinedPlaces={this.props.arrowPageModel.predefinedPlaces}
                    predefinedPlacesAlwaysVisible={true}
                    listViewDisplayed={false}
                    fetchDetails={true}
                    onPress={(data, details) => {
                        console.log(JSON.stringify(data), JSON.stringify(details));
                        ArrowPageModel.getInstance().setDestination(details.geometry.location);

                    }}
                    onLongPress={(data, details) => {
                        console.log('long hold: ' + JSON.stringify(data), JSON.stringify(details));
                        SwipeNavigationPageModel.getInstance().showPlaceInfoButton = false; // cancel previous animation when long pressing fast on different items
                        PlacePageModel.getInstance().place = { data, details };
                        SwipeNavigationPageModel.getInstance().showPlaceInfoButton = true;
                    }}
                    onClear={() => {
                        ArrowPageModel.getInstance().setDestination(null);
                    }}
                    textInputProps={{ clearButtonMode: 'never' }}
                    renderSwipeoutButtons={(rowData) => this.renderSwipeoutButtons(rowData)}
                    buttonWidth={scale(55)}
                    onSwipeoutScroll={(scrollEnabled) => {
                        SwipeNavigationPageModel.getInstance().scrollEnabled = scrollEnabled; //using setState with value didn't work
                    }}
                    
                />

                <View style={{ height: 44, width: '100%' }} />

                <View style={{ alignItems: 'flex-end', paddingTop: moderateScale(11), paddingRight: moderateScale(11) }}>
                    <TouchableOpacity
                        disabled={!this.props.arrowPageModel.isShowingDirection}
                        onPress={() => {
                            this.googlePlacesAutocomplete.setAddressText('');
                            ArrowPageModel.getInstance().setDestination('');
                        }}
                    >
                        <Icon name={'clear'} size={scale(33)} color={this.props.arrowPageModel.isShowingDirection ? 'black' : 'transparent'} />
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
            </View>
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
