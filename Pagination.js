
/**
 * react-native-swiper
 * @author leecade<leecade@163.com>
 * react-native-screen-pagination
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View
} from 'react-native';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';

/**
 * Default styles
 * @type {StyleSheetPropType}
 */
const styles = {
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        flex: 1
    },

    wrapperIOS: {
        backgroundColor: 'transparent',
    },

    wrapperAndroid: {
        backgroundColor: 'transparent',
        flex: 1
    },

    slide: {
        backgroundColor: 'transparent',
    },

    pagination_x: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },

    pagination_y: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },

}

// missing `module.exports = exports['default'];` with babel6
// export default React.createClass({
class Pagination extends Component {
    /**
     * Props Validation
     * @type {Object}
     */
    static propTypes = {
        horizontal: PropTypes.bool,
        containerStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        scrollViewStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        pagingEnabled: PropTypes.bool,
        showsHorizontalScrollIndicator: PropTypes.bool,
        showsVerticalScrollIndicator: PropTypes.bool,
        bounces: PropTypes.bool,
        scrollsToTop: PropTypes.bool,
        removeClippedSubviews: PropTypes.bool,
        automaticallyAdjustContentInsets: PropTypes.bool,
        showsPagination: PropTypes.bool,
        showsButtons: PropTypes.bool,
        disableNextButton: PropTypes.bool,
        loadMinimal: PropTypes.bool,
        loadMinimalSize: PropTypes.number,
        loadMinimalLoader: PropTypes.element,
        loop: PropTypes.bool,
        autoplay: PropTypes.bool,
        autoplayTimeout: PropTypes.number,
        autoplayDirection: PropTypes.bool,
        index: PropTypes.number,
        renderPagination: PropTypes.func,
        dotStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        activeDotStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
        dotColor: PropTypes.string,
        activeDotColor: PropTypes.string,
        /**
         * Called when the index has changed because the user swiped.
         */
        onIndexChanged: PropTypes.func
    }

    /**
     * Default props
     * @return {object} props
     * @see http://facebook.github.io/react-native/docs/scrollview.html
     */
    static defaultProps = {
        horizontal: true,
        pagingEnabled: true,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        bounces: false,
        scrollsToTop: false,
        removeClippedSubviews: true,
        automaticallyAdjustContentInsets: false,
        showsPagination: true,
        showsButtons: false,
        disableNextButton: false,
        loop: true,
        loadMinimal: false,
        loadMinimalSize: 1,
        autoplay: false,
        autoplayTimeout: 2.5,
        autoplayDirection: true,
        index: 0,
        onIndexChanged: () => null
    }

    componentDidMount() {
        this.reactionOnIndexChange = reaction(() => this.props.swipeNavigationPageModel.index, (index, reaction) => {
            // can check if index is valid
            console.log('index: ' + index); 
            this.setState({ index });
        }, {});
    }
    componentWillUnmount() {
        this.reactionOnIndexChange();
    }
    /**
     * Init states
     * @return {object} states
     */
    state = this.initState(this.props)

    initState(props, updateIndex = false) {
        // set the current state
        const state = this.state || { width: 0, height: 0, offset: { x: 0, y: 0 } }

        const initState = {
            
        };

        // initState.total = props.children ? props.children.length || 1 : 0
            initState.total = props.total ? props.total : 0;
        if (state.total === initState.total && !updateIndex) {
            // retain the index
            initState.index = state.index
        } else {
            initState.index = initState.total > 1 ? Math.min(props.index, initState.total - 1) : 0
        }

        initState.dir = props.horizontal === false ? 'y' : 'x';

        return initState;
    }

    /**
     * Update active index
     * @param {integer} index
     */
    updateIndex = (index) => { // using mobx instead
        this.setState({ index });
    }
    /**
     * Render pagination
     * @return {object} react-dom
     */
    renderPagination = () => {
        // By default, dots only show when `total` >= 2
        if (this.state.total <= 1) return null;

        let dots = [];
        const ActiveDot = this.props.activeDot || <View style={[{
            backgroundColor: this.props.activeDotColor || '#007aff',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
        }, this.props.activeDotStyle]} />
        const Dot = this.props.dot || <View style={[{
            backgroundColor: this.props.dotColor || 'rgba(0,0,0,.2)',
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
        }, this.props.dotStyle]} />
        for (let i = 0; i < this.state.total; i++) {
            dots.push(i === this.state.index
                ? React.cloneElement(ActiveDot, { key: i })
                : React.cloneElement(Dot, { key: i })
            );
        }

        return (
            <View pointerEvents='none' style={[styles['pagination_' + this.state.dir], this.props.paginationStyle]}>
                {dots}
            </View>
        );
    }
    /**
     * Default render
     * @return {object} react-dom
     */
    render() {
        return (
            this.renderPagination()
        );
    }
}
/*
    Can delete even more
*/
export default inject('swipeNavigationPageModel')(observer(Pagination));

