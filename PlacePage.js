import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

class PlacePage extends Component {

    render() {
        return (
            <View>
                <Text>hejhej</Text>
            </View>
        );
    }
}

export default inject('placePageModel')(observer(PlacePage));
