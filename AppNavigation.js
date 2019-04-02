
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
inject('swipeNavigationPageModel')(stackNavigator);

stackNavigator.navigationOptions = ({ navigation, screenProps }) => {
    // console.log('screensProps: ' + JSON.stringify(screenProps));
    if (navigation.state.index === 0) {
       /*
        let enabled = true;
       if (navigation.state.swipeEnabled) {
           enabled = navigation.state.swipeEnabled;
       }
       return {
           swipeEnabled: enabled
       }
       */
      return {
          swipeEnabled: true
      };
   } else {
       return {
           swipeEnabled: false
       };
   }
};
const tabs = createMaterialTopTabNavigator({
  Explore: { screen: ExplorePage },
  Arrow: { screen: stackNavigator }
},
{
    initialRouteName: 'Arrow',
    tabBarPosition: 'bottom',
    defaultNavigationOptions: { tabBarVisible: false },
    swipeEnabled: true
}
);

/*
tabs.navigationOptions = ({ navigation }) => { // can not access tabs navigationOptions from here
    console.log('tabs');
};
*/ 
const AppContainer = createAppContainer(tabs);
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

