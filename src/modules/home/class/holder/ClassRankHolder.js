import React from 'react'
import {View, StyleSheet, Image, Text,} from 'react-native'
import Holder from "../../../../components/tableView/Holder";
import CircleImage from "../../../../components/CircleImage";
import Utils from "../../../../utils/Utils";

import image from "../../../../constants/image";
import colors from "../../../../constants/colors";

export default class ClassRankHolder extends Holder {

    build(itemModel) {
        this.data = itemModel.getAttrbute("data");
        this.holderStatus = itemModel.getAttrbute("holderStatus");
        this.score = this.holderStatus.scoreType === 0 ? (this.data.rewardScore - this.data.punishScore) :
            this.holderStatus.scoreType === 1 ? this.data.rewardScore :
                this.holderStatus.scoreType === 2 ? this.data.punishScore : this.data.avgScore;
        return (
            <View style={{
                alignItems: "center",
                flexDirection: 'row',
                paddingVertical: 10,
                paddingLeft: 14,
                paddingRight: 20
            }}>
                {!Utils.isNull(this.getRankImage(itemModel.key)) && this.holderStatus.isShowImage ?
                    <Image style={{width: 25, height: 25}} resizeMode={'contain'}
                           source={this.getRankImage(itemModel.key)}/>
                    :
                    <View style={{width: 25, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, color: colors.text666,}}>{parseInt(itemModel.key) + 1}</Text>
                    </View>
                }
                <CircleImage imageUrl={this.data.headerUrl} customWidth={40} customHeight={40}
                             customStyle={{marginLeft: 14}}/>
                <View style={{flex: 1, marginLeft: 7,}}>
                    <Text style={{
                        fontSize: 14,
                        color: colors.text333
                    }}>{this.data.name}</Text>
                    {this.holderStatus.isTeam ?
                        <Text style={{
                            fontSize: 12,
                            color: colors.text999,
                            marginTop: 3
                        }}>{this.data.studentNum}名组员</Text> : null}
                </View>
                <View style={{
                    flex: 0.3,
                    justifyContent: 'center',
                    alignItems: 'flex-end'
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: Utils.isNull(this.score) || parseFloat(this.score) <= 0 ? colors.text333 : '#FF693C'
                    }}>{Number.isInteger(parseFloat(this.score)) ? parseFloat(this.score) : parseFloat(this.score).toFixed(1).toString()}</Text>
                </View>
            </View>
        )
    };

    getRankImage = (index) => {
        switch (index) {
            case '0':
                return image.rankFirst;
            case '1':
                return image.rankSecond;
            case '2':
                return image.rankThird;
            default:
                return null;
        }
    }
}