import React from 'react';
import {Container} from 'native-base';
import {StyleSheet, Text, View, Image} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import BaseScreen from '../../../../base/BaseScreen';

import colors from '../../../../constants/colors';
import theme from '../../../../constants/theme';
import image from '../../../../constants/image';
import Utils from '../../../../utils/Utils';
import ToastUtils from '../../../../utils/ToastUtils';
import HttpUtils from '../../../../utils/HttpUtils';
import SQLite from '../../../../utils/SQLite';

import CustomBar from '../../../../components/CustomBar';
import KBScrollView from '../../../../components/KBScrollView';
import PraisePopDialog from '../../../../components/dialog/PraisePopDialog';
import KBPolygonImage from '../../../../components/KBPolygonImage';
import KBButton from '../../../../components/KBButton';
import Divider from '../../../../components/Divider';
import fetchUrl from '../../../../constants/fetchUrl';
import UserData from '../../../../constants/UserData';

import OptionPraisePage from './OptionPraisePage';
import OptionImprovePage from './OptionImprovePage';

export default class ClassOptionScreen extends BaseScreen {


    constructor(props) {
        super(props);
        this.sqLite = new SQLite();

        this.teacherId = UserData.getInstance().getId();
        this.dialogButtons = [
            {text: '全选'},
            {text: '删除'},
        ];
        this.state = Object.assign({

            options: [],
            praiseData: [],
            improveData: [],
            isImprove: false,

            isDialogSelectAll: false,
            isPraiseSort: false,
            isImproveSort: false,
        }, this.state);
    }

    componentDidMount() {
        super.componentDidMount();
        //开启数据库
        if (!this.db) {
            this.db = this.sqLite.open();
        }
    }


    render() {
        const {params} = this.props.navigation.state;
        return (
            <Container>
                <ScrollableTabView
                    style={styles.content}
                    renderTabBar={
                        () => <CustomBar
                            style={{backgroundColor: colors.yellowColor}}
                            isHeaderBar={true}
                            tabBtnWidth={theme.screenWidth / 4}
                            leftComponent={() => {
                                return (
                                    <View>
                                        {
                                            this.state.isPraiseSort || this.state.isImproveSort ?
                                                <KBButton onPress={() => {
                                                    if (this.state.isPraiseSort) {
                                                        this.state.isPraiseSort = false;
                                                    }
                                                    if (this.state.isImproveSort) {
                                                        this.state.isImproveSort = false;
                                                    }
                                                    this.setState({});
                                                }}>
                                                    <View style={{
                                                        width: 50, height: theme.withoutStatusHeight,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <Text style={{
                                                            marginLeft: 20,
                                                            width: 40,
                                                            height: 20,
                                                        }}>取消</Text>
                                                    </View>
                                                </KBButton>
                                                :
                                                <KBButton onPress={() => {
                                                    const {goBack} = this.props.navigation;
                                                    goBack();
                                                }}>
                                                    <View style={{
                                                        width: 50, height: theme.withoutStatusHeight,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}>
                                                        <Image
                                                            source={require('../../../../assets/icon_back_black.png')}
                                                            style={{
                                                                width: 10,
                                                                height: 15,
                                                            }}/>
                                                    </View>
                                                </KBButton>
                                        }
                                    </View>
                                );
                            }}
                            {...this.props}/>
                    }
                    initialPage={params.initialPage}
                    onChangeTab={(index) => this.tabChanged(index)}
                    locked={true}
                >
                    <OptionPraisePage
                        ref={(c) => this.praisePage = c}
                        entryType={params.entryType}
                        style={styles.content}
                        classId={params.classId}
                        navigation={this.props.navigation}
                        tabLabel={'表扬'}
                        getPraiseData={(data) => {
                            this.setState({
                                praiseData: data,
                            });
                        }}
                        praiseSort={this.state.isPraiseSort}
                        ChangedPraiseSort={(data) => {
                            this.setState({
                                isPraiseSort: data,
                            });
                        }}
                        popDialog={this.PopDialog}
                    />
                    <OptionImprovePage
                        ref={(c) => this.improvePage = c}
                        entryType={params.entryType}
                        style={styles.content}
                        classId={params.classId}
                        navigation={this.props.navigation}
                        tabLabel={'待改进'}
                        getImproveData={(data) => {
                            this.setState({
                                improveData: data,
                            });
                        }}
                        improveSort={this.state.isImproveSort}
                        ChangedImproveSort={(data) => {
                            this.setState({
                                isImproveSort: data,
                            });
                        }}
                        popDialog={this.PopDialog}
                    />
                </ScrollableTabView>

                <PraisePopDialog
                    ref={(c) => this.PopDialog = c}
                    title={this.state.isImprove ? '删除待改进事项' : '删除表扬事项'}
                    mainComponent={() => this.renderDialogView()}
                />
            </Container>
        );

    }

    renderDialogView() {
        let data = this.state.isImprove ? this.state.improveData : this.state.praiseData;
        return (
            <View style={styles.content}>
                <View style={{flex: 1}}>
                    <KBScrollView>
                        {data.map((item, index) => this.renderDialogItem(item, index))}
                    </KBScrollView>
                </View>

                <View>
                    {this.renderDialogToolBarView()}
                </View>
            </View>
        );
    }

    renderDialogItem(item, index) {
        let data = this.state.isImprove ? this.state.improveData : this.state.praiseData;
        return (
            <KBButton
                key={index}
                onPress={() => this.dialogItemClik(index)}
            >
                <View>
                    <View style={{
                        paddingHorizontal: 14,
                        width: theme.screenWidth,
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            flex: 7,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <View>
                                <Image style={{
                                    width: 15,
                                    height: 15,
                                    marginRight: 10,
                                }}
                                       source={item.delStatus == '1' ? image.classBtnChoiceS : image.classBtnChoiceD}/>
                            </View>
                            <KBPolygonImage width={'40'} imageUrl={Utils.getSystemAvatar(item.header)}/>
                            <Text style={{
                                fontSize: 15,
                                color: colors.text666,
                                marginLeft: 10,
                            }}>{item.name}</Text>

                        </View>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}>
                            <Text style={{
                                fontSize: 15,
                                color: colors.text666,
                            }}>{item.score}</Text>
                        </View>
                    </View>
                    {
                        index == data.length - 1 ?
                            null
                            :
                            <Divider isMargin={true}/>
                    }

                </View>
            </KBButton>
        );
    }

    //底部按钮
    renderDialogToolBarView() {

        let data = this.state.isImprove ? this.state.improveData : this.state.praiseData;
        let selectArr = this.sumSelectArray(data);
        let isSelectedAll = this.changeSelectedAll(data);
        return (
            <View
                style={{
                    height: 49,
                    width: theme.screenWidth,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <KBButton style={{flex: 3}}
                          onPress={() => this.toolBarSelectAll()}>
                    <View style={{
                        flex: 3,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 49,
                        borderTopWidth: 0.5,
                        borderColor: colors.divider,
                    }}>
                        <Image style={{
                            width: 20,
                            height: 20,
                        }}
                               source={isSelectedAll ? image.classBtnChoiceS : image.classBtnChoiceD}/>
                        <Text style={{
                            fontSize: 15,
                            marginLeft: 5,
                        }}>全选</Text>
                    </View>
                </KBButton>
                <KBButton style={{flex: 4}}
                          onPress={() => this.toolBarDelete()}>
                    <View style={{
                        flex: 3,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 49,
                        backgroundColor: colors.yellowColor,
                    }}>
                        <Text style={{
                            fontSize: 15,
                            marginLeft: 5,
                        }}>
                            {'删除（' + selectArr.length + '）'}
                        </Text>
                    </View>
                </KBButton>
            </View>
        );
    };

    changeSelectedAll(data) {
        if (data && data.length > 0) {
            for (let obj of data) {
                if (!obj.delStatus || obj.delStatus == '0') {
                    return false;
                }
            }
        }
        return true;
    }

    sumSelectArray(data) {

        let selectArr = [];
        if (Utils.isArrayNull(data)) {
            return selectArr;
        }
        for (let obj of data) {
            if (obj.delStatus == '1') {
                selectArr.push(obj);
            }
        }
        return selectArr;
    }

    /**
     * tab 切换
     */
    tabChanged(index) {
        if (index.i == 0) {
            this.setState({
                isImprove: false,
                isPraiseSort: false,
                isImproveSort: false,
            });
        } else {
            this.setState({
                isImprove: true,
                isPraiseSort: false,
                isImproveSort: false,
            });
        }
    };

    dialogItemClik(index) {
        let data = this.state.isImprove ? this.state.improveData : this.state.praiseData;

        let delStatus = data[index].delStatus;
        data[index].delStatus = delStatus == '1' ? '0' : '1';

        this.setState({});
    }

    /**
     * 全选
     */
    toolBarSelectAll() {
        let data = this.state.isImprove ? this.state.improveData : this.state.praiseData;
        if (Utils.isArrayNull(data)) {
            ToastUtils.showToast('暂无数据');
            return;
        }

        this.state.isDialogSelectAll = !this.state.isDialogSelectAll;
        for (let obj of data) {
            obj.delStatus = this.state.isDialogSelectAll ? '1' : '0';
        }

        this.setState({});
    }

    /**
     * 删除
     */
    toolBarDelete() {

        this.PopDialog.hide();
        let data = this.state.isImprove ? this.state.improveData : this.state.praiseData;

        // ToastUtils.showToast("删除");
        let idArr = [];
        let deleteArray = [];
        for (let obj of data) {
            if (obj.delStatus == '1') {
                idArr.push(obj.id);
                deleteArray.push(obj);
            }
        }
        for (let obj of deleteArray) {
            if (obj.createBy != this.teacherId) {
                ToastUtils.showToast('你没有权限删除事项！');
                return;
            }
        }

        let formData = new FormData();
        formData.append('idJson', JSON.stringify(idArr));

        HttpUtils.doPostWithToken(fetchUrl.deleteOption, formData, {
            onSuccess: (responseData) => {
                ToastUtils.showToast(responseData.message);

                //数据库删除
                this.sqLite.deleteOptionData(deleteArray);
            },
            onFail: function (responseData) {
                ToastUtils.showToast(responseData.message);
            },
        });
    }
}
const styles = StyleSheet.create({

    content: {
        width: theme.screenWidth,
        height: theme.screenHeight - theme.headerHeight,
        backgroundColor: colors.white,
    },

});
