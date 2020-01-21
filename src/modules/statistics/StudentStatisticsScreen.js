import React from 'react'
import {Image, Text, View, StyleSheet, ScrollView} from "react-native";
import BaseScreen from '../../base/BaseScreen'
import lodash from 'lodash';

import colors from "../../constants/colors";
import KBHeader from "../../components/KBHeader";
import KBScrollView from "../../components/KBScrollView";
import KBStatisTopView from "./view/KBStatisTopView";
import TypeChooseView from "./view/TypeChooseView";
import StatisticsListView from "./view/StatisticsListView";
import KBButton from "../../components/KBButton";
import KBLineChart from "./view/KBLineChart";
import theme from "../../constants/theme";
import KBRadarChart from "./view/KBRadarChart";
import KBScoreListView from "./view/KBScoreListView";
import fetchUrl from "../../constants/fetchUrl";
import HttpUtils from "../../utils/HttpUtils";
import ToastUtils from "../../utils/ToastUtils";

import KBDropPopMenu from '../../components/popMenu/KBDropPopMenu';

import {timeArray, compareTimeArray} from './StatisticMode';

export default class StudentStatisticsScreen extends BaseScreen {


    numberData = [
        {name: '学生人数', number: '0'},
        {name: '本周奖票', number: '0'},
        {name: '上周奖票', number: '0'}
    ];

    titleArray = ['德', '智', '体', '美', '劳'];

    constructor(props) {
        super(props);

        const {params} = this.props.navigation.state;
        this.classId = params.classItem.id;
        this.allClass = params.allClass;

        this.classTimeType = 1; //时间类型：1:本日;2:昨日;3:本周;4:上周;5:本月;6:上个月;
        this.classStartTime = '';
        this.classEndTime = '';
        this.classLineTimeType = 1; //时间类型：1:本日;2:昨日;3:本周;4:上周;5:本月;6:上个月;
        this.lineStartTime = '';
        this.lineEndTime = '';
        this.classRadarTimeType = 1;  //时间类型  1.今天/昨天 2.本周/上周 3.本月/上月
        this.radarGroupId = '';  //班级id，雷达图筛选条件
        this.radarGroups = [];

        this.state = Object.assign({

            studentData: [],
            studentDataMore: false,  //是否查看更多

            isRefreshing: false,
            classDropDown: false,
            nowClass: params.classItem,

            groupNameData: [],  //雷达图 小组筛选条件数据
            lineData: [],  //线性图数据
            radarData: {
                first: [
                    {name: '德', score: 0},
                    {name: '智', score: 0},
                    {name: '体', score: 0},
                    {name: '美', score: 0},
                    {name: '劳', score: 0},
                ],
                second: [
                    {name: '德', score: 0},
                    {name: '智', score: 0},
                    {name: '体', score: 0},
                    {name: '美', score: 0},
                    {name: '劳', score: 0},
                ],
            },  //默认为0,

            firstRadarName: '今天:',
            secondRadarName: '昨天:',
            lineWidth: theme.screenWidth - 30,

        }, this.state);
    }


    getApiUrl = () => {
        return `${fetchUrl.getStudentTopStatistics}class_id=${this.classId}`;
    };

    onSuccess = (responseData) => {
        if (responseData.data) {
            let data = responseData.data;
            for (let i = 0; i < this.numberData.length; i++) {
                switch (this.numberData[i].name) {
                    case '学生人数':
                        this.numberData[i].number = data.total;
                        break;
                    case '本周奖票':
                        this.numberData[i].number = data.week;
                        break;
                    case "上周奖票":
                        this.numberData[i].number = data.lastWeek;
                        break;
                    default:
                        this.numberData[i].number = 0;
                        break;
                }
            }
        }
    };

    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }

    //获取学生排行列表
    _getStudentRankPost = () => {

        //添加自定义时间
        let customTime = this.classTimeType === 7 ? `&startTime=${this.classStartTime}&endTime=${this.classEndTime}` : '';
        let url = `${fetchUrl.getStudentRank}class_id=${this.classId}&timeType=${this.classTimeType}${customTime}`;

        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                if (responseData.data.list && responseData.data.list.length > 0) {
                    this.setState({
                        studentData: responseData.data.list,
                    })
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message)
            }
        })
    };

    //获取线性图数据请求
    _getLineDataPost() {

        //添加自定义时间
        let customTime = this.classLineTimeType === 7 ? `&startTime=${this.lineStartTime}&endTime=${this.lineEndTime}` : '';

        let url = `${fetchUrl.getStudentLineChart}class_id=${this.classId}&timeType=${this.classLineTimeType}${customTime}`;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                //添加雷达图筛选条件：班级数据
                this.state.groupNameData = []; //清零

                if (responseData.data && responseData.data.length > 0) {

                    for (let i = 0; i < responseData.data.length; i++) {
                        this.state.groupNameData.push(responseData.data[i].groupName);
                    }
                    if (this.state.groupNameData.length * 50 > this.state.lineWidth) {
                        this.state.lineWidth = this.state.groupNameData.length * 50;
                    }
                    this.setState({
                            lineData: responseData.data,
                        }, () => {
                            if (this.lineChart) {
                                this.lineChart.updateData(this._getLinePickData(this.state.lineData, 'pickNum'), this._getLinePickData(this.state.lineData, 'totalNum'));
                            }
                            if (!this.radarGroupId) {  //只有刚进当前页面事进行网络请求，获取默认班级（第一个）数据

                                this.radarGroupId = responseData.data[0].groupId;
                                this.radarGroups = responseData.data

                            }
                            this._getRadarDataPost();  //获取雷达图数据
                        }
                    )
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        })
    }

    //获取雷达图数据请求
    _getRadarDataPost() {

        let url = `${fetchUrl.getStudentRadarChart}groupId=${this.radarGroupId}&timeType=${this.classRadarTimeType}`;

        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                if (responseData.data) {
                    this.setState({
                        radarData: responseData.data,
                    });
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        })

    }

    componentDidMount() {
        super.componentDidMount();
        this._getStudentRankPost();  //获取学生排行列表
        this._getLineDataPost(); //获取学生小组线性图

    }

    renderHeader() {

        return (
            <KBHeader backgroundColor={colors.yellowColor}
                      {...this.props}
                      showDriver={false}
                      isLeft={true}
                      titleComponent={() => {
                          return (
                              <KBDropPopMenu
                                  onOpen={() => {
                                      this.setState({classDropDown: true})
                                  }}
                                  onClose={() => {
                                      this.setState({classDropDown: false})
                                  }}
                                  rendererProps={{
                                      placement: 'bottom',
                                      preferredPlacement: 'top',
                                  }}
                                  optionsStyle={{
                                      backgroundColor: colors.white,
                                      width: theme.screenWidth,
                                      marginTop: theme.headerHeight - theme.statusHeight
                                  }}
                                  optionStyle={{paddingHorizontal: 14}}
                                  menuTriggerStyle={{paddingHorizontal: 5, height: theme.withoutStatusHeight,}}
                                  menuTrigger={() =>
                                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                          <Text style={{
                                              fontSize: 15,
                                              color: colors.text21
                                          }}>{this.state.nowClass.name}</Text>
                                          <Image
                                              source={this.state.classDropDown ? require('../../assets/image3.5/time_up.png') :
                                                  require('../../assets/image3.5/time_down.png')}
                                              style={{width: 8, height: 8, marginLeft: 5}} resizeMode={'contain'}/>
                                      </View>}
                                  dataArray={this.allClass}
                                  uniqueKey={'name'}
                                  onSelect={(value) => {
                                      this.classId = value.value.id;
                                      this.radarGroupId = '';
                                      this.setState({
                                          nowClass: value.value,
                                          isRefreshing: true
                                      });
                                      this.componentDidMount();
                                  }}
                              />
                          );
                      }}/>
        )
    }


    renderData() {

        return (
            <View style={{flex: 1, backgroundColor: colors.textf9}}>
                <KBScrollView style={{flex: 1}}
                              isRefreshControl={true}
                              isRefreshing={this.state.isRefreshing}
                              onRefresh={this.onRefresh}>
                    <View style={{
                        width: theme.screenWidth,
                        height: 150,
                        borderBottomLeftRadius: 15,
                        borderBottomEndRadius: 15,
                        backgroundColor: colors.yellowColor,
                        position: "absolute"
                    }}/>

                    <KBStatisTopView data={this.numberData} nameStr={'name'} numberStr={'number'}/>

                    <View style={{
                        marginBottom: 10,
                        marginHorizontal: 15,
                        paddingVertical: 20,
                        backgroundColor: colors.white,
                        borderRadius: 6
                    }}>

                        <TypeChooseView hasCustom={true}
                                        {...this.props}
                                        titleText={'学生活跃排行'}
                                        dataArray={timeArray}
                                        timeSelected={this._randTimeSelected}/>

                        <StatisticsListView {...this.props}
                                            isStudent={true}
                                            data={this.state.studentData.length > 6 && !this.state.studentDataMore ? this.state.studentData.slice(0, 6) : this.state.studentData}/>

                        {this.state.studentData.length > 6 && !this.state.studentDataMore ?
                            <View style={{alignItems: 'center'}}>
                                <KBButton onPress={() => {
                                    this.props.navigation.navigate('StudentRanking', {classId: this.classId});
                                }}><View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 80,
                                    height: 30,
                                    borderWidth: 1,
                                    borderColor: colors.yellowColor,
                                    borderRadius: 4
                                }}>
                                    <Text style={{fontSize: 14, color: colors.yellowColor}}>查看更多</Text>
                                </View>
                                </KBButton>
                            </View> : null
                        }

                        <TypeChooseView hasCustom={true}
                                        {...this.props}
                                        titleText={'小组对比图'}
                                        dataArray={timeArray}
                                        timeSelected={this._lineTimeSelected}/>

                        <View style={{
                            marginHorizontal: 10,
                            marginVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>

                            <Image style={{width: 20, height: 12}}
                                   source={require('../../assets/image3.5/line_color1.png')}/>
                            <Text
                                style={{flex: 1, marginLeft: 10, fontSize: 14, color: colors.text21}}>奖票数</Text>
                            <Text style={{marginRight: 10, fontSize: 14, color: colors.text21}}>积分总数</Text>
                            <Image
                                style={{width: 20, height: 12}}
                                source={require('../../assets/image3.5/line_color2.png')}/>
                        </View>

                        {this.state.lineData.length > 0 ?
                            <ScrollView horizontal={true} style={{paddingBottom: 10}}>
                                <KBLineChart ref={(c) => this.lineChart = c}
                                             bianWidth={this.state.lineWidth}
                                             bottomNames={this.state.groupNameData}
                                             lineDataTwo={this._getLinePickData(this.state.lineData, 'pickNum')}
                                             lineDataOne={this._getLinePickData(this.state.lineData, 'totalNum')}/>
                            </ScrollView>
                            :
                            <Image style={{
                                width: theme.screenWidth - 30,
                                resizeMode: 'contain',
                                marginHorizontal: 10,
                                height: theme.screenHeight / 4 - 20
                            }} source={require('../../assets/image3.5/blank_group_data.png')}/>
                        }

                        {
                            this.radarGroups.length > 0 ?
                                <TypeChooseView titleText={'小组分布图'}
                                                dataArray={this.radarGroups}
                                                uniqueKey={'groupName'}
                                                timeSelected={this._randClassSelected}
                                /> : null
                        }

                        <KBRadarChart edgeWidth={15}
                                      titleArray={this.titleArray}
                                      firstData={this._getRadarData(this.state.radarData.first)}
                                      secondData={this._getRadarData(this.state.radarData.second)}/>

                        <TypeChooseView {...this.props}
                                        style={{marginBottom: 20}}
                                        dataArray={compareTimeArray}
                                        btnScreenStyle={{width: 80}}
                                        timeSelected={this._radarTimeSelected}
                        />
                        <KBScoreListView style={{marginBottom: 20}} name={this.state.firstRadarName}
                                         image={require('../../assets/image3.5/circle_blue.png')}
                                         data={this.state.radarData.first}/>

                        <KBScoreListView style={{marginBottom: 10}} name={this.state.secondRadarName}
                                         image={require('../../assets/image3.5/circle_yellow.png')}
                                         data={this.state.radarData.second}/>
                    </View>
                </KBScrollView>
            </View>
        )
    }

    onRefresh = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    //班级活跃排行时间筛选选择
    _randTimeSelected = (value, startTime, endTime) => {
        this.classTimeType = value.value;
        this.classStartTime = startTime;
        this.classEndTime = endTime;
        this._getStudentRankPost();
    };

    //班级对比图时间筛选选择
    _lineTimeSelected = (value, startTime, endTime) => {
        this.classLineTimeType = value.value;
        this.lineStartTime = startTime;
        this.lineEndTime = endTime;
        this._getLineDataPost();
    };

    //班级雷达图班级筛选选择
    _randClassSelected = (seletedClass) => {
        // ToastUtils.showToast("雷达图班级选择"+index);
        this.radarGroupId = seletedClass.groupId;
        this._getRadarDataPost();
    };

    //班级雷达图时间筛选选择
    _radarTimeSelected = (value) => {

        switch (value.value) {
            case 0:
                this.state.firstRadarName = '今天:';
                this.state.secondRadarName = '昨天:';
                break;
            case 1:
                this.state.firstRadarName = '本周:';
                this.state.secondRadarName = '上周:';
                break;
            case 2:
                this.state.firstRadarName = '本月:';
                this.state.secondRadarName = '上月:';
                break;
        }
        this.classRadarTimeType = value.value;
        this._getRadarDataPost();
    };

    _getLinePickData = (data, keyName) => {

        let result = [];
        for (let i = 0; i < data.length; i++) {
            result.push({x: i, y: data[i][keyName]})
        }
        return result;
    }

    _getRadarData = (data) => {
        let result = [];
        this.titleArray = [];
        for (let i = 0; i < data.length; i++) {
            this.titleArray.push(data[i].name);
            result.push({value: data[i].score});
        }
        return result;
    }

}

const styles = StyleSheet.create({
    groupText: {
        marginHorizontal: 10,
        fontSize: 13,
        color: colors.text21,
        transform: [{rotateZ: '-55deg'}],

    },
})