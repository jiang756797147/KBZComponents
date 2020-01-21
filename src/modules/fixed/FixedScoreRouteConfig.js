'use strict';
import AddFixedScoreScreen from "./AddFixedScoreScreen";
import FixedHistoryScreen from "./FixedHistoryScreen";
import FixedStatisticsScreen from "./FixedStatisticsScreen";
import FixedSearchScreen from "./FixedSearchScreen";

export default {


    //添加设置固定分
    AddFixedScore: {  //固定分设置
        screen: AddFixedScoreScreen,
        navigationOptions: {
            header: null,
        }
    },

    FixedHistory: {  //固定分历史记录
        screen: FixedHistoryScreen,
        navigationOptions: {
            header: null,
        }
    },

    FixedStatistics: {  //固定分统计
        screen: FixedStatisticsScreen,
        navigationOptions: {
            header: null,
        }
    },

    FixedSearch: {  //固定分搜索
        screen: FixedSearchScreen,
        navigationOptions: {
            header: null,
        }
    }


}