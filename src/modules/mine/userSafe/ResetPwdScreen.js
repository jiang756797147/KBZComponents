import React, {Component} from "react"
import {Container} from 'native-base'
import {Image, StyleSheet, Text, View} from "react-native";
import KBHeader from "../../../components/KBHeader";
import TextInputWithClear from "../../../components/TextInputWithClear";
import colors from "../../../constants/colors";
import KBButton from "../../../components/KBButton";
import Utils from "../../../utils/Utils";
import ToastUtils from "../../../utils/ToastUtils";
import HttpUtils from "../../../utils/HttpUtils";
import fetchUrl from "../../../constants/fetchUrl";

export default class ResetPwdScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canCommit: false,
        };
    }

    render() {
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} title={'修改密码'} {...this.props}/>
                <View style={{
                    paddingHorizontal: 20, flex: 1
                }}>
                    <TextInputWithClear
                        ref={(c) => this.oldTextInput = c}
                        onTextChange={() => this.onTextChange()}
                        viewStyle={{marginTop: 15, flex: 0}}
                        inputStyle={{height: 40}}
                        // onFocusUnderlineColor={'#F9DB63'}
                        onFocusUnderlineColor={colors.yellowColor}
                        unFocusUnderlineColor={'#E0E0E0'}
                        secureTextEntry={true}
                        placeholderText={'输入旧密码'}/>
                    <TextInputWithClear
                        ref={(c) => this.newTextInput = c}
                        onTextChange={() => this.onTextChange()}
                        viewStyle={{marginTop: 15, flex: 0}}
                        inputStyle={{height: 40}}
                        // onFocusUnderlineColor={'#F9DB63'}
                        onFocusUnderlineColor={colors.yellowColor}
                        unFocusUnderlineColor={'#E0E0E0'}
                        secureTextEntry={true}
                        placeholderText={'输入新密码'}/>
                    <TextInputWithClear
                        ref={(c) => this.againTextInput = c}
                        onTextChange={() => this.onTextChange()}
                        viewStyle={{marginTop: 15, flex: 0}}
                        inputStyle={{height: 40}}
                        // onFocusUnderlineColor={'#F9DB63'}
                        onFocusUnderlineColor={colors.yellowColor}
                        unFocusUnderlineColor={'#E0E0E0'}
                        secureTextEntry={true}
                        placeholderText={'再次输入新密码'}/>

                    <KBButton onPress={() => {
                        if (this.state.canCommit) {
                            this.updatePassword()
                        }
                    }}>
                        <View style={{
                            alignItems: 'center',
                            marginTop: 35,
                            justifyContent: 'center',
                            marginHorizontal: 14,
                            height: 42,
                            // backgroundColor: this.state.canCommit ? '#FFDA48' : '#EFEDE4',
                            backgroundColor: this.state.canCommit ? colors.yellowColor : '#EFEDE4',
                            borderRadius: 21
                        }}>
                            <Text style={{
                                color: this.state.canCommit ? colors.text444 : colors.text888,
                                fontSize: 15
                            }}>确认修改</Text>
                        </View>
                    </KBButton>
                </View>
            </View>
        );
    }

    onTextChange = () => {
        this.setState({
            canCommit: !(Utils.isNull(this.oldTextInput.getText()) || Utils.isNull(this.newTextInput.getText()) || Utils.isNull(this.againTextInput.getText()))
        })
    };

    updatePassword = () => {
        if (this.newTextInput.getText() !== this.againTextInput.getText()) {
            ToastUtils.showToast('两次新密码输入不一致');
            return;
        }
        let formData = new FormData();
        formData.append('oldPassword', this.oldTextInput.getText());
        formData.append('newPassword', this.newTextInput.getText());
        HttpUtils.doPostWithToken(fetchUrl.updatePassword, formData, {
            onSuccess: (responseData) => {
                const {goBack} = this.props.navigation;
                ToastUtils.showToast('密码修改成功！');
                goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        }, fetchUrl.loginBaseUrl)
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            flex: 1
        },
    });

}
