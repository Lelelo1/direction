import React, { Component } from 'react';
import { decorate, observable } from 'mobx';

export default class SwipeNavigationPageModel {
    static instance = null;

    static getInstance() {
        if (this.instance === null) {
            this.instance = new SwipeNavigationPageModel();
        }
        return this.instance;
    }
    scrollEnabled = true;

}
decorate(SwipeNavigationPageModel, {
    scrollEnabled: observable
});
