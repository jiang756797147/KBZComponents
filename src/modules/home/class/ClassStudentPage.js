import React, {Component} from 'react';
import {Container} from 'native-base';
import BaseScreen from '../../../base/BaseScreen';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    DeviceEventEmitter,
    FlatList
} from 'react-native';

import TableView, {PullRefreshMode} from '../../../components/tableView/index';
import ItemModel from '../../../components/tableView/ItemModel';
import KBButton from '../../../components/KBButton';
import theme from '../../../constants/theme';
import colors from '../../../constants/colors';
import UserData from '../../../constants/UserData';
import fetchUrl from '../../../constants/fetchUrl';
import ToastUtils from '../../../utils/ToastUtils';
import Utils from '../../../utils/Utils';
import HttpUtils from '../../../utils/HttpUtils';
import SQLite from '../../../utils/SQLite';
import StorageUtils from '../../../utils/StorageUtils';

import {
    STUDENT_SORT,
    UPDATE_OPTION,
    CLSASS_SETTLEMENT,
    GROUP_UPDATE,
    STUDENT_SCORE_UPDATE,
    FIRST_LOGIN,
} from '../../../constants/notify';
import KBScrollView from '../../../components/KBScrollView';
import ClassCommitDialog from './view/ClassCommitDialog';
import ClassAdapter from './holder/ClassAdapter';
import ClassCollectionHolder from './holder/ClassCollectionHolder';
import ClassCellHolder from './holder/ClassCellHolder';
import TextInputWithClear from "../../../components/TextInputWithClear";
import Divider from "../../../components/Divider";
import KBPopupDialog from '../../../components/dialog/KBPopupDialog';

import KBAlertDialog from '../../../components/dialog/KBAlertDialog';

import {NullLiteral} from "@babel/types";
import ToastTopUtils from "../../../utils/ToastTopUtils";

export default class ClassStudentPage extends BaseScreen {

    static propTypes = {
        isSelectMore: PropTypes.bool,
        isEdit: PropTypes.bool,
        changedSelectMore: PropTypes.func,
        navigation: PropTypes.any,
        classId: PropTypes.string,
        canAddStudent: PropTypes.bool,
        refresh: PropTypes.func,
    };
    static defaultProps = {
        isSelectMore: false,
        classId: '',
        isEdit: false,
        canAddStudent: false,
        refresh: () => {
        },
    };

    constructor(props) {
        super(props);
        this.selectGroup = '';
        this.selectedValue = 0, //默认选中第一个组
        this.groupNameArr = null;
        this.groupNameInfo = [];
        this.sqLite = new SQLite();
        this.teacherId = UserData.getInstance().getId();
        this.scoreFilter = UserData.getInstance().getScoreFilter();
        this.state = Object.assign({
            studentData: [],


            isRefreshing: false,
            isSelectAll: false,
            selectedStudent: {},
            isClassify: true,
            order: '5',
            scoreFilter: this.scoreFilter, //显示分数
            disPlayType: 0, //分数显示 0 全部 1 表扬分 2、待改进分

            isShowOwn: false,
            praiseOptions: [],
            improveOptions: [],
            ownPraiseOptions: [],
            ownImproveOptions: [],

        }, this.state);

        this.commitCache = []; //存储点评数据用于撤销操作
        this.commitTimeOut = null; // 点评请求延时

        this.eventEmitter = DeviceEventEmitter;
        this.adapter = new ClassAdapter();
        //显示方式缓存
        StorageUtils._load('studentDisPlay', (data) => {
            if (Utils.isNull(data)) {
                this.setState({
                    disPlayType: 0,
                });
            } else {
                this.setState({
                    disPlayType: parseInt(data),
                });
            }
        }, (err) => {
            this.setState({
                disPlayType: 0,
            });
        });


    }

    UNSAFE_componentWillMount(): void {
        super.UNSAFE_componentWillMount();

        this.eventEmitter.addListener(UPDATE_OPTION, this.optionRefresh.bind(this));
        this.eventEmitter.addListener(STUDENT_SORT, this.updateSort.bind(this));
        this.eventEmitter.addListener(CLSASS_SETTLEMENT, this.updateSettlement.bind(this));
        this.eventEmitter.addListener(GROUP_UPDATE, this.updateGroup.bind(this));
        this.eventEmitter.addListener(STUDENT_SCORE_UPDATE, this.updateScore.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.eventEmitter.removeListener(UPDATE_OPTION, this.optionRefresh);
        this.eventEmitter.removeListener(STUDENT_SORT, this.updateSort);
        this.eventEmitter.removeListener(CLSASS_SETTLEMENT, this.updateSettlement);
        this.eventEmitter.removeListener(GROUP_UPDATE, this.updateGroup);
        this.eventEmitter.removeListener(STUDENT_SCORE_UPDATE, this.updateScore);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    getApiUrl() {
        let order = '&order=' + (this.state.order == '5' ? '' : this.state.order);
        let scoreFilter = '&scoreFilter=' + this.state.scoreFilter;
        return fetchUrl.getClassStudentList + '&classIds=' + this.props.classId + order + scoreFilter;
    }

    onSuccess(responseData) {
        if (responseData.data && responseData.data.length > 0) {
            let studentData = responseData.data;
            for (let obj of studentData) {
                obj.status = '0';
            }
            this.state.studentData = studentData;

            let hasSection = this.state.order === '5';
            this.setAdapter(hasSection);

            this.filerOptions();//表扬待改进事项
            this.setState({
                isRefreshing: false,
                isNullData: false,
            });
            this.getIsFirstLogin();
        }
    }

    onNullData(responseData) {

        this.setState({
            isNullData: true,
            isRefreshing: false,
        });
    }

    filerOptions() {
        let praiseOptions = [];
        let improveOptions = [];
        let ownPraiseOptions = [];
        let ownImproveOptions = [];
        /**
         * 查询数据排序
         * @param teacherId  教师ID
         * @param classId    班级ID
         * @param type       事项类型     0 表扬  1 待改进
         * @param entryType  排序事项显示入口  0 学生 1 小组  -1 全部
         */
        this.sqLite.select(this.teacherId, this.props.classId, 0, 0, {
            onSuccess: (data) => {
                for (let obj of data) {
                    praiseOptions.push(obj);
                    if (obj.createBy == this.teacherId) {
                        ownPraiseOptions.push(obj);
                    }
                }
                this.state.praiseOptions = praiseOptions;
                this.state.ownPraiseOptions = ownPraiseOptions;
            },
        });
        this.sqLite.select(this.teacherId, this.props.classId, 1, 0, {
            onSuccess: (data) => {
                for (let obj of data) {
                    improveOptions.push(obj);
                    if (obj.createBy == this.teacherId) {
                        ownImproveOptions.push(obj);
                    }
                }
                this.state.improveOptions = improveOptions;
                this.state.ownImproveOptions = ownImproveOptions;
            },
        });
    }

    setAdapter(hasSection) {
        let holder = this.state.isClassify ? ClassCollectionHolder : ClassCellHolder;
        this.adapter.removeAll();
        this.groupNameInfo = [];
        if (hasSection) {
            this.groupNameArr = Utils.getSortDataByKey(this.state.studentData, 'groupId', 'groupSort');
            let keys = Object.keys(this.groupNameArr);
            if (this.props.isEdit) {
                this.groupNameInfo.push({name: '未分组', groupId: ''});
            }
            for (let index = 0; index < keys.length; index++) {
                let isLast = this.props.isEdit ? true : (index == keys.length - 1) ? true : false;
                let array = this.groupNameArr[keys[index]];
                let itemModel1 = new ItemModel(index, holder);
                itemModel1.setAttribute('data', array);

                itemModel1.setAttribute('groupId', keys[index]);
                itemModel1.setAttribute("isEdit", this.props.isEdit);
                itemModel1.setAttribute("itemClick", this.itemClick);
                itemModel1.setAttribute("groupId", keys[index]);
                itemModel1.setAttribute("headerClick", this.headerClick);
                itemModel1.setAttribute('isLast', isLast);
                itemModel1.setAttribute('world', this);
                itemModel1.setAttribute('isMaster', this.props.isMaster);
                itemModel1.setAttribute('canAddStudent', this.props.canAddStudent);
                itemModel1.setAttribute('disPlayType', this.state.disPlayType);
                itemModel1.setAttribute('isSelectMore', {
                    getIsSelectMore: () => {
                        return this.props.isSelectMore;
                    },
                });
                let groupName = '';
                if (Utils.isNull(keys[index])) {
                    groupName = '未分组';
                    itemModel1.setAttribute('add', this.addStudent);
                } else {

                    groupName = array[0].groupName;
                    itemModel1.setAttribute('add', this.addGroupStudent);
                    if (this.props.isEdit) {

                        this.groupNameInfo.push({name: array[0].groupName, groupId: keys[index]});
                    }

                }
                this.adapter.addItem(keys[index] ? keys[index] : '', groupName, itemModel1);
            }
        } else {
            let itemModel = new ItemModel('0', holder);
            itemModel.setAttribute('data', this.state.studentData);
            itemModel.setAttribute('itemClick', this.itemClick);
            itemModel.setAttribute('isLast', true);
            itemModel.setAttribute('world', this);
            itemModel.setAttribute('isMaster', this.props.isMaster);
            itemModel.setAttribute('canAddStudent', this.props.canAddStudent);
            itemModel.setAttribute('add', this.addStudent);
            itemModel.setAttribute('disPlayType', this.state.disPlayType);
            itemModel.setAttribute('isSelectMore', {
                getIsSelectMore: () => {
                    return this.props.isSelectMore;
                },
            });
            this.adapter.addItem('0', '', itemModel);
        }

        if (this.tableView) {
            this.tableView.onRefreshComplete();
            this.tableView.setHasMoreData(false);
        }
        this.setState({});
    }

    //sortName
    updateSort(data) {
        // 显示方式
        if (data.classify) {
            this.state.isClassify = data.classify === 'collection';
            let hasSection = this.state.order === '5';
            this.setAdapter(hasSection);
        }
        // 排序
        if (data.order) {
            this.setState({
                order: data.order,
            }, () => {
                this.refreshData();
            });
        }
        // 分数显示
        if (data.disPlayType) {

            this.state.disPlayType = parseInt(data.disPlayType);
            let hasSection = this.state.order === '5';
            this.setAdapter(hasSection);
        }
    }

    getIsFirstLogin(){
        StorageUtils._load(FIRST_LOGIN, (data) => {
            if (this.props.isEdit){
                if (Utils.isNull(data)) {
                    this.isFirst = true;
                    this.setState({});
                    this.showTips();
                    StorageUtils._sava(FIRST_LOGIN, '1');
                } else {
                    this.isFirst = false;
                }
            }
        }, (err) => {
            if (this.props.isEdit){
                this.isFirst = true;
                this.setState({});
                this.showTips();
                 StorageUtils._sava(FIRST_LOGIN, '1');
            }

        });
    }

    updateSettlement(data) {
        if (data.scoreFilter) {
            this.setState({
                scoreFilter: parseInt(data.scoreFilter),
            }, () => {
                this.refreshData();
            });
        }
    }

    updateGroup = () => {
        this.componentDidMount();
    };
    updateScore = () => {
        this.componentDidMount();
    };

    componentDidUpdate() {
        if (this.tableView) {
            this.tableView.onRefreshComplete();
            this.tableView.setHasMoreData(false);
        }
    }

    renderNullDataView() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <KBScrollView
                    isRefreshControl={true}
                    isRefreshing={false}
                    onRefresh={this.onRefresh}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{alignItems: 'center'}}>
                            <Image source={require('../../../assets/class/image_no_group.png')}
                                   style={{width: 200, height: 150, marginTop: 90}} resizeMode={'cover'}/>
                            <Text style={{color: colors.text999, fontSize: 13}}>暂无学生，请先创建学生</Text>
                            <KBButton onPress={() => {
                                if (!this.props.isMaster && !this.props.canAddStudent) {
                                    ToastUtils.showToast('您没有创建学生权限，请联系管理员');
                                    return;
                                }
                                const {navigate} = this.props.navigation;
                                navigate('AddStudent', {
                                    classId: this.props.classId,
                                    onRefresh: this.refreshData,
                                });
                            }}>
                                <View style={{
                                    paddingHorizontal: 45,
                                    height: 40,
                                    borderRadius: 20,
                                    marginTop: 40,
                                    backgroundColor: '#FBD962',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{color: colors.text333, fontSize: 14}}>创建学生</Text>
                                </View>
                            </KBButton>
                        </View>
                    </View>
                </KBScrollView>
            </View>
        );
    }

    renderData() {
        return (
            <TableView
                style={{flex: 1, backgroundColor: '#FFF'}}
                ref={(c) => this.tableView = c}
                mode={PullRefreshMode.NONE}
                adapter={this.adapter}
                // onPullDownToRefresh={(tableView) => {
                //     this.refreshData();
                // }}
            />
        );
    }

    render() {
        let renderView = super.render();
        return (
            <Container>

                <ClassCommitDialog
                    ref={(c) => this.commitDialog = c}
                    title={this._getPopTitle()}
                    touchTitle={() => {
                        this.commitDialog.hide();
                        const {navigate} = this.props.navigation;
                        navigate('StudentInfo', {
                            student: this.state.selectedStudent,
                            isMaster: this.props.isMaster,
                            backRefresh: this.refreshData,
                        });
                    }}
                    touchRight={() => {
                        if (this.props.isSelectMore) {
                            return;
                        }
                        this.commitDialog.hide();
                        const {navigate} = this.props.navigation;
                        navigate('StudentReport', {
                            student: this.state.selectedStudent,
                            isMaster: this.props.isMaster,
                            backRefresh: this.refreshData,
                        });
                    }}
                    praiseOptions={this.state.praiseOptions}
                    improveOptions={this.state.improveOptions}
                    ownPraiseOptions={this.state.ownPraiseOptions}
                    ownImproveOptions={this.state.ownImproveOptions}
                    customConfirm={(data) => this.customConfirm(data)}
                    optionClick={(index) => this.detailItemClick(index)}
                    editOptionClick={(tabIndex) => this.detailItemEdit(tabIndex)}
                />
                <View style={{flex: 1}}>
                    {this.state.isNullData ?
                        this.renderNullDataView()
                        :
                        renderView
                    }
                </View>
                <KBAlertDialog
                    ref={(c) => this.dialog = c}
                    title={'温馨提示'}
                    contentComponent={() => this.renderDialogContent()}
                    rightPress={() => {
                        //this.auditTask();
                        this.dialog.dismiss();
                        this.deleteStudent();

                    }}>

                </KBAlertDialog>
                {this.props.isEdit ?
                    <KBPopupDialog
                        ref={(c) => this.inputNamePop = c}>
                        {this.renderInputPop()}
                    </KBPopupDialog> : null}
                {this.props.isEdit ?
                    <KBPopupDialog
                        ref={(c) => this.editStudentPop = c}>
                        {this.renderEditStudentPop()}
                    </KBPopupDialog> : null}
                {this.props.isSelectMore ?
                    this.renderSelectToolBarView()
                    :
                    null
                }
                {this.isFirst ? <KBPopupDialog
                    backgroundColor={colors.trans}
                    // dismissOnTouchOutside={false}
                    ref={(c) => this.tipsPopF = c}>
                    {this.renderTipsPop()}
                </KBPopupDialog> : null}

                {this.isFirst ? <KBPopupDialog
                    backgroundColor={colors.trans}
                    // dismissOnTouchOutside={false}
                    ref={(c) => this.tipsPopS = c}>
                    {this.renderTipsPopNext()}
                </KBPopupDialog> : null}


            </Container>
        );
    };

    showTips() {
        if (this.tipsPopF) {
            this.tipsPopF.show();
        }
    }

    renderDialogContent = () => {
        return (
            <Text style={[{
                marginHorizontal: 14,
                marginTop: 15,
                lineHeight: 20,
                color: colors.text333,
            }]}>{'确定删除该学生吗?'}</Text>

        );
    };

    _getPopTitle = () => {
        let nameStr = '';
        if (this.props.isSelectMore) {
            let selectArray = this.selectSum();
            if (Utils.isArrayNull(selectArray)) {
                nameStr = '';
            } else {
                let text = selectArray.length > 1 ? '等' : '';
                nameStr = `${selectArray[0].name}${text}`;
            }
        } else {
            nameStr = this.state.selectedStudent.name;
        }

        return nameStr;
    };

    changedSelectedAll() {
        if (this.state.studentData && this.state.studentData.length > 0) {
            for (let obj of this.state.studentData) {
                if (obj.status == '0') {
                    return false;
                }
            }
            return true;
        }

    }

    /**
     * 首次提示
     */
    renderTipsPop = () => {
        return (<KBButton onPress={() => {
                this.tipsPopF.dismiss();
                this.tipsPopS.show();
            }}>
                <Image style={{width: theme.screenWidth, height: 300}}
                       resizeMode={'contain'}
                       source={require('../../../assets/img-guidance-friendcircle.png')}
                >

                </Image>
            </KBButton>
        );

    }
    /**
     * 首次提示
     */
    renderTipsPopNext = () => {
        return (<View>
                <Image style={{width: theme.screenWidth, height: 500,}}
                       resizeMode={'contain'}
                       source={require('../../../assets/img-guidance-friendcircle.png')}
                >

                </Image>
            </View>
        );

    }

    //多选底部按钮
    renderSelectToolBarView() {

        this.state.isSelectAll = this.changedSelectedAll();
        let selectArr = this.selectSum();
        return (
            <View style={styles.toolBar}>
                <KBButton style={{flex: 4}} onPress={() => this.selectAll()}>
                    <View style={{
                        flex: 4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 49,
                    }}>
                        <Image style={{
                            width: 20,
                            height: 20,
                            marginRight: 10,
                        }}
                               source={this.state.isSelectAll ? require('../../../assets/class/class_btn_choice_s.png') : require('../../../assets/class/class_btn_choice_d.png')}
                        />
                        <Text style={{fontSize: 17}}>全选</Text>
                    </View>
                </KBButton>
                <KBButton style={{flex: 6}}
                          onPress={() => this.selectConfirm()}>
                    <View style={{
                        flex: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.yellowColor,
                        height: 49,
                    }}>
                        <Text style={{fontSize: 17}}>{'进行点评(' + selectArr.length + '人)'}</Text>
                    </View>
                </KBButton>
            </View>
        );
    };

    optionRefresh = (data) => {
        this.filerOptions();
        this.setState({});
    };

    //刷新
    refreshData = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    /**
     *  头像点击
     */
    itemClick = (item) => {

        this.state.selectedStudent = item;
        this.setState({});
        if (this.props.isEdit) {
            this.selectedValue = 0;
            this.editStudentPop.show();
        } else {
            this.commitDialog.show();
        }

    };
    /**
     *  header点击
     */
    headerClick = (item) => {

        this.selectGroup = item;
        this.inputNamePop.show();
        // this.commitDialog.show();
        // this.state.selectedStudent = item;
        // this.renderInputPop();
        // this.setState({});
    };

    renderEditStudentPop() {
        for (let i = 0; i < this.groupNameInfo.length; i++) {
            if (this.groupNameInfo[i].groupId === this.state.selectedStudent.groupId) {
                if (i !== 0) {
                    this.groupNameInfo.unshift(this.groupNameInfo.splice(i, 1)[0]);
                }
            }
        }

        return (

            <View style={{alignItems: 'center',}}>
                <View style={{paddingLeft: theme.screenWidth * (0.85 - 0.15 / 2),}}>
                    <KBButton style={{width: 30, height: 30,}}
                              onPress={() => {
                                  this.editStudentPop.dismiss();

                              }}
                    >
                        <Image style={{width: 30, height: 30, borderRadius: 15, backgroundColor: colors.blue}}/>
                    </KBButton>
                </View>
                <View style={{width: theme.screenWidth * 0.85, alignItems: 'center', marginTop: 10}}>
                    <View
                        style={{
                            borderRadius: 5,
                            width: theme.screenWidth * 0.85,
                            backgroundColor: colors.white
                        }}>

                        <Text style={[{
                            marginLeft: 20,
                            marginTop: 15,
                            fontSize: 18,
                            fontWeight: 'bold'

                        }]}>{this.state.selectedStudent.name}</Text>
                        <Divider customStyle={{marginTop: 20, width: theme.screenWidth * 0.85, height: 1}}/>


                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 10,
                                flexDirection: 'row',
                                marginTop: 15
                            }}>
                            <View style={{marginLeft: 50}}>
                                <Text style={{fontSize: 15, textAlign: 'right'}}>{'换小组:'}</Text>
                            </View>


                            <FlatList
                                style={{marginTop: 0, marginLeft: 10, height: this.groupNameInfo.length == 1 ? 20 : 40}}
                                ref={(c) => this.flatList = c}
                                // extraData={this.state}
                                data={this.groupNameInfo}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => this.renderGroupItemView(item, index)}
                            >
                            </FlatList>


                        </View>

                        <Divider customStyle={{marginTop: 15, width: theme.screenWidth * 0.85, height: 1}}/>
                        <View style={{
                            width: theme.screenWidth * 0.85,
                            height: 60,
                            marginTop: 15,
                            paddingBottom: 20,
                            paddingHorizontal: 15,
                            flexDirection: 'row'
                        }}>
                            <KBButton style={{flex: 1, paddingRight: 15}}
                                      onPress={() => {
                                          this.dialog.show();


                                      }}>
                                <View style={{
                                    flex: 1,
                                    borderRadius: 5,
                                    borderColor: colors.black,
                                    borderWidth: 1,
                                    //backgroundColor:colors.bluesky,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{color: colors.black, fontSize: 14}}>删除学生</Text>
                                </View>
                            </KBButton>
                            <KBButton style={{flex: 1}} onPress={() => {


                                this.changeGroup();
                                this.editStudentPop.dismiss();

                            }}>
                                <View style={{
                                    flex: 1,
                                    borderRadius: 5,
                                    backgroundColor: '#FFDB49',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{color: colors.white, fontSize: 14}}>确定换组</Text>
                                </View>
                            </KBButton>
                        </View>
                    </View>
                </View>
            </View>

        );
    }

    renderGroupItemView = (item, index) => {
        return (
            <KBButton
                // style={{backgroundColor:colors.green}}
                onPress={() => {
                    this.selectedValue = index;
                    this.setState({});
                }} key={index}>
                <View style={{flexDirection: 'row', height: 20, alignItems: 'center',}}>

                    <Text style={{marginLeft: 15, width: 100}}>{item?.name}</Text>
                    <Image style={{
                        backgroundColor: this.selectedValue === index ? colors.redSubmitBtnColor : colors.lightGray,
                        width: 16,
                        height: 16
                    }}/>
                </View>

            </KBButton>
        );
    }
    sortTypeChanged = () => {

    }

    renderInputPop() {
        return (
            <View style={{width: theme.screenWidth * 0.85, alignItems: 'center'}}>
                <View
                    style={{borderRadius: 5, width: theme.screenWidth * 0.85, backgroundColor: colors.white}}>
                    <Text style={[{
                        marginLeft: 14,
                        marginTop: 15
                    }]}>修改组名</Text>
                    <TextInputWithClear
                        onTextChange={(text) => {
                            this.groupName = text;
                            this.setState({});
                        }}
                        // value={this.state.popPlaceHolder === '名称' ? this.state.nickname : this.state.mobile}
                        keyboardType={'default'}
                        placeholderText={'请输入组名'}
                        onFocusUnderlineColor={'#F9DB63'}
                        unFocusUnderlineColor={'#E0E0E0'}
                        maxLength={20}
                        inputStyle={{height: 30}}
                        viewStyle={{
                            marginTop: 20,
                            marginHorizontal: 14,
                            flex: 0,
                        }}/>
                    <Divider customStyle={{marginTop: 25, width: theme.screenWidth * 0.85,}}/>
                    <View style={{
                        width: theme.screenWidth * 0.85,
                        height: 40,
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                        flexDirection: 'row'
                    }}>
                        <KBButton style={{flex: 1}}
                                  onPress={() => {
                                      this.inputNamePop.dismiss();
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


                            this.updateGroupName();
                            this.inputNamePop.dismiss();


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
    }


    removeFromGroup = () => {
        let students = [];
        let studentArr = this.groupNameArr[this.state.selectedStudent.groupId];
        let groupSort = this.state.selectedStudent.groupSort;
        studentArr.pop(this.state.selectedStudent);

        for (let obj of studentArr) {
            let student = {};
            student.studentId = obj.id;
            student.percent = 1;
            students.push(student);
        }

        let formData = new FormData();

        formData.append('name', this.state.selectedStudent.groupName);
        formData.append('classId', this.props.classId);
        formData.append('groupId', this.state.selectedStudent.groupId);
        formData.append('sort', groupSort);

        formData.append('studentJson', JSON.stringify(students));

        // this.selectedValue=0;
        // this.flatList.data = null;
        this.setState({});
        HttpUtils.doPostWithToken(fetchUrl.updateGroup, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                //this.refreshData();
                this.eventEmitter.emit(GROUP_UPDATE);
                // this.goBack();

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }


    changeGroup = () => {
        if (this.selectedValue === 0 && (this.state.selectedStudent.groupId.length > 0 || this.groupNameInfo[this.selectedValue].name === '未分组')) {
            ToastUtils.showToast('该学生已经在所选组！');
            return;
        }

        if (this.groupNameInfo[this.selectedValue].name === '未分组') {
            this.removeFromGroup();
            return;
        }


        let students = [];
        let studentArr = this.groupNameArr[this.groupNameInfo[this.selectedValue].groupId];
        let groupSort = studentArr[0].groupSort;
        studentArr.push(this.state.selectedStudent);

        for (let obj of studentArr) {
            let student = {};
            student.studentId = obj.id;
            student.percent = 1;
            students.push(student);
        }

        let formData = new FormData();

        formData.append('name', this.groupNameInfo[this.selectedValue].name);
        formData.append('classId', this.props.classId);
        formData.append('groupId', this.groupNameInfo[this.selectedValue].groupId);
        formData.append('sort', groupSort);

        formData.append('studentJson', JSON.stringify(students));

        console.log('formData', formData)
        // this.selectedValue=0;
        // this.flatList.data = null;
        // this.setState({});
        HttpUtils.doPostWithToken(fetchUrl.updateGroup, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.refreshData();
                this.eventEmitter.emit(GROUP_UPDATE);
                // this.goBack();

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }

    /**
     * 删除学生
     */
    deleteStudent() {
        this.setState({isRefreshing: true})
        let formData = new FormData();
        formData.append('studentIds', this.state.selectedStudent.id);
        HttpUtils.doPostWithToken(fetchUrl.deleteStudents, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                //this.refreshData();
                this.eventEmitter.emit(GROUP_UPDATE);
                // this.goBack();

            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }


    /**
     * 添加学生
     */
    addStudent = () => {
        if (!this.props.isMaster && !this.props.canAddStudent) {
            ToastUtils.showToast('仅班主任可添加学生');
            return;
        }

        // ToastUtils.showToast("添加学生");
        const {navigate} = this.props.navigation;
        navigate('AddStudent', {
            classId: this.props.classId,
            onRefresh: this.refreshData,
        });
    };

    /**
     * 添加学生进组
     */
    addGroupStudent = (groupId) => {

        console.log('!this.props.isMaster', this.props.isMaster)
        if (!this.props.isMaster && !this.props.canAddStudent) {
            ToastUtils.showToast('仅班主任可添加学生');
            return;
        }

        const {navigate} = this.props.navigation;
        let students = [];
        students = this.groupNameArr[groupId];
        navigate('GroupMember', {
            isNewGroup: false,
            isEdit: true,
            classId: this.props.classId,
            groupId: groupId,
            students: students,
        });
    };

    //item 编辑
    detailItemEdit(tabIndex) {
        this.commitDialog.hide();
        const {navigate} = this.props.navigation;
        let initialPage = tabIndex;
        navigate('ClassOption', {
            classId: this.props.classId,
            entryType: 0,
            initialPage: initialPage,
        });
    }
    ;


    //**多选页**//
    // 全选
    selectAll = () => {
        if (this.state.isNullData) {
            ToastUtils.showToast('暂无学生，请先创建学生');
            return;
        }
        this.state.isSelectAll = !this.state.isSelectAll;
        for (let obj of this.state.studentData) {
            obj.status = this.state.isSelectAll ? '1' : '0';
        }

        this.setState({});
    };

    // 计算多选 选择人数
    selectSum = () => {

        let selectArr = [];
        for (let obj of  this.state.studentData) {
            if (obj.status == '1') {
                selectArr.push(obj);
            }
        }
        return selectArr;
    };

    // 点评 确认
    selectConfirm() {
        let selectArray = this.selectSum();

        if (Utils.isArrayNull(selectArray)) {
            ToastUtils.showToast('请先选择要点评的学生！');
            return;
        }
        this.commitDialog.show();
    }
    ;

    /**
     * 弹出框
     */
    // item 点击
    detailItemClick(item, index) {
        this.commitDialog.hide();
        this.commit(item, false);
    }
    ;

    //自定义加分
    customConfirm(data) {

        this.commitDialog.hide();
        if (Utils.isNull(data.content)) {
            ToastUtils.showToast('请填写自定义事项内容！');
        } else if (Utils.isNull(data.score)) {
            ToastUtils.showToast('请填写自定义事项分值！');
        } else if (!Number.isInteger(parseFloat(data.score))) {
            ToastUtils.showToast('请填写整数自定义事项分值！');
        } else {
            this.commit(data, true);
        }
    }

    commit = (option, isCustom) => {
        clearTimeout(this.commitTimeOut);  // 移除延时提交
        if (this.props.isSelectMore) { // 多人点评
            this.props.changedSelectMore(false);

            let selectedArr = this.selectSum();
            for (let student of selectedArr) {
                this.scoreAnimate(student, option);
            }
            let commitObject = {
                student: selectedArr,
                option: option,
                isCustom: isCustom,
            };
            this.commitCache.push(commitObject);
            this.setState({}, () => {
                ToastTopUtils.showTopToast('撤销点评', this.cancleCommit, this.toastHidden);
            });

        } else { // 单人点评
            this.scoreAnimate(this.state.selectedStudent, option);
            let commitObject = {
                student: this.state.selectedStudent,
                option: option,
                isCustom: isCustom,
            };
            this.commitCache.push(commitObject);
            this.setState({}, () => {
                ToastTopUtils.showTopToast('撤销点评', this.cancleCommit, this.toastHidden);
            });
        }

        this.commitTimeOut = setTimeout(() => { // 重置延时提交
            if (this.commitCache && this.commitCache.length > 0) {
                this.postCommit();
            }
        }, 5000);
    };

    // 撤销点评
    cancleCommit = () => {
        // console.log('cancle 00000 ===================', this.commitCache);

        let commitObject = this.commitCache[this.commitCache.length - 1];
        let option = commitObject.option;
        if (commitObject.student instanceof Array) {
            for (let student of commitObject.student) {
                if (option.type === 0) { // 表扬
                    student.rewardScore = (parseFloat(student.rewardScore) - parseFloat(option.score)).toString();
                } else { // 待改进
                    student.punishScore = (parseFloat(student.punishScore) - parseFloat(option.score)).toString();
                }
            }
        } else {
            let student = commitObject.student;
            if (option.type === 0) { // 表扬
                student.rewardScore = (parseFloat(student.rewardScore) - parseFloat(option.score)).toString();
            } else { // 待改进
                student.punishScore = (parseFloat(student.punishScore) - parseFloat(option.score)).toString();
            }
        }
        this.setState({}, () => {
            ToastUtils.showToast('撤销成功！');
            this.commitCache.splice(-1, 1);
        });
    };

    // // 撤销提示消失， 上传点评
    toastHidden = () => {
        // console.log('commit 1111111 ===================', this.commitCache);
    };


    // 点评加分动画
    scoreAnimate = (student, option) => {
        if (option.type === 0) { // 表扬
            student.rewardScore = (parseFloat(student.rewardScore) + parseFloat(option.score)).toString();
        } else { // 待改进
            student.punishScore = (parseFloat(student.punishScore) + parseFloat(option.score)).toString();
        }
        student.optionName = option.type === 0 ? `+${option.score}` : `-${option.score}`;
        student.animBottom = new Animated.Value(0);
        student.animate = Animated.timing(
            student.animBottom,
            {
                toValue: 20,
                duration: 800,
            });
        student.fade = new Animated.Value(1);
        student.fadeOut = Animated.timing(
            student.fade,
            {
                toValue: 0,
            });
        student.Viewfade = new Animated.Value(0.3);
        student.ViewfadeOut = Animated.timing(
            student.Viewfade,
            {
                toValue: 0,
            });
        student.animate.start(() => {
            student.fadeOut.start();
            student.ViewfadeOut.start();
        });
    };

    /**
     * post 请求
     *
     * @param studentIds
     * @param classId
     * @param optionId
     * @param content   自定义事项
     */

    postCommit() {
        // this.postRequest(this.props.classId, null, data, null);

        for (let index = 0; index < this.commitCache.length; index++) {
            let commitObj = this.commitCache[index];
            let studentIds = '';
            if (commitObj.student instanceof Array) {
                let studentIdArray = [];
                for (let student of commitObj.student) {
                    studentIdArray.push(student.id);
                }
                studentIds = studentIdArray.join(',');
            } else {
                studentIds = commitObj.student.id;
            }
            this.post(studentIds, commitObj.option, commitObj.isCustom, index);
        }
    }

    post(studentIds, option, isCustom, index) {
        let formData = new FormData();
        formData.append('studentIds', studentIds);
        formData.append('classId', this.props.classId);

        if (isCustom) {
            formData.append('content', JSON.stringify(option));
        } else {
            formData.append('optionId', option.id);
        }
        // console.log('option =================', option);
        // console.log('commit =========================', index);
        // console.log('commitFormData =========================', formData);
        // if (this.commitCache.length - 1 === index) {
        //     console.log('commitcache =========================', index);
        //     this.commitCache = [];
        //     clearTimeout(this.commitTimeOut);
        // }
        // return;
        HttpUtils.doPostWithToken(fetchUrl.commentStudent, formData, {
            onSuccess: (responseData) => {
                console.log('点评成功===========', responseData.message);
                if (this.commitCache.length - 1 === index) {
                    this.commitCache = [];
                    clearTimeout(this.commitTimeOut);
                }
            },
            onFail: (responseData) => {
                console.log('点评失败===========', responseData.message);
            },
        }, null, true);
    }

    updateGroupName() {
        // this.groupNameArr[this.groupName] = this.groupNameArr[this.selectGroup?.key];

        // delete this.groupNameArr[this.selectGroup?.key];
        if (Utils.isNull(this.groupName)) {
            ToastUtils.showToast('小组名称不能为空！');
            return;
        }

        let studentArr = [];
        let groupSort = {};
        for (let obj of this.groupNameArr[this.selectGroup?.key]) {
            let student = {};
            student.studentId = obj.id;
            student.percent = 1;
            groupSort.groupSort = obj.groupSort;
            studentArr.push(student);
        }


        let formData = new FormData();
        // if (this.state.changedImage) {
        //     if (Utils.isNull(this.state.imagePath)) {
        //         let header = '#' + image.defaulImg;
        //         formData.append('header', header);
        //     } else {
        //         let imagePath = this.state.imagePath;
        //         let array = imagePath.split('/');
        //         let imageStr = Utils.removeChinese(array[array.length - 1]);
        //         let file = {uri: imagePath, type: 'multipart/form-data', name: imageStr};
        //         formData.append('files', file);
        //     }
        // }
        formData.append('name', this.groupName);
        formData.append('classId', this.props.classId);
        formData.append('groupId', this.selectGroup.key);
        formData.append('sort', groupSort.groupSort);
        formData.append('studentJson', JSON.stringify(studentArr));

        HttpUtils.doPostWithToken(fetchUrl.updateGroup, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.refreshData();
                //this.goBack();
                this.eventEmitter.emit(GROUP_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    }


    postRequest(classId, optionId, content, callBack, optionName) {
        if (!Utils.isNull(this.props.changedSelectMore)) {
            this.props.changedSelectMore(false);
        }
        let selectStudent = [];
        let selectedArr = this.selectSum();
        let studentIds = '';
        if (this.props.isSelectMore) {
            let studentIdArray = [];
            if (Utils.isArrayNull(selectedArr)) {
                ToastUtils.showToast('请选择要点评的学生！');
                return;
            }
            for (let obj of selectedArr) {
                studentIdArray.push(obj.id);
                selectStudent.push(obj);
            }
            studentIds = studentIdArray.join(',');
        } else {
            studentIds = this.state.selectedStudent.id;
            selectStudent.push(this.state.selectedStudent);
        }

        let formData = new FormData();
        formData.append('studentIds', studentIds);
        formData.append('classId', classId);

        if (Utils.isNull(content)) {
            optionName = optionName;
            formData.append('optionId', optionId);
        } else {
            optionName = content.content;
            formData.append('content', JSON.stringify(content));
        }

        HttpUtils.doPostWithToken(fetchUrl.commentStudent, formData, {
            onSuccess: (responseData) => {
                for (let student of selectStudent) {
                    if (!Utils.isNull(responseData.data) && responseData.data.length > 0) {
                        for (let score of responseData.data) {
                            if (student.id === score.id) {
                                // if (parseFloat(score.remark) < 0) {
                                //     if (Utils.isNull(student.punishScore)) {
                                //         student.punishScore = 0;
                                //     }
                                //     student.punishScore = parseFloat(student.punishScore) - (Utils.isNull(score.remark) ? 0 : parseFloat(score.remark));
                                // } else {
                                //     if (Utils.isNull(student.rewardScore)) {
                                //         student.rewardScore = 0;
                                //     }
                                //     student.rewardScore = parseFloat(student.rewardScore) + (Utils.isNull(score.remark) ? 0 : parseFloat(score.remark));
                                // }
                                student.optionName = Utils.getScore(score.remark);
                                student.animBottom = new Animated.Value(0);
                                student.animate = Animated.timing(
                                    student.animBottom,
                                    {
                                        toValue: 20,
                                        duration: 500,
                                    });
                                student.fade = new Animated.Value(1);
                                student.fadeOut = Animated.timing(
                                    student.fade,
                                    {
                                        toValue: 0,
                                    });
                                student.Viewfade = new Animated.Value(0.3);
                                student.ViewfadeOut = Animated.timing(
                                    student.Viewfade,
                                    {
                                        toValue: 0,
                                    });
                                // this.tableView.reloadData();
                                this.refreshData();
                                student.animate.start(() => {
                                    student.fadeOut.start();
                                    student.ViewfadeOut.start();
                                });
                                break;
                            }
                        }
                    }
                }
            },
            onFail: function (responseData) {
                ToastUtils.showToast(responseData.message);
            },
        }, null, true);
    }
    ;

}

const styles = StyleSheet.create({
    toolBar: {
        flexDirection: 'row',
        height: 49,
        width: theme.screenWidth,
        borderTopWidth: 0.5,
        backgroundColor: colors.white,
        borderColor: colors.divider,
    },
});
