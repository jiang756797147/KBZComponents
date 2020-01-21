import React from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';

import BaseScreen from '../../base/BaseScreen';
import ToastUtils from '../../utils/ToastUtils';
import Utils from '../../utils/Utils';
import HttpUtils from '../../utils/HttpUtils';

import KBHeader from '../../components/KBHeader';
import KBButton from '../../components/KBButton';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';
import CircleImage from '../../components/CircleImage';
import TableView from '../../components/tableView';
import Adapter from '../../components/tableView/Adapter';
import ItemModel from '../../components/tableView/ItemModel';

import TeacherListHolder from './holder/TeacherListHolder';

import fetchUrl from '../../constants/fetchUrl';
import {UPDATE_CONTACT} from '../../constants/notify';
import colors from '../../constants/colors';


export default class TeacherListScreen extends BaseScreen {


    constructor(props) {
        super(props);
        this.adapter = new Adapter();
        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.teacherId = params.teacherId;
        this.isMaster = Utils.isNull(params.isMaster) ? false : params.isMaster;
        this.refreshClassEdit = params.refreshData;
        this.state = Object.assign({
            headmaster: null,
            data: [],
            isEdit: false,
            isRefreshing: false,
            selectedTeacher: null,
            editStatus: {
                value: false,
            },
        }, this.state);

        this.eventEmitter = DeviceEventEmitter;
    }


    getApiUrl() {
        return fetchUrl.getClassTeacherList + 'classIds=' + this.classId;
    }

    onSuccess(responseData) {
        let i = 0;
        this.adapter.removeAll();
        for (let teacher of responseData.data) {
            teacher.headerUrl = Utils.getTeacherAvatar(teacher.header, teacher.sex);
            if (teacher.id === this.teacherId) {
                this.state.headmaster = teacher;
            } else {
                let itemModel = new ItemModel(i, TeacherListHolder);
                itemModel.setAttribute('data', teacher);
                itemModel.setAttribute('customClick', this.itemClick);
                itemModel.setAttribute('isShowPhone', false);
                itemModel.setAttribute('isCanEdit', this.state.editStatus);
                this.adapter.addItem(itemModel);
                i++;
            }
        }

        this.setState({});
    }


    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }

    renderTableHeader() {
        return (
            <View>
                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    justifyContent: 'center',
                    backgroundColor: '#FAFAF8',
                }}>
                    <Text style={{color: colors.text888, fontSize: 13}}>班主任</Text>
                </View>
                <KBButton onPress={() => {
                    // ToastUtils.showToast(data.nickname);
                }}>
                    <View style={{
                        paddingHorizontal: 14,
                        height: 65,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <CircleImage customWidth={45} customHeight={45} imageUrl={Utils.isNull(this.state.headmaster) ?
                            require('../../assets/class/image_boy_tea_head.png') : this.state.headmaster.headerUrl}/>
                        <Text style={{
                            fontSize: 14,
                            color: colors.text333,
                            marginLeft: 10,
                            flex: 1,
                        }}>{Utils.isNull(this.state.headmaster) ? '暂无' : this.state.headmaster.nickname}</Text>
                    </View>
                </KBButton>
                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    justifyContent: 'center',
                    backgroundColor: '#FAFAF8',
                }}>
                    <Text style={{color: colors.text888, fontSize: 13}}>任课老师</Text>
                </View>
            </View>
        );
    };

    renderData() {
        return (
            <TableView style={{backgroundColor: colors.white}} ref={(c) => this.tableView = c} adapter={this.adapter}
                       isRefreshing={this.state.isRefreshing} refresh={() => this.onRefresh()}
                       ListHeaderComponent={this.renderTableHeader()}/>
        );
    }

    renderHeaderRight = () => {
        return (
            <View style={{paddingVertical: 5}}>
                <Text style={{fontSize: 14, color: colors.text888}}>{this.state.isEdit ? '完成' : '管理'}</Text>
            </View>
        );
    };

    render() {
        let renderView = super.render();
        return (
            <View style={styles.container}>
                <KBHeader showDriver={false} isLeft={true} {...this.props} title={'教师列表'}
                          touchRight={() => {
                              let isEdit = this.state.isEdit;
                              this.state.editStatus.value = !isEdit;
                              this.setState({isEdit: !isEdit});
                          }}
                          rightComponent={this.isMaster ? this.renderHeaderRight : null}/>
                {renderView}
                <KBAlertDialog
                    ref={(c) => {
                        this.customDialog = c;
                    }}
                    content={'您确定要移除' + (Utils.isNull(this.state.selectedTeacher) ? null : this.state.selectedTeacher.nickname) + '老师吗?'}
                    rightPress={() => this.delete()}
                    leftPress={() => {
                        this.customDialog.dismiss();
                    }}
                />
            </View>
        );
    }

    delete = () => {
        // this.customDialog.dismiss();
        let formData = new FormData();
        formData.append('classId', this.classId);
        formData.append('teacherIds', this.state.selectedTeacher.id);

        HttpUtils.doPostWithToken(fetchUrl.banTeacher, formData, {
            onSuccess: (responseData) => {
                this.adapter.remove(this.state.index);
                this.tableView.reloadData();
                this.eventEmitter.emit(UPDATE_CONTACT);
                this.refreshClassEdit();
                ToastUtils.showToast('已移出老师' + this.state.selectedTeacher.nickname);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onError: (err) => {
                console.log('err =========', err);
            },
        });
    };
    itemClick = (teacher, index) => {
        this.customDialog.show();
        this.setState({
            selectedTeacher: teacher,
            index: index,
        });
    };

    onRefresh = () => {
        this.setState({isRefreshing: true});
        super.componentDidMount();
    };
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1,
    },
});
