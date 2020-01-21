import React from 'react'
import {View,Text,Image} from 'react-native'
import StatisticsClassHolder from "./StatisticsClassHolder";
import Holder from "../../../components/tableView/Holder";

function StudentRankingHolder(){

    this.build=function (itemModel) {

        let item=itemModel.getAttrbute('item');
        let index=itemModel.getAttrbute('index');

        return(
            <View style={{marginVertical: 5}}>
                <StatisticsClassHolder isStudent={true} itemData={item} itemIndex={index+1} />
            </View>
        )
    }

}

StudentRankingHolder.prototype=new Holder();
export default StudentRankingHolder;
