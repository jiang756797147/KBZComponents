'use strict';

import GroupScreen from './GroupScreen';
import GroupPKScreen from './GroupPKScreen';
import GroupNewScreen from './GroupNewScreen';
import GroupMemberScreen from './GroupMemberScreen';
import GroupDetailScreen from './GroupDetailScreen';

export default {

    Group: { // 小组
        screen: GroupScreen,
        navigationOptions: {
            header: null,
        },
    },

    GroupPK: { // 小组PK
        screen: GroupPKScreen,
        navigationOptions: {
            header: null,
        },
    },
    GroupNew: { // 小组创建
        screen: GroupNewScreen,
        navigationOptions: {
            header: null,
        },
    },
    GroupMember: { // 小组成员
        screen: GroupMemberScreen,
        navigationOptions: {
            header: null,
        },
    },
    GroupDetail: { // 小组详情
        screen: GroupDetailScreen,
        navigationOptions: {
            header: null,
        },
    },
};