import React from 'react';
import {Button} from 'native-base';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import BaseScreen from '../../../../base/BaseScreen';

import {CLSASS_SETTLEMENT, UPDATE_OPTION} from '../../../../constants/notify';
import theme from '../../../../constants/theme';
import fetchUrl from '../../../../constants/fetchUrl';
import UserData from '../../../../constants/UserData';
import colors from '../../../../constants/colors';

import Divider from '../../../../components/Divider';
import CircleImage from '../../../../components/CircleImage';
import KBButton from '../../../../components/KBButton';
import KBPopupDialog from '../../../../components/dialog/KBPopupDialog';
import KBScrollView from '../../../../components/KBScrollView';
import TextInputWithClear from '../../../../components/TextInputWithClear';

import KBImagePicker from '../../../../components/KBImagePicker';
import ToastUtils from '../../../../utils/ToastUtils';
import Utils from '../../../../utils/Utils';
import SQLite from '../../../../utils/SQLite';
import HttpUtils from '../../../../utils/HttpUtils';
import StorageUtils from '../../../../utils/StorageUtils';


export default class ClassEditScreenNew extends BaseScreen {

    classSelttlementList = [
        {title: '每周——结算', isSelected: false, type: '0'},
        {title: '每月——结算', isSelected: false, type: '1'},
        // {title: '学期——结算', isSelected: false, type: "2"},
        {title: '总分——结算', isSelected: false, type: '3'},
    ];
    improvePopCheckData = [
        {checkedName: '全部', isChecked: true},
        {checkedName: '仅学生', isChecked: false},
        {checkedName: '仅小组', isChecked: false},
    ];

    constructor(props) {
        super(props);

        this.sqLite = new SQLite();

        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.isMaster = params.isMaster;
        this.state = Object.assign({
            improveNameCheck: '暂无',
            improveRangeCheck: '暂无',
            classData: [],
            // imageUrl: image.defaulImg,
            imagePath: '',
            isMaster: false,
            teacherId: null,
            isRefreshing: false,
            header: '',
            optionKindType: 2,  //用于新增事项分类网络请求
            optionKindName: '', //用于新增事项分类网络请求
            optionKindId: '',   //用于删除事项分类网络请求
        }, this.state);

        this.eventEmitter = DeviceEventEmitter;

    }

    componentDidMount() {
        super.componentDidMount();
        //开启数据库
        if (!this.db) {
            this.db = this.sqLite.open();
        }
        StorageUtils._load('classSelttlement', (data) => {

            if (Utils.isNull(data)) {
                this.classSelttlementList[0].isSelected = true;
                this.setState({});
            } else {
                for (let obj of this.classSelttlementList) {
                    if (obj.type == data) {
                        obj.isSelected = true;
                        return;
                    }
                }
                this.setState({});
            }
        }, (err) => {
            this.classSelttlementList[0].isSelected = true;
            this.setState({});
        });
    }

    getApiUrl() {
        return fetchUrl.getClassDetails + 'classIds=' + this.classId;
    }

    onSuccess(responseData) {
        if (responseData.data && responseData.data.length > 0) {

            this.rankSwitch = responseData.data[0].rankSwitch;
            this.setState({
                classData: responseData.data[0],
                teacherId: responseData.data[0].teacherId,
                isMaster: (responseData.data[0].teacherId === UserData.getInstance().getId()) || this.isMaster,
            }, () => {
                this.state.classData.headImg = Utils.getClassAvatar(this.state.classData.header);
                // console.log("header  ========", this.state.classData.headImg);
            });
        }
    }

    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }

    renderImproveItem = ({id, name, type}, index, data) => { //type 事项分类类型;0:仅学生;1:小组;2:两者
        return (type === 0 || type === 1 || type === 2 ?
                <KBButton key={index} onPress={() => {
                    if (this.state.isMaster) {
                        let improveRange = type === 2 ? '全部' : (type === 1 ? '仅小组' : '仅学生');
                        this.setState({
                            improveNameCheck: name,
                            improveRangeCheck: improveRange,
                            optionKindId: id,
                        }, () => {
                            this.improvePop.show();
                        });
                    }
                }}>
                    <View
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 7,
                            flexDirection: 'row',
                            backgroundColor: '#F7F7F2',
                            marginVertical: 6,
                            marginHorizontal: 7,
                            borderRadius: 3,
                        }}>
                        <View>
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: 13,
                                    color: colors.text555,
                                }}>{name}</Text>
                        </View>
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            right: -5,
                            paddingHorizontal: 3,
                            height: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderTopRightRadius: 3,
                            borderBottomLeftRadius: 3,
                            backgroundColor: type === 0 ? '#77BBFA' : (type === 1 ? '#FF8DA5' : colors.reduceColor),
                        }}>
                            <Text style={{
                                fontSize: 9,
                                color: colors.white,
                            }}>{type === 0 ? '学' : type === 1 ? '组' : '通用'}</Text>
                        </View>

                    </View>
                </KBButton> : null
        );
    };

    renderClassSettlementItem = (item, index) => {
        return (
            <KBButton key={index}
                      onPress={() => this.classSettlementChanged(item)}
            >
                <View style={{
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                }}>
                    <Text style={{flex: 1, fontSize: 13, color: colors.text444}}>{item.title}</Text>
                    <Image style={{width: 15, height: 15}} resizeMode={'contain'}
                           source={item.isSelected ? require('../../../../assets/class/class_ic_selected.png') :
                               require('../../../../assets/class/class_btn_choice_d.png')}/>
                </View>
            </KBButton>
        );
    };

    classSettlementChanged(item) {
        if (item.isSelected) {
            return;
        } else {
            for (let obj of this.classSelttlementList) {
                obj.isSelected = false;
            }
            item.isSelected = true;
            this.setState({}, () => {
                StorageUtils._sava('classSelttlement', item.type);
                UserData.getInstance().setScoreFilter(item.type);
                this.eventEmitter.emit(CLSASS_SETTLEMENT, {
                    scoreFilter: item.type,
                });
            });
        }
    }

    renderImprovePop() {
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <View
                        style={{flexDirection: 'row', marginVertical: 15, paddingHorizontal: 14, alignItems: 'center'}}>
                        <Text style={[{flex: 1}, this.styles.textForListTitle]}>表扬待改进类型</Text>
                        <Text
                            style={{fontSize: 13, color: colors.text999}}>{this.state.improveNameCheck}</Text>
                    </View>
                    <Divider customStyle={{width: theme.screenWidth * 0.85 - 28, marginHorizontal: 14}}/>
                    <View
                        style={{flexDirection: 'row', marginVertical: 15, paddingHorizontal: 14, alignItems: 'center'}}>
                        <Text style={[{flex: 1}, this.styles.textForListTitle]}>可见范围</Text>
                        <Text
                            style={{fontSize: 13, color: colors.text999}}>{this.state.improveRangeCheck}</Text>
                    </View>
                    <KBButton onPress={() => {
                        this.deleteOptionKind();
                    }}>
                        <View style={{
                            width: theme.screenWidth * 0.85,
                            height: 40,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            backgroundColor: '#FFDB49',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{color: colors.text333, fontSize: 14}}>删除</Text>
                        </View>
                    </KBButton>
                </View>
                <KBButton onPress={() => {
                    this.improvePop.dismiss();
                }}>
                    <View style={{marginTop: 20}}>
                        <Image source={require('../../../../assets/icon_close.png')} style={{width: 30, height: 30}}/>
                    </View>
                </KBButton>
            </View>
        );
    }

    renderImprovePopCheck = ({checkedName, isChecked}, index, data) => {
        return (
            <KBButton key={index} onPress={() => {
                for (let i = 0; i < data.length; i++) {
                    data[i].isChecked = index === i;
                }
                this.state.optionKindType = checkedName === '仅学生' ? 0 : checkedName === '仅小组' ? 1 : 2;
                this.setState({});
            }}>
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    marginLeft: index === 0 ? -6 : 15,
                    alignItems: 'center',
                }}>
                    <Image
                        source={isChecked ? require('../../../../assets/class/class_ic_selected.png') :
                            require('../../../../assets/class/class_btn_choice_d.png')}
                        style={{width: 13, height: 13}}/>
                    <Text
                        style={{marginLeft: 5, color: isChecked ? colors.text333 : colors.text999}}>{checkedName}</Text>
                </View>
            </KBButton>
        );
    };

    renderImproveAddPop() {
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View
                    style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <Text style={[{marginLeft: 14, marginTop: 15}, this.styles.textForListTitle]}>新增表扬待改进类型</Text>
                    <TextInputWithClear
                        onTextChange={(text) => {
                            this.state.optionKindName = text;
                        }}
                        placeholderText={'输入表扬待改进类型(最多12个字)'}
                        onFocusUnderlineColor={colors.text999}
                        inputStyle={{height: 30}}
                        viewStyle={{
                            marginTop: 20,
                            marginHorizontal: 14,
                            flex: 0,
                        }}/>
                    <Text style={[{marginLeft: 14, marginTop: 18}, this.styles.textForListTitle]}>可见范围</Text>
                    <View style={{flexDirection: 'row', paddingHorizontal: 14, marginTop: 15}}>
                        {this.improvePopCheckData.map(this.renderImprovePopCheck)}
                    </View>
                    <KBButton onPress={() => {
                        if (Utils.isNull(this.state.optionKindName)) {
                            ToastUtils.showToast('请输入表扬待改进类型');
                        } else {
                            this.createOptionKind();
                        }
                    }}>
                        <View style={{
                            width: theme.screenWidth * 0.85,
                            height: 40,
                            marginTop: 25,
                            borderBottomLeftRadius: 5,
                            borderBottomRightRadius: 5,
                            backgroundColor: '#FFDB49',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{color: colors.text333, fontSize: 14}}>保存</Text>
                        </View>
                    </KBButton>
                </View>
                <KBButton onPress={() => {
                    this.improveAddPop.dismiss();
                }}>
                    <View style={{marginTop: 20}}>
                        <Image source={require('../../../../assets/class/pop_ic_close.png')}
                               style={{width: 30, height: 30}}/>
                    </View>
                </KBButton>
            </View>
        );
    };

    setRankSwitch = () => {

        const {navigate} = this.props.navigation;
        navigate('ParentalPermission', {
            classId: this.classId,
            isMaster: this.state.isMaster,
            rankSwitch: this.rankSwitch,
            // refreshData: this.refreshData,
        });


        // let formData = new FormData();
        // formData.append('rankSwitch', this.rankSwitch == 1 ? 0 : 1);
        // formData.append('classId', this.classId);
        //
        // HttpUtils.doPostWithToken(fetchUrl.setRankSwitch, formData, {
        //     onSuccess: (responseData) => {
        //         if (this.rankSwitch == 1) {
        //             this.rankSwitch = 0;
        //         } else {
        //             this.rankSwitch = 1;
        //         }
        //         this.setState({});
        //     },
        //     onFail: function (responseData) {
        //         ToastUtils.showToast(responseData.message);
        //     },
        // });

    };


    renderData() {
        const {navigate} = this.props.navigation;
        return (
            <KBScrollView style={{backgroundColor: colors.white}} showsVerticalScrollIndicator={false}
                          isRefreshControl={true}
                          isRefreshing={this.state.isRefreshing}
                          onRefresh={this.refreshData}
            >
                <View style={{backgroundColor: colors.white, flex: 1}}>
                    <View style={this.styles.viewForHeader}>
                        <View style={{flex: 1}}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '400',
                                color: colors.text333,
                            }}>{this.state.classData.name}</Text>
                            <Text style={{
                                fontSize: 13,
                                color: colors.text888,
                                marginTop: 7,
                            }}>班级号:{this.state.classData.inviteCode}</Text>
                        </View>
                        <KBButton onPress={() => {
                            if (this.state.isMaster) {
                                this.imagePicker.show();
                            }
                        }}>
                            <View style={{marginBottom: 14, width: 65, height: 65}}>
                                {Utils.isNull(this.state.classData.headImg) ? null :
                                    <CircleImage customWidth={65} customHeight={65}
                                                 imageUrl={this.state.classData.headImg}/>
                                }
                            </View>
                        </KBButton>
                    </View>

                    <KBButton style={{backgroundColor: colors.white}}
                              onPress={() => this.setRankSwitch()}
                    >
                        <View style={{
                            flexDirection: 'row',
                            paddingHorizontal: 14,
                            justifyContent: 'space-between',
                            paddingVertical: 16,
                        }}>
                            <Text style={{fontSize: 15, color: colors.text333}}>家长端权限设置</Text>

                            <Image resizeMode={'contain'} style={{height: 13, width: 13, marginLeft: 100 - 10}}
                                   source={require('../../../../assets/icon_right.png')}/>

                        </View>
                    </KBButton>

                    <Divider isMargin={false} customHeight={1}/>

                    <View style={this.styles.viewForList}>
                        <KBButton
                            style={{flex: 4}}
                            onPress={() => {
                                navigate('TeacherList', {
                                    classId: this.classId,
                                    isMaster: this.state.isMaster,
                                    teacherId: this.state.teacherId,
                                    refreshData: this.refreshData,
                                });
                            }}>
                            <View style={this.styles.viewForListLeft}>
                                <Image style={{width: 70, height: 60}} resizeMode={'cover'}
                                       source={require('../../../../assets/class/image_teacher_list.png')}/>
                                <Text style={[this.styles.textForListTitle, {marginTop: 5}]}>教师列表</Text>
                                <Text style={this.styles.textForListLength}>共{this.state.classData.teacherNum}人</Text>
                            </View>
                        </KBButton>
                        <View style={{flex: 6, marginLeft: 8}}>
                            <KBButton
                                style={{flex: 1}}
                                onPress={() => {
                                    navigate('ParentList', {
                                        classId: this.classId,
                                        isMaster: this.state.isMaster,
                                        refreshData: this.refreshData,
                                    });
                                }}>
                                <View style={this.styles.viewForListRightTop}>
                                    <View>
                                        <Text style={this.styles.textForListTitle}>家长列表</Text>
                                        <Text
                                            style={this.styles.textForListLength}>共{this.state.classData.parentNum}人</Text>
                                    </View>
                                    <Image source={require('../../../../assets/class/image_parent_list.png')}
                                           style={{width: 45, height: 45}}
                                           resizeMode={'contain'}/>
                                </View>
                            </KBButton>
                            <KBButton style={{flex: 1}}
                                      onPress={() => {
                                          navigate('StudentList', {
                                              classId: this.classId,
                                              isMaster: this.state.isMaster,
                                              refreshData: this.refreshData,
                                          });
                                      }}>
                                <View style={this.styles.viewForListRightBottom}>
                                    <View>
                                        <Text style={this.styles.textForListTitle}>学生列表</Text>
                                        <Text
                                            style={this.styles.textForListLength}>共{this.state.classData.studentNum}人</Text>
                                    </View>
                                    <Image source={require('../../../../assets/class/image_student_list.png')}
                                           style={{width: 45, height: 45}}
                                           resizeMode={'contain'}/>
                                </View>
                            </KBButton>
                        </View>
                    </View>
                    <Divider customHeight={8} customColor={'#F9F9F6'}/>

                    <View style={{paddingHorizontal: 14}}>
                        <View style={{paddingVertical: 11, alignItems: 'center', flexDirection: 'row'}}>
                            <Image source={require('../../../../assets/class/ic_type.png')}
                                   style={{width: 15, height: 15}}/>
                            <Text style={[this.styles.textForListTitle, {marginLeft: 8}]}>表扬待改进类型</Text>
                        </View>
                        <Divider isMargin={true}/>
                        <View
                            style={{flexDirection: 'row', paddingVertical: 6, marginHorizontal: -7, flexWrap: 'wrap'}}>
                            {this.state.classData.classKindList.map(this.renderImproveItem)}
                            {this.state.isMaster ?
                                <KBButton onPress={() => {
                                    this.improveAddPop.show();
                                }}>
                                    <View
                                        style={{
                                            paddingHorizontal: 16,
                                            paddingVertical: 7,
                                            backgroundColor: '#F7F7F2',
                                            marginVertical: 6,
                                            marginHorizontal: 7,
                                            borderRadius: 3,
                                        }}>
                                        <Text numberOfLines={1}
                                              style={{fontSize: 13, color: '#FF6943'}}>+ 新增</Text>
                                    </View>
                                </KBButton>
                                : null}
                        </View>
                    </View>
                    <Divider customHeight={8} customColor={'#F9F9F6'}/>

                    <View>
                        <View style={{
                            paddingVertical: 11,
                            paddingHorizontal: 14,
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                            <Image source={require('../../../../assets/class/ic_score_settlement.png')}
                                   style={{width: 15, height: 15}}/>
                            <Text style={[this.styles.textForListTitle, {marginLeft: 8}]}>结算方式</Text>
                        </View>
                        <Divider isMargin={true}/>
                        <View style={{paddingVertical: 6}}>
                            {this.classSelttlementList.map(this.renderClassSettlementItem)}
                        </View>
                    </View>
                </View>
            </KBScrollView>
        );
    }

    render() {
        let renderView = super.render();
        const {goBack} = this.props.navigation;
        return (
            <View style={this.styles.container}>
                {renderView}
                <Button transparent onPress={() => {
                    const {goBack} = this.props.navigation;
                    goBack();
                }} style={{
                    position: 'absolute',
                    left: 0,
                    width: 50,
                    height: theme.withoutStatusHeight,
                    top: theme.statusHeight,
                }}>
                    <Image source={require('../../../../assets/icon_back_black.png')} style={{
                        marginLeft: 20,
                        width: 10,
                        height: 15,
                        // color: this.props.headerStyle === 'dark' ? "black" : "white"
                    }}/>
                </Button>
                <KBPopupDialog
                    ref={(c) => this.improveAddPop = c}>
                    {this.renderImproveAddPop()}
                </KBPopupDialog>
                <KBPopupDialog
                    ref={(c) => this.improvePop = c}>
                    {this.renderImprovePop()}
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

    refreshData = () => {
        this.setState({isRefreshing: true});
        super.componentDidMount();
    };

    editHeadImg(path) {
        let imagePath = path;
        let array = imagePath.split('/');
        let imageStr = Utils.removeChinese(array[array.length - 1]);
        let file = {uri: imagePath, type: 'multipart/form-data', name: imageStr};
        let formData = new FormData();
        formData.append('files', file);
        this.editClass(formData, imagePath);
    }

    editClass = (formData, imagePath) => {
        formData.append('id', this.classId);
        HttpUtils.doPostWithToken(fetchUrl.editClass, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                if (!Utils.isNull(imagePath)) {
                    this.state.classData.headImg = {uri: imagePath};
                }
                this.setState({});
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: () => {

            },
        });
    };

    createOptionKind = () => {
        if (this.state.optionKindName.length > 12) {
            ToastUtils.showToast('表扬待改进类型最多输入12个字');
            return;
        }
        let formData = new FormData();
        formData.append('classId', this.classId);
        formData.append('name', this.state.optionKindName);
        formData.append('type', this.state.optionKindType.toString());
        HttpUtils.doPostWithToken(fetchUrl.createOptionKind, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.improveAddPop.dismiss();
                this.refreshData();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: (responseData) => {

            },
        });
    };

    deleteOptionKind = () => {
        let formData = new FormData();
        formData.append('optionKindId', this.state.optionKindId);
        HttpUtils.doPostWithToken(fetchUrl.deleteOptionKind, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.improvePop.dismiss();
                this.refreshData();
                this.sqLite.deleteOption('pid', this.state.optionKindId);

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onEnd: (responseData) => {

            },
        });
    };

    styles = StyleSheet.create({
        container: {
            backgroundColor: 'white',
            flex: 1,
        },
        viewForHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: colors.divider,
            borderBottomWidth: 1,
            marginTop: theme.headerHeight,
            paddingHorizontal: 14,
        },
        viewForList: {
            paddingHorizontal: 14,
            paddingVertical: 10,
            height: theme.screenHeight * 0.22,
            flexDirection: 'row',
        },
        viewForListLeft: {
            flex: 4,
            borderRadius: 5,
            backgroundColor: '#F7F7F2',
            alignItems: 'center',
            justifyContent: 'center',
        },
        viewForListRightTop: {
            flex: 1,
            borderRadius: 5,
            flexDirection: 'row',
            backgroundColor: '#F7F7F2',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 14,
            justifyContent: 'space-between',
        },
        viewForListRightBottom: {
            flex: 1,
            marginTop: 8,
            alignItems: 'center',
            paddingVertical: 10,
            borderRadius: 5,
            backgroundColor: '#F7F7F2',
            flexDirection: 'row',
            paddingHorizontal: 14,
            justifyContent: 'space-between',
        },
        textForListTitle: {
            fontSize: 13,
            fontWeight: '400',
            color: colors.text333,
        },
        textForListLength: {
            fontSize: 12,
            color: colors.text999,
            marginTop: 3,
        },
    });
}
