import React, {Component} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {Label} from "native-base";
import moment from "moment/moment";
import DateTimePicker from 'react-native-modal-datetime-picker';

import PropTypes from 'prop-types'
import colors from "../../../../constants/colors";
import theme from "../../../../constants/theme";
import KBButton from "../../../../components/KBButton";
import Utils from "../../../../utils/Utils";
import Divider from "../../../../components/Divider";
import TimeUtils from "../../../../utils/TimeUtils";
import ToastUtils from "../../../../utils/ToastUtils";
import KBScrollView from "../../../../components/KBScrollView";

let filterW = theme.screenWidth * 9 / 10;
export default class ClassRankDrawerScreen extends Component {

    static defaultProps = {
        startTimes: "",
        endTimes: "",
        improveData: [],
        teamData: [],
        isCheckMine: false,
    };

    static propTypes = {
        startTimes: PropTypes.string,
        endTimes: PropTypes.string,
        improveData: PropTypes.array,
        teamData: PropTypes.array,
        isCheckMine: PropTypes.bool,
        subtitle: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            startTimeStr: "开始时间",
            endTimeStr: "结束时间",
            startTimes: null,
            endTimes: null,
            dateTimePickerType: "", //"start" "end"
            isDateTimePickerVisible: false,
            isCheckMine: this.props.isCheckMine,
            isImproveAllCheck: false,
            isTeamAllCheck: false,
            subtitle: '小组内排名'
        };
    }

    renderImproveItem = ({name, isChecked}, index, data) => {
        return (
            <KBButton key={index} onPress={() => {
                data[index].isChecked = !data[index].isChecked;
                this.setState({});
            }}>
                <View style={{
                    marginBottom: 10,
                    marginRight: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isChecked ? '#FFD945' : '#F7F6F3',
                    paddingVertical: 5,
                    borderRadius: 5,
                    paddingHorizontal: 14,
                }}>
                    <Text numberOfLines={1}
                          style={{
                              fontSize: 13,
                              color: isChecked ? colors.text333 : colors.text666
                          }}>{name}</Text>
                </View>
            </KBButton>
        );
    };

    renderTeamItem = ({name, isChecked}, index, data) => {
        return (
            <KBButton key={index} onPress={() => {
                data[index].isChecked = !data[index].isChecked;
                this.setState({});
            }}>
                <View style={{
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text numberOfLines={1}
                          style={{
                              color: isChecked ? '#FF693C' : colors.text666,
                              fontSize: 13,
                              flex: 1
                          }}>{name}</Text>
                    {isChecked ?
                        <Image source={require('../../../../assets/class/screen_ic_select.png')}
                               style={{width: 15, height: 15}} resizeMode={'contain'}/>
                        :
                        null}
                </View>
            </KBButton>
        );
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{
                flex: 1,
                backgroundColor: colors.white,
                paddingTop: theme.statusHeight
                // paddingBottom: theme.isIphoneX? 34 : 0,
            }}>
                <KBScrollView style={{flex: 1,}} showsVerticalScrollIndicator={false}>

                    {/*时间筛选*/}
                    <View style={styles.filterTime}>
                        <Label style={styles.filterTitle}>时间筛选</Label>
                        <View style={styles.filterTimeChoose}>
                            <KBButton onPress={() => this.startTime()}>
                                <View style={{
                                    width: 120,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: '#F7F6F3',
                                    justifyContent: "center",
                                    alignItems: "center"
                                }
                                }>
                                    <Text style={{color: colors.text888}}>
                                        {this.state.startTimeStr}
                                    </Text>
                                </View>
                            </KBButton>
                            <Label> - </Label>
                            <KBButton onPress={() => this.endTime()}>
                                <View style={{
                                    width: 120,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: '#F7F6F3',
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Text style={{color: colors.text888}}>
                                        {this.state.endTimeStr}
                                    </Text>
                                </View>
                            </KBButton>
                            <DateTimePicker mode={"date"}
                                            cancelTextIOS={"取消"}
                                            confirmTextIOS={"确定"}
                                            titleIOS={"日期选择"}
                                            isVisible={this.state.isDateTimePickerVisible}
                                            onConfirm={(value) => this.handleDatePicked(value)}
                                            onCancel={() => this.hideDateTimePicker()}>

                            </DateTimePicker>
                        </View>
                    </View>

                    <Divider/>

                    <View style={{
                        paddingTop: 10,
                        paddingLeft: 14,
                        paddingVertical: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 14, fontWeight: 'bold', color: colors.text333}}>表扬待改进类型</Text>

                        <KBButton onPress={() => this.improveAllCheck()}>
                            <View style={{paddingHorizontal: 10, marginRight: 4, paddingVertical: 5}}>
                                <Text style={{fontSize: 13, color: colors.text666}}>全选</Text>
                            </View>
                        </KBButton>
                    </View>
                    <View style={{flexWrap: 'wrap', flexDirection: 'row', paddingHorizontal: 14}}>
                        {this.props.improveData.map(this.renderImproveItem)}
                    </View>

                    <Divider/>

                    <View style={{
                        paddingLeft: 14,
                        paddingTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text style={{fontSize: 14, fontWeight: 'bold', color: colors.text333}}>{this.props.subtitle}</Text>

                        <KBButton onPress={() => this.teamAllCheck()}>
                            <View style={{paddingHorizontal: 10, marginRight: 4, paddingVertical: 5}}>
                                <Text style={{fontSize: 13, color: colors.text666}}>全选</Text>
                            </View>
                        </KBButton>
                    </View>
                    <View>
                        {this.props.teamData.map(this.renderTeamItem)}
                    </View>

                </KBScrollView>

                {/*重置、确认*/}
                <View style={styles.filterBottom}>
                    <KBButton style={{flex: 1}} onPress={() => this.filterReset()}>
                        <View style={{
                            flex: 1,
                            height: 44.5,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Text style={{
                                fontSize: 17,
                                color: colors.text666,
                            }}>
                                重置
                            </Text>
                        </View>
                    </KBButton>
                    <KBButton style={{flex: 1}} onPress={() => this.filterConfirm()}>
                        <View style={{
                            flex: 1,
                            height: 44.5,
                            backgroundColor: '#FED845',
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Text style={{
                                fontSize: 17,
                                color: colors.text666,
                            }}>
                                确定
                            </Text>
                        </View>
                    </KBButton>
                </View>
            </View>
        );
    }

    /**
     * filter 筛选
     */
    // 开始时间
    startTime() {
        this.setState({
            isDateTimePickerVisible: true,
            dateTimePickerType: "start",
        });
    };

    // 结束时间
    endTime() {
        this.setState({
            isDateTimePickerVisible: true,
            dateTimePickerType: "end",
        });
    };

    handleDatePicked(value) {
        let dateStr = moment(value).format('YYYY-MM-DD').toString();
        if (this.state.dateTimePickerType == "start") {
            let startStr = dateStr + ' 00:00:00';
            this.state.startTimeStr = dateStr;
            this.state.startTimes = TimeUtils.getTimeByDateAsS(startStr);
            this.props.setStateFlag({startTimes: TimeUtils.getTimeByDateAsS(startStr)});
            // this.props.startTimes = dateStr;
        } else {
            this.state.endTimeStr = dateStr;
            let endStr = dateStr + ' 23:59:59';
            this.state.endTimes = TimeUtils.getTimeByDateAsS(endStr);
            this.props.setStateFlag({endTimes: TimeUtils.getTimeByDateAsS(endStr)});
            // this.props.endTimes = dateStr;
        }
        this.setState({});
        this.hideDateTimePicker();
    }

    hideDateTimePicker() {
        this.setState({
            isDateTimePickerVisible: false,
        });
    }

    improveAllCheck = () => {
        for (let improve of this.props.improveData) {
            improve.isChecked = !this.state.isImproveAllCheck
        }
        this.setState({isImproveAllCheck: !this.state.isImproveAllCheck});
    };

    teamAllCheck = () => {
        for (let team of this.props.teamData) {
            team.isChecked = !this.state.isTeamAllCheck
        }
        this.setState({isTeamAllCheck: !this.state.isTeamAllCheck});
    };

    /**
     * 重置
     */
    filterReset() {

        // 时间重置
        this.state.startTimeStr = "开始时间";
        this.state.endTimeStr = "结束时间";
        this.state.startTimes = null;
        this.state.endTimes = null;
        this.props.setStateFlag({startTimes: '', endTimes: ''});

        this.arrayReset(this.props.improveData);//待改进类型重置
        this.arrayReset(this.props.teamData);        //小组重置

        this.setState({});
    };

    arrayReset(array) {

        if (Utils.isArrayNull(array)) {
            return;
        }

        for (let obj of array) {
            obj.isChecked = false;
        }
    }

    /**
     * 确定
     */
    filterConfirm() {
        if ((Utils.isNull(this.state.startTimes) && !Utils.isNull(this.state.endTimes)) || (!Utils.isNull(this.state.startTimes) && Utils.isNull(this.state.endTimes))) {
            ToastUtils.showToast('不能只选择开始时间或结束时间');
            return;
        }
        if (!Utils.isNull(this.state.startTimes) && !Utils.isNull(this.state.endTimes) && this.state.endTimes < this.state.startTimes) {
            ToastUtils.showToast('结束时间不能早于开始时间');
            return;
        }
        this.props.onConfirm();
        this.props.drawer.close();
    };
}

const styles = StyleSheet.create({

    backTextWhite: {
        color: '#FFF'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: colors.white,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0
    },

    filterTitleView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text333,
    },
    filterTime: {
        marginVertical: 15,
        paddingHorizontal: 14,
    },
    filterTimeChoose: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    filterIntegral: {
        marginTop: 30,
    },
    filterIntegralView: {
        marginTop: 10,
        marginRight: 20,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    filterItem: {
        marginTop: 30,
    },
    filterItemView: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: 'space-around',
        flexWrap: "wrap",
    },
    filterDepartment: {
        marginTop: 30,
    },
    filterDepartmentView: {
        marginTop: 10,
    },
    filterBottom: {
        flexDirection: "row",
        height: 45,
        width: filterW,
        backgroundColor: colors.white,
        borderWidth: 0.5,
        borderColor: colors.classroomCircle,
    },
});