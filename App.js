/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import ArrowPageModel from './ArrowPageModel';
import { Provider } from 'mobx-react';
import SwipeNavigationPageModel from './SwipeNavigationPageModel';
import PlacePageModel from './PlacePageModel';
import AppNavigation from './AppNavigation';
/*
const Provider = {
      arrowPageModel: ArrowPageModel.getInstance(),
      swipeNavigationPageModel: SwipeNavigationPageModel.getInstance(),
      placePageModel: PlacePageModel.getInstance()
};
*/
export default class App extends Component {
  
  render() {
    return (
      <Provider
        arrowPageModel={ArrowPageModel.getInstance()}
        swipeNavigationPageModel={SwipeNavigationPageModel.getInstance()}
        placePageModel={PlacePageModel.getInstance()}
      >
        <AppNavigation />
      </Provider>
    );
  }
}

// release build ios
// https://stackoverflow.com/questions/42110496/how-to-build-ipa-application-for-react-native-ios
