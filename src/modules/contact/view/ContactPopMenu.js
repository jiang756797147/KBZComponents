import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types'

import colors from '../../../constants/colors';
import theme from "../../../constants/theme";
import Utils from "../../../utils/Utils";
import ToastUtils from '../../../utils/ToastUtils';

import KBButton from "../../../components/KBButton";
import Divider from "../../../components/Divider";
import KBPopupDialog from '../../../components/dialog/KBPopupDialog';

export default class ContactPopMenu extends Component {

    static defaultProps = {
        popPhone: ''
    };

    static propTypes = {
        popPhone: PropTypes.string,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <KBPopupDialog
                ref={(c) => this.customPop = c}
                {...this.props}>
                {this.renderCallPop()}
            </KBPopupDialog>
        );
    }

    renderCallPop() {
        return (
            <View style={{alignItems: 'center', width: theme.screenWidth * 0.8, borderRadius: 5,}}>
                <View style={{backgroundColor: colors.white, borderRadius: 5}}>
                    <View style={{
                        width: theme.screenWidth * 0.8,
                        paddingVertical: 14,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        backgroundColor: colors.white,
                        alignItems: 'center'
                    }}>

                        <Text style={{
                            color: '#FEAF00',
                            fontWeight: '400',
                            fontSize: 14
                        }}>{this.props.popPhone}</Text>
                    </View>
                    <Divider
                        customStyle={{width: theme.screenWidth - theme.screenWidth * 0.2 - 20}}/>
                    <KBButton onPress={() => {
                        Utils.phoneCall(this.props.popPhone)
                    }}>
                        <View style={{
                            width: theme.screenWidth * 0.8,
                            paddingVertical: 14, alignItems: 'center',
                            backgroundColor: colors.white,
                        }}>
                            <Text style={{color: '#FEAF00', fontSize: 14}}>拨打电话</Text>
                        </View>
                    </KBButton>
                    <Divider
                        customStyle={{width: theme.screenWidth - theme.screenWidth * 0.2 - 20}}/>
                    <KBButton onPress={() => {
                        Utils.setClipboardContent(this.props.popPhone);
                        ToastUtils.showToast('已复制手机号到粘贴板');
                        this.dismiss();
                    }}>
                        <View style={{
                            width: theme.screenWidth * 0.8,
                            backgroundColor: colors.white,
                            paddingVertical: 14, alignItems: 'center',
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                        }}>
                            <Text style={{color: '#706F69', fontSize: 14}}>复制号码</Text>
                        </View>
                    </KBButton>
                </View>
                <KBButton onPress={() => {
                    this.dismiss()
                }}>
                    <View
                        style={{
                            width: theme.screenWidth * 0.8,
                            alignItems: 'center',
                            borderRadius: 5,
                            paddingVertical: 14,
                            backgroundColor: colors.white,
                            marginTop: 8
                        }}>
                        <Text style={{color: '#706F69', fontSize: 14}}>取消</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    show = () => {
        this.customPop.show();
    };
    dismiss = () => {
        this.customPop.dismiss();
    };
};
