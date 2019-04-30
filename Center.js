import React from 'react';
import { View } from "react-native";


const widths = [];
// wraps children with the largest width and centers them
const Center = ({ component, width }) => {
    widths.push(width);
    const largestWidth = Math.max(...widths);
    return (
        <View style={{ width: largestWidth, alignItems: 'center' }}>
            {component}
        </View>
    );
};
// used to center toggle buttons in settingspage.js
export default Center;
