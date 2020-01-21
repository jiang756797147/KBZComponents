import React, {Component} from "react"
import {Container} from 'native-base'
import {Image, StyleSheet, Text, TextInput, View, Keyboard} from "react-native";
import colors from "../../../constants/colors";
import KBHeader from "../../../components/KBHeader";
import Divider from "../../../components/Divider";
import ToastUtils from "../../../utils/ToastUtils";
import KBButton from "../../../components/KBButton";
import HttpUtils from "../../../utils/HttpUtils";
import fetchUrl from "../../../constants/fetchUrl";
import Utils from "../../../utils/Utils";
import UserData from "../../../constants/UserData"

export default class FeedBackScreen extends Component {
    constructor(props) {

        super(props);

        this.state = {
            feedText: '',
            phoneNum: UserData.getInstance().getUserData().mobile,
        };
    }

    render() {
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} {...this.props} title="意见反馈"/>
                <View style={{paddingHorizontal: 12, paddingVertical: 10}}>
                    <View style={{
                        backgroundColor: colors.white,
                        height: 210,
                        borderRadius: 5,
                        paddingVertical: 12,
                        paddingHorizontal: 10
                    }}>
                        <TextInput style={{flex: 1, textAlignVertical: 'top'}}
                                   underlineColorAndroid="transparent"
                                   placeholder={'请描述您的问题...'}
                                   padding={0}
                                   returnKeyType={'done'}
                                   onKeyPress={(nativeEvent) => {
                                       if(nativeEvent.nativeEvent.key == 'Enter') {
                                           Keyboard.dismiss();
                                       }
                                   }}
                                   placeholderTextColor={colors.text999}
                                   multiline={true}
                                   value={this.state.feedText}
                                   onChangeText={(text) => {
                                       this.setState({
                                           feedText: text
                                       })
                                   }}/>
                    </View>
                </View>
                <View style={{
                    marginHorizontal: 12,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    height: 50,
                    backgroundColor: colors.white
                }}>
                    <TextInput
                        style={{flex: 1, color: colors.text666}}
                        underlineColorAndroid="transparent"
                        placeholder={'请留下手机号方便我们及时反馈  (必填)'}
                        padding={0}
                        maxLength={11}
                        keyboardType={'numeric'}
                        placeholderTextColor={colors.text999}
                        value={this.state.phoneNum}
                        onChangeText={(text) => {
                            this.setState({
                                phoneNum: text
                            })
                        }}/>
                </View>

                <KBButton onPress={() => {
                    this.giveFeedBack();
                }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 20,
                        height: 42,
                        borderRadius: 21,
                        marginTop: 40,
                        backgroundColor: colors.yellowColor //'#FCD963'
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: colors.text444
                        }}>提交</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    giveFeedBack = () => {
        if (Utils.isNull(this.state.feedText)) {
            ToastUtils.showToast('请输入意见反馈内容');
            return;
        }
        if (!Utils.isPhoneNum(this.state.phoneNum)) {
            ToastUtils.showToast('请输入正确的手机号');
            return;
        }

        let formData = new FormData();
        formData.append('content', this.state.feedText);
        formData.append('mobile', this.state.phoneNum);
        HttpUtils.doPostWithToken(fetchUrl.giveFeedBack, formData, {
            onSuccess: (responseData) => {
                const {goBack} = this.props.navigation;
                ToastUtils.showToast('提交成功！');
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
            backgroundColor: colors.empty,
            flex: 10
        },
    });
}
