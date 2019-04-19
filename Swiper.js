import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import propTypes from 'prop-types';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import Button from 'react-native-vector-icons/AntDesign';
import { scale, moderateScale } from 'react-native-size-matters';
import AutoHeightImage from 'react-native-auto-height-image';

const windowWidth = Dimensions.get('window').width;

export default class Swiper extends Component {
    
    state = {
        activeIndex: 0,
    }
    getContainerStyle() {
        let containerWidth = this.props.containerWidth;
        let containerHeight = this.props.containerHeight;
        let swiperWidth = this.props.swiperWidth;
        let swiperHeight = this.props.swiperHeight;
        if (swiperWidth > containerWidth) {
            swiperWidth = containerWidth;
            console.warn('swiperWidth cant be larger containerWidth in Swiper.js');
        }
        if(swiperHeight > containerHeight) {
            swiperHeight = containerHeight;
            console.warn('swiperHeight cant be larger containerHeight in Swiper.js');
        }
        if (this.props.useButtons) { 
            if (containerWidth === swiperWidth) {
                console.warn('no space for buttons in Swiper.js. Please provide a swiperWidth which is smaller than containerWidth to allow room for buttons');
                swiperWidth = containerWidth * 0.70;
            } 
        }
        if (this.props.showPagination) {
            if (containerHeight === swiperHeight) {
                console.warn('no space for pagination in Swiper.js. Please provide a swiperHeight which is smaller than containerHeight to allow room for pagination');
                swiperHeight = containerHeight * 0.90;
            }
        }
        return { containerWidth, containerHeight, swiperWidth, swiperHeight };
    }
    render() {
        const style = this.getContainerStyle();
        console.log('containerWidth: ' + style.containerWidth  + ' containerHeight: ' + style.containerHeight);
        return (
            <View style={{ width: style.containerWidth, height: style.containerHeight }}>
                <View style={{ flex: 1, height: style.swiperHeight, flexDirection: 'row', }}>
                    {this.renderButtonArea('left')}
                    {this.renderCarousel(style)}  
                    {this.renderButtonArea('right')}  
                </View>
                <View>
                    {this.renderPagination(style)}
                </View>
            </View>
        );
    }
    renderCarousel(style) {
        return (
            <View>
                <Carousel
                ref={(ref) => { this.carousel = ref; }}
                data={this.props.data}
                renderItem={({ item }, parallaxProps) => {
                    if (this.props.useParallax) {
                        return (
                            <ParallaxImage
                                source={{ uri: item.uri }}
                                dimensions={{ width: style.swiperWidth, height: style.swiperHeight }} // need set dimension for image to show
                                {...parallaxProps}
                            />
                        );
                    } else {
                        return <AutoHeightImage source={{ uri: item.uri }} width={style.swiperWidth} height={style.swiperHeight} />
                    }
                }}
                sliderWidth={style.swiperWidth}
                itemWidth={style.swiperWidth}
                hasParallaxImages={this.props.useParallax}
                onSnapToItem={(index) => { this.setState({ activeIndex: index }); }}

            />
            </View>
        );
    }
    
    renderPagination(style) {
        /*
        const paginationHeight = style.containerHeight - style.swiperHeight;
        console.log('paginationHeight: ' + paginationHeight);
        can't set pagination height for some reason
        */
        return this.props.showPagination ? (
            <Pagination activeDotIndex={this.state.activeIndex} dotsLength={this.props.data.length} />
        )
        :
        null;
    }
    renderButtonArea(direction) {
        return this.props.showButtons ? (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                {this.renderButton(direction)}
            </View>
        )
        :
        null;
    }
    renderButton(direction) {
        if (direction === 'left') {
            return this.state.activeIndex > 0 ? (
                <TouchableOpacity
                    onPress={() => {
                        this.carousel._snapToItem(this.state.activeIndex - 1);
                    }}
                >
                    <Button name={'left'} size={moderateScale(35)} />
                </TouchableOpacity>
            )
            :
            null;
        } else if (direction === 'right') {
            return this.state.activeIndex < this.props.data.length - 1 ? (
                <TouchableOpacity
                    onPress={() => {
                        this.carousel._snapToItem(this.state.activeIndex + 1);
                    }}
                >
                    <Button name={'right'} size={moderateScale(35)} />
                </TouchableOpacity>
            )
            :
            null;
        } else {
            throw new Exception('internal swiper.js error');
        }
    }
}

Swiper.propTypes = {
    containerWidth: propTypes.number,
    swiperWidth: propTypes.number,
    containerHeight: propTypes.number,
    swiperHeight: propTypes.number,
    showPagination: propTypes.bool,
    showButtons: propTypes.bool,
    data: propTypes.arrayOf(propTypes.shape({ uri: propTypes.string.isRequired })),
    useParallax: propTypes.bool
};


Swiper.defaultProps = {
    containerWidth: windowWidth,
    swiperWidth: windowWidth * 0.8,
    containerHeight: 190,
    swiperHeight: 190,
    showPagination: false,
    showButtons: false,
    data: [],
    useParallax: false
};

