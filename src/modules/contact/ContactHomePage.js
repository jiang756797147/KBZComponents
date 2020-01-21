import React from 'react';
import {StyleSheet, View, Text, Image, DeviceEventEmitter} from 'react-native';
import BaseScreen from '../../base/BaseScreen';
import KBButton from '../../components/KBButton';
import colors from '../../constants/colors';
import {UPDATE_CONTACT} from '../../constants/notify';
import theme from '../../constants/theme';
import fetchUrl from '../../constants/fetchUrl';

import HttpUtils from '../../utils/HttpUtils';
import ToastUtils from '../../utils/ToastUtils';
import DialogUtils from '../../utils/DialogUtils';
import Utils from '../../utils/Utils';

import ContactList from './view/ContactList';
import ContactHomeHolder from './holder/ContactHomeHolder';
import CustomListDialog from './view/CustomListDialog';
import CircleImage from '../../components/CircleImage';

import ShareUtil from '../../umeng/ShareUtil'
import ContactPopMenu from './view/ContactPopMenu'

export default class ContactHomePage extends BaseScreen {

    SHARE_TEACHER = 'share_teacher';
    SHARE_PARENT = 'share_parent';

    constructor(props) {
        super(props);

        this.state = Object.assign({
            data: [],
            isTeacherShare: true,
            isRefreshing: false,
            classArray: [],    //班级列表
            classMap: [],      //班级Map  key: calssId  value: className
        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
        this.phoneNumber = '';
    }


    // componentWillMount() {
    //     super.componentWillMount();
    //     this.eventEmitter.addListener(UPDATE_CONTACT, this.updateContact.bind(this));
    // }
    //
    // componentWillUnmount() {
    //     super.componentWillUnmount();
    //     this.eventEmitter.removeListener(UPDATE_CONTACT, this.updateContact);
    // }

    updateContact() {
        this.onRefresh();
    }

    componentDidMount() {

        super.componentDidMount();
        this.reloadData();
    }

    onEnd() {}

    getClassList() {
        return new Promise((resolve, reject) => {
            HttpUtils.doGetWithToken(fetchUrl.getClassList, {
                onSuccess: (responseData) => {
                    if (responseData.data && responseData.data.length > 0) {

                        resolve(responseData.data)
                    } else {
                        resolve([]);
                    }
                },
                onFail: () => {
                    resolve([]);
                },
                onNullData: () => {
                    resolve([]);
                },
                onError: () => {
                    resolve([]);
                }
            })
        })
    }

    getTeacherData(classIdStr) {
        return new Promise((resolve, reject) => {
            let url = fetchUrl.getClassTeacherList + 'classIds=' + classIdStr;
            HttpUtils.doGetWithToken(url, {
                onSuccess: (responseData) => {
                    if (responseData.data && responseData.data.length > 0) {
                        let dataArray = [];
                        for (let obj of responseData.data) {
                            obj.isParent = false;
                            dataArray.push(obj);
                        }

                        resolve(dataArray);
                    }else {
                        resolve([]);
                    }
                },
                onFail: (responseData) => {
                    resolve([]);
                },
                onNullData: (responseData) => {
                    resolve([]);
                },
                onError: () => {
                    resolve([]);
                }
            });
        })
    }

    getParentData(classIdStr, classMap) {
        return new Promise((resolve, reject) => {
            let url = fetchUrl.getClassParentList + 'classIds=' + classIdStr;
            HttpUtils.doGetWithToken(url, {
                onSuccess: (responseData) => {
                    if (responseData.data && responseData.data.length > 0) {
                        let dataArray = [];
                        for (let obj of responseData.data) {
                            obj.nickname = obj.name;
                            obj.isParent = true;
                            obj.className = classMap[obj.classId];
                            dataArray.push(obj);
                        }
                        resolve(dataArray);
                    }else {
                        resolve([]);
                    }
                },
                onFail: (responseData) => {
                    resolve([]);
                },
                onNullData: (responseData) => {
                    resolve([]);
                },
                onError: () => {
                    resolve([]);
                }
            });
        })
    }

    async reloadData() {
        try {
            let classList = await this.getClassList();
            if (classList.length > 0) {
                let classIdArray = [];
                let classMap = [];
                for (let classObj of classList) {
                    classIdArray.push(classObj.id);
                    classMap[classObj.id] = classObj.name;
                }
                let classIdStr = classIdArray.join(',');
                let tearcherList = await this.getTeacherData(classIdStr);
                let parentList = await this.getParentData(classIdStr, classMap);
                let data = [...tearcherList, ...parentList];
                this.setState({
                    data: data,
                    isLoading: false,
                    isRefreshing: false,
                    classArray: classList,
                })
            }else {
                super.onNullData();
            }

        }catch (e) {
            super.onError();
        }

    }

    renderTableHeader() {
        return (
            <View>
                <View style={{
                    justifyContent: 'center',
                    backgroundColor: colors.divider,
                    paddingHorizontal: 14,
                    paddingVertical: 5,
                    height: 30,
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: colors.text777,
                    }}>{'班级'}</Text>
                </View>
                {this.state.classArray.map(this.renderClassItem)}
            </View>
        );
    }

    renderClassItem = (item, index) => {
        return (
            <KBButton key={index}
                      onPress={() => {
                          const {navigate} = this.props.navigation;
                          navigate('ClassEdit', {classId: item.id});
                      }}
            >
                <View style={{
                    backgroundColor: colors.white,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    height: 65,
                    borderColor: colors.divider,
                }}>
                    <View style={{
                        flex: 1,
                        paddingHorizontal: 14,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}>
                        <CircleImage customWidth={45} customHeight={45}
                                  imageUrl={Utils.getClassAvatar(item.headUrl)}
                        />
                        <View style={{marginLeft: 10, flex: 1}}>
                            <Text style={{
                                fontSize: 14,
                                color: colors.text333,
                            }}>{item.name}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: colors.text999,
                                marginTop: 10,
                            }}>{'班级码' + item.inviteCode}</Text>
                        </View>
                    </View>
                </View>
            </KBButton>
        );
    };

    renderData() {

        let tableHeaderHeight = 30 + this.state.classArray.length * 65;
        return (
            <View style={{flex: 1}}>
                {this.renderShare()}
                <ContactList listData={this.state.data} isRefreshing={this.state.isRefreshing}
                             refresh={this.onRefresh}
                             letterTop={theme.headerHeight + theme.withoutStatusHeight}
                             customHolder={ContactHomeHolder}
                             customClick={this.popDialogShow}
                             renderTableHeader={this.renderTableHeader()}
                             tableHeaderHeight={tableHeaderHeight}
                             listKey={'nickname'}/>
            </View>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <View style={styles.container}>
                {this.state.isNullData ? this.renderNullDataView(null, '还没有加入班级') : renderView}
                <CustomListDialog
                    ref={(c) => {
                        this.listDialog = c;
                    }}
                    data={this.state.classArray}
                    submit={(data) => this.shareClass(data)}
                />
                <ContactPopMenu
                    ref={(c) => this.contactPop = c}
                    popPhone={this.phoneNumber}
                />
            </View>
        );
    }

    //邀请老师和家长
    renderShare() {
        return (
            <View style={{marginTop: 7, flexDirection: 'row', backgroundColor: colors.white, marginBottom: 5}}>
                <KBButton style={{flex: 1}}
                          onPress={() => {
                              this.share(true);
                          }}>
                    <View
                        style={{
                            flex: 1,
                            height: 35,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Image resizeMode={'contain'}
                               style={{width: 15, height: 15, marginRight: 10}}
                               source={require('../../assets/invitation.png')}/>
                        <Text style={{fontSize: 14, color: colors.text333}}>邀请老师</Text>
                    </View>
                </KBButton>
                <View style={{width: 1, height: 20, marginVertical: 10, backgroundColor: colors.divider}}/>
                <KBButton style={{flex: 1}}
                          onPress={() => {
                              this.share(false);
                          }}>
                    <View
                        style={{
                            flex: 1,
                            height: 35,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}>
                        <Image resizeMode={'contain'}
                               style={{width: 15, height: 15, marginRight: 10}}
                               source={require('../../assets/invitation.png')}/>
                        <Text style={{fontSize: 14, color: colors.text333}}>邀请家长</Text>
                    </View>
                </KBButton>

            </View>
        );
    }

    popDialogShow = (phone) => {
        this.phoneNumber = phone;
        this.setState({}, () => {
            this.contactPop.show();
        })

    };

    onRefresh = () => {
        this.setState({isRefreshing: true});
        super.componentDidMount();
    };

    share(type) {

        if (this.state.classArray && this.state.classArray.length > 0) {
            this.listDialog.show();
            this.setState({
                isTeacherShare: type,
            });
        } else {
            ToastUtils.showToast('暂无班级不能分享！');
        }
    };

    shareClass(data) {

        let text1 = '输入班级编号：' + data.inviteCode + '，加入' + data.name + '，关注班级动态了解孩子在校情况。';
        let text2 = '输入班级编号：' + data.inviteCode + '，加入' + data.name + '，与班主任老师一起管理班级吧。';
        let shareText = this.state.isTeacherShare ? text2 : text1;
        let title = '邀请您加入班级';
        let img = 'https://mobile.umeng.com/images/pic/home/social/img-1.png';
        // let img = 'assets/class/image_group_head.png';
        let url = fetchUrl.webBaseUrl + 'index/page/teacher_aboutus.html';
        let platform = 2;
        let list = [2];

        ShareUtil.share(shareText, img, url, title, platform, (code, message) => {
            console.log('sharecode ========', code);
            console.log('sharemessage ========', message);
        });
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.empty,
        flex: 1,
    },
    item: {
        backgroundColor: colors.white,
        justifyContent: 'center',
        height: 45,
    },
});
