import React from 'react'
import {View, Image, Text,} from 'react-native'

import Holder from "../../../../../components/tableView/Holder";
import KBButton from "../../../../../components/KBButton";
import CircleImage from "../../../../../components/CircleImage";
import colors from "../../../../../constants/colors";
import image from "../../../../../constants/image";
import Utils from "../../../../../utils/Utils";

export default class GroupMemberHolder extends Holder{

    build(itemModel) {

        this.data = itemModel.getAttrbute("data");
        this.itemClick = itemModel.getAttrbute("itemClick");

        return (
            <View>
                {this.data.map((item, index) => this.renderItem(item, index))}
            </View>
        )
    };

    renderItem (item, index) {

        return (
            <KBButton key={index}
                onPress={() => this.itemClick(item)}>
                <View style={{
                        paddingHorizontal: 14,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 70,
                        justifyContent: 'space-between'
                    }}>
                    <View style={{
                        flex: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 70,
                    }}>
                        <Image style={{width: 15, height: 15,}}
                            source={item.isSelected ? image.classBtnChoiceS : image.classBtnChoiceD}
                        />

                        <CircleImage
                            imageUrl={Utils.getStudentAvatar(item.header, item.sex)}
                            customWidth={50}
                            customHeight={50}
                            customStyle={{marginLeft: 15, marginRight: 10,}}
                        />
                        <Text style={{
                            fontSize: 15,
                            color: colors.text555,
                        }}>{item.name}</Text>
                    </View>

                </View>
            </KBButton>
        )
    };

}
