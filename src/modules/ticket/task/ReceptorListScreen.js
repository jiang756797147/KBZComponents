import React from 'react';
import {Container, ActionSheet} from 'native-base';
import {Image, StyleSheet, Text, View} from 'react-native';
import colors from '../../../constants/colors';
import theme from '../../../constants/theme';
import image from '../../../constants/image';
import fetchUrl from '../../../constants/fetchUrl';

import BaseScreen from '../../../base/BaseScreen';
import KBHeader from '../../../components/KBHeader';
import ExpandableList from '../../../components/tableView/ExpandableList';
import KBSearch from '../../../components/search/KBSearch';
import KBButton from '../../../components/KBButton';
import Divider from '../../../components/Divider';


export default class ReceptorListScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = Object.assign({

            allData: [],
            isSelectAll: false,

            sortData: [],
        }, this.state);

        const {params} = this.props.navigation.state;
        const {goBack} = this.props.navigation;
        this.classId = params.classId;
        this.getReceptors = params.getReceptors;
        this.receptors = params.receptors;

        this.goBack = goBack;
    }

    getApiUrl() {
        return fetchUrl.getGroupStudent + '&classId=' + this.classId;
    }

    onSuccess(responseData) {

        if (responseData.data && responseData.data.length > 0) {
            let data = [];

            for (let obj of responseData.data) {
                obj.isSelected = !!this.receptors.find((student) => student.id === obj.id);
                data.push(obj);
            }
            this.state.allData = data;
            this.setDataSource(data);

        }
    }

    setDataSource(data) {

        let map = {};
        let dataSource = [];

        for (let student of data) {

            if (!map[student.groupId]) {

                dataSource.push({
                    groupId: student.groupId,
                    groupName: student.groupName || '未分组',
                    students: [student],
                });

                map[student.groupId] = student;
            } else {
                for (let group of dataSource) {
                    if (group.groupId === student.groupId) {
                        group.students.push(student);
                        break;
                    }
                }
            }
        }

        this.setState({
            sortData: dataSource,
        });
    }

    _renderRow = (rowItem, rowId, sectionId) => {
        return (
            <KBButton onPress={() => this.itemClick(rowItem)}>
                <View style={{
                    paddingLeft: 30,
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 40,
                    justifyContent: 'space-between',
                    backgroundColor: colors.white,
                }}>
                    <View style={{
                        flex: 5,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 40,
                    }}>
                        <Image style={{width: 16, height: 16}}
                               source={rowItem.isSelected ? image.ticketSelectIcon : image.ticketUnSelectIcon}
                        />

                        {/*<CircleImage*/}
                        {/*imageUrl={Utils.getStudentAvatar(item.header, item.sex)}*/}
                        {/*customWidth={50}*/}
                        {/*customHeight={50}*/}
                        {/*customStyle={{marginLeft: 15, marginRight: 10,}}*/}
                        {/*/>*/}
                        <Text style={{
                            marginLeft: 10,
                            fontSize: 15,
                            color: colors.text555,
                        }}>{rowItem.name}</Text>
                    </View>

                </View>
            </KBButton>
        );
    };
    _renderSectionHeader = (section, sectionId, sectionOpen) => {
        section.isSelected = this.isSelectedAll(section.students);
        return (
            <View>
                <View style={styles.sectionView}>
                    <KBButton onPress={() => {
                        section.isSelected = !section.isSelected;
                        let studentArray = section.students;
                        for (let student of studentArray) {
                            student.isSelected = section.isSelected;
                        }
                        this.setState({});
                    }}>
                        <View style={styles.sectionTitleView}>
                            <Image style={{
                                width: 16,
                                height: 16,
                                marginRight: 10,
                            }}
                                   source={section.isSelected ? image.ticketSelectIcon : image.ticketUnSelectIcon}
                            />
                            <Text style={styles.sectionTitle}>
                                {section.groupName}
                            </Text>
                        </View>
                    </KBButton>

                    <Image style={[styles.sectionIcon, {transform: [{rotateZ: sectionOpen ? '90deg' : '0deg'}]}]}
                           source={image.itemArrowImage}/>
                </View>
                <View style={{
                    width: theme.screenWidth - 30,
                    marginLeft: 15,
                    height: 1,
                    backgroundColor: colors.divider,
                }}/>
            </View>
        );
    };
    _renderSectionFooter = () => {
        return <Divider customHeight={10}/>;
    };

    renderData() {
        let selectArr = this.sumSelectedArr();
        return (
            <View style={{
                backgroundColor: colors.empty,
                flex: 1,
            }}>
                <View style={{
                    width: theme.screenWidth,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                }}>
                    <KBSearch
                        backgroundColor={colors.empty}
                        onSearch={(text) => this.onSearch(text)}
                    />
                </View>
                <View style={{paddingHorizontal: 15, height: 40, justifyContent: 'center'}}>
                    <Text style={{fontSize: 15, color: colors.text555}}>{`已有学生${selectArr.length}人`}</Text>
                </View>
                <ExpandableList
                    style={{backgroundColor: colors.empty}}
                    dataSource={this.state.sortData}
                    headerKey="groupName"
                    memberKey="students"
                    renderRow={this._renderRow}
                    renderSectionHeaderX={this._renderSectionHeader}
                    renderSectionFooterX={this._renderSectionFooter}
                    openOptions={[0]}
                />
            </View>
        );
    }

    render() {
        let renderView = super.render();
        return (
            <Container style={styles.container}>
                <KBHeader
                    isLeft={true} {...this.props}
                    title={'选择指派人'}
                    rightText={'确定'}
                    rightStyle={{color: colors.text888, fontSize: 14}}
                    touchRight={() => this.complete()}
                />
                {renderView}
            </Container>
        );
    }


    isSelectedAll(data) {
        for (let obj of data) {
            if (!obj.isSelected) {
                return false;
            }
        }
        return true;
    }

    /**
     *  计算全选
     */
    sumSelectedArr() {
        let selectedArr = [];
        for (let obj of this.state.allData) {
            if (obj.isSelected) {
                selectedArr.push(obj);
            }
        }
        return selectedArr;
    }

    /**
     * 完成
     */
    complete() {
        let selectedArray = this.sumSelectedArr();
        this.getReceptors(selectedArray);
        this.goBack();
    }

    /**
     * cell 点击事件
     * @param index
     */
    itemClick = (item) => {
        item.isSelected = !item.isSelected;
        this.setState({});
    };

    // 搜索框点击事件
    onSearch = (text) => {
        let allData = this.state.allData;
        let searchData = [];

        if (text === '') {
            searchData = allData;
        } else {
            for (let obj of allData) {
                if (obj.name.search(text) >= 0) {
                    searchData.push(obj);
                }
            }
        }
        this.setDataSource(searchData);
    };

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    sectionView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 50,
        width: theme.screenWidth,
        backgroundColor: colors.white,
    },
    sectionTitleView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        // backgroundColor: colors.reduceColor,
    },
    sectionTitle: {
        color: colors.text333,
        textAlign: 'center',
        fontSize: 16,
    },
    sectionIcon: {
        width: 8,
        height: 13,
        marginRight: 10,
    },
});
