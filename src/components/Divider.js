import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../constants/colors';
import PropTypes from 'prop-types'
import theme from "../constants/theme";

export default class Divider extends Component {

    static defaultProps = {
        customStyle: null,
        customHeight: false,
        isMargin: false,
        customColor: false,
    };

    static propTypes = {
        customStyle: PropTypes.any,
        customHeight: PropTypes.any,
        isMargin: PropTypes.bool,
        customColor: PropTypes.any
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <View style={[{
                    width: this.props.isMargin ? theme.screenWidth - 28 : theme.screenWidth,
                    height: this.props.customHeight ? this.props.customHeight : 0.7
                }, !this.props.customColor ? styles.divider : {backgroundColor: this.props.customColor}, this.props.customStyle,]}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    divider: {
        backgroundColor: colors.divider,
    }
});