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
import { createAppContainer, createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import SettingsPage from './SettingsPage';
import SwipeNavigationPage from './SwipeNavigationPage';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import PlacePageModel from './PlacePageModel';
import PlacePage from './PlacePage';

const stackNavigator = createStackNavigator({
  Swipe: { screen: SwipeNavigationPage },
  Settings: { screen: SettingsPage },
  Place: { screen: PlacePage }
},
{
  initialRouteKey: 'Swipe'
});
/* can't swipe between tabs on ios
const tabs = createBottomTabNavigator({
  Explore: { screen: ExplorePage },
  Arrow: { screen: arrowNavigation }
},
{
  initialRouteName: 'Arrow'
});
*/
const AppContainer = createAppContainer(stackNavigator);

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

