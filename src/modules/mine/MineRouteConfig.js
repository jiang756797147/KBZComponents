'use strict';

import WebViewScreen from './WebViewScreen';
import MineDataScreen from './settings/MineDataScreen';
import SettingsScreen from './settings/SettingsScreen';
import ResetPwdScreen from './userSafe/ResetPwdScreen';
import UserSafeScreen from './userSafe/UserSafeScreen';
import FeedBackScreen from './feedBack/FeedBackScreen';
import MineTicketScreen from './mineTicket/MineTicketScreen';
import ClassStarScreen from './mineTicket/ClassStarScreen';
import MineTicketDetailsScreen from './mineTicket/MineTicketDetailsScreen';

export default {

    WebView: { // 网页
        screen: WebViewScreen,
        navigationOptions: {
            header: null,
        },
    },

    MineData: { // 个人信息
        screen: MineDataScreen,
        navigationOptions: {
            header: null,
        },
    },
    Settings: { // 设置
        screen: SettingsScreen,
        navigationOptions: {
            header: null,
        },
    },
    UserSafe: { // 账号安全
        screen: UserSafeScreen,
        navigationOptions: {
            header: null,
        },
    },
    ResetPwd: { // 重置密码
        screen: ResetPwdScreen,
        navigationOptions: {
            header: null,
        },
    },
    FeedBack: { // 意见反馈
        screen: FeedBackScreen,
        navigationOptions: {
            header: null,
        },
    },

    MineTicket: { // 我的审核/申请奖票
        screen: MineTicketScreen,
        navigationOptions: {
            header: null,
        },
    },
    ClassStar: { // 班级之星
        screen: ClassStarScreen,
        navigationOptions: {
            header: null,
        },
    },
    MineTicketDetails: { // 我的审核/申请奖票 详情
        screen: MineTicketDetailsScreen,
        navigationOptions: {
            header: null,
        },
    },
}
