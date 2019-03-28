/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ExplorePage from './ExplorePage';
import ArrowPage from './ArrowPage';
import ArrowPageModel from './ArrowPageModel';
import { Provider } from 'mobx-react';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import SettingsPage from './SettingsPage';
import SwipeNavigationPage from './SwipeNavigationPage';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import PlacePageModel from './PlacePageModel';
import PlacePage from './PlacePage';

const stackNavigator = createStackNavigator({
  Swipe: { screen: ArrowPage },
  Settings: { screen: SettingsPage },
  Place: { screen: PlacePage }
},
{
  initialRouteKey: 'Swipe',
  defaultNavigationOptions: { headerVisible: false },
  navigationOptions: { headerVisible: false }
});
// can't swipe between tabs on ios
const tabs = createMaterialTopTabNavigator({
  Explore: { screen: ExplorePage },
  Arrow: { screen: stackNavigator }
},
{
  initialRouteName: 'Arrow',
  swipeEnabled: true,
  tabBarPosition: 'bottom',
  defaultNavigationOptions: { tabBarVisible: false }
});

const AppContainer = createAppContainer(tabs);

export default class App extends Component {
  render() {
    return (
      <Provider
        arrowPageModel={ArrowPageModel.getInstance()}
        swipeNavigationPageModel={SwipeNavigationPageModel.getInstance()}
        placePageModel={PlacePageModel.getInstance()}
      >
        <AppContainer />
      </Provider>
    );
  }
}

