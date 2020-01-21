import React, {Component} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Color from '../constants/colors';
import PropTypes from 'prop-types'
import theme from "../constants/theme";

export default class CircleImage extends Component {

    static defaultProps = {
        customWidth: 50,
        customHeight: 50,
        borderWidth: 0,
        borderColor: Color.trans,
        imageUrl: false,
        customStyle: null,
    };

    static propTypes = {
        customWidth: PropTypes.number,
        customHeight: PropTypes.number,
        borderWidth: PropTypes.number,
        borderColor: PropTypes.string,
        imageUrl: PropTypes.any,
        customStyle: PropTypes.any,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            !this.props.imageUrl ?
                null
                :
                <Image style={[{
                    width: this.props.customWidth,
                    height: this.props.customHeight,
                    borderWidth: this.props.borderWidth,
                    borderColor: this.props.borderColor,
                    borderRadius: this.props.customWidth / 2
                }, this.props.customStyle]} source={this.props.imageUrl} resizeMod={'contain'}/>
        );
    }
}

const styles = StyleSheet.create({});