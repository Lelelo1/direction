import React, { Component } from 'react';
import { decorate, observable } from 'mobx';
export default class SwipeNavigationPageModel {
    static instance = null;

    static getInstance() {
        if (SwipeNavigationPageModel.instance === null) {
            SwipeNavigationPageModel.instance = new SwipeNavigationPageModel();
        }
        
        return SwipeNavigationPageModel.instance;
    }
    scrollEnabled = true;

    showPlaceInfoButton = false;

    title = 'Arrow'; // remove 

    index = 1;

    tabBarSwipeEnabled = true;
}
decorate(SwipeNavigationPageModel, {
    scrollEnabled: observable,
    showPlaceInfoButton: observable,
    title: observable,
    index: observable,
    tabBarSwipeEnabled: observable
});
