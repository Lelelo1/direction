import React, { Component, Fragment } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    PixelRatio,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ViewPropTypes,
    Dimensions
} from 'react-native';
// import Swipeout from 'react-native-swipeout';
import Qs from 'qs'; // use encode false when creating query arguments
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlaceInfoIcon from 'react-native-vector-icons/SimpleLineIcons';
import WalkIcon from 'react-native-vector-icons/FontAwesome5'
import PlaceIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MultiStateButton from './MultiStateButton';
import AutoHeightImage from 'react-native-auto-height-image';
import ArrowPageModel from './ArrowPageModel';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale, moderateScale, verticalScale } from 'react-native-size-matters';
import { inject, observer } from 'mobx-react';
import { toJS, reaction } from 'mobx';
import Utils from './Utils';
import PlacePageModel from './PlacePageModel';
import Pagination from './Pagination';
import * as Animatable from 'react-native-animatable';
import Geolocation from 'react-native-geolocation-service';

let self;
class ArrowPage extends Component {
    
    static values = {
        iconSize: 25
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        // const title = state.params ? `${state.params.title}` : 'Arrow';
        return {
            title: 'Arrow',
            headerRight: ArrowPage.headerRight(navigation),
        };
    };

    static headerRight(navigation) {
        const { iconSize } = ArrowPage.values;
        return (
            <View
                style={{
                    alignItems: 'center',
                    width: scale(100),
                    height: '100%',
                    flexDirection: 'row-reverse',
                }}
            >
                <TouchableOpacity
                    style={{ paddingRight: scale(12) }}
                    onPress={() => {
                        navigation.navigate('Settings');
                    }}
                >
                    <Icon
                        name={'settings'}
                        size={iconSize}
                        style={{ width: iconSize, height: iconSize }}
                    />
                </TouchableOpacity>

            </View>
        );
    }
    /*
    // {this.renderPlaceInfoButton(navigation, iconSize)}
    static renderPlaceButton(navigation, iconSize) {
        const shouldRender = ArrowPageModel.getInstance().isShowingDirection;
        return shouldRender ? (
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Place');
                }}
            >
                <Icon
                    name={'place'}
                    size={iconSize}
                    style={{ width: iconSize, height: iconSize }}
                />
            </TouchableOpacity>
        ) : (
                <View style={{ width: iconSize, height: iconSize }} /> // render empty on the area so that settings button don't replaces itself
            );
    }
    static renderPlaceInfoButton(navigation, iconSize) {
        const shouldRender = SwipeNavigationPageModel.getInstance().showPlaceInfoButton;
        return shouldRender ? (
            <Animatable.View ref={(ref) => ArrowPage.animateAndDisappear(ref)} >
                <TouchableOpacity
                    onPress={() => {
                        self.navigateInfoPlace();
                    }}
                >
                    <PlaceInfoIcon
                        name={'info'}
                        size={iconSize}
                        style={{ width: iconSize, height: iconSize }}
                    />
                </TouchableOpacity>
            </Animatable.View>
        )
            :
            ArrowPage.renderPlaceButton(navigation, iconSize);
    }
    static avoidCancel = [];
    static animateAndDisappear(ref) {
        if (ref) {
            const avoidCancel = ArrowPage.avoidCancel;
            avoidCancel.push(ref);
            ref.flash(2000).then((fulfilled) => {

            });
            ref.bounceIn(3000).then(() => {
                setTimeout(() => {
                    const index = avoidCancel.indexOf(ref);
                    avoidCancel.splice(index, 1);
                    if (avoidCancel.length === 0) { // cancel with time only when it has not already been cancelled by long hold on new item
                        SwipeNavigationPageModel.getInstance().showPlaceInfoButton = false;
                    }
                }, 1500);
            });
        }
    }
    */
    constructor() {
        super();
        self = this;
    }
    componentDidMount() {
        this.willBlurListener = this.props.navigation.addListener('willBlur', () => {
            console.log('will blur');
        });
        this.didBlurListener = this.props.navigation.addListener('didBlur', () => {
            // SwipeNavigationPageModel.getInstance().tabBarSwipeEnabled = false; did not work
            SwipeNavigationPageModel.getInstance().showListViewOnReturn = false;
            this.googlePlacesAutocomplete._onBlur();
        });
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            console.log('willFocus: ' + this.props.swipeNavigationPageModel.showListViewOnReturn);
            if (this.props.swipeNavigationPageModel.showListViewOnReturn) { // if placepage user should return to listview again if it was opened
                this.googlePlacesAutocomplete.listViewDisplayed = true;
                this.googlePlacesAutocomplete.triggerFocus();
            }
            SwipeNavigationPageModel.getInstance().index = 1;
        });

        /*

        this.reactionOnShowPlaceButton = reaction(() => this.props.swipeNavigationPageModel.showPlaceInfoButton, (show, reaction) => {
            this.updateHeaderRight();
        }, {});
        this.reactionOnIsShowingDirection = reaction(() => this.props.arrowPageModel.isShowingDirection, (show, reaction) => {
            this.updateHeaderRight();
        }, {});

        */
        /* need to fix swipe out issue: https://github.com/mobxjs/mobx-react/issues/510
        this.reactionOnScrollEnabled = reaction(() => this.props.swipeNavigationPageModel.scrollEnabled, (scrollEnabled, reaction) => {
            console.log('reaction');
            const { setParams } = this.props.navigation;
            setParams({ swipeEnabled: scrollEnabled });
        }, {});
        */
       /*
        this.reactionOnLocationChanged = reaction(() => this.props.arrowPageModel.location, (location, reaction) => {
            console.log('reacted on location changed');
            if (this.props.arrowPageModel.isShowingResultsWhereFacing) {
                const text = this.googlePlacesAutocomplete.getAddressText();
                this.googlePlacesAutocomplete._request(text);
            }
        });
        */
        
        // needed. But could try wrap googleplacesautocomplete in observer tags.
        // react on location changed instead
        this.reactionOnLocationAheadChanged = reaction(() => this.props.arrowPageModel.locationAhead, (locationAhead, reaction) => {
            console.log('reacted on locationAheadChanged');
            if (this.props.arrowPageModel.isShowingResultsWhereFacing) {
                const text = this.googlePlacesAutocomplete.getAddressText();
                this.googlePlacesAutocomplete._request(text);
            }
        });
        
    }
    componentWillUnmount() {
        this.didBlurListener.remove();
        this.willFocusListener.remove();
        this.didFocusListener.remove();
        /*
        this.reactionOnShowPlaceButton();
        this.reactionOnIsShowingDirection();
        */
        // this.reactionOnScrollEnabled();
        this.reactionOnQueryChanged();
    }

    navigateInfoPlace() { // show listview on return if it was open
        // const showListViewOnReturn = this.googlePlacesAutocomplete.state.listViewDisplayed;
        this.props.navigation.navigate('Place', { pageType: 'infoPlace', showListViewOnReturn: true });
    }
    renderSwipeoutButtons(data) {
        console.log('render swipeoutButtons'); // https://github.com/dancormier/react-native-swipeout/issues/327
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
                        <TouchableOpacity
                            onPress={() => {
                                fetch('https://maps.googleapis.com/maps/api/place/details/json?' + Qs.stringify({
                                    key: Utils.getInstance().key,
                                    placeid: data.place_id,
                                    language: 'en'
                                })).then(response => response.json()).then(details => {

                                    PlacePageModel.getInstance().setPlace({ data, details: details.result });
                                    this.navigateInfoPlace();
                                });
                            }}
                        >
                            <PlaceInfoIcon name={'info'} size={26} />
                        </TouchableOpacity>
                    </View>
                )
                
            }
        ];
    }
    getAvoidMakingIndexActive() {
        if (this.props.arrowPageModel.isShowingDirection) {
            return [1];
        }
        return [];
    }
    renderMultiStateButton() {
        return (
            <MultiStateButton
                ref={(ref) => { this.multiStateButton = ref; }}
                disablePressOnAlreadyActiveButton={[0]}
                avoidMakingIndexActive={this.getAvoidMakingIndexActive()}
                onPress={(index) => {
                    if (this.props.arrowPageModel.shouldShowClear) {
                        if (index === 0) {
                            if (!this.props.arrowPageModel.isShowingDirection) {
                                const details = this.props.placePageModel.place.details;
                                ArrowPageModel.getInstance().setDestination(details.geometry.location);
                            } else {
                                // do nothing
                            }
                        } else {
                            // is index 1
                            this.props.navigation.navigate('Place', { pageType: 'destination', showListViewOnReturn: false });
                        }
                    }
                }}
            >
                <WalkIcon name={'walking'} size={moderateScale(20)} />
                <PlaceIcon name={'text'} size={moderateScale(20)} />
            </MultiStateButton>
        );
    }
    renderClearButton() {
        return (
            <TouchableOpacity
                disabled={!this.props.arrowPageModel.shouldShowClear}
                onPress={() => {
                    this.googlePlacesAutocomplete.setAddressText('');
                    ArrowPageModel.getInstance().setDestination('');
                    ArrowPageModel.getInstance().shouldShowClear = false;
                }}
            >
                <Icon name={'clear'} size={moderateScale(33)} color={this.props.arrowPageModel.shouldShowClear ? 'black' : 'transparent'} />
            </TouchableOpacity>
        );
    }
    render() {
        return (
            <ScrollView
                //style={{ flex: 1 }} // had to change back to scroll view after removing react-native-swiper so that deselecting textinput works
                contentContainerStyle={{ flex: 1 }}
                
                keyboardDismissMode={'none'} 
                keyboardShouldPersistTaps={'handled'} // neccesary to prevent listview items to have to be pressed twice
                scrollEnabled={false}
            >
                <GooglePlacesAutocomplete // internal problem - listview not updating the first time focusing it and turning
                    ref={(ref) => { this.googlePlacesAutocomplete = ref; }}
                    placeholder='search'
                    textInputProps={{
                        onFocus: () => {
                            console.log('focus');
                            Geolocation.getCurrentPosition((position) => {
                                console.log('position: ' + JSON.stringify(position));
                                const pageModel = this.props.arrowPageModel;
                                pageModel.location.latitude = position.coords.latitude;
                                pageModel.location.longitude = position.coords.longitude;

                                if (pageModel.isShowingResultsWhereFacing) {
                                    ArrowPageModel.getInstance().shouldCalculatePointWhereFacing = true;
                                    pageModel.startCompass(); 
                                }
                                 // no need to check isShowingDirection to limit

                            }, (error) => {
                                console.log(error);
                                console.warn(error);
                            });
                        },
                        clearButtonMode: 'never',
                        spellCheck: false,
                        autoCorrect: false,
                        rejectResponderTermination: true
                    }}
                    onBlur={() => { // can't be passed with textInput props since already used internally
                        
                        // blur occures after showTheWay need check 
                        if (!this.props.arrowPageModel.isShowingDirection) {
                            ArrowPageModel.getInstance().stopCompass();
                        } else {
                            ArrowPageModel.getInstance().shouldCalculatePointWhereFacing = false;
                        }
                    }}
                    query={this.props.arrowPageModel.getQuery()}
                    /* can't use this
                    https://github.com/FaridSafi/react-native-google-places-autocomplete/issues/373
                    */
                    GooglePlacesSearchQuery={{
                        location: '57.708870,11.974560', // Burggrevegatan, 41103 Göteborg (Stampen) Stampen, Göteborg Göteborg Sverige
                        radius: this.props.arrowPageModel.getRadius()
                        // types: 'cafe'
                    }}
                    
                    styles={{
                        // to place suggestions on top
                        container: {
                            flex: 1,
                            position: 'absolute',
                            width: '100%',
                            zIndex: 1,
                        },
                        listView: {
                            flex: 1,
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
                        PlacePageModel.getInstance().setPlace({ data, details });
                        console.log('data: ' + JSON.stringify(data));
                        if (this.multiStateButton.activeIndex === 0) {
                            ArrowPageModel.getInstance().setDestination(details.geometry.location);
                        } else if (this.multiStateButton.activeIndex === 1) {
                            this.navigateInfoPlace();
                        } else {
                            console.warn('error');
                        }
                        ArrowPageModel.getInstance().shouldShowClear = true;
                    }}
                    onLongPress={(data, details) => {
                        /*
                        console.log('long hold: ' + JSON.stringify(data), JSON.stringify(details));
                        SwipeNavigationPageModel.getInstance().showPlaceInfoButton = false; // cancel previous animation when long pressing fast on different items
                        PlacePageModel.getInstance().setPlace({ data, details }); // need to set 
                        SwipeNavigationPageModel.getInstance().showPlaceInfoButton = true;
                        */
                    }}
                    onClear={() => {
                        ArrowPageModel.getInstance().setDestination(null);
                    }}
                    renderSwipeoutButtons={(rowData) => this.renderSwipeoutButtons(rowData)}
                    buttonWidth={scale(55)}
                    api={this.props.arrowPageModel.api} // can't use GooglePlacesSearch beacuse shows too many results: https://stackoverflow.com/questions/55440295/flatlist-with-position-absolute-dont-scroll 
                />
                <View style={{ height: 44, width: '100%' }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: scale(5), height: verticalScale(40) }}>
                    {this.renderMultiStateButton()}
                    {this.renderClearButton()}
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
                    <Text style={{ fontSize: moderateScale(20) }}>{this.props.arrowPageModel.distance} meters</Text>
                    <Text style={{ paddingTop: 20 }}>magneticFieldStrength: {this.props.arrowPageModel.magneticFieldStrength}μT</Text>
                    <Text style={{ paddingTop: 20 }}>magneticFieldDisturbance: {this.props.arrowPageModel.magneticFieldDisturbance}μT</Text>
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
  /*
    total is amount of tabs in AppNavigation.js  .wont be using tabs to due swipe problem
                <Pagination total={2} index={this.props.swipeNavigationPageModel.index} />
  */
}

export default inject('arrowPageModel', 'swipeNavigationPageModel', 'placePageModel')(observer(ArrowPage));

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
