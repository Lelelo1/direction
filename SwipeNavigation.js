import React, { Component } from 'react'
import Swiper from 'react-native-swiper';
import ArrowPage from './ArrowPage';
import ExplorePage from './ExplorePage';

export default class SwipeNavigation extends Component {
    
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
          title: state.params ? `${state.params.title}` : 'Arrow',
        };
      };
      
      changeTitle(titleText) {
         const { setParams } = this.props.navigation;
          setParams({ title: titleText });
      }
      
    render() {
        return (
            <Swiper
            loop={false}
            showsPagination={false}
            index={1}
            onIndexChanged={(index) => {
                if (index === 0) {
                    this.changeTitle('Explore');
                } else {
                    this.changeTitle('Arrow');
                }
            }}
            >
                <ExplorePage />
                <ArrowPage navigation={this.props.navigation} />
            </Swiper>
        );
    }
}
/*
decorate(SwipeNavigation, {

})
*/