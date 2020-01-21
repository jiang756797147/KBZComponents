'use strict';

import MessageNoticeScreen from './MessageNoticeScreen';
import MessageHomeWorkScreen from './MessageHomeWorkScreen';
import MessageAuditTicketScreen from './MessageAuditTicketScreen';
import MessageAuditTaskScreen from './MessageAuditTaskScreen';
import MessageApplyScreen from './MessageApplyScreen';
import MessageRangeScreen from './MessageRangeScreen';
import ReleaseNoticeScreen from './ReleaseNoticeScreen';
import ReleaseHomeWorkScreen from './ReleaseHomeWorkScreen';

export default {

    MessageNotice: { // 公告
        screen: MessageNoticeScreen,
        navigationOptions: {
            header: null,
        },
    },

    MessageHomeWork: { // 作业
        screen: MessageHomeWorkScreen,
        navigationOptions: {
            header: null,
        },
    },

    MessageAuditTicket: { // 奖票审核
        screen: MessageAuditTicketScreen,
        navigationOptions: {
            header: null,
        },
    },

    MessageAuditTask: { // 任务审核
        screen: MessageAuditTaskScreen,
        navigationOptions: {
            header: null,
        },
    },

    MessageApply: { // 申请审核
        screen: MessageApplyScreen,
        navigationOptions: {
            header: null,
        },
    },

    ReleaseNotice: { // 发布公告
        screen: ReleaseNoticeScreen,
        navigationOptions: {
            header: null,
        },
    },

    ReleaseHomeWork: { // 发布作业
        screen: ReleaseHomeWorkScreen,
        navigationOptions: {
            header: null,
        },
    },

    MessageRange: { // 发布公告、作业适用范围
        screen: MessageRangeScreen,
        navigationOptions: {
            header: null,
        },
    },
};