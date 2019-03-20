/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ArrowPage from './ArrowPage';
import ArrowPageModel from './ArrowPageModel';
import { Provider } from 'mobx-react';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider
        arrowPageModel={ArrowPageModel.getInstance()}
      >
        <ArrowPage />
      </Provider>
    );
  }
}

