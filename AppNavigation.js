
import React, { Component } from 'react';
import ExplorePage from './ExplorePage';
import ArrowPage from './ArrowPage';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import SettingsPage from './SettingsPage';
import PlacePage from './PlacePage';

const stackNavigator = createStackNavigator({
  Swipe: { screen: ArrowPage },
  Settings: { screen: SettingsPage, },
  Place: { screen: PlacePage }
},
{
  initialRouteKey: 'Swipe',
});

stackNavigator.navigationOptions = ({ navigation }) => {
   if (navigation.state.index === 0) {
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

tabs.navigationOptions = ({ navigation }) => {
    console.log('tabs');
};

const AppContainer = createAppContainer(tabs);
export default class AppNavigation extends Component {

    componentDidMount() {
        console.log('mount');
        /*
        this.willFocusListener = this.props.navigation.addListener('willFocus', () => {
            SwipeNavigationPageModel.getInstance().index = 0;
        });
        this.reactionOnTabBarSwipeEnableChange = reaction(() => this.props.swipeNavigationPageModel.tabBarSwipeEnabled, (enable, reaction) => {
            console.log('enable: ' + enable);
            this.props.navigation.setParams({ swipeEnabled: enable });
            this.appNavigation.props.
        }, {});
        */
    }
    componentWillUnmount() {
        /*
        this.willFocusListener.remove();
        this.reactionOnTabBarSwipeEnableChange();
        */
    }
    render() {
        return (
            <AppContainer />
        );
    }
}


