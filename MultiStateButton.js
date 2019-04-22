import React,{ Component } from 'react';
import { View, Text }  from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { decorate, observable } from 'mobx';
import { observer } from 'mobx-react';

class MultiStateButton extends Component {

    activeIndex = 0
    render() {
        return (
            <View
                style={containerStyle}
            >
             {this.renderStateButtons()}  
            </View>
        )
    }
    renderStateButtons() {
        const childrenArray = [];
        // const disablePressOnAlreadyActiveButton = this.props.disablePressOnAlreadyActiveButton; // _this5.props.onHandlerStateChange is not a function seems to be probelm with rn gesture handler
        const avoidMakingIndexActive = this.props.avoidMakingIndexActive;
        for (let i = 0; i < this.props.children.length; i ++) {
            const children = this.props.children[i];
            children.style = childrenStyle;
            const shouldBeAvoided = avoidMakingIndexActive.includes(i);
            let stateButton = (
                <TouchableOpacity
                    key={i}
                    style={stateButtonStyle}
                    onPress={() => {
                        if (!shouldBeAvoided) {
                            this.activeIndex = i;
                        }
                        this.props.onPress(i);
                    }}
                >

                    {React.cloneElement(children, { style: childrenStyle })}
                </TouchableOpacity>
            );
            if (i === this.activeIndex) {
                children.style = activechildrenStyle;
                // const shouldBeDisabled = disablePressOnAlreadyActiveButton.includes(i);
                stateButton = (
                    <TouchableOpacity
                        key={i}
                        style={activeStateButtonStyle}
                        onPress={() => {
                            this.activeIndex = i;
                            this.props.onPress(i); // if presses the already active index
                        }}
                        // disabled={true}
                    >
                        {React.cloneElement(children, { style: [activechildrenStyle, { fontFamily: 'Cochin' }] })}
                    </TouchableOpacity>
                );
            }
            childrenArray.push(stateButton);
        }
        return childrenArray;
    }
}
// { fontFamily: 'Cochin'}
export default (observer(MultiStateButton));

decorate(MultiStateButton, {
    activeIndex: observable
});

const containerStyle = {
    // alignSelf: 'flex-start',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'black'
};
const stateButtonStyle = {
    // paddingVertical: verticalScale(6),
    // paddingHorizontal: scale(18),
    width: scale(65),
    height: verticalScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
};
const activeStateButtonStyle = {
    // paddingVertical: scale(6),
    // paddingHorizontal: verticalScale(18),
    width: scale(65),
    height: verticalScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
};
const childrenStyle = {
    color: 'black'
};
const activechildrenStyle = {
    color: 'white'
};