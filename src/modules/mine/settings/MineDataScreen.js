import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import KBHeader from '../../../components/KBHeader';
import KBButton from '../../../components/KBButton';
import ToastUtils from '../../../utils/ToastUtils';
import Divider from '../../../components/Divider';
import CircleImage from '../../../components/CircleImage';
import KBPopupDialog from '../../../components/dialog/KBPopupDialog';
import HttpUtils from '../../../utils/HttpUtils';
import Utils from '../../../utils/Utils';
import UserData from '../../../constants/UserData';
import fetchUrl from '../../../constants/fetchUrl';
import theme from '../../../constants/theme';
import TextInputWithClear from '../../../components/TextInputWithClear';
import KBImagePicker from '../../../components/KBImagePicker';
import KBScrollView from '../../../components/KBScrollView';
import BaseScreen from '../../../base/BaseScreen';

export default class MineDataScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.settingData = [
            {
                itemTitle: '头像',
                itemName: '',
                itemSex: 2,
            },
            {itemTitle: '名称', itemName: ''},
            {itemTitle: '手机号', itemName: ''},
            {itemTitle: '职称', itemName: ''},
        ];
        this.state = Object.assign({
            isRefreshing: false,
            popPlaceHolder: '名称',
            nickname: '',
            headerUrl: '',
            userData: '',
            mobile: '',
        }, this.state);
    }

    onEnd() {
    }

    componentDidMount() {
        super.componentDidMount();
        HttpUtils.doGetWithToken(fetchUrl.getUserInfo, {
            onSuccess: (responseData) => {
                UserData.getInstance().setUserData(responseData.data);
                let settingData = [
                    {
                        itemTitle: '头像',
                        itemName: responseData.data.header,
                        itemSex: responseData.data.sex,
                    },
                    {itemTitle: '名称', itemName: responseData.data.nickname},
                    {itemTitle: '手机号', itemName: responseData.data.mobile},
                    {itemTitle: '职称', itemName: Utils.getNoNullText(responseData.data.duty)},
                ];
                this.settingData = settingData;
                this.setState({
                    userData: responseData.data,
                    nickname: responseData.data.nickname,
                    mobile: responseData.data.mobile,
                });
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);

            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: () => {
                this.setState({
                    isRefreshing: false,
                    isLoading: false,
                });
            },
        }, fetchUrl.loginBaseUrl);
    }

    renderInputPop() {
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View
                    style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <Text style={[{
                        marginLeft: 14,
                        marginTop: 15,
                    }]}>修改{this.state.popPlaceHolder}</Text>
                    <TextInputWithClear
                        onTextChange={(text) => {
                            if (this.state.popPlaceHolder === '名称') {
                                this.state.nickname = text;
                            } else {
                                this.state.mobile = text;
                            }
                            this.setState({});
                        }}
                        keyboardType={this.state.popPlaceHolder === '名称' ? 'default' : 'numeric'}
                        placeholderText={'请输入' + this.state.popPlaceHolder}
                        onFocusUnderlineColor={'#F9DB63'}
                        unFocusUnderlineColor={'#E0E0E0'}
                        maxLength={20}
                        inputStyle={{height: 30}}
                        viewStyle={{
                            marginTop: 20,
                            marginHorizontal: 14,
                            flex: 0,
                        }}
                    />
                    <Divider customStyle={{marginTop: 25, width: theme.screenWidth * 0.85}}/>
                    <View style={{
                        width: theme.screenWidth * 0.85,
                        height: 40,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        flexDirection: 'row',
                    }}>
                        <KBButton style={{flex: 1}}
                                  onPress={() => {
                                      this.inputNamePop.dismiss();
                                      this.inputPhonePop.dismiss();
                                  }}>
                            <View style={{
                                flex: 1,
                                borderBottomLeftRadius: 5,
                                backgroundColor: colors.white,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text888, fontSize: 14}}>取消</Text>
                            </View>
                        </KBButton>
                        <KBButton style={{flex: 1}} onPress={() => {
                            let formData = new FormData();
                            if (this.state.popPlaceHolder === '名称') {
                                formData.append('nickname', this.state.nickname);
                                this.updateUserInfo(formData);
                            } else {
                                if (Utils.isPhoneNum(this.state.mobile)) {
                                    formData.append('mobile', this.state.mobile);
                                    this.updateUserInfo(formData);
                                } else {
                                    ToastUtils.showToast('请输入正确的手机号');
                                }
                            }
                        }}>
                            <View style={{
                                flex: 1,
                                borderBottomRightRadius: 5,
                                backgroundColor: '#FFDB49',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text333, fontSize: 14}}>保存</Text>
                            </View>
                        </KBButton>
                    </View>
                </View>
            </View>
        );
    };

    renderItem = ({itemTitle, itemName, itemSex}, index) => {
        return (
            <KBButton key={index} onPress={() => {
                switch (index) {
                    case 0:
                        this.imagePicker.show();
                        break;
                    case 1:
                        this.setState({popPlaceHolder: '名称'}, () => {
                            this.inputNamePop.show();
                        });
                        break;
                    case 2:
                        this.setState({popPlaceHolder: '手机号'}, () => {
                            this.inputPhonePop.show();
                        });
                        break;
                    default:
                        ToastUtils.showToast('暂时不能修改' + itemTitle);
                        break;
                }
            }
            }>
                <View style={{backgroundColor: colors.white}}>
                    <View style={{
                        flexDirection: 'row',
                        paddingHorizontal: 14,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: index === 0 ? 8 : 16,
                    }}>
                        <Text style={{fontSize: 14, color: colors.text333}}>{itemTitle}</Text>
                        {index === 0 ?
                            <CircleImage customWidth={48}
                                         customHeight={48}
                                         imageUrl={Utils.getMineAvatar(itemName, itemSex)}
                                         resizeMode={'contain'}
                            />
                            :
                            <Text style={{fontSize: 13, color: colors.text777}}>{itemName}</Text>
                        }
                    </View>
                    <Divider isMargin={index !== 2} customHeight={index === 2 ? 8 : 1}/>
                </View>
            </KBButton>
        );
    };

    renderData() {
        return (
            <KBScrollView
                isRefreshControl={true}
                isRefreshing={this.state.isRefreshing}
                onRefresh={this.refreshData}
            >
                <View>
                    {this.settingData.map(this.renderItem)}
                </View>
            </KBScrollView>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={styles.container}>
                <KBHeader isLeft={true}
                          {...this.props}
                    showDriver={true}
                          headerStyle={'dark'}
                          title="个人资料"
                />
                {renderView}
                <KBPopupDialog
                    ref={(c) => this.inputNamePop = c}>
                    {this.renderInputPop()}
                </KBPopupDialog>
                <KBPopupDialog
                    ref={(c) => this.inputPhonePop = c}>
                    {this.renderInputPop()}
                </KBPopupDialog>
                <KBImagePicker ref={(c) => this.imagePicker = c} title={'头像选择'}
                               isSingle={true}
                               imagePicked={(image) => {
                                   this.editHeadImg(image.path);
                               }}
                />
            </View>
        );
    }

    editHeadImg = (path) => {
        let imagePath = path;
        let array = imagePath.split('/');
        let imageStr = Utils.removeChinese(array[array.length - 1]);
        let file = {uri: imagePath, type: 'multipart/form-data', name: imageStr};
        this.state.headerUrl = imagePath;
        let formData = new FormData();
        formData.append('file[]', file);
        this.updateUserInfo(formData);
    };

    refreshData = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    updateUserInfo = (formData) => {
        this.inputNamePop.dismiss();
        this.inputPhonePop.dismiss();
        HttpUtils.doPostWithToken(fetchUrl.updateUserInfo, formData, {
            onSuccess: (responseData) => {
                // UserData.getInstance().setUserData(responseData.data);
                if (!Utils.isNull(this.state.headerUrl)) {
                    this.settingData[0].itemName = {uri: this.state.headerUrl};
                    this.state.userData.header = this.state.headerUrl;
                }
                if (!Utils.isNull(this.state.nickname)) {
                    this.settingData[1].itemName = this.state.nickname;
                    this.state.userData.nickname = this.state.nickname;
                }
                if (!Utils.isNull(this.state.mobile)) {
                    this.settingData[2].itemName = this.state.mobile;
                    this.state.userData.mobile = this.state.mobile;
                }
                UserData.getInstance().setUserDataAndRefresh(this.state.userData);
                this.setState({});
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);

            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: () => {
                this.setState({isRefreshing: false});
            },
        }, fetchUrl.loginBaseUrl);
    };
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});
