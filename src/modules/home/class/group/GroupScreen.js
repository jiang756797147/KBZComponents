import React from 'react';
import {Container} from 'native-base';
import {
    Text,
    View,
    Image,
} from 'react-native';
import BaseScreen from '../../../../base/BaseScreen';
import KBButton from '../../../../components/KBButton';
import CircleImage from '../../../../components/CircleImage';
import KBScrollView from '../../../../components/KBScrollView';
import KBHeader from '../../../../components/KBHeader';

import colors from '../../../../constants/colors';
import fetchUrl from '../../../../constants/fetchUrl';
import ToastUtils from '../../../../utils/ToastUtils';
import Utils from '../../../../utils/Utils';
import theme from '../../../../constants/theme';

export default class GroupScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.state = Object.assign({

            data: null,
            isRefreshing: false,
            isNullData: false,

        }, this.state);
        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.isMaster = params.isMaster;
    }


    getApiUrl() {
        return fetchUrl.getGroupList + '&classId=' + this.classId;
    }

    onSuccess(responseData) {

        if (responseData.data && responseData.data.length > 0) {
            let data = responseData.data;

            this.setState({
                data: data,
                isRefreshing: false,
                isNullData: false,
            });
        }
    }

    onNullData(responseData) {
        this.setState({
            isNullData: true,
            isRefreshing: false,
        });
    }

    renderNullDataView() {
        return (
            <KBScrollView>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{alignItems: 'center'}}>
                        <Image source={require('../../../../assets/class/image_no_group.png')}
                               style={{width: 200, height: 150, marginTop: 90}} resizeMode={'cover'}/>
                        <Text style={{color: colors.text999, fontSize: 13}}>暂无分组，请先创建小组</Text>
                        <KBButton onPress={() => this.creatNew()}>
                            <View style={{
                                paddingHorizontal: 45,
                                height: 40,
                                borderRadius: 20,
                                marginTop: 40,
                                backgroundColor: '#FBD962',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Text style={{color: colors.text333, fontSize: 14}}>创建小组</Text>
                            </View>
                        </KBButton>
                    </View>
                </View>
            </KBScrollView>

        );
    }


    renderData() {
        return (
            <View style={{flex: 1, backgroundColor: '#FAFAF7'}}>
                <KBScrollView
                    isRefreshControl={true}
                    isRefreshing={this.state.isRefreshing}
                    onRefresh={this.refreshData}
                >
                    {this.state.data.map(this.renderItem)}
                </KBScrollView>
                {this.isMaster ? this.renderBottom() : null}
            </View>
        );
    }

    renderItem = (item, index) => {
        let imageUrl = Utils.getTeamAvatar(item.header);
        return (
            <KBButton key={index}
                      onPress={() => {
                          const {navigate} = this.props.navigation;
                          navigate('GroupDetail', {
                              groupData: item,
                              onRefresh: this.refreshData,
                              isMaster: this.isMaster,
                          });
                      }}
            >
                <View style={{
                    flexDirection: 'row',
                    padding: 15,
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: colors.divider,
                    backgroundColor: colors.white,
                }}>
                    <CircleImage customWidth={50} customHeight={50} imageUrl={imageUrl}/>
                    <Text style={{marginLeft: 15, fontSize: 15, color: colors.text333}}>{item.name}</Text>
                    <Text style={{marginLeft: 10, fontSize: 14, color: colors.text999}}>{`(${item.studentNum}人)`}</Text>
                </View>
            </KBButton>
        );
    };

    renderHeader() {
        return (
            <KBHeader
                isLeft={true}
                title={'小组'}
                backgroundColor={colors.yellowColor}
                {...this.props}
            />
        );
    }

    renderBottom() {
        return (
            <View style={[theme.tabBarStyle, {alignItems: 'center', backgroundColor: '#FAFAF7'}]}>
                <KBButton onPress={() => this.creatNew()}>
                    <View style={{
                        width: theme.screenWidth - 30,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.yellowColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 15, color: colors.text555}}>新建</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    render() {
        let renderView = super.render();

        return (
            <Container style={{flex: 1, backgroundColor: '#FAFAF7'}}>

                {this.state.isNullData ? this.renderNullDataView() : renderView}
            </Container>
        );
    }

    //刷新
    refreshData = () => {

        this.setState({isRefreshing: true}, () => {
            this.componentDidMount();
        });
    };

    creatNew = () => {
        if (!this.isMaster) {
            ToastUtils.showToast('仅班主任能创建小组');
            return;
        }
        const {navigate} = this.props.navigation;
        navigate('GroupNew', {
            classId: this.classId,
            onRefresh: this.refreshData,
        });
    };

}
