import React from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter, Image} from 'react-native';
import BaseScreen from '../../base/BaseScreen';

import theme from '../../constants/theme';
import colors from '../../constants/colors';
import {UPDATE_CONTACT} from '../../constants/notify';
import fetchUrl from '../../constants/fetchUrl';
import image from '../../constants/image';

import ToastUtils from '../../utils/ToastUtils';
import HttpUtils from '../../utils/HttpUtils';
import Utils from '../../utils/Utils';

import KBHeader from '../../components/KBHeader';
import KBAlertDialog from '../../components/dialog/KBAlertDialog';

import {renderers} from '../../components/popMenu/src';
import KBDropPopMenu from '../../components/popMenu/KBDropPopMenu';
import TextInputWithClear from '../../components/TextInputWithClear';
import Divider from '../../components/Divider';
import KBButton from '../../components/KBButton';

import ContactList from './view/ContactList';
import ContactParentPhoneHolder from './holder/ContactParentPhoneHolder';


export default class ParentListScreen extends BaseScreen {

    headerData = [
        {
            text: '管理',
            value: 0,
        },

    ];

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.isMaster = Utils.isNull(params.isMaster) ? false : params.isMaster;
        // if (this.isMaster) {
        this.headerData.push({
            text: '设置',
            value: 1,
        });
        // }
        this.refreshClassEdit = params.refreshData;
        this.state = Object.assign({
            data: [],
            isEdit: false,
            setScore: false,
            score: 0,
            number: 0,
            isRefreshing: false,
            selectedParent: null,
            attributes: [
                {key: 'isShowPhone', value: false},
                {key: 'isCanEdit', value: false},
            ],
        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
    }

    componentDidMount() {
        super.componentDidMount();
        this.getParentSetting();
    }

    getParentSetting() {
        let url = `${fetchUrl.getAccessScore}classId=${this.classId}`;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                if (responseData.data && responseData.data.length > 0) {
                    let data = responseData.data[0];
                    this.setState({
                        score: data.accessScore,
                        number: data.ticketNum,
                    });
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }

    getApiUrl() {
        return fetchUrl.getClassParentList + 'classIds=' + this.classId;
    }

    onSuccess(responseData) {
        for (let item of responseData.data) {
            item.familyName = Utils.getFamilyName(item.type);
            item.headerUrl = Utils.getStudentAvatar(item.header, item.sex);
        }
        this.setState({data: responseData.data});
    }

    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }

    renderData() {
        return (
            <ContactList
                ref={(c) => this.tableView = c}
                listData={this.state.data}
                letterTop={theme.headerHeight}
                customHolder={ContactParentPhoneHolder}
                customAttribute={this.state.attributes}
                isRefreshing={this.state.isRefreshing}
                refresh={() => this.onRefresh()}
                customClick={this.itemClick}
                listKey={'name'}/>
        );
    }

    renderHeaderRight = () => {
        return (
            <View style={{paddingVertical: 5}}>
                <Text style={{fontSize: 14, color: colors.text888}}>{this.state.isEdit ? '完成' : '管管'}</Text>
            </View>
        );
    };

    render() {
        let renderView = super.render();
        return (
            <View style={this.styles.container}>
                <KBHeader isLeft={true}
                          {...this.props}
                          title={'家长列表'}
                />
                {renderView}
                {
                    this.state.isEdit ?
                        <KBButton onPress={() => {
                            let isEdit = this.state.isEdit;
                            this.state.attributes[1].value = !isEdit;
                            this.setState({isEdit: !isEdit});
                        }
                        }>
                            <View>
                                <Divider/>
                                <Text style={this.styles.okButton}>完成</Text>
                            </View>
                        </KBButton>
                        :
                        null
                }

                <KBDropPopMenu
                    renderer={renderers.PopoverNew}
                    rendererProps={{placement: 'bottom', preferredPlacement: 'top'}}
                    menuStyle={{position: 'absolute', right: 0, top: theme.statusHeight}}
                    menuTriggerStyle={{width: 50, height: theme.withoutStatusHeight}}
                    menuTrigger={() => {
                        return (
                            <View>
                                <Image style={{width: 3, height: 15}}
                                       source={image.navRightMore}
                                />
                            </View>
                        );
                    }}
                    optionsStyle={{width: theme.screenWidth / 4, marginTop: 0,}}
                    optionStyle={{justifyContent: 'center', alignItems: 'center',}}
                    dataArray={this.headerData}
                    uniqueKey={'text'}
                    textStyle={{color: colors.white, fontSize: 15}}
                    onSelect={(value) => this.headRightClick(value)}
                />

                <KBAlertDialog
                    ref={(c) => {
                        this.customDialog = c;
                    }}
                    content={'您确定要移除' + (Utils.isNull(this.state.selectedParent) ? null : this.state.selectedParent.name + '的' + this.state.selectedParent.familyName) + '吗?'}
                    rightPress={() => this.delete()}
                    leftPress={() => {
                        this.customDialog.dismiss();
                    }}
                />
                <KBAlertDialog
                    ref={(c) => {
                        this.settingDialog = c;
                    }}
                    title={'设置'}
                    contentComponent={() => {
                        return (
                            <View style={{marginTop: 10}}>
                                {this.renderDialogContent('家长权限分数', this.state.score)}
                                {this.renderDialogContent('家长权限次数', this.state.number)}
                            </View>
                        );
                    }}
                    rightPress={() => this.setScorePost()}
                    leftPress={() => {
                        this.settingDialog.dismiss();
                    }}
                />
            </View>
        );
    }

    renderDialogContent(title, value) {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    flexDirection: 'row',
                }}>

                <View style={{height: 40, justifyContent: 'center'}}>
                    <Text style={{fontSize: 15, color: colors.text444}}>{`${title}：`}</Text>
                </View>
                <TextInputWithClear
                    inputStyle={{fontSize: 15, color: colors.text444, textAlignVertical: 'center'}}
                    viewStyle={{
                        paddingHorizontal: 5,
                        height: 40,
                        backgroundColor: colors.white,
                    }}
                    showDriver={false}
                    multiline={true}
                    defaultText={value.toString()}
                    blurOnSubmit={true}
                    clearIconVisible={false}
                    placeholderText={'请输入分数'}
                    onTextChange={(text) => {
                        if (title === '家长权限分数') {
                            this.setState({score: text});
                        } else {
                            this.setState({number: text});
                        }
                    }}
                />
            </View>
        );
    }

    /**
     * 设置分数请求(教师端设置权限分）
     */
    setScorePost = () => {

        this.settingDialog.dismiss();

        let formData = new FormData();
        formData.append('classId', this.classId);
        formData.append('accessScore', this.state.score);
        formData.append('ticketNum', this.state.number);


        HttpUtils.doPostWithToken(fetchUrl.addAccessScore, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });


    };

    /**
     * header右侧按钮
     */
    headRightClick(value) {
        console.log('value ================', value);
        switch (value.index) {
            case 0: {
                let isEdit = this.state.isEdit;
                this.state.attributes[1].value = !isEdit;
                this.setState({isEdit: !isEdit});
            }
                break;
            case 1: {
                setTimeout(() => {
                    this.settingDialog.show();
                }, 10);
            }
                break;

        }
    }

    delete = () => {
        let formData = new FormData();
        formData.append('parentIds', this.state.selectedParent.id);
        HttpUtils.doPostWithToken(fetchUrl.banParent, formData, {
            onSuccess: (responseData) => {
                this.tableView.remove(this.state.index, this.state.selectedParent);
                this.refreshClassEdit();
                this.eventEmitter.emit(UPDATE_CONTACT);
                ToastUtils.showToast('已移出' + this.state.selectedParent.name + '家长');
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    itemClick = (parent, index) => {
        this.customDialog.show();
        this.setState({
            selectedParent: parent,
            index: index,
        });
    };

    onRefresh = () => {
        this.setState({isRefreshing: true});
        super.componentDidMount();
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: colors.white,
            flex: 1,
        },
        okButton: {
            padding: 10,
            width: theme.screenWidth,
            height: theme.withoutStatusHeight,
            textAlign: 'center',
            fontSize: 17,
            color: colors.text444,
        },
    });
}
