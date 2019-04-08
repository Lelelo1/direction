
import React, { Component } from 'react';
import ExplorePage from './ExplorePage';
import ArrowPage from './ArrowPage';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import SettingsPage from './SettingsPage';
import PlacePage from './PlacePage';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';

const stackNavigator = createStackNavigator({
  Swipe: { screen: ArrowPage },
  Settings: { screen: SettingsPage, },
  Place: { screen: PlacePage }
},
{
  initialRouteKey: 'Swipe',
});

// inject stores: https://github.com/mobxjs/mobx-react/issues/510
/*
inject(stores => {
    console.log('stores: ' + stores);
    return {
      screenProps: {
        ...stores,
      },
    }  
  })(stackNavigator);
*/
// inject('swipeNavigationPageModel')(stackNavigator);

/*
stackNavigator.navigationOptions = ({ navigation, screenProps }) => {
    // console.log('screensProps: ' + JSON.stringify(screenProps));
    console.log('tabNavigationOptions: ' + JSON.stringify(navigation.state));
    let enabled = true;
    
    if (navigation.state.index === 0) {
        
        if (navigation.state.routes[0].params) {
            console.log('sc: ' + navigation.state.routes[0].params.swipeEnabled);
            enabled = navigation.state.routes[0].params.swipeEnabled;
        }
        
    } else {
        enabled = false; // prevent swipback to lead to wrong tab
    }
    
    return {
        swipeEnabled: enabled
    };
};
*/
/*
const tabs = createMaterialTopTabNavigator({
  Explore: { screen: ExplorePage },
  Arrow: { screen: stackNavigator }
},
{
    initialRouteName: 'Arrow',
    defaultNavigationOptions: { tabBarVisible: false },
    swipeEnabled: true
}
);
*/
/*
tabs.navigationOptions = ({ navigation }) => { // can not access tabs navigationOptions from here
    console.log('tabs');
};
*/ 
const AppContainer = createAppContainer(stackNavigator);
export default class AppNavigation extends Component {
    /*
    componentDidMount() {
        this.reactionOnSwipeoutSwipeEnabledChange = reaction(() => this.props.swipeNavigationPageModel.scrollEnabled, (scrollEnabled, reaction) => {
            console.log('reacted');
            const { setParams } = AppContainer.
            setParams({ swipeEnabled: scrollEnabled });
        }, {});
    }
    componentWillUnmount() {
        this.reactionOnSwipeoutSwipeEnabledChange();
    }
    */
    render() {
        return (
            <AppContainer />
        );
    }
    
}

