import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import ArrowPage from './ArrowPage';
import ExplorePage from './ExplorePage';
import Icon from 'react-native-vector-icons/Feather';
import { scale } from 'react-native-size-matters';
import { decorate, observable, toJS, autorun, computed, reaction } from 'mobx';
import { observer, inject } from 'mobx-react';
import { onSnapshot } from  'mobx-state-tree';
import PlaceInfoIcon from 'react-native-vector-icons/SimpleLineIcons';
import PlaceIcon from 'react-native-vector-icons/MaterialIcons';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import * as Animatable from 'react-native-animatable';
import ArrowPageModel from './ArrowPageModel';

class SwipeNavigationPage extends Component {
    static values = {
        iconSize: 25
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const title = state.params ? `${state.params.title}` : 'Arrow';
        return {
            title,
            headerRight: SwipeNavigationPage.headerRight(title, navigation)
        };
    };
    static headerRight(title, navigation) {
        const { iconSize } = SwipeNavigationPage.values;
        return title === 'Arrow' ? (
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
        )
            :
            null;
    }
    static renderPlaceButton(navigation, iconSize) {
        const shouldRender = ArrowPageModel.getInstance().isShowingDirection;
        return shouldRender ? (
            <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Place');
                    }}
                >
                    <PlaceIcon
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
            <Animatable.View ref={(ref) => SwipeNavigationPage.animateAndDisappear(ref)} >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Place');
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
        SwipeNavigationPage.renderPlaceButton(navigation, iconSize);
    }
    static avoidCancel = [];
    static animateAndDisappear(ref) {
        if (ref) {
            const avoidCancel = SwipeNavigationPage.avoidCancel;
            avoidCancel.push(ref);
            ref.flash(2000).then((fulfilled) => {
                console.log('fulfilled: ' + JSON.stringify(fulfilled));
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
    componentDidMount() {
        /*
        // console.log(toJS(this.props.swipeNavigationPageModel));
        console.log(SwipeNavigationPageModel.getInstance());
        onSnapshot(SwipeNavigationPageModel.getInstance(), (snapshot) => {
            console.log('snapshot: ' + snapshot);
            
        });
        */
       /*
        this.onTitleChanged = autorun((reaction) => {
            const title = this.props.swipeNavigationPageModel.title;
            console.log(title);
            this.updateTitle(title);
        });
        */
       /*
        computed((options) => {
            console.log('options: ' + options);
            const title = this.props.swipeNavigationPageModel.title;
            console.log(title);
        });
        */
       /*
       observer((ob) => {
        console.log('ob ' + ob);
            const title = this.props.swipeNavigationPageModel.title;
            console.log(title);
       });
       */

        reaction(() => this.props.swipeNavigationPageModel.title, (title, reaction) => {
            console.log(title);
            this.updateTitle(title);
        }, this.reactionOnTitleChange);
        reaction(() => this.props.swipeNavigationPageModel.showPlaceInfoButton, (show, reaction) => {
            this.updateTitle(this.props.swipeNavigationPageModel.title);
        }, this.reactionOnShowPlaceButton);
        reaction(() => this.props.arrowPageModel.isShowingDirection, (show, reaction) => {
            console.log('isShowingDirection');
            this.updateTitle(this.props.swipeNavigationPageModel.title);
        }, this.reactOnIsShowingDirection); // address set
    }
    componentWillUnmount() {
        // this.onTitleChanged(); // disposed
        console.log('unmount');
        this.reactionOnTitleChange();
        this.reactionOnShowPlaceButton();
        this.reactOnIsShowingDirection();
    }
    updateTitle(title) {
        const { setParams } = this.props.navigation;
        setParams({ title });
    }
/*
<TouchableOpacity
                style={{ paddingRight: scale(14) }}
                onPress={() => {
                    this.props.navigation.navigate('Settings');
                }}
            >
                <Icon
                    name={'settings'}
                    size={22}
                />
            </TouchableOpacity>
*/
/*
    changeTitle(titleText) {
        const { setParams } = this.props.navigation;
        setParams({ title: titleText });
    }
    */
    render() {
        return (
            <Swiper
                loop={false}
                showsPagination={false}
                index={1}
                onIndexChanged={(index) => {
                    if (index === 0) {
                        // this.changeTitle('Explore');
                        this.props.swipeNavigationPageModel.title = 'Explore';
                    } else {
                        // this.changeTitle('Arrow');
                        this.props.swipeNavigationPageModel.title = 'Arrow';
                    }
                }}
                keyboardDismissMode={'none'} // 
                keyboardShouldPersistTaps={'handled'}
                scrollEnabled={this.props.swipeNavigationPageModel.scrollEnabled}
            >
                <ExplorePage />
                <ArrowPage navigation={this.props.navigation} />
            </Swiper>
        );
    }
}

export default inject('swipeNavigationPageModel', 'arrowPageModel')(observer(SwipeNavigationPage));
