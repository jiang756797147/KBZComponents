import React from 'react';
import {Container, Button} from 'native-base';
import BaseScreen from '../../../base/BaseScreen';
import {StyleSheet, Text, View, Image, DeviceEventEmitter, Alert} from 'react-native';
import {STUDENT_SORT, GROUP_SORT} from '../../../constants/notify';

import ScrollableTabView from 'react-native-scrollable-tab-view';

import KBHeader from '../../../components/KBHeader';
import CustomBar from '../../../components/CustomBar';
import theme from '../../../constants/theme';
import colors from '../../../constants/colors';
import image from '../../../constants/image';
import KBButton from '../../../components/KBButton';
import KBDropPopMenu from '../../../components/popMenu/KBDropPopMenu';
import UserData from '../../../constants/UserData';
import fetchUrl from '../../../constants/fetchUrl';
import HttpUtils from '../../../utils/HttpUtils';
import ToastUtils from '../../../utils/ToastUtils';
import StorageUtils from '../../../utils/StorageUtils';
import SQLite from '../../../utils/SQLite';
import Utils from '../../../utils/Utils';
import {renderers} from '../../../components/popMenu/src';

import ClassModuleDialog from './view/ClassModuleDialog';
import ClassGuidView from './view/ClassGuidView';
import StudentPage from './ClassStudentPage';

export default class ClassScreen extends BaseScreen {
    sqLite = new SQLite();

    //权限值
    CREATE_STUDENT = 4; //创建学生
    SET_FIXED = 5; //固定分设置
    SET_TASK = 6; //任务分设置
    PRINT_TICKET = 7;//打印将票
    EDIT_CLASS = 8;  //编辑班级
    CLEAR_INTEGRAL = 9;//积分清零
    CREATE_TEAM = 10; //创建小组

    classEditData = [
        {
            title: '编辑班级',
        },
        {
            title: '查看班级报表',
        },
        {
            title: '编辑表扬/待改进',
        },
        {
            title: '显示规则',
        },
        {
            title: '积分清零',
        },
        {
            title: '学生分组',
        },
    ];

    moduleArray = [
        {
            title: '固定分',
            icon: require('../../../assets/image3.3/class/class_fixed_icon.png'),
            iconNot: require('../../../assets/image3.5/class_fixed_icon_not.png'),
            pressTag: 'AddFixedScore',
            canUse: true,
        },
        {
            title: '任务分',
            icon: require('../../../assets/image3.3/class/class_task_icon.png'),
            iconNot: require('../../../assets/image3.5/class_task_icon_not.png'),
            pressTag: 'Task',
            canUse: true,
        },
        {
            title: '打印奖票',
            icon: require('../../../assets/image3.3/class/class_print_icon.png'),
            iconNot: require('../../../assets/image3.5/class_print_icon_not.png'),
            pressTag: 'TicketPrint',
            canUse: true,
        },
        // {
        //     title: 'PK',
        //     icon: require('../../../assets/image3.3/class/class_pk_icon.png'),
        //     pressTag: 'GroupPK',
        // },
    ];

    studentSortList = [
        {title: '按总分排序', isSelected: false, type: '1'},
        {title: '按姓名首字母排序', isSelected: false, type: '2'},
        {title: '按表扬分排序', isSelected: false, type: '3'},
        {title: '按待改进分排序', isSelected: false, type: '4'},
        {title: '按小组排序', isSelected: true, type: '5'},
    ];

    toolBarButtons = [
        {image: image.tabMultiselect, text: '选择多人'},
        {image: image.tabRanking, text: '排名'},
    ];

    constructor(props) {
        super(props);

        const {params} = this.props.navigation.state;
        this.classData = params.classData;
        this.allClassData = params.allClassData;
        // this.allClassAuth=params.allClassAuth;
        this.classAuth = [];
        if (this.classData.auth) {
            this.classAuth = this.classData.auth;
        }
        this._setAuthData();  //设置有关权限的数据

        this.state = Object.assign({

            isSelectMore: false,
            isClassify: true,
            isRefresh: false,
        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
        StorageUtils._load('classSelttlement', (data) => {
            if (Utils.isNull(data)) {
                UserData.getInstance().setScoreFilter('0');
            } else {
                UserData.getInstance().setScoreFilter(data);
            }
        }, (err) => {
            UserData.getInstance().setScoreFilter('0');
        });

    }

    componentDidMount() {
        super.componentDidMount();

        // //龙虎榜引导&&pK页面引导
        // this.guid();

        // this.sqLite.dropTable('OPTIONTABLE'); // 删除事项表
        // this.sqLite.dropTable('SORTTABLE');   // 删除排序表
        // 创建事项表
        this.sqLite.createOptionTable();
        // 创建排序表
        this.sqLite.createSortTable();
        // 班级表扬全部待改进事项
        this.getClassOptions();
    }

    async guid() {

        let hasBindBoard = this.getClassHasBindBoard();
        let hasBoardkGuid = await this.getBoardGuid();
        let hasPKGuid = await this.getPKGuid();

        // console.log('hasBindBoard 1111==============', hasBindBoard);
        // console.log('hasBoardkGuid 2222==============', hasBoardkGuid);
        // console.log('hasPKGuid 3333==============', hasPKGuid);
        if (!hasBindBoard) {
            if (this.classData.isMaster) {
                if (!hasBoardkGuid) {
                    this.boardGuid.show();
                } else if (hasBoardkGuid && !hasPKGuid) {
                    this.pkGuid.show();
                }
            } else {
                if (!hasPKGuid) {
                    this.pkGuid.show();
                }
            }
        }
    }

    //是否操作过龙虎榜
    getBoardGuid() {
        return new Promise((resolve, reject) => {
            StorageUtils._load('hasAlertBindBoard', (data) => {
                resolve(data);
            }, (err) => {
                resolve(false);
            });
        });
    }

    //是否操作过PK小组
    getPKGuid() {
        return new Promise((resolve, reject) => {
            StorageUtils._load('hasAlertPKGroup', (data) => {
                resolve(data);
            }, (err) => {
                resolve(false);
            });
        });
    }

    //判断所有班级以前是否绑定龙虎榜
    getClassHasBindBoard() {
        for (let classData of this.allClassData) {
            if (classData.isMaster && !Utils.isNull(classData.IMEI)) {
                return true;
            }
        }
        return false;
    }

    //根据权限组 设定相关权限数据
    _setAuthData = () => {

        /** 班主任用于所有权限，不需要设置，默认都是可用的*/
        if (!this.classData.isMaster) {
            //设置 '固定分'，'任务分'，'打印将票'权限
            this.moduleArray[0].canUse = this.classAuth.includes(this.SET_FIXED);
            this.moduleArray[1].canUse = this.classAuth.includes(this.SET_TASK);
            this.moduleArray[2].canUse = this.classAuth.includes(this.PRINT_TICKET);

            if (!this.classAuth.includes(this.CLEAR_INTEGRAL)) {
                this.classEditData.splice(4, 1); //删除'积分清零'
            }

        } else {
        }
    };

    //清零功能网络请求
    clearCodePost = () => {

        let formData = new FormData();
        formData.append('classId', this.classData.id);

        HttpUtils.doPostWithToken(fetchUrl.frontClean, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);
                this.refresh();
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

    //获取（下拉刷新）权限 网络请求
    getAuthList = () => {
        // this.setState({isRefreshing:true});
        HttpUtils.doGetWithToken(fetchUrl.getClassList, {
            onSuccess: (responseData) => {
                console.log('........', this.state.allClassData);
                console.log('.....有权查看的数据...', responseData.data);
                if (responseData.data) {

                    let managerClass = responseData.data.managerClasses;
                    let joinClass = responseData.data.joinClasses;
                    let visibleClass = responseData.data.visibleClasses;

                    let allClassData = joinClass?.concat(managerClass)?.concat(visibleClass);

                    this.classAuth = [];
                    for (let i = 0; i < allClassData?.length; i++) {
                        if (allClassData[i].id == this.classData.id && allClassData[i].auth) {
                            this.classAuth = allClassData[i].auth;
                            break;
                        }
                    }
                    this._setAuthData();  //设置有关权限的数据
                }
            },
            onEnd: () => {
                this.setState({isRefresh: false});
            },
        });
    };


    //请求所有事项加进本地数据库里
    getClassOptions() {
        let url = fetchUrl.getClassOptionList + 'classId=' + this.classData.id + '&type=' + -1;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                let classOptions = [];
                for (let obj of responseData.data) {
                    if (obj.kindType < 3) {
                        classOptions.push(obj);
                    }
                }
                //清空数据
                this.sqLite.deleteAllData('OPTIONTABLE');
                //插入数据
                this.sqLite.insertOptionData(classOptions);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
            onNullData: (responseData) => {
            },
        });
    }


    renderData() {
        return (
            <View style={{flex: 1}}>
                <ScrollableTabView
                    onChangeTab={(index) => this.tabChanged(index)}
                    style={styles.content}

                    locked={this.state.isSelectMore}
                    isShowUnderDivider={true}
                    renderTabBar={() => <CustomBar
                        barStyle={{borderBottomWidth: 1, borderColor: colors.divider,}}
                        tabBtnWidth={theme.screenWidth / 4}
                        tabLock={this.state.isSelectMore}
                        tabUnderlineMarginLeft={30} {...this.props}
                        rightComponent={this.customSortView()}
                       // leftComponentView={this.classData.isMaster?this.leftView():null}
                        leftComponentView={this.leftView()}

                    />
                    }
                    initialPage={0}>
                    <StudentPage
                        ref={(c) => this.studentPage = c}
                        navigation={this.props.navigation}
                        style={styles.content}
                        classId={this.classData.id}
                        tabLabel={'学生'}
                        canAddStudent={this.classAuth.includes(this.CREATE_STUDENT)}
                        isMaster={this.classData.isMaster}
                        isSelectMore={this.state.isSelectMore}
                        changedSelectMore={(isSelected) => {
                            this.setState({
                                isSelectMore: isSelected,
                            });
                        }}
                    />
                </ScrollableTabView>
                {
                    this.state.isSelectMore ?
                        null
                        :
                        <View style={styles.toolBar}>
                            {this.toolBarButtons.map((item, index) => this.renderToolBarItem(item, index))}
                        </View>
                }
            </View>
        );
    }

    render() {
        // this.classEditData[0].title = this.classData.isMaster ? "编辑班级" : "查看班级资料";

        let renderView = super.render();
        return (

            <Container style={{
                backgroundColor: colors.white,
                paddingBottom: theme.tabBarStyle.paddingBottom,
            }}>
                {this.renderClassHeader()}
                <View style={{
                    position: 'absolute',
                    right: 0,
                    top: theme.statusHeight,
                    height: theme.withoutStatusHeight,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    <KBButton onPress={() => {
                        this.moduleDialog.show();
                    }}>
                        <View style={{
                            height: theme.withoutStatusHeight,
                            justifyContent: 'center',
                            paddingHorizontal: 10,
                        }}>
                            <Image style={{width: 20, height: 20}}
                                   resizeMode={'contain'}
                                   source={require('../../../assets/icon_add.png')}
                            />
                        </View>
                    </KBButton>

                    <KBDropPopMenu
                        renderer={renderers.PopoverNew}
                        rendererProps={{placement: 'bottom', preferredPlacement: 'top'}}
                        menuStyle={{right: 0, top: 0}}
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
                        optionsStyle={{width: theme.screenWidth / 5 * 2, borderRadius: 5, marginTop: 0}}
                        optionStyle={{marginLeft: 10}}
                        dataArray={this.classEditData}
                        uniqueKey={'title'}
                        textStyle={{color: colors.white, fontSize: 14}}
                        onSelect={(value) => this.classEdit(value)}
                    />
                    <ClassModuleDialog
                        ref={(c) => this.moduleDialog = c}
                        dataSource={this.moduleArray}
                        onSelect={(item, index) => {
                            if (item.canUse) {
                                const {navigate, goBack} = this.props.navigation;
                                navigate(item.pressTag, {
                                    classId: this.classData.id,
                                    isMaster: this.classData.isMaster,
                                    goBack: '',
                                });
                            } else {
                                ToastUtils.showToast('请先申请该权限');
                            }
                        }}
                    />
                    <ClassGuidView
                        ref={(c) => this.pkGuid = c}
                        onSelect={() => {
                            StorageUtils._sava('hasAlertPKGroup', true);
                            const {navigate} = this.props.navigation;
                            navigate('GroupPK', {
                                classId: this.classData.id,
                                isMaster: this.classData.isMaster,
                            });
                        }}
                    />
                    <ClassGuidView
                        ref={(c) => this.boardGuid = c}
                        guidType={'board'}
                        onSelect={() => {
                            StorageUtils._sava('hasAlertBindBoard', true);
                            const {navigate, goBack} = this.props.navigation;
                            const {params} = this.props.navigation.state;
                            navigate('BindRank', {
                                classId: this.classData.id,
                                goBack: goBack,
                                onRefresh: params.onRefresh,
                            });
                        }}
                        onCancel={() => {
                            StorageUtils._sava('hasAlertBindBoard', true);
                        }}
                    />
                </View>
                {renderView}
            </Container>
        );
    };

    leftView() {
        return (
            <View style={{
                position: 'absolute',
                left: 80,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <KBButton onPress={() => {
                    const {navigate} = this.props.navigation;
                    navigate("EditGroup", {
                        classId: this.classData.id,
                        classTitle: this.classData.name,
                        classData: this.classData,
                        isMaster: this.classData.isMaster,
                    });
                }}>
                    <View style={{
                        width: 40,
                        height: theme.withoutStatusHeight,
                        justifyContent: 'center',
                    }}>
                        <Image style={{
                            width: 16,
                            height: 16,
                        }} source={image.classifyList}/>
                    </View>
                </KBButton>
            </View>
        );
    }

    customSortView() {
        return (
            <View style={{
                position: 'absolute',
                right: 20,
                flexDirection: 'row',
                alignItems: 'center',
            }}>

                <KBButton onPress={() => {
                    this.setState({
                        isClassify: !this.state.isClassify,
                    }, () => {
                        this.eventEmitter.emit(STUDENT_SORT, {
                            classify: this.state.isClassify ? 'collection' : 'cell',
                        });
                    });
                }}>
                    <View style={{width: 40, height: theme.withoutStatusHeight, justifyContent: 'center'}}>
                        <Image style={{
                            width: 16,
                            height: 16,
                        }} source={this.state.isClassify ? image.classifyList : image.classifyCard}/>
                    </View>
                </KBButton>

                <KBDropPopMenu
                    renderer={renderers.Popover}
                    rendererProps={{
                        placement: 'bottom',
                        preferredPlacement: 'top',
                        anchorStyle: {backgroundColor: colors.white},
                    }}
                    optionsStyle={{backgroundColor: colors.white, width: theme.screenWidth - 15, marginTop: 0}}
                    dataArray={this.studentSortList}
                    uniqueKey={'title'}
                    menuTriggerStyle={{width: 40, height: theme.withoutStatusHeight}}
                    // optionsStyle={{marginTop: 40}}
                    menuTrigger={() => {
                        return (
                            <Image style={{
                                width: 16,
                                height: 16,
                            }} source={image.classifySort}/>
                        );
                    }}
                    onSelect={(value) => this.sortTypeChanged(value)}
                />
            </View>
        );
    }

    //底部按钮
    renderToolBarItem(item, index) {

        return (
            <KBButton key={index}
                      style={{flex: index == 1 ? 4 : 3}}
                      onPress={() => this.toolBarClick(index)}
            >
                <View style={{
                    flex: index == 1 ? 4 : 3,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 49,
                }}>
                    <Image style={{width: 20, height: 20}}
                           source={item.image}/>
                    <Text style={{
                        fontSize: 15,
                        marginLeft: 5,
                    }}>{item.text}</Text>
                </View>
            </KBButton>
        );
    };

    renderHeader(): null {
        return null;
    }

    renderClassHeader() {
        return (
            <KBHeader backgroundColor={colors.yellowColor}
                      leftComponent={() => {
                          return (
                              this.state.isSelectMore && this.state.isConnected ?
                                  <KBButton onPress={() => this.cancle()}>
                                      <View style={{
                                          width: 50, height: theme.withoutStatusHeight,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                      }}>
                                          <Text style={{marginLeft: 20}}>取消</Text>
                                      </View>
                                  </KBButton>
                                  :
                                  <KBButton onPress={() => {
                                      const {goBack} = this.props.navigation;
                                      goBack();
                                  }}>
                                      <View style={{
                                          width: 50,
                                          height: theme.withoutStatusHeight,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                      }}>
                                          <Image source={require('../../../assets/icon_back_black.png')}
                                                 style={{width: 10, height: 15}}/>
                                      </View>
                                  </KBButton>
                          );
                      }}
                      titleComponent={() => {
                          return (
                              <KBDropPopMenu
                                  rendererProps={{
                                      placement: 'bottom',
                                      preferredPlacement: 'top',
                                  }}
                                  optionsStyle={{
                                      backgroundColor: colors.white,
                                      width: theme.screenWidth,
                                      marginTop: theme.headerHeight - theme.statusHeight,
                                  }}
                                  optionStyle={{paddingHorizontal: 14}}
                                  dataArray={this.allClassData}
                                  uniqueKey={'name'}
                                  menuTriggerStyle={{paddingHorizontal: 5, height: theme.withoutStatusHeight}}
                                  menuTrigger={() => {
                                      return (
                                          <View style={{
                                              paddingHorizontal: 5,
                                              flexDirection: 'row',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              paddingLeft: 5,
                                              height: 44,
                                          }}>
                                              <Text style={{fontSize: 17}}>{this.classData.name}</Text>
                                              <Image style={{width: 15, height: 6, marginLeft: 5}}
                                                     source={image.navTitleOPen}
                                                     resizeMode={'contain'}/>
                                          </View>
                                      );
                                  }}
                                  onSelect={(value) => this.classChanged(value)}
                              />
                          );
                      }}
            />
        );
    };

    /***
     * 排序方式选择
     */
    sortTypeChanged(value) {
        let item = value.value;
        let data = this.studentSortList;
        if (item.isSelected) {
            return;
        } else {
            for (let obj of data) {
                obj.isSelected = false;
            }
            item.isSelected = true;
        }

        let emitType = STUDENT_SORT;

        this.setState({}, () => {
            this.eventEmitter.emit(emitType, {
                order: item.type,
            });
        });
    }


    /**
     * 子页刷新
     */
    refreshChildData() {
        if (!Utils.isNull(this.studentPage)) {
            this.studentPage.refreshData();
        }
    }

    refreshData = () => {
        this.componentDidMount();
    };

    //刷新主页与子页
    refresh = () => {
        this.refreshData();
        this.refreshChildData();
    };


    /**
     * 多选时取消按钮
     */
    cancle() {
        this.setState({
            isSelectMore: !this.state.isSelectMore,
        });
    };

    /**
     * toolBar 点击事件
     */
    toolBarClick(index) {
        switch (index) {
            case 0: {
                this.setState({
                    isSelectMore: !this.state.isSelectMore,
                });
            }
                break;
            case 1: {
                const {navigate} = this.props.navigation;
                navigate('ClassRank', {classId: this.classData.id});
            }
                break;
        }
    };

    /**
     * 标题班级选择
     * @param index
     */
    classChanged(value) {
        let obj = value.value;
        if (this.classData.id == obj.id) {
            return;
        }
        this.classData = obj;
        this.classAuth = [];
        if (this.classData.auth) {
            this.classAuth = this.classData.auth;
        }
        this._setAuthData();

        this.setState({}, () => {
            this.getClassOptions(); //添加班级事项刷新
            this.refresh();
        });
    }

    /**
     * 班级编辑
     */
    classEdit(value) {
        const {navigate} = this.props.navigation;
        switch (value.value.title) {
            case '编辑班级': {

                navigate('ClassEdit', {
                    classId: this.classData.id,
                    isMaster: this.classData.isMaster || this.classAuth.includes(this.EDIT_CLASS),
                });
            }
                break;
            case '查看班级报表': {
                navigate('ClassReport', {
                    classId: this.classData.id,
                    classTitle: this.classData.name,
                    isMaster: this.classData.isMaster,
                });
            }
                break;
            case '编辑表扬/待改进': {
                navigate('ClassOption', {
                    classId: this.classData.id,
                    entryType: -1,
                    onRefresh: this.refresh,
                    initialPage: 0,
                });
            }
                break;
            case '显示规则': {
                navigate('DisPalyRule');
            }
                break;
            case '积分清零':
                Alert.alert('警告', '清空后无法恢复，确定要清空该积分吗？', [{text: '清空', onPress: () => this.clearCodePost()},
                    {text: '取消', style: 'cancel'}]);
                break;
            case '学生分组':

                let master = false;  //此处查看是否有学生分组的权限，如果有，则赋予班主任分组权限

                if (this.classData.isMaster || this.classAuth.includes(this.CREATE_TEAM)) {
                    master = true;
                }

                navigate('Group', {
                    isMaster: master,
                    classId: this.classData.id,
                });
                break;
        }
    }

    /**
     * tab 切换
     */
    tabChanged(index) {
    };
}

const styles = StyleSheet.create({

    content: {
        width: theme.screenWidth,
        height: theme.screenHeight - theme.headerHeight,
        backgroundColor: colors.white,
    },
    toolBar: {
        flexDirection: 'row',
        height: 49,
        width: theme.screenWidth,
        borderTopWidth: 0.5,
        backgroundColor: colors.white,
        borderColor: colors.divider,
    },

});
