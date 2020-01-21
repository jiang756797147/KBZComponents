import React from 'react';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import BaseScreen from '../../../../base/BaseScreen';

import colors from '../../../../constants/colors';
import image from '../../../../constants/image';
import theme from '../../../../constants/theme';
import fetchUrl from '../../../../constants/fetchUrl';
import {GROUP_UPDATE} from '../../../../constants/notify';

import KBHeader from '../../../../components/KBHeader';
import CircleImage from '../../../../components/CircleImage';
import KBButton from '../../../../components/KBButton';
import KBScrollView from '../../../../components/KBScrollView';
import Divider from '../../../../components/Divider';
import KBImagePicker from '../../../../components/KBImagePicker';

import ToastUtils from '../../../../utils/ToastUtils';
import Utils from '../../../../utils/Utils';
import HttpUtils from '../../../../utils/HttpUtils';

import CustomInputDialog from './view/CustomInputDialog';


export default class GroupNewScreen extends BaseScreen {

    constructor(props) {
        super(props);

        this.state = Object.assign({

            name: '',
            groupNumber: '', //小组序号

            imagePath: '',
            imageUrl: '',

            students: [],

        }, this.state);

        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        this.classId = params.classId;
        this.onRefresh = params.onRefresh;
        this.goBack = goBack;

        this.eventEmitter = DeviceEventEmitter;

    }

    renderData() {

        return (
            <View style={styles.container}>
                <View style={{width: theme.screenWidth, height: 10, backgroundColor: '#FAFAF7'}}/>
                <KBButton onPress={() => this.pickerMenu.show()}>
                    <View style={styles.groupInfoItem}>
                        <Text style={styles.groupInfoItemText}>小组头像：</Text>

                        <CircleImage
                            imageUrl={Utils.isNull(this.state.imageUrl) ? image.defaultGroup : this.state.imageUrl}
                            customWidth={50}
                            customHeight={50}/>
                    </View>
                </KBButton>
                <Divider isMargin={true}/>
                <KBButton onPress={() => {
                    this.inputNamePop.show();
                }}>
                    <View style={styles.groupInfoItem}>
                        <Text style={styles.groupInfoItemText}>小组名称：</Text>
                        <Text style={{
                            color: Utils.isNull(this.state.name) ? colors.text999 : colors.text333,
                            fontSize: 14,
                        }}>{Utils.isNull(this.state.name) ? '输入小组名称' : this.state.name}</Text>
                    </View>
                </KBButton>
                <Divider isMargin={true}/>
                <KBButton onPress={() => {
                    this.inputNumberPop.show();
                }}>
                    <View style={styles.groupInfoItem}>
                        <Text style={styles.groupInfoItemText}>小组序号：</Text>
                        <Text style={{
                            color: Utils.isNull(this.state.groupNumber) ? colors.text999 : colors.text333,
                            fontSize: 14,
                        }}>{Utils.isNull(this.state.groupNumber) ? '输入小组序号' : this.state.groupNumber}</Text>
                    </View>
                </KBButton>


                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    backgroundColor: colors.white,
                }}>
                    <View style={{width: 5, height: 15, borderRadius: 3, backgroundColor: colors.yellowColor}}/>
                    <Text style={{marginLeft: 10, fontSize: 16, color: colors.text666}}>小组成员</Text>
                </View>
                <KBScrollView>
                    <View style={{flexWrap: 'wrap', flexDirection: 'row', backgroundColor: colors.white}}>

                        {this.state.students && this.state.students.length > 0 ?
                            this.state.students.map(this.renderItem)
                            : null
                        }
                        {this.renderAddItem()}
                    </View>
                </KBScrollView>

                {this.renderBottom()}
            </View>
        );
    }

    renderAddItem() {
        return (
            <View style={{
                width: theme.screenWidth / 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
            }}>
                <KBButton onPress={() => this.pushToAddMember()}>
                    <View>
                        <Image style={{width: 60, height: 60}}
                               source={require('../../../../assets/image3.3/group_member_add.png')}/>
                        <Text style={{marginTop: 15, fontSize: 15, color: colors.text333}}>{'添加学生'}</Text>
                    </View>
                </KBButton>
            </View>
        );
    };

    renderBottom() {
        return (
            <View style={[theme.tabBarStyle, {alignItems: 'center', backgroundColor: '#FAFAF7'}]}>
                <KBButton onPress={() => {
                    this.createGroup();
                }}>
                    <View style={{
                        width: theme.screenWidth - 30,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.yellowColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 15, color: colors.text555}}>新建</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    renderItem = (item, index) => {
        let header = Utils.getStudentAvatar(item.header, item.sex);
        return (
            <View key={index} style={{
                width: theme.screenWidth / 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
            }}>
                <CircleImage customWidth={60} customHeight={60}
                             customStyle={{borderWidth: 1, borderColor: '#FB9F74'}} imageUrl={header}/>

                <Text style={{marginTop: 15, fontSize: 15, color: colors.text333}}>{item.name}</Text>
            </View>
        );
    };

    render() {
        let renderView = super.render();
        return (
            <View style={styles.container}>
                <CustomInputDialog
                    ref={(c) => this.inputNamePop = c}
                    alertTitle={'小组名称'}
                    placeholderText={'请输入小组名字'}
                    rightBtnText={'保存'}
                    rightPress={() => {
                        this.inputNamePop.dismiss();
                        this.setState({
                            name: this.inputNamePop.getInputText(),
                        });
                    }}
                />
                <CustomInputDialog
                    ref={(c) => this.inputNumberPop = c}
                    alertTitle={'小组序号'}
                    placeholderText={'请输入小组序号'}
                    rightBtnText={'保存'}
                    rightPress={() => {
                        this.inputNumberPop.dismiss();
                        this.setState({
                            groupNumber: this.inputNumberPop.getInputText(),
                        });
                    }}
                />
                <KBHeader isLeft={true} {...this.props} title="新建小组"/>
                {renderView}
                <KBImagePicker ref={(c) => this.pickerMenu = c} title={'头像选择'}
                               isSingle={true}
                               imagePicked={(image) => {
                                   let imageUrl = {uri: image['path']};
                                   this.setState({
                                       imagePath: image['path'],
                                       imageUrl: imageUrl,
                                   });
                               }}
                />
            </View>
        );
    }

    pushToAddMember = () => {

        const {navigate} = this.props.navigation;

        navigate('GroupMember', {
            isNewGroup: true,
            classId: this.classId,
            groupId: '',
            students: this.state.students,
            getGroupMember: (data) => {
                this.setState({
                    students: data,
                });
            },
        });
    };

    createGroup() {
        if (Utils.isNull(this.state.name)) {
            ToastUtils.showToast('小组名称不能为空！');
            return;
        }
        if (Utils.isNull(this.state.groupNumber)) {
            ToastUtils.showToast('小组序号不能为空！');
            return;
        }

        if (Utils.isArrayNull(this.state.students)) {
            ToastUtils.showToast('请选择小组成员');
            return;
        }

        let studentArr = [];
        for (let obj of this.state.students) {
            let student = {};
            student.studentId = obj.id;
            student.percent = 1;
            studentArr.push(student);
        }

        let formData = new FormData();
        if (Utils.isNull(this.state.imagePath)) {
            let header = '#' + image.defaulImg;
            formData.append('header', header);
        } else {
            let imagePath = this.state.imagePath;
            let array = imagePath.split('/');
            let imageStr = Utils.removeChinese(array[array.length - 1]);
            let file = {uri: imagePath, type: 'multipart/form-data', name: imageStr};
            formData.append('files', file);
        }
        formData.append('name', this.state.name);
        formData.append('sort', this.state.groupNumber);
        formData.append('classId', this.classId);
        formData.append('studentJson', JSON.stringify(studentArr));

        HttpUtils.doPostWithToken(fetchUrl.createGroup, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.onRefresh();
                this.goBack();
                this.eventEmitter.emit(GROUP_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    groupInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    groupInfoItemText: {
        color: colors.text555,
        fontSize: 15,
    },
});
