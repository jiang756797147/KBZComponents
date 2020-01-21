import React from 'react'
import {View, Text, Image, Button, StyleSheet} from 'react-native';
import Holder from "../../../components/tableView/Holder";
import KBScrollView from "../../../components/KBScrollView";
import Color from "../../../constants/colors";
import KBButton from "../../../components/KBButton";
import TimeUtils from "../../../utils/TimeUtils";
import Utils from "../../../utils/Utils";


export default class FixedHistoryHolder extends Holder{
    build (itemModel) {
        let item = itemModel.getAttrbute('data');
        let navigate = itemModel.getAttrbute('navigation').navigate;
        let refresh = itemModel.getAttrbute('refresh');

        return (

            <View style={{flex: 1}}>
                <KBScrollView style={{backgroundColor: Color.white}}>
                    <View style={{flex: 1, margin: 15}}>
                        <View style={{backgroundColor: Color.white, marginBottom: 15}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 16, color: Color.text21}}>{item.cateName}</Text>
                                {Utils.isNull(item.fixedName) ? <View style={{flex: 1}}></View> :
                                    <Text style={{flex: 1, fontSize: 15, color: Color.text21}}>({item.fixedName})</Text>
                                }
                                <Text style={{fontSize: 16, color: Color.bluesky}}>{'+'+item.score}</Text>
                            </View>
                            <View style={{flexDirection: 'row',marginTop: 10}}>
                                <Text style={{
                                    fontSize: 13,
                                    color: Color.text666
                                }}>{TimeUtils.getTimeWithDay(item.create_at)}</Text>
                                <Text style={{
                                    fontSize: 13,
                                    color: Color.bluesky
                                }}>{' (有效期：'+TimeUtils.getTimeWithDay(item.validity)+')'}</Text>
                            </View>
                            <Text style={{
                                marginTop: 15,
                                fontSize: 15,
                                color: Color.text21
                            }}>包含学生：{item.studentName}</Text>
                            <View style={{flexDirection: 'row', marginTop: 20}}>
                                <View style={{flex: 1}}></View>
                                <KBButton onPress={() => {
                                    navigate("AddFixedScore", {
                                        item:item,
                                        classId:item.class_id,
                                        isChange: true,
                                        refresh: refresh,
                                    });
                                }}>
                                    <Image style={{width: 75, height: 27}}
                                           source={require('../../../assets/fixed/flexd_change_bn.png')}/>
                                </KBButton>
                            </View>
                        </View>
                    </View>
                </KBScrollView>
            </View>

        );
    };


}
const styles = StyleSheet.create({
    recommend: {
        fontSize: 13,
        color: Color.text555,
    },
    recommendNo: {
        fontSize: 13,
        color: Color.text999,
    }
});
