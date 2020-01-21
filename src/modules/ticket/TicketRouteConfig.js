'use strict';

import TicketPrintScreen from './print/TicketPrintScreen';
import TicketPrintRecordScreen from './print/TicketPrintRecordScreen';

import TaskScreen from './task/TaskScreen';
import TaskRecordScreen from './task/TaskRecordScreen';
import ReceptorListScreen from './task/ReceptorListScreen';
import TaskStatisScreen from './task/TaskStatisScreen';
import TaskSearchScreen from "./task/TaskSearchScreen";

export default {


    TicketPrint: { //奖票打印
        screen: TicketPrintScreen,
        navigationOptions: {
            header: null,
        },
    },
    TicketPrintRecord: { //奖票打印记录
        screen: TicketPrintRecordScreen,
        navigationOptions: {
            header: null,
        },
    },
    Task: { //任务
        screen: TaskScreen,
        navigationOptions: {
            header: null,
        },
    },
    TaskRecord: { //任务记录
        screen: TaskRecordScreen,
        navigationOptions: {
            header: null,
        },
    },
    TaskSearch:{  //任务搜索
      screen:TaskSearchScreen,
      navigationOptions:{
          header:null,
      },
    },
    TaskStatis: { //任务统计
        screen: TaskStatisScreen,
        navigationOptions: {
            header: null,
        },
    },
    ReceptorList: { //任务指派人列表
        screen: ReceptorListScreen,
        navigationOptions: {
            header: null,
        },
    },
}