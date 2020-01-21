import React from 'react';
import {View, Text} from 'react-native';
import Holder from '../../../components/tableView/Holder';
import KBButton from '../../../components/KBButton';
import CircleImage from '../../../components/CircleImage';
import Divider from '../../../components/Divider';
import colors from '../../../constants/colors';


export default class MessageAuditTaskHolder extends Holder {
    build(itemModel) {

        let data = itemModel.getAttrbute('data');
        let audit = itemModel.getAttrbute('audit');

        return (
            <View style={{paddingTop: 15, backgroundColor: colors.white, paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row'}}>
                    <CircleImage customWidth={50} customHeight={50} imageUrl={data.headUrl}/>

                    <View style={{flex: 1, marginLeft: 10}}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Text style={{fontSize: 15, color: '#565771'}}>{`${data.nickname}老师`}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
                            <Text style={{fontSize: 13, color: colors.text888}}>
                                {data.date}
                            </Text>
                            <Text style={{marginLeft: 3, fontSize: 13, color: colors.text888}}>
                                {data.week}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{marginTop: 20}}>
                    <Text style={{fontSize: 15, color: colors.text444, lineHeight: 20}}>
                        {data.title}
                    </Text>
                </View>
                <View style={{marginTop: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {this.renderButton('终止', colors.text999, audit, data)}

                        {this.renderButton('复制', colors.themeColor, audit, data)}
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {this.renderButton('不通过', colors.text888, audit, data)}
                        {this.renderButton('通过', colors.yellowColor, audit, data)}
                    </View>
                </View>
                <Divider customHeight={10}/>
            </View>
        );
    };

    renderButton = (title, titleColor, action, taskData) => {
        let btnStyle = title === '不通过' || title === '通过' ?
            {
                marginLeft: 10,
                width: 70,
                borderRadius: 14,
                borderColor: title === '不通过' ? colors.text888 : colors.yellowColor,
                borderWidth: 1,
                alignItems: 'center',
                overflow: 'hidden',
            } : {
                width: 50,
            };

        return (
            <KBButton onPress={() => {
                if (title === '通过') {
                    action(1, taskData);
                } else if (title === '不通过') {
                    action(2, taskData);
                } else if (title === '终止') {
                    action(3, taskData);
                } else {//复制
                    action(4, taskData);
                }
            }}>
                <View style={[{height: 28, justifyContent: 'center'}, btnStyle]}>
                    <Text style={{fontSize: 14, color: titleColor}}>{title}</Text>
                </View>
            </KBButton>
        );
    };
}
