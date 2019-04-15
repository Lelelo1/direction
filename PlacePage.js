import React, { Component } from 'react';
import { View, Text, Switch, Dimensions, TouchableOpacity, ScrollView, Animated, Easing, ImageBackground } from 'react-native';
import { inject, observer } from 'mobx-react';
import PlacePageModel from './PlacePageModel';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import Swiper from 'react-native-swiper';
import AutoHeightImage from 'react-native-auto-height-image';
import * as Animatable from 'react-native-animatable';
import { decorate } from 'mobx-state-tree';
import { observable } from 'mobx';
import Clock from 'react-native-vector-icons/AntDesign';
import Home from 'react-native-vector-icons/MaterialCommunityIcons';
import Phone from 'react-native-vector-icons/Entypo';
import Google from 'react-native-vector-icons/FontAwesome5';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import Accordion from 'react-native-collapsible/Accordion'; // not using
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog';
import { Header } from 'react-navigation';
import { Card, Divider } from 'react-native-elements';

class PlacePage extends Component {

    static navigationOptions = ({ navigation }) => {
        
        return {
            title: 'Place',
        };
    }
    state = {
        showClockIcon: false,
        scrollEnabled: false,
    }
// infoPlace destinationVisited or destination depending on pagetype given in naviagtion prop
    componentDidMount() {
        // console.log(JSON.stringify(this.props.placePageModel.place));
        this.didFocus = this.props.navigation.addListener('didFocus', () => {
            if (this.props.navigation.state.params) {
                // was infoPlace
                // console.log('did focus ' + JSON.stringify(this.props.placePageModel.place));
                SwipeNavigationPageModel.getInstance().showListViewOnReturn
                 = this.props.navigation.state.params.showListViewOnReturn; // setting listview to proper value on return to arrowPage
                SwipeNavigationPageModel.getInstance().showPlaceInfoButton = false;
            }         
        });
    }

    windowWidth = Dimensions.get('window').width;
    swiperWidth = scale(this.windowWidth - scale(30));
    renderSlides() {
        // console.log('renderingSlides');
        const photos = this.props.placePageModel.place.details.photos;
        return photos.map(photo => {
            // console.log('image: ' + JSON.stringify(photo));
            const c = (
                <View key={photo.photo_reference} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <AutoHeightImage source={{ uri: photo.url }} width={this.swiperWidth - scale(80)} height={190} />
                </View>
            );
            // c.key = photo.photo_reference;
            return c;
        });
    }
    renderSwiper() {
        return (
            <View
                style={{ height: 190, justifyContent: 'center', marginVertical: verticalScale(30) }}
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
        // console.log('images: ' + JSON.stringify(this.props.placePageModel.place.details.photos));
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
                        this.setState({ showClockIcon: !this.state.showClockIcon });
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
                        {this.state.showClockIcon ? <Clock name={'clockcircleo'} size={moderateScale(17)} /> : null }
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
    screenWidth = Dimensions.get('window').width;
    renderTimeTable(openingHours) {
        // console.log('table: ' + JSON.stringify(openingHours.periods));
        if (openingHours.periods) {
            return this.state.showClockIcon ? (
                <Animatable.View
                    style={{
                        width: scale(260),
                        height: verticalScale(120),
                        borderWidth: 3,
                        borderColor: 'grey',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: verticalScale(10),
                        zIndex: 1,
                    }}
                >
                    <Text style={{ fontSize: moderateScale(20), alignSelf: 'center' }}>Opening hours</Text>
                    <Text style={{ alignSelf: 'center' }}>{this.periodsToString(openingHours.periods)}</Text>
                </Animatable.View>
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
    renderOpeningHours() {
        const openingHours = this.props.placePageModel.place.details.opening_hours;
        // console.log('openingHours: ' + JSON.stringify(openingHours));
        if (openingHours) {
            return (
                <View
                    // style={{ paddingTop: verticalScale(13), paddingBottom: verticalScale(20) }}
                >
                    {this.renderClockButton(openingHours.open_now)}
                    <Dialog
                        visible={this.state.showClockIcon}
                        onTouchOutside={() => {
                            this.setState({ showClockIcon: false });
                        }}
                    >
                        <DialogTitle title={<Text>Opening hours</Text>} />
                        <DialogContent>
                            <View style={{ width: scale(250), height: verticalScale(140), justifyContent: 'center' }}>
                                <Text style={{ alignSelf: 'center' }}>{this.periodsToString(openingHours.periods)}</Text>
                            </View>
                        </DialogContent>
                    </Dialog>
                </View>
            );
        }
        return null;
    }
    // {this.renderTimeTable(openingHours)}
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
    renderGoButton() {
        return this.props.navigation.state.params.pageType === 'infoPlace' ? (
            <TouchableOpacity
                style={{
                    // marginTop: moderateScale(30), 
                    width: moderateScale(240),
                    height: moderateScale(60),
                    borderRadius: 45,
                    backgroundColor: 'blue',
                    alignSelf: 'center',
                    opacity: 0.7
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                    <Text
                        style={{ fontSize: moderateScale(20), fontWeight: 'bold', color: 'white' }}
                    >Go</Text>
                </View>
            </TouchableOpacity>
        )
        :
        null; // is destination or destinationVisited page
    }
    other = { paddingTop: verticalScale(80), flex: 1 }
    renderReviewButton() {
        const reviews = this.props.placePageModel.place.details.reviews;
        if (reviews) {
            return reviews.length > 0 ? (
                <TouchableOpacity
                    style={{
                        backgroundColor: '#16bf2a',
                        width: moderateScale(100), 
                        height: moderateScale(50), 
                        borderRadius: 45,
                        opacity: 0.6
                    }}
                    onPress={() => {
                        if ((this.scrollY > 0 && this.scrollY < 10) || !this.scrollY) {
                            this.setState({ scrollEnabled: true }, () => {
                                setTimeout(() => {
                                    this.scrollView.scrollToEnd({ animated: true });
                                }, 100);
                            });
                        } else {
                            this.scrollUp();
                        }
                    }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Read reviews</Text>
                    </View>
                </TouchableOpacity>
            )
            :
            null;
        }
        return null;
    }
    renderWebsiteButton() {
        const website = this.props.placePageModel.place.details.website;
        return website ? (
            <TouchableOpacity>
                <Home size={moderateScale(35)} name={'home-circle'} />
            </TouchableOpacity>
        )
        :
        null;
    }
    renderPhoneButton() {
        const phone = this.props.placePageModel.place.details.international_phone_number;
        return phone ? (
            <TouchableOpacity>
                <Phone size={moderateScale(35)} name={'phone'} />
            </TouchableOpacity>
        )
        :
        null;
    }
    renderGoogleButton() {
        const google = this.props.placePageModel.place.details.url;
        return google ? (
            <TouchableOpacity>
                <Google size={moderateScale(45)} name={'google'} />
            </TouchableOpacity>
        )
        :
        null;
    }
    renderBottomArea() {
        return (
            <ImageBackground source={require('./path.png')} style={{ flex: 1, width: undefined, height: undefined }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        // backgroundColor: '#725132',
                        // paddingVertical: moderateScale(20),
                        paddingTop: verticalScale(15),
                        paddingBottom: verticalScale(55)

                    }}

                >
                    {/*  mail, phone, website, google  */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            width: '90%',
                            borderWidth: 2,
                            borderColor: 'black',
                            backgroundColor: '#dce2ed',
                            shadowColor: 'grey',
                            shadowOffset: { width: 3, height: 8 },
                            shadowOpacity: 0.8,
                            shadowRadius: 20,
                            alignContent: 'center',
                            alignItems: 'center',
                            paddingVertical: verticalScale(12),
                            opacity: 0.7
                        }}
                    >
                        {this.renderPhoneButton()}
                        {this.renderGoogleButton()}
                        {this.renderWebsiteButton()}
                    </View>
                    {this.renderGoButton()}
                    {this.renderReviewButton()}
                </View>
            </ImageBackground>
        );
    }
    reviews(reviews) {
        return reviews.map((review) => {
            let r = null;
            if (review.text) {
                r = <Text key={review.time}>{review.text}</Text>;
            }
            return r;
        });
    }
    renderReviews() {
        const reviews = this.props.placePageModel.place.details.reviews; // already checked via scrollenabled reviewButton
        return this.state.scrollEnabled ? (
            <View style={{ flex: 1 }}>
                {this.reviews(reviews)}
            </View>
        )
        :
        null;
    }

    scrollUp() {
        console.log('scrollY: ' + this.scrollY);
        if (!this.scrollY) this.scrollY = 0;

        const animatedValue = new Animated.Value(this.scrollY);
        const id = animatedValue.addListener(({ value }) => {
            this.scrollView.scrollTo({ x: 0, y: value, animated: false });
        });
        Animated.timing(animatedValue, { toValue: 0, duration: 250, easing: Easing.linear })
        .start(() => { animatedValue.removeListener(id); });
    }
    renderTitleArea() {
        return (
            <View style={{ width: '100%', height: moderateScale(90) }}>
                <View style={{ width: '75%', alignSelf: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: moderateScale(22), textAlign: 'center' }}>{this.props.placePageModel.place.details.name}</Text>
                </View>
                <Text style={{ marginTop: verticalScale(5), alignSelf: 'center' }}>{this.props.placePageModel.place.details.formatted_address}</Text>
            </View>
        );
    }
    renderTopArea() {
        return (
            <View style={{ width: '100%', height: moderateScale(130), justifyContent: 'space-around' }}>
                {this.renderTitleArea()}
                {this.renderOpeningHours()}
            </View>
        );
    }
    windowHeight = Dimensions.get('window').height;
    render() {
        console.log('render placePage: ' + JSON.stringify(this.props.placePageModel.place));
        return (
            <ScrollView
                ref={(ref) => { this.scrollView = ref; }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={this.state.scrollEnabled}
                onScroll={(event) => {
                    this.scrollY = event.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
                
            >
                <View style={{ height: (this.windowHeight - Header.HEIGHT) }}>
                    <View style={{ height: '52%' }}>
                        {this.renderTopArea()}
                        {this.renderSwiperArea()}
                    </View>
                    {this.renderBottomArea()}
                </View>
                {this.renderReviews()}
                {this.renderIcon()}
            </ScrollView>
        );
    }
}

export default inject('placePageModel')(observer(PlacePage));
