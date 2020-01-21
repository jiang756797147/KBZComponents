'use strict';

import AddStudentScreen from './AddStudentScreen';
import StudentInfoScreen from './StudentInfoScreen';
import StudentReportScreen from './StudentReportScreen';

export default {

    AddStudent: { // 添加学生
        screen: AddStudentScreen,
        navigationOptions: {
            header: null,
        },
    },
    StudentInfo: { // 学生信息
        screen: StudentInfoScreen,
        navigationOptions: {
            header: null,
        },
    },
    StudentReport: { // 学生表现
        screen: StudentReportScreen,
        navigationOptions: {
            header: null,
        },
    },
}