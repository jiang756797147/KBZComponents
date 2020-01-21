import React, {Component} from 'react';
import {Container} from 'native-base';
import {Text, View, Image, DeviceEventEmitter} from 'react-native';
import SortableGrid from 'react-native-sortable-grid';
import PropTypes from 'prop-types';

import colors from '../../../../constants/colors';
import UserData from '../../../../constants/UserData';
import {UPDATE_OPTION} from '../../../../constants/notify';
import image from '../../../../constants/image';
import theme from '../../../../constants/theme';
import ToastUtils from '../../../../utils/ToastUtils';
import Utils from '../../../../utils/Utils';
import SQLite from '../../../../utils/SQLite';
import KBScrollView from '../../../../components/KBScrollView';
import KBButton from '../../../../components/KBButton';
import KBPolygonImage from '../../../../components/KBPolygonImage';


export default class OptionPraisePage extends Component {

    static propTypes = {
        ChangedPraiseSort: PropTypes.func,
        praiseSort: PropTypes.bool,
        popDialog: PropTypes.any,
        classId: PropTypes.string,
        type: PropTypes.number,
        getPraiseData: PropTypes.func,
    };
    static defaultProps = {
        // praiseData: [],
    };

    constructor(props) {
        super(props);
        this.sqLite = new SQLite();

        this.alertText = '长按图标，可以调整自己点评时的展示排序';
        this.teacherId = UserData.getInstance().getId();

        this.itemOrderData = [];
        this.state = Object.assign({

            array: [],
            data: [],
            sortData: [],
            showData: [],

            isSort: false,
            isShowOwn: false,
            isRefreshing: false,

            isNoData: false,
            isScroll: true,

        }, this.state);
        this.eventEmitter = DeviceEventEmitter;
    }

    UNSAFE_componentWillMount(): void {
        this.eventEmitter.addListener(UPDATE_OPTION, this.optionRefresh.bind(this));
    }

    componentWillUnmount() {
        this.eventEmitter.removeListener(UPDATE_OPTION, this.optionRefresh);
    }

    componentDidMount() {
        //开启数据库
        if (!this.db) {
            this.db = this.sqLite.open();
        }

        this.getOptions();
    }

    getOptions() {
        //查询
        this.sqLite.select(this.teacherId, this.props.classId, 0, this.props.entryType, {
            onSuccess: this.onSqLiteSuccess.bind(this),
            onNullData: this.onSqLiteNullData.bind(this),
        });
    }

    onSqLiteSuccess(data) {

        let praiseData = data;
        this.state.data = praiseData;
        this.getShowData();
        this.setState({
            isRefreshing: false,
            isNoData: false,
        });
    }

    onSqLiteNullData() {

        this.setState({
            isRefreshing: false,
            isNoData: true,
        });
    }

    getShowData() {
        let praiseData = this.state.data;
        let showOwnData = [];
        for (let obj of praiseData) {
            if (obj.createBy == this.teacherId) {
                showOwnData.push(obj);
            }
        }
        if (this.state.isShowOwn) {

            let showData = [];
            for (let obj of showOwnData) {
                showData.push(obj);
            }
            showData.push(
                {id: '00', name: '添加', header: image.classMatterAdd},
                {id: '01', name: '删除', header: image.classMatterDelete},
            );

            this.state.showData = showData;
            this.state.sortData = showOwnData;

        } else {
            let showData = [];
            for (let obj of praiseData) {
                showData.push(obj);
            }
            showData.push(
                {id: '00', name: '添加', header: image.classMatterAdd},
                {id: '01', name: '删除', header: image.classMatterDelete},
            );

            this.state.showData = showData;
            this.state.sortData = praiseData;
        }
        this.props.getPraiseData(showOwnData);
    }

    renderNullDataView() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <KBScrollView
                    isRefreshControl={true}
                    isRefreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh}
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <View style={{alignItems: 'center'}}>
                            <Image source={require('../../../../assets/class/image_no_group.png')}
                                   style={{width: 200, height: 150, marginTop: 90}} resizeMode={'cover'}/>
                            <Text style={{color: colors.text999, fontSize: 13}}>暂无表扬事项</Text>
                            <KBButton onPress={() => {
                                const {navigate} = this.props.navigation;
                                navigate('ClassItemNew', {
                                    title: '新建表扬事项',
                                    classId: this.props.classId,
                                    praiseType: 0,
                                    entryType: this.props.entryType,
                                });
                            }}>
                                <View style={{
                                    paddingHorizontal: 45,
                                    height: 40,
                                    borderRadius: 20,
                                    marginTop: 40,
                                    backgroundColor: '#FBD962',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{color: colors.text333, fontSize: 14}}>添加事项</Text>
                                </View>
                            </KBButton>
                        </View>
                    </View>
                </KBScrollView>
            </View>
        );
    }

    renderData() {

        let data = this.props.praiseSort ? this.state.sortData : this.state.showData;
        let gridDefaultH = theme.defaultContent - 20 - 49;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.white,
                }}>
                <View style={{
                    width: theme.screenWidth,
                    height: 20,
                    backgroundColor: colors.pinkBg,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 12,
                        color: colors.yellowColor,
                        textAlign: 'center',
                    }}>
                        {this.alertText}
                    </Text>
                </View>

                <View style={{flex: 1}}>
                    <KBScrollView scrollEnabled={this.state.isScroll}>
                        {
                            this.props.praiseSort ?
                                <SortableGrid
                                    style={{
                                        flex: 1,
                                        height: gridDefaultH,
                                        // backgroundColor: colors.yellowColor
                                    }}
                                    blockTransitionDuration={400}
                                    activeBlockCenteringDuration={200}
                                    itemsPerRow={3}
                                    dragActivationTreshold={200}
                                    onDragRelease={(itemOrder) => {

                                        this.itemOrderData = itemOrder.itemOrder;
                                        this.setState({
                                            isScroll: true,
                                        });
                                    }}
                                    onDragStart={() => {
                                        this.setState({
                                            isScroll: false,
                                        });
                                    }}
                                >
                                    {
                                        data.map((item, index) => this.renderSortItem(item, index))
                                    }
                                </SortableGrid>
                                :
                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    {data.map((item, index) => this.renderItem(item, index))}
                                </View>
                        }
                    </KBScrollView>
                </View>
                {
                    this.props.praiseSort ?
                        <KBButton
                            onPress={() => this.saveSort()}
                        >
                            <View style={{
                                height: 49,
                                width: theme.screenWidth,
                                backgroundColor: colors.yellowColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 15,
                                    color: colors.white,
                                }}>保存排序</Text>
                            </View>
                        </KBButton>
                        :
                        <KBButton onPress={() => this.showOwn()}>
                            <View style={{
                                paddingLeft: 10,
                                height: 49,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            >
                                <Image style={{
                                    width: 15,
                                    height: 15,

                                }}
                                       source={this.state.isShowOwn ? image.classBtnChoiceS : image.classBtnChoiceD}
                                />
                                <Text style={{
                                    marginLeft: 10,
                                    fontSize: 13,
                                    color: colors.text888,
                                }}
                                >
                                    只显示自己创建的事项类型
                                </Text>
                            </View>
                        </KBButton>
                }
            </View>

        );
    };

    render() {
        return (
            <Container style={{
                paddingBottom: theme.tabBarStyle.paddingBottom,
            }}>
                {
                    this.state.isNoData ?
                        this.renderNullDataView()
                        :
                        this.renderData()
                }

            </Container>
        );
    }

    renderItem(item, index) {
        let imageUrl = '';
        if (item.id == '00' || item.id == '01') {

            imageUrl = item.header;
        } else {
            imageUrl = Utils.getSystemAvatar(item.header);
        }
        return (
            <KBButton
                key={index}
                onLongPress={() => this.longPress()}
                onPress={() => {
                    if (item.id == '00') {
                        this.itemAdd();
                    } else if (item.id == '01') {
                        this.itemReduce();
                    } else {
                        this.itemClick(index);
                    }
                }}
            >
                <View style={{
                    width: theme.screenWidth / 3,
                    height: theme.screenWidth / 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 20,
                    borderWidth: 1,
                    borderColor: colors.lightGray,
                }}>
                    <View>
                        <KBPolygonImage
                            imageUrl={imageUrl}
                            width={'60'}
                        />
                        {
                            item.id == '00' || item.id == '01' ?
                                null
                                :
                                <View style={{
                                    position: 'absolute',
                                    width: 30,
                                    height: 30,
                                    bottom: -5,
                                    right: -5,
                                    backgroundColor: colors.trans,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                >

                                    <Image style={{
                                        width: 30,
                                        height: 30,
                                    }}
                                           source={image.classGradeBg}
                                    />
                                    <Text style={{
                                        top: 7,
                                        fontSize: 11,
                                        color: colors.reduceColor,
                                        position: 'absolute',
                                        textAlign: 'center',
                                    }}>{item.score}</Text>
                                </View>
                        }
                    </View>
                    <Text style={{fontSize: 13, marginTop: 10, color: colors.text444}}>
                        {item.name}
                    </Text>
                </View>
            </KBButton>
        );
    }

    renderSortItem(item, index) {
        let imageUrl = '';
        if (item.id == '00' || item.id == '01') {

            imageUrl = item.header;
        } else {
            imageUrl = Utils.getSystemAvatar(item.header);
        }
        return (
            <View
                key={index}
                style={{
                    width: theme.screenWidth / 3,
                    height: theme.screenWidth / 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 20,
                    borderWidth: 1,
                    borderColor: colors.lightGray,
                }}
                onTap={() => {
                    if (item.id == '00') {
                        this.itemAdd();
                    } else if (item.id == '01') {
                        this.itemReduce();
                    } else {
                        this.itemClick(index);
                    }
                }}
            >

                <View>
                    <KBPolygonImage
                        imageUrl={imageUrl}
                        width={'60'}
                    />
                    {
                        item.id == '00' || item.id == '01' ?
                            null
                            :
                            <View style={{
                                position: 'absolute',
                                width: 30,
                                height: 30,
                                bottom: -5,
                                right: -5,
                                backgroundColor: colors.trans,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Image style={{
                                    width: 30,
                                    height: 30,
                                }}
                                       source={image.classGradeBg}
                                />
                                <Text style={{
                                    width: 20,
                                    height: 20,
                                    fontSize: 13,
                                    color: colors.reduceColor,
                                    position: 'absolute',
                                    textAlign: 'center',
                                }}>{item.score}</Text>
                            </View>
                    }

                </View>
                <Text style={{fontSize: 13, marginTop: 10, color: colors.text444}}>
                    {item.name}
                </Text>
            </View>
        );
    }

    optionRefresh = (data) => {
        this.getOptions();
        this.setState({});
    };

    refreshData = () => {
        this.setState({isRefreshing: true});
        this.componentDidMount();
    };

    /**
     * 长按排序
     */
    longPress() {
        if (this.props.praiseSort) {
            return;
        }
        this.state.isShowOwn = false;
        let praiseData = this.state.data;
        let showData = [];
        for (let obj of praiseData) {
            showData.push(obj);
        }
        showData.push(
            {id: '00', name: '添加', header: image.classMatterAdd},
            {id: '01', name: '删除', header: image.classMatterDelete},
        );

        this.state.showData = showData;
        this.state.sortData = praiseData;

        this.props.ChangedPraiseSort(true);
        this.props.getPraiseData(this.state.sortData);
        this.setState({});
    }

    /**
     * 保存排序
     * teacherId,classId,type,ertryType,optionId,sort
     */
    saveSort() {
        console.log('praise排序000000', this.itemOrderData);
        let data = this.state.data;
        // 删除上次保存的排序
        /**
         * teacherID  classID  entryType
         */
        this.sqLite.deleteSortData(this.teacherId, this.props.classId, this.props.entryType, 0);

        let sortData = [];
        // 插入新数据
        // teacherId,type,entryType,optionId,sort
        for (let index = 0; index < this.itemOrderData.length; index++) {
            let optionObj = data[parseInt(this.itemOrderData[index].key)];
            let sortObj = {};
            sortObj.teacherId = this.teacherId;
            sortObj.classId = this.props.classId;
            sortObj.type = 0;
            sortObj.entryType = this.props.entryType;
            sortObj.id = optionObj.id;
            sortObj.sort = index;
            sortData.push(sortObj);
            /*this.sqLite.insertSortData(this.teacherId, 0, this.props.entryType, optionObj.id, index);*/
        }
        console.log('sortData =========', sortData);
        this.sqLite.insertSortData(sortData, () => {
            this.props.ChangedPraiseSort(false);
            // this.optionRefresh();
        });
    }

    /**
     * 显示自己创建的事项
     */
    showOwn() {
        this.state.isShowOwn = !this.state.isShowOwn;
        this.getShowData();
        this.setState({});
    }


    /**
     * item点击
     */
    itemClick = (index) => {
        if (this.props.praiseSort) {
            return;
        }

        console.log('index', this.state.showData[index]);

        let optionObj = this.state.showData[index];
        if (optionObj.createBy != this.teacherId) {

            ToastUtils.showToast('你没有权限编辑此事项！');
            return;
        }
        const {navigate} = this.props.navigation;
        navigate('ClassOptionEdit', {
            optionObj: optionObj,
            title: '编辑表扬事项',
            classId: this.props.classId,
            praiseType: 0,
            entryType: this.props.entryType,
        });
    };

    /**
     * 新增
     */
    itemAdd = () => {

        const {navigate} = this.props.navigation;
        navigate('ClassOptionNew', {
            // id : "",
            title: '新建表扬事项',
            classId: this.props.classId,
            praiseType: 0,
            entryType: this.props.entryType,
        });
    };
    /**
     * 删除
     */
    itemReduce = () => {

        this.props.popDialog.show();
    };
}
