import React, {Component} from "react"
import PropTypes from 'prop-types'
import {Container, Icon} from 'native-base'
import {View, Text, Image, TextInput, StyleSheet, Keyboard} from "react-native"
import color from '../constants/colors'
import KBButton from "./KBButton";
import Utils from "../utils/Utils";


export default class  TextInputWithClear extends Component {

    static defaultProps = {
        headerStyle: "dark",
        leftComponent: null,
        titleComponent: null,
        rightComponent: null,
        background: "#fff",
        placeholderText: "请输入",
        showDriver: true,
        hideText: false,
        leftIcon: false,
        onFocusUnderlineColor: '#333333',
        unFocusUnderlineColor: '#F4F4F4',
        clearIconVisible: true,
        viewStyle: null,
        defaultText: '',
        onTextChange: function () {

        },
        onInputFocus: function () {

        },
        onInputBlur: function () {

        },
        keyboardType: 'default',
        multiline: false,
    };

    static propTypes = {
        headerStyle: PropTypes.oneOf(['dark', 'light']),
        inputStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
        keyboardType: PropTypes.oneOfType(['default', 'numeric', 'email-address', 'phone-pad']),
        titleComponent: PropTypes.func,
        rightComponent: PropTypes.func,
        leftComponent: PropTypes.func,
        background: PropTypes.string,
        placeholderText: PropTypes.string,
        showDriver: PropTypes.bool,
        hideText: PropTypes.bool,
        leftIcon: PropTypes.any,
        onFocusUnderlineColor: PropTypes.any,
        unFocusUnderlineColor: PropTypes.any,
        clearIconVisible: PropTypes.bool,
        viewStyle: PropTypes.any,
        onTextChange: PropTypes.func,
        defaultText: PropTypes.string,
        onInputFocus: PropTypes.func,
        onInputBlur: PropTypes.func,
        multiline: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            text: this.props.defaultText,
            defaultText: this.props.defaultText,
            isOnFocus: false
        };
    }

    getText = () => {
        return this.state.text;
    }

    render() {
        return (
            <View
                style={[
                    {borderBottomColor: this.props.showDriver ? (this.state.isOnFocus ? this.props.onFocusUnderlineColor : this.props.unFocusUnderlineColor) : color.trans},
                    styles.viewForInput, {backgroundColor: this.props.background,}, this.props.viewStyle,]}>
                {!this.props.leftIcon ? null :
                    <Image resizeMode={'contain'} style={styles.imageForInputIcon}
                           source={this.props.leftIcon}/>}
                <TextInput ref={"textInput"} underlineColorAndroid="transparent"
                           style={[styles.inputForTextInput, this.props.inputStyle]}
                           placeholder={this.props.placeholderText}
                           returnKeyType={'done'}
                           secureTextEntry={this.props.hideText}
                           placeholderTextColor={color.text999}
                           keyboardType={this.props.keyboardType}
                           onBlur={() => {
                               this.setState({isOnFocus: false});
                               this.props.onInputBlur();
                           }}
                           onFocus={() => {
                               this.setState({isOnFocus: true});
                               this.props.onInputFocus();
                           }}
                           onChangeText={(text) => {
                               this.setState({text: text}, () => {
                                   this.props.onTextChange(text);
                               });
                           }}
                           value={this.state.text}
                           multiline={this.props.multiline}
                           onKeyPress={(nativeEvent) => {
                               if(nativeEvent.nativeEvent.key == 'Enter') {
                                   Keyboard.dismiss();
                               }
                           }}
                           {...this.props}
                />

                {this.state.text.length > 0 && this.props.clearIconVisible && this.state.isOnFocus ?
                    <KBButton onPress={() => {
                        this.refs.textInput.clear();
                        this.setState({text: ''}, () => {
                            this.props.onTextChange('');
                        })
                    }}>
                        <View style={styles.viewForInputClear}>
                            <Image resizeMode={'contain'} source={require('../assets/input_ic_close.png')}
                                   style={styles.imageForInputClear}/>
                        </View>
                    </KBButton>
                    :
                    null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    inputForTextInput: {
        height: 30,
        flex: 1,
        fontSize: 13,
        padding: 0
    },
    imageForInputIcon: {
        width: 17,
        height: 17,
        marginLeft: 5,
    },
    viewForInputClear: {
        width: 15,
        height: 15,
        marginLeft: 5,
        marginRight: 5,
    },
    imageForInputClear: {
        width: 15,
        height: 15,
    },
    viewForInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.7
    },
});