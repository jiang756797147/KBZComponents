import React, {Component} from 'react';
import {Image, StyleSheet, Text, View, Keyboard} from 'react-native';

import colors from '../../../../constants/colors';
import KBHeader from '../../../../components/KBHeader';
import KBButton from '../../../../components/KBButton';
import CircleImage from '../../../../components/CircleImage';
import Divider from '../../../../components/Divider';
import KBPopupDialog from '../../../../components/dialog/KBPopupDialog';
import theme from '../../../../constants/theme';
import TextInputWithClear from '../../../../components/TextInputWithClear';
import KBImagePicker from '../../../../components/KBImagePicker';
import Utils from '../../../../utils/Utils';
import HttpUtils from '../../../../utils/HttpUtils';
import fetchUrl from '../../../../constants/fetchUrl';
import ToastUtils from '../../../../utils/ToastUtils';
import BaseScreen from '../../../../base/BaseScreen';

export default class AddStudentScreen extends BaseScreen {


    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.classId = params.classId;

        this.onRefresh = params.onRefresh;
        this.state = {
            canCommit: false,
            inputPopPlaceHolder: '',
            inputPopMaxLength: 16,
            name: '',
            cardId: '',
            duty: '',
            sex: 1,
            isCheckBoy: true,
            headUrl: null,
            itemData: [],
        };
        this.state.itemData = [
            {
                itemName: require('../../../../assets/class/image_boy_stu_head.png'), itemValue: '添加学生头像',
                itemClick: () => {
                    this.imagePicker.show();
                },
            },
            {
                itemName: '姓名', itemValue: Utils.isNull(this.state.name) ? '(不超过6个字符)' : this.state.name,
                itemClick: () => {
                    this.setState({inputPopPlaceHolder: '学生姓名', inputPopMaxLength: 25}, () => {
                        this.inputNamePop.show();
                    });
                },
            },
            {
                itemName: '性别', itemValue: this.state.sex === 1 ? '男' : '女',
                itemClick: () => {
                    this.sexPop.show();
                },
            },
            {
                itemName: '身份证号(选填)', itemValue: this.state.cardId,
                itemClick: () => {
                    this.setState({inputPopPlaceHolder: '身份证号', inputPopMaxLength: 18}, () => {
                        this.inputCardPop.show();
                    });
                },
            },
            {
                itemName: '职务(选填)', itemValue: this.state.duty,
                itemClick: () => {
                    this.setState({inputPopPlaceHolder: '职务', inputPopMaxLength: 40}, () => {
                        this.inputDutyPop.show();
                    });
                },
            }];
    }

    renderItem = ({itemName, itemValue, itemClick}, index, data) => {
        return (
            <KBButton key={index} onPress={() => itemClick()}>
                <View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: index === 0 ? 8 : 15,
                            paddingHorizontal: 14,
                        }}>
                        {index === 0 ?
                            <CircleImage customWidth={55} customHeight={55} imageUrl={itemName}/>
                            :
                            <Text style={{color: colors.text333, fontSize: 14}}>{itemName}</Text>}
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: colors.text999, fontSize: 13}}>{itemValue}</Text>
                            <Image source={require('../../../../assets/icon_right.png')}
                                   style={{width: 10, height: 10, marginLeft: 10}}
                                   resizeMode={'contain'}/>
                        </View>
                    </View>
                    {index === data.length - 1 ?
                        null : <Divider customColor={'#FAFAF7'} isMargin={!(index === data.length - 2)}
                                        customHeight={index === data.length - 2 ? 10 : 0.7}/>
                    }
                </View>
            </KBButton>
        );
    };

    renderInputPop() {
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View
                    style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <Text style={[{
                        marginLeft: 14,
                        marginTop: 15,
                    }, this.styles.textForListTitle]}>{this.state.inputPopPlaceHolder}</Text>
                    <TextInputWithClear
                        onTextChange={(text) => {
                            switch (this.state.inputPopPlaceHolder) {
                                case'学生姓名':
                                    this.setState({name: text});
                                    break;
                                case '身份证号':
                                    this.setState({cardId: text});
                                    break;
                                case '职务':
                                    this.setState({duty: text});
                                    break;
                            }
                        }}
                        placeholderText={'请输入' + this.state.inputPopPlaceHolder}
                        onFocusUnderlineColor={'#F9DB63'}
                        unFocusUnderlineColor={'#E0E0E0'}
                        maxLength={this.state.inputPopMaxLength}
                        inputStyle={{height: 30}}
                        viewStyle={{
                            marginTop: 20,
                            marginHorizontal: 14,
                            flex: 0,
                        }}/>
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
                                      this.inputCardPop.dismiss();
                                      this.inputDutyPop.dismiss();
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
                            switch (this.state.inputPopPlaceHolder) {
                                case'学生姓名':
                                    if (this.state.name && this.state.name.length > 6) {
                                        ToastUtils.showToast('学生姓名最多为6个字！');
                                        return;
                                    }
                                    this.state.itemData[1].itemValue = this.state.name;
                                    this.setState({});
                                    this.inputNamePop.dismiss();
                                    break;
                                case '身份证号':
                                    if (!Utils.isIDCard(this.state.cardId)) {
                                        ToastUtils.showToast('请输入正确的身份证号码！');
                                        return;
                                    }
                                    this.state.itemData[3].itemValue = this.state.cardId;
                                    this.setState({});
                                    this.inputCardPop.dismiss();
                                    break;
                                case '职务':
                                    this.state.itemData[4].itemValue = this.state.duty;
                                    this.setState({});
                                    this.inputDutyPop.dismiss();
                                    break;
                            }
                            this.setBtnStatus();
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

    renderSexPop = () => {
        return (
            <View style={{borderRadius: 5, backgroundColor: colors.white, width: theme.screenWidth * 0.85}}>
                <KBButton onPress={() => {
                    if (Utils.isNull(this.state.headUrl)) {
                        this.state.itemData[0].itemName = require('../../../../assets/class/image_boy_stu_head.png');
                    }
                    this.state.itemData[2].itemValue = '男';
                    this.setState({isCheckBoy: true, sex: 1});
                    this.sexPop.dismiss();
                }}>
                    <View style={{flexDirection: 'row', height: 45, alignItems: 'center', paddingHorizontal: 14}}>
                        <Text style={{flex: 1, color: colors.text333, fontSize: 14}}>男</Text>
                        {this.state.isCheckBoy ?
                            <Image source={require('../../../../assets/class/screen_ic_select.png')}
                                   style={{width: 15, height: 15}} resizeMode={'contain'}/> : null}
                    </View>
                </KBButton>
                <Divider isMargin={true} customStyle={{width: theme.screenWidth * 0.85 - 28}}/>
                <KBButton onPress={() => {
                    if (Utils.isNull(this.state.headUrl)) {
                        this.state.itemData[0].itemName = require('../../../../assets/class/image_girl_stu_head.png');
                    }
                    this.state.itemData[2].itemValue = '女';
                    this.setState({isCheckBoy: false, sex: 0});
                    this.sexPop.dismiss();
                }}>
                    <View style={{flexDirection: 'row', height: 45, alignItems: 'center', paddingHorizontal: 14}}>
                        <Text style={{flex: 1, color: colors.text333, fontSize: 14}}>女</Text>
                        {!this.state.isCheckBoy ?
                            <Image source={require('../../../../assets/class/screen_ic_select.png')}
                                   style={{width: 15, height: 15}}
                                   resizeMode={'contain'}/> : null}
                    </View>
                </KBButton>
            </View>
        );
    };

    renderData() {
        return (
            <View style={{flex: 1, backgroundColor: colors.white}}>
                {this.state.itemData.map(this.renderItem)}
                <KBButton onPress={() => {
                    if (this.state.canCommit) {
                        this.addStudent();
                    }
                }}>
                    <View style={{
                        alignItems: 'center',
                        marginTop: 35,
                        justifyContent: 'center',
                        marginHorizontal: 14,
                        height: 42,
                        backgroundColor: this.state.canCommit ? '#FFDA48' : '#EFEDE4',
                        borderRadius: 21,
                    }}>
                        <Text style={{color: colors.text666, fontSize: 15}}>添加</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true} title={'添加学生'} {...this.props}/>
                {renderView}
                <KBPopupDialog
                    ref={(c) => this.inputNamePop = c}>
                    {this.renderInputPop()}
                </KBPopupDialog>
                <KBPopupDialog
                    ref={(c) => this.inputCardPop = c}>
                    {this.renderInputPop()}
                </KBPopupDialog>
                <KBPopupDialog
                    ref={(c) => this.inputDutyPop = c}>
                    {this.renderInputPop()}
                </KBPopupDialog>
                <KBPopupDialog
                    ref={(c) => this.sexPop = c}>
                    {this.renderSexPop()}
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

    editHeadImg(path) {
        let imagePath = path;
        // let formData = new FormData();

        this.state.itemData[0].itemName = {uri: imagePath};

        this.setState({headUrl: imagePath});
        this.setBtnStatus();
    }

    setBtnStatus = () => {
        // this.setState({canCommit: true});
        this.setState({canCommit: !(Utils.isNull(this.state.name))});
    };

    addStudent = () => {
        if (this.state.name.length > 6) {
            ToastUtils.showToast('学生姓名最多为6个字！');
            return;
        }
        const {goBack} = this.props.navigation;
        // goBack();
        let formData = new FormData();
        formData.append('classId', this.classId);
        formData.append('name', this.state.name);
        formData.append('sex', this.state.sex.toString());
        formData.append('cardId', this.state.cardId);
        formData.append('duty', this.state.duty);
        //增加一个组的字段
        if (!Utils.isNull(this.state.headUrl)) {
            let array = this.state.headUrl.split('/');
            let imageStr = Utils.removeChinese(array[array.length - 1]);
            let file = {uri: this.state.headUrl, type: 'multipart/form-data', name: imageStr};
            formData.append('files', file);
        } else {
            formData.append('header', '#666');
        }
        HttpUtils.doPostWithToken(fetchUrl.addStudent, formData, {
            onSuccess: (responseData) => {
                console.log('11111111111111', '成功');
                ToastUtils.showToast(responseData.message);
                if (!Utils.isNull(this.onRefresh)) {
                    this.onRefresh();
                }
                goBack();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: () => {

            },
        });
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1,
        },
        textForListTitle: {
            fontSize: 13,
            fontWeight: '400',
            color: colors.text333,
        },
    });
}
