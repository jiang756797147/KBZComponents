'use strict';

import JoinClassScreen from './joinClass/JoinClassScreen';
import JoinClassAfterScreen from './joinClass/JoinClassAfterScreen';
import ClassScreen from './class/ClassScreen';
import ClassReportScreen from './class/ClassReportScreen';
import ClassRankScreen from './class/ClassRankScreen';

import ClassEditScreen from './class/classSetting/ClassEditScreen';
import DisPalyRuleScreen from './class/classSetting/DisPalyRuleScreen';

import ClassOptionScreen from './class/option/ClassOptionScreen';
import ClassOptionEditScreen from './class/option/ClassOptionEditScreen';
import ClassOptionNewScreen from './class/option/ClassOptionNewScreen';

import GroupRouteConfig from './class/group/GroupRouteConfig'
import EditGroupInfoScreen from '../index/EditGroupInfoScreen';
import StudentRouteConfig from './class/student/StudentRouteConfig'
import UsingHelpScreen from "./usingHelp/UsingHelpScreen";
import UsingHelpSearchScreen from "./usingHelp/UsingHelpSearchScreen";

export default {

    JoinClass: { // 加入班级
        screen: JoinClassScreen,
        navigationOptions: {
            header: null,
        },
    },

    JoinClassAfter: { // 加入班级确认
        screen: JoinClassAfterScreen,
        navigationOptions: {
            header: null,
        },
    },

    Class: { // 班级
        screen: ClassScreen,
        navigationOptions: {
            header: null,
        },
    },
    ClassReport: { // 班级报表
        screen: ClassReportScreen,
        navigationOptions: {
            header: null,
        },
    },

    ClassRank: { // 班级排名
        screen: ClassRankScreen,
        navigationOptions: {
            header: null,
        },
    },
    ClassEdit: { // 班级编辑
        screen: ClassEditScreen,
        navigationOptions: {
            header: null,
        },
    },
    DisPalyRule: { // 显示规则
        screen: DisPalyRuleScreen,
        navigationOptions: {
            header: null,
        },
    },

    ClassOption: { // 班级事项
        screen: ClassOptionScreen,
        navigationOptions: {
            header: null,
        },
    },
    ClassOptionNew: { // 新建班级事项
        screen: ClassOptionNewScreen,
        navigationOptions: {
            header: null,
        },
    },
    ClassOptionEdit: { // 编辑班级事项
        screen: ClassOptionEditScreen,
        navigationOptions: {
            header: null,
        },
    },
    EditGroup: { //编辑小组
        screen: EditGroupInfoScreen,
        navigationOptions: {
            header: null,
        },
    },

    UsingHelp: { //使用帮助
        screen: UsingHelpScreen,
        navigationOptions: {
            header: null,
        },
    },


    UsingHelpSearch: { //使用帮助搜索
        screen: UsingHelpSearchScreen,
        navigationOptions: {
            header: null,
        },
    },
    ...GroupRouteConfig,
    ...StudentRouteConfig,
};
