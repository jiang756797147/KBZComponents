import React from 'react';
import BaseScreen from '../../base/BaseScreen';
import {View, Text, Image} from 'react-native';
import colors from '../../constants/colors';
import KBHeader from '../../components/KBHeader';
import TableView, {PullRefreshMode} from '../../components/tableView';
import Adapter from '../../components/tableView/Adapter';
import ItemModel from '../../components/tableView/ItemModel';
import StudentRankingHolder from './holder/StudentRankingHolder';
import {renderers} from '../../components/popMenu/src';
import KBDropPopMenu from '../../components/popMenu/KBDropPopMenu';
import fetchUrl from '../../constants/fetchUrl';

import {timeArray} from './StatisticMode'

export default class StudentRankingScreen extends BaseScreen {


    constructor(props) {
        super(props);
        this.page = 1;
        this.totalPage = 0;
        this.tableKey = 0;

        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.classTimeType = 1;

        this.adapter = new Adapter();
        this.state = Object.assign({
            rankingTime: '本日',
            startTime: '',
            endTime: '',
        }, this.state);
    }

    getApiUrl() {
        //添加自定义时间
        let customTime = this.classTimeType === 7 ? `&startTime=${this.state.startTime}&endTime=${this.state.endTime}` : '';
        return `${fetchUrl.getStudentRank}page=${this.page}&class_id=${this.classId}&timeType=${this.classTimeType}${customTime}`;
    }

    onSuccess(responseData) {

        if (responseData.data) {
            this.totalPage = responseData.data.totalPage;

            if (responseData.data.list && responseData.data.list.length > 0) {

                for (let i = 0; i < responseData.data.list.length; i++) {
                    let itemModel = new ItemModel(this.tableKey, StudentRankingHolder);
                    itemModel.setAttribute('item', responseData.data.list[i]);
                    itemModel.setAttribute('index', this.tableKey);
                    this.adapter.addItem(itemModel);
                    this.tableKey++;
                }

                if (this.tableView) {
                    this.tableView.notifyDataSetChanged();
                    this.tableView.onRefreshComplete();
                }
            } else {
                if (this.tableView) {
                    this.tableView.onRefreshComplete();
                    this.tableView.setHasMoreData(false);
                }
                if (this.page === 1) {
                    super.onNullData();
                }
            }
        }
    }

    renderData() {

        return (
            <View style={{flex: 1, backgroundColor: colors.white}}>

                <KBHeader backgroundColor={colors.white}
                          {...this.props}
                          isLeft={true}
                          title={'学生活跃排行'}
                          rightComponent={() => {
                              return (
                                  <KBDropPopMenu
                                      onOpen={() => {
                                          this.setState({rankingTimeDown: true});
                                      }}
                                      onClose={() => {
                                          this.setState({rankingTimeDown: false});
                                      }}
                                      menuTriggerStyle={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          width: 60,
                                          height: 26,
                                          justifyContent: 'center',
                                      }}
                                      onSelect={(item) => {
                                          console.log('item =================', item);
                                          this.classTimeType = item.value.value;
                                          if (item.value.value === 7) {
                                              const {navigate} = this.props.navigation;
                                              navigate('KBDate', {
                                                  isSingle: false,
                                                  getDate: (startDate, endDate) => {
                                                      this.setState({
                                                          startTime: (startDate.timestamp / 1000).toString(),
                                                          endTime: (endDate.timestamp / 1000).toString(),
                                                          rankingTime: item.value.text,
                                                      }, () => {
                                                          this.onDownRefresh();
                                                      });
                                                  },
                                              });
                                          } else {
                                              this.setState({
                                                  rankingTime: item.value.text,
                                                  startTime: '',
                                                  endTime: '',
                                              }, () => {
                                                  this.onDownRefresh();
                                              });
                                          }
                                      }}
                                      renderer={renderers.PopoverNew}
                                      rendererProps={{
                                          placement: 'bottom',
                                          preferredPlacement: 'top',
                                          anchorStyle: {backgroundColor: colors.white},
                                      }}
                                      optionsStyle={{
                                          marginTop: 0,
                                          width: 100,
                                          backgroundColor: colors.white,
                                          borderRadius: 5,
                                          marginRight: 14,
                                      }}
                                      menuStyle={{}}
                                      menuTrigger={() =>
                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                              <Text style={{
                                                  fontSize: 13,
                                                  color: colors.text21,
                                              }}>{this.state.rankingTime}</Text>
                                              <Image
                                                  source={this.state.rankingTimeDown ? require('../../assets/image3.5/time_up.png') :
                                                      require('../../assets/image3.5/time_down.png')}
                                                  style={{width: 8, height: 8, marginLeft: 5}} resizeMode={'contain'}/>
                                          </View>}
                                      dataArray={timeArray}
                                      uniqueKey={'text'}
                                  />
                              );


                          }}
                />

                <TableView
                    ref={(c) => {
                        this.tableView = c;
                    }}
                    mode={PullRefreshMode.BOTH}
                    isShowDivider={true}
                    dividerStyle={{customHeight: 1}}
                    adapter={this.adapter}
                    onPullDownToRefresh={(tableView) => {
                        this.onDownRefresh();
                    }}
                    onPullUpToRefresh={(tableView) => {
                        if (this.page >= this.totalPage) {
                            tableView.onRefreshComplete();
                            tableView.setHasMoreData(false);
                            return;
                        }
                        this.onUpRefresh();
                    }}
                />

            </View>
        );

    }

    //下拉刷新
    onDownRefresh = () => {
        this.page = 1;
        this.tableKey = 0;
        this.adapter.removeAll();
        this.componentDidMount();
    };

    //上拉加载
    onUpRefresh = () => {
        ++this.page;
        this.componentDidMount();
    };


}
