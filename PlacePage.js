import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import PlacePageModel from './PlacePageModel';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';

class PlacePage extends Component {

    static navigationOptions = ({ navigation }) => {

    }

    componentDidMount() {
        console.log(JSON.stringify(this.props.placePageModel.place));
        this.didFocus = this.props.navigation.addListener('didFocus', () => {
            if (this.props.navigation.state.params) {
                // was infoPlace
                SwipeNavigationPageModel.getInstance().showListViewOnReturn
                 = this.props.navigation.state.params.showListViewOnReturn; // setting listview to proper value on return to arrowPage
            }
        });
    }
    render() {
        return (
            <View>
                <Text>Place</Text>
            </View>
        );
    }
}

export default inject('placePageModel')(observer(PlacePage));
