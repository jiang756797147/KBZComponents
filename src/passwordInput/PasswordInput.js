import React, {PureComponent} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet, TextInput,
} from 'react-native';
import InputView from './InputView';
import PropTypes from 'prop-types';
import colors from '../../constants/colors';


class PasswordInput extends PureComponent {

    static defaultProps = {
        length: 6,
        clear: true,
        borderColor: '#C7C7C7',
    };

    static propTypes = {
        borderColor: PropTypes.string,
    };

    state = {visible: false, password: ''};

    show() {
        if (this.props.clear && this.state.password) {
            this.setState({password: ''});
        }
        this.setState({visible: true});
    }

    hide() {
        this.setState({visible: false});
    }

    conectText(text) {
        // let nextPassword = this.state.password + text;  用自定义键盘是调用
        let nextPassword = text;
        if (nextPassword.length > this.props.length) {
            return null;
        }
        this.setState({password: nextPassword});
        if (nextPassword.length === this.props.length) {
            this.props.onDone && this.props.onDone(nextPassword);
            this.hide();
        }
    }

    onDelete() {
        let password = this.state.password;
        this.setState({password: password.substring(0, password.length - 1)});
    }

    render() {
        const {onDone, ...rest} = this.props;
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={() => {
                    // this.show()
                }} activeOpacity={0.6}>
                    <InputView index={this.state.password.length} strs={this.state.password} {...rest}
                               borderColor={this.props.borderColor}/>
                    <TextInput
                        ref={(c) => this.textInput = c}
                        keyboardType={'email-address'}
                        maxLength={6}
                        autoFocus={true}
                        caretHidden={true}
                        style={{
                            position: 'absolute',
                            backgroundColor: colors.trans,
                            color: colors.trans,
                            width: this.props.length * 37 + (this.props.length - 1) * 15,
                            height: 40,
                        }}
                        underlineColorAndroid="transparent"
                        value={this.state.password}
                        onChangeText={(text) => {
                            this.conectText(text);
                        }}/>
                </TouchableOpacity>
            </View>
        );
    }

    styles = StyleSheet.create({
        keyborad: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
    });
}


export default PasswordInput;