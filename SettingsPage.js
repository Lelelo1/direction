import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import Dialog from "react-native-dialog";
import * as Animatable from 'react-native-animatable';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
// import { inject, observer } from 'mobx-react';
import ArrowPageModel from './ArrowPageModel';

export default class SettingsPage extends Component {

    static navigationOptions = {
        title: 'Settings'
    }

    state = {
        initialValue: 0,
        distance: this.meterConverter(ArrowPageModel.getInstance().radius),
        enableButton: false,
        showDialog: false,
    }
    componentDidMount() {
        this.setState({ initialValue: ArrowPageModel.getInstance().radius / this.MAX_VALUE });
    }
    setDistance(val) {
        const v = val * this.MAX_VALUE;
        const m = Math.round(v);
        ArrowPageModel.getInstance().radius = m;
        if (m >= this.MAX_VALUE) {
            this.setState({ distance: this.meterConverter(m), enableButton: true });
            this.moreButton.pulse(2000);
        } else {
            this.setState({ distance: this.meterConverter(m), enableButton: false });
        }
    }
    meterConverter(meters) {
        if (meters >= 4000) {
            let km = meters / 1000;
            km = Math.round(km);
            return km + ' km';
        }
        return meters + ' meters';
    }
    MAX_VALUE = 10000;
    renderDialog() {
        return this.state.showDialog ? (<View>
            <Dialog.Container
                visible={true}
                onBackdropPress={() => {
                    this.setState({ showDialog: false });
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
                                newText = newText + text[i];
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
    render() {
        return (
            <View style={{ paddingVertical: verticalScale(30), paddingHorizontal: scale(20), borderRadius: moderateScale(40) }}>

                <Text>Give me results within...</Text>
                <Slider
                    ref={(r) => { this.slider = r; }}
                    minimumValue={0}
                    maximumValue={1}
                    onValueChange={(value) => {
                        this.setDistance(value);
                    }}
                    value={this.state.initialValue}
                />
                <Animatable.View ref={(r) => { this.moreButton = r }} style={{ alignSelf: 'flex-start' }}>
                    <TouchableOpacity
                        style={{ flex: 0, backgroundColor: this.state.enableButton ? '#d8d8d8' : 'transparent', alignSelf: 'flex-start', borderRadius: moderateScale(20) }}
                        disabled={!this.state.enableButton}
                        onPress={() => {
                            this.setState({ showDialog: true });
                        }}
                    >
                        <View style={{ flexDirection: 'row', paddingHorizontal: this.state.enableButton ? scale(12) : 0, paddingVertical: verticalScale(8), alignItems: 'center' }} >
                            <Text>{this.state.distance}</Text>
                            <Icon name={this.state.enableButton ? 'circle-with-plus' : null} size={moderateScale(20)} style={{ paddingLeft: scale(8) }} />
                        </View>
                    </TouchableOpacity>
                </Animatable.View>
                {this.renderDialog()}
            </View>
        );
    }
}