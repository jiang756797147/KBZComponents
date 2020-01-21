import React, {Component} from "react"
import PropTypes from "prop-types";

import {TouchableHighlight, TouchableNativeFeedback, Platform} from "react-native"
import colors from "../constants/colors";


class KBButton extends Component {
    static defaultProps = {
        isAndroidRipple: true
    };

    static propTypes = {
        isAndroidRipple: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            Platform.OS === 'ios' ?
                <TouchableHighlight underlayColor={colors.trans} {...this.props}>
                    {this.props.children}
                </TouchableHighlight>
                :
                <TouchableNativeFeedback
                    background={this.props.isAndroidRipple ? TouchableNativeFeedback.SelectableBackground() : null} {...this.props}>
                    {this.props.children}
                </TouchableNativeFeedback>
        )
    }
}

export default KBButton;
