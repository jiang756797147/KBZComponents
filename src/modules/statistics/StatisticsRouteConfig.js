'use strict';

import ClassStatisticsScreen from "./ClassStatisticsScreen";
import StudentStatisticsScreen from "./StudentStatisticsScreen";
import StudentRankingScreen from "./StudentRankingScreen";

export default {

    ClassStatistics:{
        screen:ClassStatisticsScreen,
        navigationOptions:{
            header:null
        },
    },
    StudentStatistics:{
        screen:StudentStatisticsScreen,
        navigationOptions: {
            header:null
        },
    },

    StudentRanking:{
        screen:StudentRankingScreen,
        navigationOptions:{
            header:null
        }
    },

}