import React, { Component } from 'react';
import { View, Text, Switch, Dimensions, TouchableOpacity, } from 'react-native';
import { inject, observer } from 'mobx-react';
import PlacePageModel from './PlacePageModel';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import Swiper from 'react-native-swiper';
import AutoHeightImage from 'react-native-auto-height-image';
import * as Animatable from 'react-native-animatable';
import { decorate } from 'mobx-state-tree';
import { observable } from 'mobx';
import Clock from 'react-native-vector-icons/AntDesign';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import Accordion from 'react-native-collapsible/Accordion'; // not using

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class PlacePage extends Component {

    static navigationOptions = ({ navigation }) => {
        
        return {
            title: 'Place'
        };
    }

    componentDidMount() {
        // console.log(JSON.stringify(this.props.placePageModel.place));
        this.didFocus = this.props.navigation.addListener('didFocus', () => {
            if (this.props.navigation.state.params) {
                // was infoPlace
                SwipeNavigationPageModel.getInstance().showListViewOnReturn
                 = this.props.navigation.state.params.showListViewOnReturn; // setting listview to proper value on return to arrowPage
                SwipeNavigationPageModel.getInstance().showPlaceInfoButton = false;
            }
        });
    }

    shouldShowSwitch = false

    swiperWidth = scale(screenWidth - scale(30));
    renderSlides() {
        console.log('renderingSlides');
        const photos = this.props.placePageModel.place.details.photos;
        return photos.map(photo => {
            // console.log('image: ' + JSON.stringify(photo));
            const c = (
                <View key={photo.photo_reference} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AutoHeightImage source={{ uri: photo.url }} width={this.swiperWidth - scale(80)} height={180} />
                </View>
            );
            // c.key = photo.photo_reference;
            return c;
        });
    }
    renderSwiper() {
        return (
            <View
                style={{ height: 190, justifyContent: 'center' }}
            >
                <Swiper
                    loop={false} // need set false otherwise last index shown on rerender https://maps.googleapis.com/maps/api/place/photo?maxwidth=946&photoreference=CmRaAAAAMB76EjM8gsuRpqQTy6uEaQn0Ua-n9QT5ibV-o5QSYGU0Ce2fokFa6U7CMy-qSY9CqDrdWFNBHyO8-FCbTg3IDBWP_sfj_TmTVVq5BJ-mp88h3eo63nFVpp8OtsZZxEt1EhC4eTACpDG03-We4LkgTlaLGhQbXFORsmFPCdX1tLljGBJVplffzw&key=AIzaSyBIHuu2CVqTKLmahKCE4wmHL3dStmIuViY
                    showsButtons={true}
                    showsPagination={false}
                    autoplay={false}
                    width={this.swiperWidth}
                    // height={20} // can't set height https://github.com/leecade/react-native-swiper/issues/718
                    removeClippedSubviews={false} // to prevent https://github.com/leecade/react-native-swiper/issues/416
                >
                    {this.renderSlides()}
                </Swiper>
            </View >

        );
    }
    renderSwiperArea() {
        if (!this.props.placePageModel.place.details.photos) {
            // console.log('no photos');
        } else {
            // console.log('has photos');
        }
        console.log('images: ' + JSON.stringify(this.props.placePageModel.place.details.photos));
        return this.props.placePageModel.place.details.photos ? (
            this.renderSwiper()
        )
        :
        null;
    }
    clockButtonStyle = {
        open: {
            backgroundColor: 'green'
        },
        closed: {
            backgroundColor: 'red'
        }
    }
    renderClockButton(openNow) {
        return (
            <Animatable.View>
                <TouchableOpacity
                    onPress={() => {
                        PlacePageModel.getInstance().showClockIcon = !this.props.placePageModel.showClockIcon;
                        // console.log('showClockIcon was set to: ' + PlacePageModel.getInstance().showClockIcon);
                    }}
                >
                    
                    <View
                        style={[{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: moderateScale(45),
                            padding: moderateScale(3),
                            alignSelf: 'center'
                        },
                            openNow ? this.clockButtonStyle.open : this.clockButtonStyle.closed
                        ]}
                    >
                        {this.props.placePageModel.showClockIcon ? <Clock name={'clockcircleo'} size={moderateScale(17)} /> : null }
                        <Text style={{ paddingLeft: moderateScale(3), fontSize: moderateScale(15) }}>{openNow ? 'open' : 'closed'}</Text>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        );
    }
    periodsToString(periods) {
        let monday = 'Monday: unspecified. ';
        let tuesday = 'Tuesday: unspecified. ';
        let wednesday = 'Wednesday: unspecified. ';
        let thursday = 'Thursday: unspecified. ';
        let friday = 'Friday: unspecified. ';
        let saturday = 'Saturday: unspecified. ';
        let sunday = 'Sunday: unspecified';
        try {
            monday = `Monday: ${this.formatTime(periods[1].open.time)}` + ' - ' + `${this.formatTime(periods[1].close.time)}. `;
        } catch (exception) {
            console.log('periodsToStringError: ' + exception);
        }
        try {
            tuesday = `Tuesday: ${this.formatTime(periods[2].open.time)}` + ' - ' + `${this.formatTime(periods[2].close.time)}. `;
        } catch (exception) {
            console.log('periodsToStringError: ' + exception);
        }
        try {
            wednesday = `Wednesday: ${this.formatTime(periods[3].open.time)}` + ' - ' + `${this.formatTime(periods[3].close.time)}. `;
        } catch (exception) {
            console.log('periodsToStringError: ' + exception);
        }
        try {
            thursday = `Thursday: ${this.formatTime(periods[4].open.time)}` + ' - ' + `${this.formatTime(periods[4].close.time)}. `;
        } catch (exception) {
            console.log('periodsToStringError: ' + exception);
        }
        try {
            friday = `Friday: ${this.formatTime(periods[5].open.time)}` + ' - ' + `${this.formatTime(periods[5].close.time)}. `;
        } catch (exception) {
            console.log('periodsToStringError: ' + exception);
        }
        try {
            saturday = `Saturday: ${this.formatTime(periods[6].open.time)}` + ' - ' + `${this.formatTime(periods[6].close.time)}. `;
        } catch (exception) {
            console.log('periodsToStringError: ' + exception);
        }
        try {
            sunday = `Sunday: ${this.formatTime(periods[0].open.time)}` + ' - ' + `${this.formatTime(periods[0].close.time)}`;
        } catch (exception) {
            console.log('periodsToStringError: ' + exception);
        }
        // handle days where its closed somehow
        const week = monday + tuesday + wednesday + thursday + friday + saturday + sunday;
        return week;
    }
    formatTime(time) {
        return time.slice(0, 2) + ':' + time.slice(2, 4);
    }
    renderTimeTable(openingHours) {
        // console.log('table: ' + JSON.stringify(openingHours.periods));
        if (openingHours.periods) {
            return this.props.placePageModel.showClockIcon ? (
                <View style={{ margin: moderateScale(10) }}>
                    <Text>Opening hours</Text>
                    <Text>{this.periodsToString(openingHours.periods)}</Text>
                </View>
            )
            :
            null; // show toast does not have time table etc...
        }
    }
    /*
    openingHoursAreaStyle = {
        open: {
            paddingVertical: verticalScale(80)
        },
        close: {
            paddingBottom: verticalScale(40)
        }
    }
    */
    renderOpeningHoursArea() {
        const openingHours = this.props.placePageModel.place.details.opening_hours;
        console.log('openingHours: ' + JSON.stringify(openingHours));
        if (openingHours) {
            return (
                <View
                    style={{ paddingTop: verticalScale(10), height: verticalScale(160), paddingBottom: verticalScale(20) }}
                >
                    {this.renderClockButton(openingHours.open_now)}
                    {this.renderTimeTable(openingHours)}
                </View>
            );
        }
        return null;
    }
    renderIcon() {
        const icon = this.props.placePageModel.place.details.icon;
        return icon ? (
            <View
                style={{
                    position: 'absolute',
                    marginTop: verticalScale(8),
                    paddingRight: scale(40),
                    alignSelf: 'flex-end',
                    width: moderateScale(25),
                    height: moderateScale(25)
                }}
            >
                <AutoHeightImage source={{ uri: icon }} width={moderateScale(25)} />
            </View>
        )
        :
        null;
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', paddingTop: verticalScale(8) }}>
                    <Text style={{ fontSize: moderateScale(22) }}>{this.props.placePageModel.place.details.name}</Text>
                    <Text style={{ paddingTop: verticalScale(5) }}>{this.props.placePageModel.place.details.formatted_address}</Text>
                    {this.renderOpeningHoursArea()}
                    {this.renderSwiperArea()}
                    {this.renderIcon()}
                </View>
        );
    }
}

export default inject('placePageModel')(observer(PlacePage));
