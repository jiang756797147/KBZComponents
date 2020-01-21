import React from 'react'
import {View, Text, Image, StyleSheet} from 'react-native';
import Holder from "../../../../components/tableView/Holder";
import theme from "../../../../constants/theme";
import colors from "../../../../constants/colors";
import Utils from "../../../../utils/Utils";


export default class TicketPrintRecordHolder extends Holder{
    build (itemModel) {

        let data = itemModel.getAttrbute("data");

        let totalCount = this.getTotalCount(data.optionSet);

        return (
            <View style={{
                marginBottom: 15,
                width: theme.screenWidth - 30,
                backgroundColor: colors.white,
                marginHorizontal: 15,
                paddingHorizontal: 15,
                borderRadius: 5,
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                }}>
                    <Image style={{width: 17, height: 17}}
                           source={require('../../../../assets/image3.3/ticket/print_item_icon.png')}
                    />
                    <Text style={{marginLeft: 10, fontSize: 13, color: colors.text555}}>{data.date}</Text>
                </View>
                <View style={{flex: 1, height: 1, backgroundColor: colors.divider}}/>
                <View style={{paddingVertical: 5}}>
                    {data.optionSet.map(this.renderOption)}
                </View>
                <View style={{flex: 1, height: 1, marginTop: 5, backgroundColor: colors.divider}}/>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 10}}>
                    <Text style={{fontSize: 15, color: colors.text555}}>{`合计：${totalCount}张`}</Text>
                </View>
            </View>
        )
    };
    renderOption = (item, index) => {
        let statusText = '';
        let statusTextColor = '';
        switch (item.status) {
            case 0:
                statusText = '进行中';
                statusTextColor = '#5AA6EA';
                break;
            case 1:
                statusText = '已完成';
                statusTextColor = colors.reduceColor;
                break;
        }
        return (
            <View key={index}
                  style={{flexDirection: 'row', paddingVertical: 5}}
            >
                <Text style={{flex: 1, fontSize: 15, color: colors.text555}} numberOfLines={1}>{item.content}</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <Text style={{
                        marginRight: 50,
                        fontSize: 15,
                        color: colors.text555,
                    }}>{`${item.count}张`}</Text>
                    <Text style={{
                        fontSize: 15,
                        color: statusTextColor,
                    }}>{statusText}</Text>
                </View>

            </View>
        )
    };

    getTotalCount = (data) => {
        let totalCount = 0;
        for (let option of data) {
            totalCount += parseInt(option.count);
        }

        return totalCount;
    }
}
