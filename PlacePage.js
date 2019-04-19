import React, { Component } from 'react';
import { View, Text, Switch, Dimensions, TouchableOpacity, ScrollView, Animated, Easing, ImageBackground } from 'react-native';
import { inject, observer } from 'mobx-react';
import PlacePageModel from './PlacePageModel';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
// import Swiper from 'react-native-swiper';
import AutoHeightImage from 'react-native-auto-height-image';
import * as Animatable from 'react-native-animatable';
import { observable } from 'mobx';
import Clock from 'react-native-vector-icons/AntDesign';
import Home from 'react-native-vector-icons/MaterialCommunityIcons';
import Phone from 'react-native-vector-icons/Entypo';
import Google from 'react-native-vector-icons/FontAwesome5';
import UserMoney from 'react-native-vector-icons/FontAwesome';
import Right from 'react-native-vector-icons/AntDesign';
import { verticalScale, moderateScale, scale } from 'react-native-size-matters';
import Accordion from 'react-native-collapsible/Accordion'; // not using
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog';
import { Header } from 'react-navigation';
// import { Card, Divider } from 'react-native-elements'; remove
import StarRating from 'react-native-star-rating';
// import { GiftedChat,Bubble } from "react-native-gifted-chat"; how to use?
import Carousel from 'react-native-snap-carousel';
import Swiper from './Swiper';

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
    getPriceLevel(number) {
        switch (number) {
            case 0 : {
                return 'Free';
            }
            case 1 : {
                return 'Inexpensive';
            }
            case 2 : {
                return 'Moderate';
            }
            case 3 : {
                return 'Expensive';
            }
            case 4 : {
                return 'Very Expensive';
            }
            default : {
                return 'Unspecified';
            }
        }
    }
    renderPriceLevel() {
        const priceLevel = this.props.placePageModel.place.details.price_level;
        return priceLevel ? (
            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'rgba(186, 152, 111, 0.7)',
                    alignSelf: 'center',
                    borderRadius: 10,
                    padding: moderateScale(2),
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        // backgroundColor: 'rgba(140, 105, 64, 0.4)',
                        padding: moderateScale(2),
                        paddingBottom: 0,
                        alignItems: 'center'
                    }}
                >
                    <UserMoney name={'money'} size={moderateScale(20)} />
                    <Text style={{ paddingLeft: moderateScale(2) }}>Price level</Text>
                </View>
                <Text style={{ fontWeight: 'bold', fontSize: moderateScale(16), padding: moderateScale(2) }}>{this.getPriceLevel(priceLevel)}</Text>
            </View>

        )
        :
        null;
    }
    windowWidth = Dimensions.get('window').width;
    // swiperWidth = scale(this.windowWidth - scale(30));
    // refractored
    renderSlides() {
        // console.log('renderingSlides');
        const photos = this.props.placePageModel.place.details.photos;
        if (photos) {
            if (photos.length > 0) {
                return photos.map(photo => {
                    // console.log('image: ' + JSON.stringify(photo));
                    const c = (
                        <View key={photo.photo_reference} style={{ flex: 1, alignItems: 'center' }}>
                            <AutoHeightImage source={{ uri: photo.url }} width={this.swiperWidth - scale(80)} height={190} />
                        </View>
                    );
                    // c.key = photo.photo_reference;
                    return c;
                });
            } else {
                // unexpected details reponse. photos was not array
            }
        }
        // render empty area...
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/*<AutoHeightImage source={{ uri: photo.url }} width={this.swiperWidth - scale(80)} height={190} />*/}
            </View>
        );
    }
    /*
    renderSwiperArea() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <View
                    style={{ height: 190, justifyContent: 'flex-start' }}
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
                {this.renderPriceLevel()}
            </View>

        );
    }
    */
    swiperWidth = scale(this.windowWidth - scale(30));
    carouselIndex = 0;
    getSnapCarousel() {
        let photos = this.props.placePageModel.place.details.photos;
        photos = photos.map(photo => { photo.uri = photo.url; return photo; });
        return photos ? ( // wrapped in view so that if no photos present it still take up the area
            <Swiper data={photos} showButtons={true} />
        )
        :
        (
            <View style={{ flex: 1 }} />
        );
    }
    renderSnapCarouselArea() {
        return (
            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                {this.getSnapCarousel()}
                {this.renderPriceLevel()}
            </View>
        );
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
                            <View style={{ margin: moderateScale(20), justifyContent: 'center' }}>
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
                        opacity: 0.7
                    }}
                    onPress={() => {
                        if ((this.scrollY > 0 && this.scrollY < 10) || !this.scrollY) {
                            
                            this.setState({ scrollEnabled: true }, () => {
                                setTimeout(() => {
                                    // this.scrollView.scrollToEnd({ animated: true });
                                    this.scrollTo(this.)
                                }, 100);
                            });
                            
                           /*
                           // scroll bottom
                            const animatedValue = new Animated.Value(this.scrollH);
                            const id = animatedValue.addListener(({ value }) => {
                                console.log('value: ' + value);
                                this.scrollTo(value); // scroll to bottom
                            });
                            this.scrollView.addListenerOn() = (w, h) => {
                                console.log('setValue: ' + h);
                                animatedValue.setValue(h);
                                // animatedValue.removeListener(id);
                            };
                            this.setState({ scrollEnabled: true });
                            */
                        } else {
                            /*
                            this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
                            this.setState({ scrollEnabled: false });
                            can't need callback
                            */
                            this.scrollTo(0);
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
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        // backgroundColor: '#725132',
                        // marginVertical: moderateScale(10)

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
    getRateColor(number) {
        const opacity = 0.6;
        switch (number) {
            case 1 : {
                return `rgba(198, 13, 13, ${opacity})`;
            }
            case 2 : {
                return `rgba(234, 143, 39, ${opacity})`;
            }
            case 3 : {
                return `rgba(226, 198, 34, ${opacity})`;
            }
            case 4: {
                return `rgba(152, 221, 35, ${opacity})`;
            }
            case 5: {
                return `rgba(74, 178, 14, ${opacity})`;
            }
            default : {
                return 'grey';
            }
        }
    }
    reviews(reviews) {
        console.log('reviewss:' + JSON.stringify(reviews));
        return reviews.map((review) => {
            let r = (
                <View
                key={review.time}
                    style={{
                        flex: 1,
                        paddingHorizontal: scale(24),
                        justifyContent: 'space-between',
                        borderBottomWidth: moderateScale(2), // add same to top of parent view
                        borderHorizontalWidth: moderateScale(2),
                        borderColor: 'grey'
                    }}
                >
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', padding: moderateScale(8) }}>
                        <StarRating rating={review.rating} starSize={moderateScale(25)} fullStarColor={this.getRateColor(review.rating)}/>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#e8e8e8', padding: moderateScale(10), borderRadius: 10 }}>
                        <Text>{review.text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: moderateScale(10), alignItems: 'center' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: 'rgba(161, 198, 209, 0.6)', alignItems: 'center', borderRadius: 10 }}>
                            <UserMoney style={{ margin: moderateScale(5) }} name={'user-circle'} size={moderateScale(18)} />
                            <Text style={{ margin: moderateScale(3) }}>{review.author_name}</Text>
                            <Right style={{ margin: moderateScale(5) }} name={'right'} size={moderateScale(18)} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
            return r;
        });
    }
    /*
    r = <Text key={review.time}>{review.text}</Text>;
    */
   /*
    getMessages(reviews) {
        return reviews.map(review => {
            const utcSeconds = review.time;
            const date = new Date(0); // The 0 there is the key, which sets the date to the epoch
            date.setUTCSeconds(utcSeconds);

            let name = 'Anonymous';
            if (review.author_name) {
                name = review.author_name;
            }
            const message = {
                _id: review.time + Math.round(Math.random() * 1000000),
                text: review.text,
                createdAt: date,
                user: {
                    _id: review.time + Math.round(Math.random() * 1000000),
                    name
                },
            };
            return message;
        });
   }
   */
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
/*
    (
            <View style={{ flex: 1 }}>
                {this.reviews(reviews)}
            </View>
        )
*/
    scrollTo(y) {
        if (!this.scrollY) this.scrollY = 0;
        console.log('from scrollY: ' + this.scrollY);
        console.log('to: ' + y);
        const animatedValue = new Animated.Value(this.scrollY);
        const id = animatedValue.addListener(({ value }) => {
            this.scrollView.scrollTo({ x: 0, y: value, animated: false });
        });
        Animated.spring(animatedValue, { toValue: y }).start(() => { animatedValue.removeListener(id); /* finished callback */ });
    }

    /*
        Animated.timing(animatedValue, { toValue: 0, duration: 250, easing: Easing.linear })
        .start(() => { animatedValue.removeListener(id); });
    */
    renderTitleArea() {
        return (
            <View style={{ width: '100%', paddingTop: moderateScale(4), paddingBottom: moderateScale(20) }}>
                <View style={{ width: '75%', alignSelf: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: moderateScale(22), textAlign: 'center' }}>{this.props.placePageModel.place.details.name}</Text>
                </View>
                <Text style={{ marginTop: verticalScale(5), alignSelf: 'center' }}>{this.props.placePageModel.place.details.formatted_address}</Text>
            </View>
        );
    }
    renderTopArea() {
        return (
            <View style={{ width: '100%' }}>
                {this.renderTitleArea()}
                {this.renderOpeningHours()}
            </View>
        );
    }
    windowHeight = Dimensions.get('window').height;
    /*
    */
    render() {
        console.log('render placePage: ' + JSON.stringify(this.props.placePageModel.place));
        return (
            <ScrollView
                ref={(ref) => { this.scrollView = ref; }}
                onScroll={(event) => {
                    this.scrollY = event.nativeEvent.contentOffset.y;
                }}
                scrollEventThrottle={16}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={this.state.scrollEnabled}
                
            >
                <View style={{ height: (this.windowHeight - Header.HEIGHT) }}>
                    <View style={{ height: '60%' }}>
                        {this.renderTopArea()}
                        {this.renderSnapCarouselArea()}
                    </View>
                    {this.renderBottomArea()}
                </View>
                {this.renderReviews()}
                {this.renderIcon()}
            </ScrollView>
        );
    }
}
// {this.renderSwiperArea()}
export default inject('placePageModel')(observer(PlacePage));

/*
    height: (this.windowHeight - Header.HEIGHT) not exact on iphone 10
*/
