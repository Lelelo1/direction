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
import Qs from 'qs'; // use encode false when creating query arguments
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlaceInfoIcon from 'react-native-vector-icons/SimpleLineIcons';
import AutoHeightImage from 'react-native-auto-height-image';
import ArrowPageModel from './ArrowPageModel';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { scale, moderateScale } from 'react-native-size-matters';
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
                    justifyContent: 'space-evenly',
                    width: scale(100),
                    height: '100%',
                    flexDirection: 'row',
                    paddingRight: scale(6),
                }}
            >
                
                {this.renderPlaceInfoButton(navigation, iconSize)}
                <TouchableOpacity
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
        this.reactionOnShowPlaceButton = reaction(() => this.props.swipeNavigationPageModel.showPlaceInfoButton, (show, reaction) => {
            this.updateHeaderRight();
        }, {});
        this.reactionOnIsShowingDirection = reaction(() => this.props.arrowPageModel.isShowingDirection, (show, reaction) => {
            this.updateHeaderRight();
        }, {});

        /* need to fix swipe out issue: https://github.com/mobxjs/mobx-react/issues/510
        this.reactionOnScrollEnabled = reaction(() => this.props.swipeNavigationPageModel.scrollEnabled, (scrollEnabled, reaction) => {
            console.log('reaction');
            const { setParams } = this.props.navigation;
            setParams({ swipeEnabled: scrollEnabled });
        }, {});
        */
    }
    componentWillUnmount() {
        this.didBlurListener.remove();
        this.willFocusListener.remove();
        this.didFocusListener.remove();
        this.reactionOnShowPlaceButton();
        this.reactionOnIsShowingDirection();

        // this.reactionOnScrollEnabled();
    }
    updateHeaderRight() {
        const { setParams } = this.props.navigation;
        // setParams({ title });
        setParams({});
    }
    navigateInfoPlace() { // show listview on return if it was open
        const showListViewOnReturn = this.googlePlacesAutocomplete.state.listViewDisplayed;
        this.props.navigation.navigate('Place', { infoPlace: true, showListViewOnReturn });
    }
    renderSwipeoutButtons(rowData) {
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
                                console.log(JSON.stringify(this.googlePlacesAutocomplete.listViewDisplayed));
                                this.navigateInfoPlace();
                            }}
                        >
                            <PlaceInfoIcon name={'info'} size={26} />
                        </TouchableOpacity>
                    </View>
                )
                
            }
        ];
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
                <GooglePlacesAutocomplete
                    ref={(ref) => { this.googlePlacesAutocomplete = ref; }}
                    placeholder='search'
                    textInputProps={{ onFocus: () => {
                        Geolocation.getCurrentPosition((position) => {
                            console.log('position: ' + JSON.stringify(position));
                            const pageModel = this.props.arrowPageModel;
                            pageModel.location.latitude = position.coords.latitude;
                            pageModel.location.longitude = position.coords.longitude;
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
                    query={{
                        key: Utils.getInstance().key,
                        radius: this.props.arrowPageModel.getRadius(),
                        location: this.props.arrowPageModel.getLocationAsString(),
                        strictbounds: this.props.arrowPageModel.getRadius() ? 'strictbounds' : undefined,
                        sessiontoken: 'aqse34fr5hnj78l9g4s2svfbm377912kde'
                    }}
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
                        console.log('press');
                        console.log(JSON.stringify(data), JSON.stringify(details));
                        ArrowPageModel.getInstance().setDestination(details.geometry.location);
                        PlacePageModel.getInstance().setPlace({ data, details });

                    }}
                    onLongPress={(data, details) => {
                        console.log('long hold: ' + JSON.stringify(data), JSON.stringify(details));
                        SwipeNavigationPageModel.getInstance().showPlaceInfoButton = false; // cancel previous animation when long pressing fast on different items
                        PlacePageModel.getInstance().setPlace({ data, details });
                        SwipeNavigationPageModel.getInstance().showPlaceInfoButton = true;
                    }}
                    onClear={() => {
                        ArrowPageModel.getInstance().setDestination(null);
                    }}
                    renderSwipeoutButtons={(rowData) => this.renderSwipeoutButtons(rowData)}
                    buttonWidth={scale(55)}
                    // api={'GooglePlacesSearch'} can't use GooglePlacesSearch beacuse shows too many results: https://stackoverflow.com/questions/55440295/flatlist-with-position-absolute-dont-scroll 
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
                    <Text style={{ fontSize: moderateScale(20) }}>{this.props.arrowPageModel.distance} meters</Text>
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

export default inject('arrowPageModel', 'swipeNavigationPageModel')(observer(ArrowPage));

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
