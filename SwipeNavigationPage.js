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
import PlaceIcon from 'react-native-vector-icons/Foundation';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';

class SwipeNavigationPage extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const title = state.params ? `${state.params.title}` : 'Arrow';
        return {
            title,
            headerRight: SwipeNavigationPage.headerRight(title, navigation)
        };
    };
    static headerRight(title, navigation) {
        return title === 'Arrow' ? (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    alignContent: 'center',
                    width: scale(80), 
                    flexDirection: 'row', 
                    paddingRight: scale(14)
                    }}
            >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Place');
                    }}
                >
                    <PlaceIcon
                        name={'info'}
                        size={33}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Settings');
                    }}
                >
                    <Icon
                        name={'settings'}
                        size={25}
                    />
                </TouchableOpacity>
            </View>
        )
            :
            null;
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
        }, this.reaction);
    }
    componentWillUnmount() {
        // this.onTitleChanged(); // disposed
        this.reaction();
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

export default inject('swipeNavigationPageModel')(observer(SwipeNavigationPage));
