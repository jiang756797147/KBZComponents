import React from 'react'
import {View, Text} from 'react-native';
import Holder from "../../../components/tableView/Holder";
import KBButton from "../../../components/KBButton";
import colors from "../../../constants/colors";
import Utils from "../../../utils/Utils";
import CircleImage from '../../../components/CircleImage';

export default class ContactHomeHolder extends Holder{
    build(itemModel) {
        this.data = itemModel.getAttrbute('data');
        this.customClick = itemModel.getAttrbute('customClick');
        this.isShowPhone = itemModel.getAttrbute('isShowPhone');
        this.listKey = itemModel.getAttrbute('listKey');
        return (
            <KBButton style={{flex: 1}} onPress={() => {
                if (!Utils.isNull(this.customClick)) {
                    this.customClick(this.data.mobile);
                }
            }}>
                {this.data.isParent ? this.renderParentItem() : this.renderTeacherItem()}
            </KBButton>
        );
    }

    renderParentItem = () => {
        return (
            <View style={{
                backgroundColor: colors.white,
                flexDirection: 'row',
                alignItems: 'center',
                height: 65,
                borderBottomWidth: 1,
                borderColor: colors.divider,
                paddingHorizontal: 20,
                justifyContent: "space-between",
            }}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <CircleImage customWidth={45} customHeight={45}
                                 imageUrl={Utils.getTeacherAvatar(this.data.headUrl, this.data.sex)}
                    />

                    <View style={{marginLeft: 10, flex: 1}}>
                        <Text style={{
                            fontSize: 14,
                            color: colors.text333,
                        }}>{this.data.name}的{Utils.getFamilyName(this.data.type)}</Text>
                        <Text style={{
                            fontSize: 12,
                            color: colors.text999,
                            marginTop: 10
                        }}>{this.data.parentName}</Text>

                    </View>

                </View>
                <Text
                    style={{fontSize: 13, color: colors.text888}}>{this.data.className}</Text>
            </View>
        )
    }
    renderTeacherItem = () => {
        return (
            <View style={{
                backgroundColor: colors.white,
                flexDirection: 'row',
                alignItems: 'center',
                height: 65,
                borderBottomWidth: 1,
                borderColor: colors.divider,
                paddingHorizontal: 20,
            }}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <CircleImage customWidth={45} customHeight={45}
                                 imageUrl={Utils.getTeacherAvatar(this.data.headUrl, this.data.sex)}
                    />
                    <View style={{marginLeft: 10, flex: 1}}>
                        <Text style={{
                            fontSize: 14,
                            color: colors.text333,
                        }}>{this.data[this.listKey]}</Text>
                        <Text style={{
                            fontSize: 12,
                            color: colors.text999,
                            marginTop: 10
                        }}>{"教师"}</Text>
                    </View>
                </View>
            </View>
        )
    }
}
