import React from 'react';
import {Container} from 'native-base';
import {
    Text,
    View,
    Image,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';
import BaseScreen from '../../../../base/BaseScreen';
import KBButton from '../../../../components/KBButton';
import CircleImage from '../../../../components/CircleImage';
import KBScrollView from '../../../../components/KBScrollView';
import KBHeader from '../../../../components/KBHeader';
import Divider from '../../../../components/Divider';
import KBImagePicker from '../../../../components/KBImagePicker';
import KBAlertDialog from '../../../../components/dialog/KBAlertDialog';

import theme from '../../../../constants/theme';
import colors from '../../../../constants/colors';
import fetchUrl from '../../../../constants/fetchUrl';
import image from '../../../../constants/image';
import {GROUP_UPDATE} from '../../../../constants/notify';

import ToastUtils from '../../../../utils/ToastUtils';
import Utils from '../../../../utils/Utils';
import HttpUtils from '../../../../utils/HttpUtils';

import CustomInputDialog from './view/CustomInputDialog';

export default class GroupDetailScreen extends BaseScreen {

    constructor(props) {
        super(props);


        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        this.isMaster = params.isMaster;
        this.groupData = params.groupData;
        this.groupId = this.groupData.id;
        this.classId = this.groupData.class_id;

        this.onRefresh = params.onRefresh;
        this.goBack = goBack;

        this.state = Object.assign({

            name: this.groupData.name,
            groupNumber: this.groupData.sort, //小组序号
            imagePath: this.groupData.header,
            imageUrl: Utils.getTeamAvatar(this.groupData.header),
            students: this.groupData.students,

            changedImage: false,

            isEdit: false,
        }, this.state);

        this.eventEmitter = DeviceEventEmitter;
    }

    renderData() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{width: theme.screenWidth, height: 10, backgroundColor: '#FAFAF7'}}/>
                {this.renderGroupInfo()}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                    backgroundColor: colors.white,
                }}>
                    <View style={{width: 5, height: 15, borderRadius: 3, backgroundColor: colors.yellowColor}}/>
                    <Text style={{marginLeft: 10, fontSize: 16, color: colors.text666}}>小组成员</Text>
                </View>
                <KBScrollView>
                    <View style={{flexWrap: 'wrap', flexDirection: 'row', backgroundColor: colors.white}}>
                        {this.state.students.map(this.renderItem)}
                        {this.isMaster && this.state.isEdit ? this.renderAddItem() : null}
                    </View>
                </KBScrollView>
                {this.isMaster ? this.renderBottom() : null}
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

    renderItem = (item, index) => {
        let header = Utils.getStudentAvatar(item.header, item.sex);
        return (
            <View key={index} style={{
                width: theme.screenWidth / 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
            }}>
                <View style={{width: 60, height: 60}}>
                    <CircleImage customWidth={60} customHeight={60}
                                 customStyle={{borderWidth: 1, borderColor: '#FB9F74'}} imageUrl={header}/>
                    {/*{this.state.isEdit ?*/}
                    {/*<KBButton style={{position: 'absolute', top: 0, right: 0}}*/}
                    {/*onPress={() => {*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*<View style={{position: 'absolute', top: 0, right: 0}}>*/}
                    {/*<Image style={{width: 20, height: 20}}*/}
                    {/*source={require('../../../../assets/image3.3/group_member_delete.png')}/>*/}
                    {/*</View>*/}
                    {/*</KBButton> : null*/}
                    {/*}*/}
                </View>

                <Text style={{marginTop: 15, fontSize: 15, color: colors.text333}}>{item.name}</Text>
            </View>
        );
    };

    renderGroupInfo() {
        return (
            <View>
                <KBButton onPress={() => {
                    if (this.state.isEdit) {
                        this.pickerMenu.show();
                    }
                }}>
                    <View style={styles.groupInfoItem}>
                        <Text style={styles.groupInfoItemText}>小组头像：</Text>

                        <CircleImage
                            imageUrl={this.state.imageUrl}
                            customWidth={50}
                            customHeight={50}/>
                    </View>
                </KBButton>
                <Divider isMargin={true}/>
                <KBButton onPress={() => {
                    if (this.state.isEdit) {
                        this.inputNamePop.show();
                    }
                }}>
                    <View style={styles.groupInfoItem}>
                        <Text style={styles.groupInfoItemText}>小组名称：</Text>
                        <Text style={{
                            color: Utils.isNull(this.state.name) || !this.state.isEdit ? colors.text999 : colors.text333,
                            fontSize: 14,
                        }}>{Utils.isNull(this.state.name) ? '输入小组名称' : this.state.name}</Text>
                    </View>
                </KBButton>
                <Divider isMargin={true}/>
                <KBButton onPress={() => {
                    if (this.state.isEdit) {
                        this.inputNumberPop.show();
                    }
                }}>
                    <View style={styles.groupInfoItem}>
                        <Text style={styles.groupInfoItemText}>小组序号：</Text>
                        <Text style={{
                            color: Utils.isNull(this.state.groupNumber) || !this.state.isEdit ? colors.text999 : colors.text333,
                            fontSize: 14,
                        }}>{Utils.isNull(this.state.groupNumber) ? '输入小组序号' : this.state.groupNumber}</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    renderHeader() {
        return (
            <KBHeader
                isLeft={true}
                title={'小组详情'}
                rightText={this.state.isEdit ? '取消' : '编辑'}
                rightStyle={{fontSize: 13, color: colors.text666}}
                touchRight={() => {
                    this.setState({
                        isEdit: !this.state.isEdit,
                    });
                }}
                {...this.props}
            />
        );
    }

    renderBottom() {
        return (
            <View style={[theme.tabBarStyle, {alignItems: 'center', backgroundColor: '#FAFAF7'}]}>
                <KBButton onPress={() => {
                    if (this.state.isEdit) {
                        this.updateGroup();
                    } else {
                        this.deleteDialog.show();
                    }
                }}>
                    <View style={{
                        width: theme.screenWidth - 30,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.yellowColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 15, color: colors.text555}}>{this.state.isEdit ? '保存' : '删除'}</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    render() {
        let renderView = super.render();

        return (
            <Container style={{flex: 1, backgroundColor: '#FAFAF7'}}>
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
                <KBAlertDialog
                    ref={(c) => this.deleteDialog = c}
                    content={'您确定要删除该小组吗?'}
                    rightPress={() => {
                        this.deleteGroup();
                    }}
                    leftPress={() => {
                        this.deleteDialog.dismiss();
                    }}
                />
                {renderView}
                <KBImagePicker ref={(c) => this.pickerMenu = c} title={'头像选择'}
                               isSingle={true}
                               imagePicked={(image) => {
                                   let imageUrl = {uri: image['path']};
                                   this.setState({
                                       imagePath: image['path'],
                                       imageUrl: imageUrl,
                                       changedImage: true,
                                   });
                               }}
                />
            </Container>
        );
    }

    pushToAddMember = () => {

        const {navigate} = this.props.navigation;

        console.log('this.state.students',this.state.students);
        navigate('GroupMember', {
            isNewGroup: false,
            classId: this.classId,
            groupId: this.groupId,
            students: this.state.students,
            getGroupMember: (data) => {
                this.setState({
                    students: data,
                });
            },
        });
    };

    updateGroup() {

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
        if (this.state.changedImage) {
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
        }
        formData.append('name', this.state.name);
        formData.append('classId', this.classId);
        formData.append('groupId', this.groupId);
        formData.append('sort', this.state.groupNumber);
        formData.append('studentJson', JSON.stringify(studentArr));

        HttpUtils.doPostWithToken(fetchUrl.updateGroup, formData, {
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

    deleteGroup() {

        let formData = new FormData();
        formData.append('groupId', this.groupId);

        HttpUtils.doPostWithToken(fetchUrl.deleteGroup, formData, {
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
