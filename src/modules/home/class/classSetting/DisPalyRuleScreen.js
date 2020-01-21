import React from 'react';
import {Image, StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';

import BaseScreen from '../../../../base/BaseScreen';

import colors from '../../../../constants/colors';
import {STUDENT_SORT, GROUP_SORT} from '../../../../constants/notify';
import KBScrollView from '../../../../components/KBScrollView';
import KBHeader from '../../../../components/KBHeader';
import Divider from '../../../../components/Divider';
import KBButton from '../../../../components/KBButton';
import StorageUtils from '../../../../utils/StorageUtils';
import Utils from '../../../../utils/Utils';

export default class DisPalyRuleScreen extends BaseScreen {

    studentClassifyList = [
        {
            title: '表扬/改进分开显示',
            isSelected: false,
            type: '0'
        },
        {
            title: '显示总分',
            isSelected: false,
            type: '1'
        },
    ];

    constructor(props) {
        super(props);

        this.state = {};
        this.eventEmitter = DeviceEventEmitter;
    }

    componentDidMount() {
        super.componentDidMount();
        StorageUtils._load('studentDisPlay', (data) => {
            if (Utils.isNull(data)) {
                this.studentClassifyList[0].isSelected = true;
                this.setState({});
            } else {
                for (let obj of this.studentClassifyList) {
                    if (obj.type == data) {
                        obj.isSelected = true;
                        return;
                    }
                }
                this.setState({});
            }
        }, (err) => {
            this.studentClassifyList[0].isSelected = true;
            this.setState({});
        });
    }

    renderData() {
        return (
            <KBScrollView style={{flex: 1, backgroundColor: colors.empty}}>
                <View style={{paddingHorizontal: 20, backgroundColor: colors.white}}>
                    <View>
                        {this.studentClassifyList.map((item, index) => this.renderItem(item, index, 'student'))}
                    </View>
                </View>
            </KBScrollView>
        );
    }

    renderItem(item, index, type) {
        return (
            <View key={index}>
                <KBButton onPress={() => this.itemClick(item, type)}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 15,
                        alignItems: 'center',
                    }}
                    >
                        <Text style={{fontSize: 15, color: colors.text666}}>{item.title}</Text>
                        <Image style={{width: 17, height: 17}} resizeMode={'contain'}
                               source={item.isSelected ? require('../../../../assets/class/class_btn_choice_s.png') : require('../../../../assets/class/class_btn_choice_d.png')}/>
                    </View>
                </KBButton>
                {
                    index == this.length - 1 ? null : <Divider/>
                }
            </View>
        );
    };


    render() {
        let renderView = super.render();
        return (
            <View style={styles.container}>
                <KBHeader
                    backgroundColor={colors.yellowColor}
                    isLeft={true}
                    touchBack={() => {
                        const {goBack} = this.props.navigation;
                        goBack();
                    }}
                    title={'学生显示规则'}
                />
                {renderView}
            </View>
        );
    }

    itemClick(item, type) {
        if (item.isSelected) {
            return;
        } else {
            // if (type == 'student') {
            for (let obj of this.studentClassifyList) {
                obj.isSelected = false;
            }
            item.isSelected = true;
            this.setState({}, () => {
                this.eventEmitter.emit(STUDENT_SORT, {
                    disPlayType: item.type,
                });
                StorageUtils._sava('studentDisPlay', item.type);
            });
        }
    };

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});
