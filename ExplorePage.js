import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import Pagination from './Pagination';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';

class ExplorePage extends Component {

    componentDidMount() {
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            SwipeNavigationPageModel.getInstance().index = 0;
        });
    }
    componentWillUnmount() {
        this.willFocusListener.remove();
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text>explore!</Text>
                <Pagination total={2} index={this.props.swipeNavigationPageModel.index} />
            </View>
        );
    }
}
export default inject('swipeNavigationPageModel')(observer(ExplorePage));
