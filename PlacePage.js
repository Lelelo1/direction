import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import PlacePageModel from './PlacePageModel';

class PlacePage extends Component {

    componentDidMount() {

        console.log(JSON.stringify(this.props.placePageModel.place));
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
