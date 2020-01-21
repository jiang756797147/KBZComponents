import React from "react"
import {Container, ActionSheet} from 'native-base'
import {Image, StyleSheet, Text, View,} from "react-native";
import colors from "../../../constants/colors";
import theme from "../../../constants/theme";
import image from "../../../constants/image";
import fetchUrl from "../../../constants/fetchUrl";

import BaseScreen from "../../../base/BaseScreen";
import KBHeader from "../../../components/KBHeader";
import ExpandableList from "../../../components/tableView/ExpandableList";
import KBSearch from "../../../components/search/KBSearch";
import Divider from "../../../components/Divider";

import Utils from "../../../utils/Utils";
import TimeUtils from "../../../utils/TimeUtils";

export default class TaskStatisScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = Object.assign({

            taskData: [],
            dataSource: [],
        }, this.state);

        const {params} = this.props.navigation.state;
        this.classId = params.classId;
    }

    getApiUrl() {

        return `${fetchUrl.statisticsTask}classId=${this.classId}`;
    }

    onSuccess(responseData) {

        if (responseData.data && responseData.data.length > 0) {
            this.setState({
                isNullData: false,
                dataSource: responseData.data,
                taskData: responseData.data,
            })
        } else {
            this.setState({
                isNullData: true
            })
        }
    }

    _renderRow = (rowItem, rowId, sectionId) => {
        let endDate = TimeUtils.getTimeWithDay(rowItem.stopAt);
        return (
            <View style={{
                paddingHorizontal: 15,
                backgroundColor: colors.white,
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                }}>
                    <Text style={{
                        flex: 8,
                        fontSize: 15,
                        color: colors.text555,
                        lineHeight: 20
                    }}>{rowItem.taskTitle}</Text>
                    <View style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Text
                            style={{marginRight: 10, fontSize: 15, color: colors.text555}}>{`+ ${rowItem.score}`}</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 5}}>
                    <Text style={{fontSize: 13, color: colors.text999}}>{`有效期至：${endDate}`}</Text>
                    <Image style={{marginLeft: 5, width: 25, height: 20}}
                           source={rowItem.taskCycle == 0 ? require('../../../assets/image3.3/ticket/task_period_day.png') : require('../../../assets/image3.3/ticket/task_period_week.png')}/>
                </View>
            </View>
        );
    };
    _renderSectionHeader = (section, sectionId, sectionOpen) => {
        return (
            <View style={styles.sectionView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{width: 50, height: 50, borderRadius: 25}}
                           source={Utils.getStudentAvatar(section.studentHeader, section.studentSex)}
                    />
                    <View style={{marginLeft: 5,}}>
                        <Text style={{fontSize: 15, color: colors.text555}}>{section.studentName}</Text>
                        <Text style={{
                            marginTop: 10,
                            fontSize: 14,
                            color: colors.text888
                        }}>{`共${section.taskList.length}项任务加分`}</Text>
                    </View>
                </View>

                <Image style={[styles.sectionIcon, {transform: [{rotateZ: sectionOpen ? '90deg' : '0deg'}]}]}
                       source={image.itemArrowImage}/>
            </View>
        )
    };
    _renderSectionFooter = () => {
        return <Divider customHeight={10}/>
    }

    renderData() {
        return (
            <View style={{
                backgroundColor: colors.empty,
                flex: 1,
            }}>
                <View style={{padding: 15}}>
                    <KBSearch
                        backgroundColor={colors.white}
                        placeholder={'请输入学生姓名搜索'}
                        searchIconCollapsedMargin={70}
                        placeholderCollapsedMargin={50}
                        onSearch={(text) => this.onSearch(text)}
                    />
                </View>

                <ExpandableList
                    style={{backgroundColor: colors.empty}}
                    dataSource={this.state.taskData}
                    headerKey="studentName"
                    memberKey="taskList"
                    renderRow={this._renderRow}
                    renderSectionHeaderX={this._renderSectionHeader}
                    renderSectionFooterX={this._renderSectionFooter}
                    openOptions={[0]}
                />
            </View>
        )
    }

    render() {
        let renderView = super.render();
        return (
            <Container style={styles.container}>
                <KBHeader
                    isLeft={true} {...this.props}
                    title={'任务分统计'}
                />
                {renderView}
            </Container>
        );
    }


    // 搜索框点击事件
    onSearch = (text) => {
        console.log('searchText =========', text);

        if (Utils.isNull(text)) {
            this.setState({
                taskData: this.state.dataSource,
            })
        } else {
            let taskData = [];
            for (let task of this.state.dataSource) {
                if (task.studentName.search(text) >= 0) {
                    taskData.push(task);
                }
            }
            this.setState({
                taskData: taskData,
            })
        }
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sectionView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        padding: 15,
        width: theme.screenWidth,
        backgroundColor: colors.white,
    },
    sectionIcon: {
        width: 8,
        height: 13,
        marginRight: 10,
    },
});
