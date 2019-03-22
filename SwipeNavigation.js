import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import ArrowPage from './ArrowPage';
import ExplorePage from './ExplorePage';
import Icon from 'react-native-vector-icons/Feather';
import { scale } from 'react-native-size-matters';

export default class SwipeNavigation extends Component {

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            title: state.params ? `${state.params.title}` : 'Arrow',
            headerRight: state.params ? state.params.headerRight : 
            (<TouchableOpacity
                style={{ paddingRight: scale(14) }}
                onPress={() => {
                    navigation.navigate('Settings');
                }}
            >
                <Icon
                    name={'settings'}
                    size={22}
                />
            </TouchableOpacity>)
        };
    };
    settingsButton(titleText) {
        return titleText === 'Arrow' ? (
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
        )
            :
            null;
    }
    changeTitle(titleText) {
        const { setParams } = this.props.navigation;
        setParams({ title: titleText, headerRight: this.settingsButton(titleText) });
    }

    render() {
        return (
            <Swiper
                loop={false}
                showsPagination={false}
                index={1}
                onIndexChanged={(index) => {
                    if (index === 0) {
                        this.changeTitle('Explore');
                    } else {
                        this.changeTitle('Arrow');
                    }
                }}
                keyboardDismissMode={'none'} // 
                keyboardShouldPersistTaps={'handled'}
            >
                <ExplorePage />
                <ArrowPage navigation={this.props.navigation} />
            </Swiper>
        );
    }
}
/*
decorate(SwipeNavigation, {

})
*/