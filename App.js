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

const arrowNavigation = createStackNavigator({
  Arrow: { screen: ArrowPage },
  Settings: { screen: SettingsPage }
},
{
  initialRouteKey: 'Arrow'
});

const tabs = createBottomTabNavigator({
  Explore: { screen: ExplorePage },
  Arrow: { screen: arrowNavigation }
},
{
  initialRouteName: 'Arrow'
});
const AppContainer = createAppContainer(tabs);

export default class App extends Component {
  render() {
    return (
      <Provider
        arrowPageModel={ArrowPageModel.getInstance()}
      >
        <AppContainer />
      </Provider>
    );
  }
}

