import React, { Component } from 'react';
import { decorate, observable } from 'mobx';
import { types } from 'mobx-state-tree';
export default class SwipeNavigationPageModel {
    static instance = null;

    static getInstance() {
        if (SwipeNavigationPageModel.instance === null) {
            SwipeNavigationPageModel.instance = new SwipeNavigationPageModel();
        }
        
        return SwipeNavigationPageModel.instance;
    }
    scrollEnabled = true;

    showPlaceButton = false;

    title = 'Arrow';
}
decorate(SwipeNavigationPageModel, {
    scrollEnabled: observable,
    showPlaceButton: observable,
    title: observable
});
