import React from 'react';
import BaseScreen from '../../base/BaseScreen';
import {Image, View, Text, StyleSheet, ScrollView} from 'react-native';
import colors from '../../constants/colors';
import KBHeader from '../../components/KBHeader';
import KBScrollView from '../../components/KBScrollView';
import KBButton from '../../components/KBButton';

import theme from '../../constants/theme';
import fetchUrl from '../../constants/fetchUrl';

import HttpUtils from '../../utils/HttpUtils';

import KBStatisTopView from './view/KBStatisTopView';
import StatisticsListView from './view/StatisticsListView';
import TypeChooseView from './view/TypeChooseView';
import KBScoreListView from './view/KBScoreListView';
import KBLineChart from './view/KBLineChart';
import KBRadarChart from './view/KBRadarChart';
import {timeArray, compareTimeArray} from './StatisticMode'
import ToastUtils from "../../utils/ToastUtils";

export default class ClassStatisticsScreen extends BaseScreen {

    numberData = [
        {name: '开通班级', number: '0'},
        {name: '本周使用班级', number: '0'},
        {name: '本周奖票', number: '0'},
        {name: '上周奖票', number: '0'},
    ];

    titleArray = ['德', '智', '体', '美', '劳'];

    constructor(props) {
        super(props);


        this.classTimeType = 1; //时间类型：1:本日;2:昨日;3:本周;4:上周;5:本月;6:上个月,7:自定义;
        this.classStartTime = '';  //如果是自定义，则添加开始时间，结束时间
        this.classEndTime = '';
        this.classLineTimeType = 1; //时间类型：1:本日;2:昨日;3:本周;4:上周;5:本月;6:上个月，7:自定义;
        this.lineStartTime = '';
        this.lineEndTime = '';
        this.classRadarTimeType = 1;  //时间类型  1.今天/昨天 2.本周/上周 3.本月/上月
        this.radarClassId = '';  //班级id，雷达图筛选条件

        this.state = Object.assign({

            classData: [],
            classDataMore: false,  //是否查看更多

            isRefreshing: false,
            isWindowsLogin: false,

            lineData: [],  //线性图数据
            classNameData: [],  //雷达图 班级筛选条件数据
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
        return fetchUrl.getClassTopStatistics;
    };


    onSuccess = (responseData) => {

        if (responseData.data) {
            let data = responseData.data;
            for (let i = 0; i < this.numberData.length; i++) {
                switch (this.numberData[i].name) {
                    case '开通班级':
                        this.numberData[i].number = data.total;
                        break;
                    case '本周使用班级':
                        this.numberData[i].number = data.exist;
                        break;
                    case '本周奖票':
                        this.numberData[i].number = data.week;
                        break;
                    case '上周奖票':
                        this.numberData[i].number = data.lastWeek;
                        break;
                    default:
                        this.numberData[i].number = 0;
                        break;
                }
            }
            this.setState({});
        }

    };

    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }

    //获取班级排行列表
    _getClassRankPost = () => {

        //自定义时间
        let customTime = this.classTimeType === 7 ? `&startTime=${this.classStartTime}&endTime=${this.classEndTime}` : '';
        let url = `${fetchUrl.getClassRank}timeType=${this.classTimeType}${customTime}`;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                if (responseData.data && responseData.data.length > 0) {
                    this.setState({
                        classData: responseData.data,
                    });
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        });
    };

    //获取线性图数据请求
    _getLineDataPost() {
        //自定义时间
        let customTime = this.classLineTimeType === 7 ? `&startTime=${this.lineStartTime}&endTime=${this.lineEndTime}` : '';
        let url = `${fetchUrl.getClassLineChart}timeType=${this.classLineTimeType}${customTime}`;
        HttpUtils.doGetWithToken(url, {
            onSuccess: (responseData) => {
                //添加雷达图筛选条件：班级数据
                this.state.classNameData = []; //清零

                if (responseData.data && responseData.data.length > 0) {

                    for (let i = 0; i < responseData.data.length; i++) {
                        this.state.classNameData.push(responseData.data[i].className);
                    }
                    if (this.state.classNameData.length * 50 > this.state.lineWidth) {
                        this.state.lineWidth = this.state.classNameData.length * 50;
                    }
                    this.setState({
                        lineData: responseData.data,
                    }, () => {
                        if (this.lineChart) {
                            this.lineChart.updateData(this._getLinePickData(this.state.lineData, 'pickNum'), this._getLinePickData(this.state.lineData, 'totalNum'));
                        }
                        if (!this.radarClassId) {  //只有刚进当前页面，获取默认班级（第一个）数据
                            this.radarClassId = responseData.data[0].classId;
                        }
                        this._getRadarDataPost();  //获取雷达图数据
                    });
                }
            },
            onFail: (responseData) => {
                ToastUtils.showToast(responseData.message);
            }
        });
    }

    //获取雷达图数据请求
    _getRadarDataPost() {

        let url = `${fetchUrl.getClassRadarChart}class_id=${this.radarClassId}&timeType=${this.classRadarTimeType}`;
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
        });

    }

    componentDidMount() {
        super.componentDidMount();
        this._getClassRankPost();  //获取班级排行列表
        this._getLineDataPost(); //获取线性图数据请求
    }

    renderData() {

        return (
            <View style={{flex: 1, backgroundColor: colors.textf9}}>
                <KBHeader backgroundColor={colors.yellowColor}
                          {...this.props}
                          showDriver={false}
                          isLeft={true}
                          title="统计"/>
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
                        position: 'absolute',
                    }}/>

                    <KBStatisTopView style={{backgroundColor: colors.trans}} data={this.numberData} nameStr={'name'}
                                     numberStr={'number'}/>

                    <View style={{
                        marginBottom: 10,
                        marginHorizontal: 15,
                        paddingVertical: 20,
                        backgroundColor: colors.white,
                        borderRadius: 6,
                    }}>
                        <TypeChooseView hasCustom={true}
                                        {...this.props}
                                        titleText={'班级活跃排行'}
                                        dataArray={timeArray}
                                        timeSelected={this._randTimeSelected}
                        />
                        <StatisticsListView {...this.props} click={true}
                                            data={this.state.classData.length > 6 && !this.state.classDataMore ? this.state.classData.slice(0, 6) : this.state.classData}/>

                        {this.state.classData.length > 6 && !this.state.classDataMore ?
                            <View style={{alignItems: 'center'}}>
                                <KBButton onPress={() => {
                                    this.setState({classDataMore: true});
                                }}><View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 80,
                                    height: 30,
                                    borderWidth: 1,
                                    borderColor: colors.yellowColor,
                                    borderRadius: 4,
                                }}>
                                    <Text style={{fontSize: 14, color: colors.yellowColor}}>查看更多</Text>
                                </View>
                                </KBButton>
                            </View> : null
                        }

                        <TypeChooseView hasCustom={true}
                                        titleText={'班级对比图'}
                                        dataArray={timeArray}
                                        timeSelected={this._lineTimeSelected}
                                        {...this.props}
                        />

                        <View style={{
                            marginHorizontal: 10,
                            marginVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Image style={{width: 20, height: 12}}
                                   source={require('../../assets/image3.5/line_color1.png')}/>
                            <Text style={{flex: 1, marginLeft: 10, fontSize: 14, color: colors.text21}}>奖票数</Text>
                            <Text style={{marginRight: 10, fontSize: 14, color: colors.text21}}>积分总数</Text>
                            <Image style={{width: 20, height: 12}}
                                   source={require('../../assets/image3.5/line_color2.png')}/>
                        </View>

                        <ScrollView horizontal={true}>
                            <KBLineChart ref={(c) => this.lineChart = c}
                                         bianWidth={this.state.lineWidth}
                                         bottomNames={this.state.classNameData}
                                         lineDataTwo={this._getLinePickData(this.state.lineData, 'pickNum')}
                                         lineDataOne={this._getLinePickData(this.state.lineData, 'totalNum')}/>

                        </ScrollView>

                        {
                            this.state.classData.length > 0 ?
                                <TypeChooseView style={{marginTop: 20}}
                                                btnScreenStyle={{width: 90}}
                                                titleText={'班级雷达图'}
                                                uniqueKey={'name'}
                                                dataArray={this.state.classData}
                                                timeSelected={this._randClassSelected}
                                                {...this.props}
                                /> : null
                        }


                        <KBRadarChart titleArray={this.titleArray}
                                      edgeWidth={15}
                                      firstData={this._getRadarData(this.state.radarData.first)}
                                      secondData={this._getRadarData(this.state.radarData.second)}/>

                        <TypeChooseView {...this.props}
                                        style={{marginBottom: 20}}
                                        titleText={''}
                                        dataArray={compareTimeArray}
                                        btnScreenStyle={{width: 80}}
                                        timeSelected={this._radarTimeSelected}
                        />

                        <KBScoreListView style={{marginBottom: 20}}
                                         name={this.state.firstRadarName}
                                         image={require('../../assets/image3.5/circle_blue.png')}
                                         data={this.state.radarData.first}/>

                        <KBScoreListView style={{marginBottom: 10}}
                                         name={this.state.secondRadarName}
                                         image={require('../../assets/image3.5/circle_yellow.png')}
                                         data={this.state.radarData.second}/>

                    </View>
                </KBScrollView>
            </View>
        );
    }

    onRefresh = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    /**
     * 班级活跃排行时间筛选选择
     * @param value      时间筛选类型
     * @param startTime
     * @param endTime
     * @private
     */
    _randTimeSelected = (value, startTime, endTime) => {
        this.classTimeType = value.value;
        this.classStartTime = startTime;
        this.classEndTime = endTime;
        this._getClassRankPost();
    };

    /**
     * 班级对比图时间筛选选择
     * @param value
     * @param startTime
     * @param endTime
     * @private
     */
    _lineTimeSelected = (value, startTime, endTime) => {
        this.classLineTimeType = value.value;
        this.lineStartTime = startTime;
        this.lineEndTime = endTime;
        this._getLineDataPost();
    };

    //班级雷达图班级筛选选择
    _randClassSelected = (selectedClass) => {
        console.log('seleted ============', selectedClass);
        this.radarClassId = selectedClass.id;
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
            result.push({x: i, y: data[i][keyName]});
        }
        return result;
    };

    _getRadarData = (data) => {
        let result = [];
        this.titleArray = [];
        for (let i = 0; i < data.length; i++) {
            this.titleArray.push(data[i].name);
            result.push({value: data[i].score});
        }
        return result;
    };

}

const styles = StyleSheet.create({
    groupText: {
        marginHorizontal: 10,
        fontSize: 13,
        color: colors.text21,
        transform: [{rotateZ: '-55deg'}],
    },
});


