import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import Dialog from "react-native-dialog";
import * as Animatable from 'react-native-animatable';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
// import { inject, observer } from 'mobx-react';
import ArrowPageModel from './ArrowPageModel';
import Utils from './Utils';
import Geolocation from 'react-native-geolocation-service';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

class SettingsPage extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Settings'
        };
    }

    state = {
        initialValue: 0,
        // distance: this.meterConverter(ArrowPageModel.getInstance().radius),
        enableButton: false,
        showRadiusDialog: false,
        showEnterNameDialog: false,
        showError: false
    }

    componentDidMount() {
        ArrowPageModel.getInstance().navigated = 'SettingsPage';
        // this.setState({ initialValue: ArrowPageModel.getInstance().radius / this.MAX_VALUE });
        this.setState({ initialValue: this.setSliderPosition(this.props.arrowPageModel.radius) });
    }
    getDistance() {
        return this.meterConverter(this.props.arrowPageModel.radius);
    }
    setDistance(val) {
        /*
        const v = val * this.MAX_VALUE;
        const m = Math.round(v);
        ArrowPageModel.getInstance().radius = m;
        if (m >= this.MAX_VALUE - 500) { // 500 so that button is available earlier
            this.setState({ distance: this.meterConverter(m), enableButton: true });
            this.moreButton.pulse(2000);
        } else {
            this.setState({ distance: this.meterConverter(m), enableButton: false });
        }
        */
       if (!this.lastVal) this.lastVal = this.state.initialValue;
       const valDif = Math.abs(val - this.lastVal);
       console.log('val: ' + val);
       console.log('lastVal: ' + this.lastVal);
       console.log('valDif: ' + valDif);
        if (valDif > 0.01) {
            const ratio = (this.maxv - this.minv) / (this.maxp - this.minp);
            let radius = Math.exp(this.minv + (ratio * (val - this.minp)));
            radius = Math.round(radius);
            ArrowPageModel.getInstance().radius = radius;
            if (radius > 9500) {
                this.setState({ enableButton: true });
            } else {
                if (this.state.enableButton) {
                    this.setState({ enableButton: false });
                }
            }
            this.lastVal = val;
        }
    }
    
    meterConverter(meters) {
        
        if (meters >= 4000) {
            let km = meters / 1000;
            km = Math.round(km);
            return km + ' km';
        } else if (meters >= 0 && meters <= 10) {
            return 'unspecified';
        }       
        return meters + ' meters';
    }
    // MAX_VALUE = 10000;
    setSliderPosition(radius) {
        // set minv, ... like above
        // ...
        const ratio = (this.maxv - this.minv) / (this.maxp - this.minp);
        return (Math.log(radius) - this.minv) / (ratio + this.minp);
    }
    lastVal = null;
    minp = 0;
    maxp = 1;
    minv = Math.log(300);
    maxv = Math.log(10000);

    renderRadiusDialog() {
        return this.state.showRadiusDialog ? (<View>
            <Dialog.Container
                visible={true}
                onBackdropPress={() => {
                    this.setState({ showRadiusDialog: false });
                }}
            >
                <Dialog.Input
                    placeholder={'kilometers'}
                    keyboardType={'numeric'}
                    onChangeText={(text) => {
                        let newText = '';
                        const numbers = '0123456789';

                        for (let i = 0; i < text.length; i++) {
                            if (numbers.indexOf(text[i]) > -1) {
                                newText += text[i];
                            } else {
                                // your call back function
                                console.log('numbers only!');
                            }
                        }
                        if (newText) {
                            if (newText > 10) {
                                const meters = newText * 1000;
                                this.setState({ distance: this.meterConverter(meters) });
                                ArrowPageModel.getInstance().radius = meters;
                            }
                        } else {
                            // NaN, do nothing since user didn't enter any value for km
                        }
                    }}
                />

            </Dialog.Container>
        </View>)
            :
            null;
    }
    renderEnterNameDialog() {
        const index = this.props.arrowPageModel.predefinedPlaces.length - 1;
        const latestAdded = this.props.arrowPageModel.predefinedPlaces[index];
        return this.state.showEnterNameDialog ? (
            <View>
                <Dialog.Container
                    visible={true}
                    onBackdropPress={() => {
                        // this.setState({ showEnterNameDialog: false }); has to either press ok or cancel
                    }}
                >
                    <Dialog.Description>{latestAdded.address.formatted_address}</Dialog.Description>
                    <Dialog.Input
                        placeholder={'My car, my hotel, my home etc'}
                        onChangeText={(text) => {
                            latestAdded.name = text;
                            latestAdded.description = text; // needed forgoogle placesautocomplete https://github.com/FaridSafi/react-native-google-places-autocomplete#example
                        }}
                        spellCheck={false}
                        autoCorrect={false}
                    />
                    <Dialog.Button
                        label={'Cancel'}
                        onPress={() => { 
                            ArrowPageModel.getInstance().predefinedPlaces.splice(index, 1);
                            console.log('array: ' + ArrowPageModel.getInstance().predefinedPlaces);
                            this.setState({ showEnterNameDialog: false });
                        }}
                    />
                    <Dialog.Button 
                        label={'Ok'}
                        disabled={!latestAdded.name}
                        color={!latestAdded.name ? '#c5ccd8' : this.getDefaultColor()}
                        onPress={() => {
                            // value of name is set from input
                            // ArrowPageModel.getInstance().predefinedPlaces.splice(index, 1); // should not be added to predifinedPlace if no name given. can't happen since disabled
                            this.setState({ showEnterNameDialog: false });
                        }}
                    />
                </Dialog.Container>
            </View>
        )
        :
        null;
    }
    getDefaultColor() {
        if (Platform.OS === 'ios') {
            return '#007ff9';
        } 
        return '#169689'; // is android
    }
    renderError() {
        return this.state.showError ? (
            <View>
                <Dialog.Container
                    visible={true}
                    onBackdropPress={() => {
                        // this.setState({ showError: false }); has to either press ok or cancel
                    }}
                >
                    <Dialog.Description>{JSON.stringify(this.error)}</Dialog.Description>
                    <Dialog.Button
                        label={'Ok'}
                        onPress={() => {
                            this.setState({ showError: false });
                        }}
                    />
                </Dialog.Container>
            </View>
        )
        :
        null;
    }
    render() {
        return (
            <View
            style={{ 
                paddingVertical: verticalScale(30),
                paddingHorizontal: scale(20),
                }}
            >

                <View
                    style={{
                        height: verticalScale(75)
                    }}
                >
                    <Text>Give me results within...</Text>
                    <Slider
                        ref={(r) => { this.slider = r; }}
                        minimumValue={this.minPosition}
                        maximumValue={this.maxPosition}
                        onValueChange={(value) => {
                            this.setDistance(value);
                        }}
                        value={this.state.initialValue}
                        style={{ height: 40 }}
                    />
                    <Animatable.View ref={(r) => { this.moreButton = r }} style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity
                            style={{ flex: 0, backgroundColor: this.state.enableButton ? '#d8d8d8' : 'transparent', alignSelf: 'flex-start', borderRadius: moderateScale(20) }}
                            disabled={!this.state.enableButton}
                            onPress={() => {
                                this.setState({ showRadiusDialog: true });
                            }}
                        >
                            <View style={{ flexDirection: 'row', paddingHorizontal: this.state.enableButton ? scale(12) : 0, paddingVertical: this.state.enableButton ? verticalScale(4) : 0, alignItems: 'center' }} >
                                <Text>{this.getDistance()}</Text>
                                <Icon name={this.state.enableButton ? 'circle-with-plus' : null} size={moderateScale(20)} style={{ paddingLeft: scale(8) }} />
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
                <View 
                    style={{
                        paddingTop: verticalScale(10),
                        flexDirection: 'row',
                        alignItems: 'center'
                        }}
                    >
                    <Text>Find my way back to...</Text>
                    <TouchableOpacity
                        onPress={() => {
                            // get location
                            this.error = null;
                            Geolocation.getCurrentPosition(
                                (position) => {
                                    console.log('position: ' + JSON.stringify(position.coords));
                                    const location = position.coords;
                                    key = 'AIzaSyBIHuu2CVqTKLmahKCE4wmHL3dStmIuViY';
                                    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${key}`)
                                    .then((response) => response.json())
                                    .then((address) => {
                                        console.log('address: ' + JSON.stringify(address)); 
                                        if (address.results[0]) {
                                            console.log('1: ' + JSON.stringify(address.results[0]));
                                            console.log('2: ' + JSON.stringify(address.results[0].formatted_address));
                                            const predefinedPlaces = ArrowPageModel.getInstance().predefinedPlaces;
                                            predefinedPlaces.push({ name: '', description: '', address: address.results[0], geometry: { location: { lat: location.latitude, lng: location.longitude } }, timeCreated: new Date(), isPredefinedPlace: true });
                                            
                                            /*
                                            const items = [];
                                            const predefinedPlace = { name: '', description: '', address: address.results[0], geometry: { location: { lat: location.latitude, lng: location.longitude } }, timeCreated: new Date(), isPredefinedPlace: true };
                                            predefinedPlaces.forEach(p => {
                                                items.push(p);
                                            });
                                            items.push(predefinedPlace);
                                            predefinedPlaces.replace(items);
                                            */

                                            this.setState({ showEnterNameDialog: true });
                                        } else {
                                            this.error = 'did not recive address for this location';
                                            this.setState({ showError: true });
                                        }
                                    }).catch((error) => { this.error = error; this.setState({ showError: true }); });
                                },
                                (error) => {
                                    this.error = error;
                                    this.setState({ showError: true });
                                }
                            );
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'teal',
                                alignSelf: 'flex-start',
                                borderRadius: moderateScale(43) / 2,
                                width: moderateScale(38),
                                height: moderateScale(38),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Icon name={'pin'} size={moderateScale(23)} />
                        </View>
                    </TouchableOpacity>
                </View>
                {this.renderRadiusDialog()}
                {this.renderEnterNameDialog()}
                {this.renderError()}
                {/** also show types */}
            </View>
        );
    }
}
export default inject('arrowPageModel')(observer(SettingsPage));
