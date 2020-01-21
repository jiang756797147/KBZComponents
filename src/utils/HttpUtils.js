import React, {Component} from 'react'
import {NetInfo, DeviceEventEmitter} from 'react-native';
import moment from "moment"
import fetchUrl from '../constants/fetchUrl'
import { HTTP_NOTIFY } from '../constants/notify'
import StorageUtils from "./StorageUtils";
import DialogUtils from "./DialogUtils";
import Utils from "./Utils";
import ToastUtils from "./ToastUtils";


let beginTime, endTime;
class HttpUtils extends Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.state);
    }

    static doRequest(requestMeched, url, parameter, callback, baseUrl, hidProgress) {

        let uri;
        let httpBaseUrl = Utils.isNull(baseUrl) ? fetchUrl.baseUrl : baseUrl;
        if (requestMeched == 'POST') {
            console.log("请求参数", parameter);
        }
        console.log(">>>>>>>>发起" + requestMeched + "请求", httpBaseUrl + url);
        if (requestMeched == "GET") {
            uri = fetch(httpBaseUrl + url);
            // callback = parameter;
        } else {
            uri = fetch(httpBaseUrl + url, {
                method: "POST",
                body: parameter
            });
        }
        beginTime = moment().format('x');
        uri.then((response) => response.json())
            .then((responseData) => {

                endTime = moment().format('x');
                setTimeout(() => {
                    if (requestMeched == 'POST' && !hidProgress) {
                        DialogUtils.getInstance().hideProgress();
                    }
                    console.log(">>>>>>>>请求结果 ", responseData);
                    if ((responseData.code === 1001 || responseData.code === 3001) && callback.onSuccess) { // 3001第三方绑定多个账号
                        callback.onSuccess(responseData);
                    }
                    else if ((responseData.code === 1007 || responseData.code === 1008 || responseData.code === 1009)) { //1007 token不存在  1008 token失效  1009 多人登陆
                        DialogUtils.getInstance().showLoginDialog();
                        DeviceEventEmitter.emit(HTTP_NOTIFY, responseData.message)
                        // callback.onFail(responseData);
                    } else if (responseData.code === 1002 && callback.onFail) { //访问错误
                        callback.onFail(responseData);
                    } else if (responseData.code === 1003 && callback.onNullData) {  //空数据
                        callback.onNullData(responseData);
                    } else if (callback.onFail)
                        callback.onFail(responseData);

                    if (callback.onEnd)
                        callback.onEnd();
                }, Math.max(0, 500 - (parseInt(endTime) - parseInt(beginTime))))
            })
            .catch((error) => {
                endTime = moment().format('x');
                setTimeout(function () {
                    DialogUtils.getInstance().hideProgress();
                    if (callback.onError) {
                        callback.onError("网络请求失败 o(╥﹏╥)o");
                        console.log(error);
                    }

                    if (callback.onEnd)
                        callback.onEnd();
                }, Math.max(0, 500 - (parseInt(endTime) - parseInt(beginTime))))
            })
            .done();
    }

    static doGet(url, callback, baseUrl) {
        // console.log("GET baseUrl ============", baseUrl);
        HttpUtils.doRequest("GET", url, null, callback, baseUrl);
    }

    static doPost(url, parameter, callback, baseUrl, hidProgress) {
        // console.log("POST baseUrl ============", baseUrl);
        if (!hidProgress) {
            DialogUtils.getInstance().showProgress();
        }
        HttpUtils.doRequest('POST', url, parameter, callback, baseUrl, hidProgress);
    }

    static doGetWithToken(url, callback, baseUrl) {
        // console.log("GET token baseUrl ============", baseUrl);
        HttpUtils.doRequestWithToken('GET', url, null, callback, baseUrl);
    }

    static doPostWithToken(url, parameter, callback, baseUrl, hidProgress) {
        // console.log("POST token baseUrl ============", baseUrl);
        HttpUtils.doRequestWithToken('POST', url, parameter, callback, baseUrl, hidProgress);
    }

    static doRequestWithToken(requestMeched, url, parameter, callback, baseUrl, hidProgress) {
        // console.log("request token baseUrl111 ============", baseUrl);
        StorageUtils._load("token", function (data) {
            // console.log("request token baseUrl ============", baseUrl);
            if (requestMeched == 'GET') {
                url = url + "&token=" + data;
                HttpUtils.doGet(url, callback, baseUrl);
            } else {
                parameter.append("token", data);
                HttpUtils.doPost(url, parameter, callback, baseUrl, hidProgress);
            }

        }, function (error) {
            // callback = parameter;
            if (callback.onError) {
                callback.onError(error.name);
            }
            if (callback.onEnd) {
                callback.onEnd();
            }
        });
    }
}
export default HttpUtils;
