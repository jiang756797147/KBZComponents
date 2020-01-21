import React from 'react';
import {Container} from 'native-base';
import {
    Text,
    View,
    Image,
    TextInput,
    DeviceEventEmitter,
} from 'react-native';
import moment from 'moment';
import BaseScreen from '../../../base/BaseScreen';
import KBButton from '../../../components/KBButton';
import KBScrollView from '../../../components/KBScrollView';
import KBHeader from '../../../components/KBHeader';
import Divider from '../../../components/Divider';

import colors from '../../../constants/colors';
import theme from '../../../constants/theme';
import image from '../../../constants/image';
import fetchUrl from '../../../constants/fetchUrl';
import {MESSAGE_UPDATE} from '../../../constants/notify';

import Utils from '../../../utils/Utils';
import TimeUtils from '../../../utils/TimeUtils';
import HttpUtils from '../../../utils/HttpUtils';
import ToastUtils from '../../../utils/ToastUtils';
// import KBSourceView from "../../../components/KBSourceView";

export default class TaskScreen extends BaseScreen {


    currentDate = moment().startOf('day').unix();

    taskData = {
        id: '',
        content: '',
        startDate: this.currentDate,
        endDate: 0,
        receptors: [],
        taskScore: '',
        taskPeriod: 0, //0: 日  1：周
    };

    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state);
        const {navigate, goBack} = this.props.navigation;
        const {params} = this.props.navigation.state;
        this.navigate = navigate;
        this.goBack = goBack;
        this.classId = params.classId;
        this.onRefresh = params.onRefresh;

        this.isCopy = false; //是否是复制
        this.eventEmitter = DeviceEventEmitter;
    }

    componentDidMount() {
        super.componentDidMount();
        this.getTaskData();
    }

    getTaskData = () => {
        const {params} = this.props.navigation.state;
        if (params.taskData) {

            this.isCopy = true;

            let students = params.taskData.studentData;
            for (let studentObj of students) {
                let student = {};
                student.id = studentObj.student_id;
                this.taskData.receptors.push(student);
            }

            this.taskData.content = params.taskData.title;
            this.taskData.startDate = this.currentDate;
            if (params.taskData.stop_at > this.currentDate) {
                this.taskData.endDate = params.taskData.stop_at;
            } else {
                this.taskData.endDate = 0;
            }

            this.taskData.taskScore = params.taskData.score;
            this.taskData.taskPeriod = params.taskData.task_cycle;
        }
    };

    //周期
    renderOptionPeriod(value) {
        let isDayPeriod = value === 0;
        return (
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 15}}>
                <KBButton onPress={() => {
                    if (isDayPeriod) {
                        return;
                    }
                    this.taskData.taskPeriod = 0;
                    this.setState({});
                }}>
                    <View style={{
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: colors.yellowColor,
                        backgroundColor: isDayPeriod ? colors.yellowColor : colors.white,
                    }}>
                        <Text style={{fontSize: 15, color: isDayPeriod ? colors.white : colors.yellowColor}}>日</Text>
                    </View>
                </KBButton>
                <KBButton onPress={() => {
                    if (!isDayPeriod) {
                        return;
                    }
                    this.taskData.taskPeriod = 1;
                    this.setState({});
                }}>
                    <View style={{
                        marginLeft: 20,
                        width: 30,
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 15,
                        borderWidth: 1,
                        borderColor: colors.yellowColor,
                        backgroundColor: isDayPeriod ? colors.white : colors.yellowColor,
                    }}>
                        <Text style={{fontSize: 15, color: isDayPeriod ? colors.yellowColor : colors.white}}>周</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    //分数
    renderOptionScore() {
        return (
            <View style={{flex: 1, height: 60, paddingHorizontal: 15, justifyContent: 'center'}}>
                <TextInput
                    underlineColorAndroid="transparent"
                    multiline={false}
                    onChangeText={(text) => {
                        if (text.length > 0 && text.substr(0, 1) == 0) {
                            text = text.substr(1, text.length - 1);
                        }
                        this.taskData.taskScore = text;
                        this.setState({});
                    }}
                    keyboardType={'number-pad'}
                    placeholder={'请输入任务分值'}
                    style={{
                        fontSize: 15,
                        color: colors.text333,
                        textAlign: 'right',
                        textAlignVertical: 'center',
                    }}
                    value={this.taskData.taskScore.toString()}
                />
            </View>

        );
    }

    renderOptionRight(value, placeText, pressAction) {
        let showPlaceText = Utils.isNull(value);
        return (
            <KBButton style={{flex: 1}} onPress={() => {
                if (placeText === '请选择开始日期') {
                    pressAction('开始');
                } else if (placeText === '请选择指派的学生或小组') {
                    pressAction();
                } else {//请选择截止日期
                    pressAction('结束');
                }

            }}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 15,
                        color: showPlaceText ? colors.text999 : colors.text555,
                    }}>{showPlaceText ? placeText : value}</Text>
                    <Image style={{marginLeft: 10, width: 7, height: 13}} source={image.itemArrowImage}/>
                </View>
            </KBButton>
        );
    }

    //任务描述内容
    renderOptionContent() {
        return (
            <View style={{marginTop: 10, borderBottomWidth: 1, borderColor: colors.divider}}>
                <TextInput
                    underlineColorAndroid="transparent"
                    multiline={true}
                    onChangeText={(text) => {
                        this.taskData.content = text;
                        this.setState({});
                    }}
                    maxLength={150}
                    placeholder={'请输入任务描述（最多输入150字）'}
                    style={{
                        paddingVertical: 10,
                        lineHeight: 20,
                        fontSize: 15,
                        color: colors.text333,
                        textAlignVertical: 'top',
                        borderRadius: 3,
                    }}
                    value={this.taskData.content}
                />
            </View>
        );
    }

    renderOptionTitle(title) {
        return (
            <View style={{justifyContent: 'center'}}>
                <Text style={{fontSize: 15, color: colors.text555}}>{`${title}：`}</Text>
            </View>
        );
    }

    renderOption(title, optionRightView) {
        return (
            <View style={[{
                backgroundColor: colors.white,
                paddingHorizontal: 15,
            }, title === '任务描述' ? {paddingTop: 20} : {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 60,
            }]}>
                <View style={{flex: 3}}>
                    {this.renderOptionTitle(title)}
                </View>
                <View style={{flex: 7}}>
                    {optionRightView}
                </View>

            </View>
        );
    }

    renderData() {
        let receptorText = this.taskData.receptors.length > 0 ? `已选中${this.taskData.receptors.length}名学生` : '';
        let startDate = TimeUtils.getTimeWithDay(this.taskData.startDate);
        let endDate = this.taskData.endDate > 0 ? TimeUtils.getTimeWithDay(this.taskData.endDate) : '';
        return (
            <View style={{flex: 1, backgroundColor: colors.empty}}>
                <KBScrollView
                    // isRefreshControl={true}
                    // isRefreshing={this.state.isRefreshing}
                    // onRefresh={this.refreshData}
                >
                    {this.renderOption('任务描述', this.renderOptionContent())}
                    {this.renderOption('开始日期', this.renderOptionRight(startDate, '请选择开始日期', this.datePicked))}
                    <Divider customHeight={10}/>
                    {this.renderOption('选择指派人', this.renderOptionRight(receptorText, '请选择指派的学生或小组', this.receptPicked))}
                    <Divider isMargin={true}/>
                    {/*<KBSourceView ref={(c)=>this.sourceView=c} textStyle={styles.typeName} style={{paddingHorizontal:15}}/>*/}
                    <Divider isMargin={true}/>
                    {this.renderOption('任务分值', this.renderOptionScore())}
                    <Divider customHeight={10}/>
                    {this.renderOption('任务周期', this.renderOptionPeriod(this.taskData.taskPeriod))}
                    <Divider isMargin={true}/>
                    {this.renderOption('截止日期', this.renderOptionRight(endDate, '请选择截止日期', this.datePicked))}
                </KBScrollView>
                {this.renderBottom()}
            </View>
        );
    }


    renderHeader() {
        return (
            <KBHeader
                isLeft={true}
                title={'任务消息'}
                rightText={'查看统计'}
                rightStyle={{color: colors.text888, fontSize: 14}}
                touchRight={() => {
                    this.navigate('TaskStatis', {
                        classId: this.classId,
                    });
                }}
                {...this.props}
            />
        );
    }

    renderBottom() {
        return (
            <View style={{
                width: theme.screenWidth,
                height: 49,
                alignItems: 'center',
                // backgroundColor: colors.empty
            }}>
                <KBButton onPress={() => this.setTask()}>
                    <View style={{
                        width: theme.screenWidth - 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.yellowColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 15, color: colors.text555}}>确认</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    //日期选择
    datePicked = (dateType) => {
        this.navigate('KBDate', {
            isSingle: true,
            getDate: (date) => {
                if (dateType === '开始') {
                    if (date.timestamp / 1000 < this.currentDate) {
                        ToastUtils.showToast('开始日期不能小于当前日期！');
                        return;
                    }
                    if (this.taskData.endDate > 0 && date.timestamp / 1000 > this.taskData.endDate) {
                        ToastUtils.showToast('请重新设置截止日期');
                        this.taskData.endDate = 0;
                    }
                    this.taskData.startDate = date.timestamp / 1000;
                } else {
                    if (date.timestamp / 1000 < this.taskData.startDate) {
                        ToastUtils.showToast('截止日期不能小于开始日期！');
                        return;
                    }
                    this.taskData.endDate = date.timestamp / 1000;
                }
                this.setState({});
            },
        });
    };
    receptPicked = () => {
        this.navigate('ReceptorList', {
            classId: this.classId,
            receptors: this.taskData.receptors,
            getReceptors: (data) => this.getReceptors(data),
        });
    };

    getReceptors = (data) => {
        this.taskData.receptors = data;
        this.setState({});
    };

    verify = () => {
        let taskData = this.taskData;
        if (Utils.isNull(taskData.content)) {
            ToastUtils.showToast('请添加任务描述！');
            return false;
        }
        if (taskData.startDate === 0) {
            ToastUtils.showToast('请选择任务开始时间！');
            return false;
        }
        if (taskData.endDate === 0) {
            ToastUtils.showToast('请选择任务截止时间！');
            return false;
        }
        if (Utils.isNull(taskData.taskScore) || parseInt(taskData.taskScore) <= 0) {
            ToastUtils.showToast('请设置任务分值！');
            return false;
        }
        if (taskData.receptors.length === 0) {
            ToastUtils.showToast('请选择指派的小组或学生！');
            return false;
        }
        return true;
    };

    _getReceptorIds = () => {
        let receptorIds = [];
        for (let student of this.taskData.receptors) {
            let studentObject = {};
            studentObject.studentId = student.id;
            receptorIds.push(studentObject);
        }
        return receptorIds;
    };

    setTask = () => {

        if (!this.verify()) {
            return;
        }
        let taskData = this.taskData;

        let receptorIds = this._getReceptorIds();

        let formData = new FormData();
        formData.append('title', taskData.content);
        formData.append('score', taskData.taskScore);
        formData.append('taskCycle', taskData.taskPeriod);
        formData.append('startAt', taskData.startDate);
        formData.append('stopAt', taskData.endDate);
        formData.append('classId', this.classId);
        formData.append('studentId', JSON.stringify(receptorIds));
        /*添加来源*/
        formData.append('qualityType', this.sourceView._getSelectedId());
        HttpUtils.doPostWithToken(fetchUrl.addTaskScore, formData, {
            onSuccess: (responseData) => {

                ToastUtils.showToast(responseData.message);
                if (this.onRefresh) {
                    this.onRefresh();
                }
                this.goBack();
                this.eventEmitter.emit(MESSAGE_UPDATE);
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            },
        });
    };

}
