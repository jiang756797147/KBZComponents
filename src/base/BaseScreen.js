import React, {Component} from 'react';

import {
    ActivityIndicator,
    InteractionManager,
    StyleSheet,
    View,
    Text,
    Image,
    DeviceEventEmitter
} from 'react-native';
import {Container} from 'native-base';
import Spinkit from 'react-native-spinkit';

import colors from "../constants/colors";
import theme from "../constants/theme";
import KBButton from "../components/KBButton";
import KBHeader from "../components/KBHeader";
import HttpUtils from "../utils/HttpUtils";
import Utils from "../utils/Utils";
import ToastUtils from "../utils/ToastUtils";


export default class BaseScreen extends Component {

    static defalutProps = {
        isExistTabBar: false
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            error: false,
            errorInfo: "",
            isConnected: true,
            isNullData: false,
        };
        this.eventEmitter = DeviceEventEmitter;

    }

    UNSAFE_componentWillMount(): void {
        this._isMounted = true;
    }

    componentWillUnmount() {

        this._isMounted = false;
        //重写组件的setState方法，直接返回空
        this.setState = (state, callback) => {
            return;
        };
    }

    getApiUrl() {
        return false;
    }

    componentDidMount() {

        // if (this.state.isConnected) {
        //请求数据
        InteractionManager.runAfterInteractions(() => {
            let apiUrl = this.getApiUrl();
            if (apiUrl) {
                HttpUtils.doGetWithToken(apiUrl, {
                    onSuccess: this.onSuccess.bind(this),
                    onFail: this.onFail.bind(this),
                    onError: this.onError.bind(this),
                    onEnd: this.onEnd.bind(this),
                    onNullData: this.onNullData.bind(this),
                });
            } else {
                this.onSuccess();
                this.onEnd();
            }
        });
        // }
    }

    onEnd() {

        this.setState({
            isLoading: false,
        });
    }

    onNullData() {

        this.setState({isLoading: false, isNullData: true});
    }

    onSuccess(responseData) {

        this.setState({});
    }

    onFail(responseData) {

        this.setState({
            error: true,
            errorInfo: responseData.msg,
            // errorInfo: '请求网络失败'
        });
    }

    onError(errMessage) {
        console.log("error", errMessage);
        ToastUtils.showToast(errMessage);
    }

    //加载等待的view
    renderLoadingView() {

        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                {theme.isAndroid ?
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: 60, height: 60}}>
                        <ActivityIndicator
                            animating={true}
                            color='gray'
                            size={45}
                        />
                        <Image source={require('../assets/hzm_logo_h.png')}
                               style={{width: 35, height: 35, position: 'absolute'}} resizeMode={'contain'}/>
                    </View>
                    :
                    <Spinkit
                        isVisible={true}
                        color={'#C3C3C3'}
                        size={40}
                        type={'Arc'}
                    />
                }
            </View>
        );
    }

    //无网络view
    renderNoNetView() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image resizeMode={'contain'} source={require('../assets/image_no_net.png')}
                       style={{width: 255, height: 215}}/>
                <Text style={{fontSize: 13, color: colors.text666}}>网络开小差啦，请稍后再试</Text>
            </View>
        );
    }

    //加载失败view
    renderErrorView(error) {
        return (
            <KBButton onPress={() => {
                this.setState({isLoading: true, error: false}, () => {
                    this.componentDidMount()
                });
            }}>
                <View style={{
                    height: theme.defaultContent,
                    backgroundColor: colors.white,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image resizeMode={'contain'}
                           source={require('../assets/image_wait_examine.png')}
                           style={{width: 90, height: 85}}/>
                    <Text style={{marginTop: 10, fontSize: 14}}>{error ? error : '加载失败,点击重试'}</Text>
                </View>
            </KBButton>
        );
    }

    //加载空数据view
    renderNullDataView(imagePath, title) {
        return (
            <KBButton
                onPress={() => {
                    this.setState({isLoading: true, error: false, isNullData: false}, () => {
                        this.nullDataRefresh()
                    });
                }}
                style={{flex: 1}}
            >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image resizeMode={'contain'}
                           source={imagePath ? imagePath : require('../assets/image_wait_examine.png')}
                           style={{width: 110, height: 130}}/>
                    <Text style={{
                        fontSize: 14,
                        marginTop: 20,
                        color: colors.text888
                    }}>{title? title : '暂无数据,点击刷新'}</Text>
                </View>
            </KBButton>
        );
    }

    nullDataRefresh() {
        this.componentDidMount();
    }

    renderData() {
        return (
            <View/>
        );
    }

    render() {
        let renderView;
        let containerStyle = {};
        // //第一次加载等待的view
        // if (!this.state.isConnected) {
        //     renderView = this.renderNoNetView();
        // } else

        if (this.state.isLoading && !this.state.error) {
            renderView = this.renderLoadingView();
            containerStyle = {
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: theme.isIphoneX && !this.props.isExistTabBar ? 34 : 0,
            }
        } else if (this.state.isNullData) {
            renderView = this.renderNullDataView();
        } else if (this.state.error) {
            //请求失败view
            renderView = this.renderErrorView(this.state.errorInfo);
        } else {
            renderView = this.renderData();
        }
        return (
            <Container style={[containerStyle, {
                backgroundColor: colors.empty,
                height: theme.screenHeight,
            }]}>
                {this.renderHeader()}
                <View style={{flex: 1}}>
                    {renderView}
                </View>

            </Container>
        );
    }

    renderHeader() {
        return null;
    }
}

const styles = StyleSheet.create({});
