import React from 'react'
import {View, Text, StyleSheet, Image} from 'react-native';
import Holder from "../../../components/tableView/Holder";
import KBButton from "../../../components/KBButton";
import Divider from "../../../components/Divider";
import colors from "../../../constants/colors";
import Utils from "../../../utils/Utils";
// import CircleImage from "../CircleImage";

export default class HomeHolder extends Holder{
    build (itemModel) {
        let data = itemModel.getAttrbute('data');
        const {navigate} = itemModel.getAttrbute('navigation');
        let allClassData = itemModel.getAttrbute('allClassData');
        return (
            <View style={{backgroundColor: colors.white}}>
                <KBButton onPress={() => {
                    navigate("ClassMain", {classId: data.id, classData: allClassData,});
                }}>
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        justifyContent: 'space-between',
                    }}>
                        <View style={{alignItems: 'center', flexDirection: 'row'}}>
                            {/*<CircleImage*/}
                            {/*    imageUrl={data.headUrl}*/}
                            {/*    customHeight={50} customWidth={50}/>*/}
                            <View style={{marginLeft: 14}}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={{
                                        fontSize: 15,
                                        color: colors.text333
                                    }}>{data.name}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <Text style={{
                                        fontSize: 14,
                                        color: colors.text999
                                    }}>班级号: {data.inviteCode}</Text>
                                    {Utils.isNull(data.masterName) ?
                                        null
                                        :
                                        <Text style={{
                                            fontSize: 14,
                                            color: colors.text777,
                                            marginTop: 10
                                        }}>班主任: {data.masterName}</Text>}
                                </View>
                            </View>
                        </View>
                        <Image resizeMode={'contain'} style={{width: 13, height: 13}}
                               source={require('../../../assets/icon_right.png')}/>
                    </View>
                </KBButton>
                {data.isShowDivider ? <Divider isMargin={true}/> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({});
