import React from 'react';
import {Image, StyleSheet, Text, View, ScrollView} from 'react-native';

import PasswordInput from '../../../components/passwordInput/PasswordInput';
import KBHeader from '../../../components/KBHeader';
import ToastUtils from '../../../utils/ToastUtils';
import HttpUtils from '../../../utils/HttpUtils';
import DialogUtils from '../../../utils/DialogUtils';
import fetchUrl from '../../../constants/fetchUrl';
import colors from '../../../constants/colors';
import BaseScreen from '../../../base/BaseScreen';


export default class JoinClassScreen extends BaseScreen {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        super.componentDidMount();
    }

    renderData() {
        return (
            <ScrollView style={{flex: 1, backgroundColor: colors.white}}>
                <View style={{marginTop: 150, alignItems: 'center', backgroundColor: colors.white}}>
                    <Text style={{fontSize: 20, color: colors.text333, fontWeight: '500'}}>请输入班级码</Text>
                    <Text style={{fontSize: 14, color: colors.text777, marginTop: 15}}>班级号可以从班主任处获取</Text>
                    <PasswordInput borderColor={'#FADD4D'} style={{marginTop: 30}}
                                   onDone={(data) => this.joinClass(data)}/>
                </View>
            </ScrollView>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={styles.container}>
                <KBHeader isLeft={true} {...this.props} showDriver={false}/>
                {renderView}
            </View>
        );
    }

    joinClass = (data) => {
        const {navigate, goBack} = this.props.navigation;
        let formData = '&inviteCode=' + data;
        DialogUtils.getInstance().showProgress();
        HttpUtils.doGetWithToken(fetchUrl.checkClassByInviteCode + formData, {
            onSuccess: (responseData) => {
                navigate('JoinClassAfter', {classData: responseData.data, goBack: goBack});
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: () => {
                DialogUtils.getInstance().hideProgress();
            },
        });
    };
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});
