'use strict';

import ParentListScreen from './ParentListScreen';
import TeacherListScreen from './TeacherListScreen';
import StudentListScreen from './StudentListScreen';
import ParentalPermissionSettingsScreen from "../home/class/classSetting/ParentalPermissionSettingsScreen";

export default {

    ParentList: { // 家长列表
        screen: ParentListScreen,
        navigationOptions: {
            header: null,
        },
    },
    TeacherList: { // 教师列表
        screen: TeacherListScreen,
        navigationOptions: {
            header: null,
        },
    },
    ParentalPermission: { // 家长权限设置
        screen: ParentalPermissionSettingsScreen,
        navigationOptions: {
            header: null,
        },
    },
    StudentList: { // 学生列表
        screen: StudentListScreen,
        navigationOptions: {
            header: null,
        },
    },
};
