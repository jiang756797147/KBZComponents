import React, {Component} from 'react'
import {Clipboard, Linking} from "react-native";
import ToastUtils from "./ToastUtils";
import PinYinUtils from "./PinYinUtils";

class Utils extends Component {

    static isNull(object) {
        return object === undefined || object === null || object === "";
    }

    //判断是否是空数组
    static isArrayNull(object) {
        return Object.prototype.toString.call(object) !== '[object Array]' || object.length === 0;
    }

    //判断数组中是否包含某个值
    static contains(arr, obj) {
        let i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }

    //判断数组里是否有空值
    static isArrayHasNull(array) {
        let isNull = false;
        for (let a of array) {
            if (Utils.isNull(a)) {
                isNull = true;
                return isNull;
            }
        }
        return isNull;
    }

    //判断是否是数字
    static isNumber(string) {
        let numberRegex = /^\+?[1-9][0-9]*$/;//正整数
        return numberRegex.test(string);
    }

    //判断是否是正负数  只有 - 号 需要再提交的时候判断
    static checkNumber(string) {
        const reg = /^(-)?(\d+)?$/;

        return reg.test(string);
    }

    //去掉汉字
    static removeChinese(strValue) {
        if (strValue != null && strValue != "") {
            let reg = /[\u4e00-\u9fa5]/g;
            return strValue.replace(reg, Utils.randomString());
        }
        else
            return "";
    }

    static randomString() {
        let len = 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    //生成从minNum到maxNum的随机数
    static randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }

    /**
     * 生成随机色
     */
    static getRandomColor() {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6);

    };

    static getRandomBackgroudColor() {
        let colorArray = [
            // '#D24D57',
            '#26A65B',
            '#EB7347',
            '#2C3E50',
            '#84AF9B',
            '#FC9D99',
            '#AEDD81',
            '#00CCFF',
            '#D0D0D0',
            '#A1C4FD',
            '#ACE0F9',
            '#ACCBEE',
            '#B1BAFB',
            '#C4F3FF',
            '#B9B6E5',
            // '#f56662',
            '#ff9476',
            '#8fd0c8',
            '#8fb697',
            '#009496'
        ];
        return colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    /**
     * 获取随机头像
     */
    // static getRandomAvatar() {
    //     let avatarArray = [
    //         {headUrl: require('../assets/mine/default_avator.png')},
    //         // {headUrl: require('../assets/banner_2.jpg')},
    //         // {headUrl: require('../assets/banner_3.jpg')},
    //         // {headUrl: require('../assets/avatar_4.jpeg')},
    //         // {headUrl: require('../assets/avatar_5.png')},
    //     ];
    //     return avatarArray[Math.floor(Math.random() * avatarArray.length)].headUrl;
    // }


    /**
     * 获取带加号的分数
     * @param score 分数
     * @returns {string}
     */
    static getScore(score) {
        return Utils.isNull(score) ? "+0" : parseFloat(score) >= 0 ? '+' + parseFloat(score).toFixed(1) : parseFloat(score).toFixed(1);
    }

    /**
     * 获取列表中的值,返回以","隔开的字符串
     * @param array
     * @param key
     */
    static getArrayName(array, key) {
        let str = '';
        for (let obj of array) {
            let objStr = Utils.isNull(key) ? obj : obj[key];
            str = str + (Utils.isNull(str) ? "" : ",") + objStr;
        }
        return str;
    }

    /**
     * 设置剪贴板的文本内容
     * @param str 内容
     */
    static setClipboardContent(str) {
        Clipboard.setString(str);
    }

    /**
     * 获取剪贴板的文本内容
     * @returns {*}
     */
    static getClipboardContent() {
        return Clipboard.getString();
    }

    /**
     * 跳到拨号页面
     * @param phone
     */
    static phoneCall(phone) {
        Linking.canOpenURL('tel:' + phone).then(supported => {
            if (!supported) {
                ToastUtils.showToast('操作失败,请手动复制手机号进行拨号')
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL('tel:' + phone);
            }
        }).catch(err => {
            console.error('An error occurred', err);
            ToastUtils.showToast('操作失败,请手动复制手机号进行拨号')
        });
    }

    /**
     * 获取搜索后的集合
     * @param searchText 搜索关键词
     * @param searchList  从list里搜索
     * @param listKey list里的key
     */
    static getSearchList(searchText, searchList, listKey) {
        let list = [];
        if (!Utils.isNull(searchText)) {
            if (PinYinUtils.isChina(searchText)) {
                for (let user of searchList) {
                    if (user[listKey].search(searchText) !== -1) {
                        list.push(user);
                    }
                }
            } else {
                let textPinYin = PinYinUtils.getSpell(searchText);
                for (let user of searchList) {
                    let userPinYin = PinYinUtils.getSpell(user[listKey].substr(0, 1)); // 首字母拼音
                    if (userPinYin.toUpperCase().search(textPinYin.toUpperCase()) !== -1) {
                        list.push(user);
                    }
                }
            }
            // this.searchTableViewChange(this.self.state.users);
        }
        return list;
    }

    static getStudentSex(sex) {
        switch (sex) {
            case 0:
                return '女';
            case 1:
                return '男';
            case 2:
                return '不显示性别';
            default:
                return '未知';
        }
    }

    static getNoNullText(text) {
        return Utils.isNull(text) ? '暂无' : text;
    }

    /**
     * 分组排序
     */
    static getSortData(data, key) {

        let sortObj = {};
        let keyArray = [];
        for (let obj of data) {
            if (Utils.isNull(obj[key])) {
                if (keyArray.indexOf('') == -1) {
                    keyArray.push('');
                }
            } else {
                if (keyArray.indexOf(obj[key]) == -1) {
                    keyArray.push(obj[key]);
                }
            }
        }

        // for (let obj of data){
        //     let array = [];
        //     if (Utils.isNull(obj[key])){
        //         array.push(obj);
        //     }
        //     for (let i = 0; i < keyArray.length; i ++){
        //
        //     }
        // }

        for (let i = 0; i < keyArray.length; i++) {

            sortObj[''] = [];
            sortObj[keyArray[i]] = [];
            for (let obj of data) {
                if (Utils.isNull(obj[key])) {
                    sortObj[''].push(obj);

                } else {
                    if (obj[key] == keyArray[i]) {
                        sortObj[keyArray[i]].push(obj);
                    }
                }
            }
        }

        if (Utils.isArrayNull(sortObj[''])) {
            delete sortObj[''];
        }

        return sortObj;
    };


    static getFloatScore(score) {
        if (Utils.isNull(score) || Number.isNaN(score)) {
            return 0;
        }
        return score.toFixed(1);
    }

    static getImageThumbnail() {
        return ''; // 3.0
    }

    static getImageDetail() {
        return '';  //3.0
    }


    static isNullHeader(header) {
        return Utils.isNull(header) || header.charAt(0) === '#'
    }

    static getTeacherAvatar(header, sex) {
        return Utils.isNullHeader(header) ? sex === 0 ? require('../assets/class/image_girl_tea_head.png') :
            require('../assets/class/image_boy_tea_head.png') : {uri: Utils.getImageDetail() + header}
    }

    static getMineAvatar(header, sex) {
        return Utils.isNullHeader(header) ? sex === 0 ? require('../assets/class/image_girl_tea_head.png') :
            require('../assets/class/image_boy_tea_head.png') : header?.search('file:') !== -1 ? {uri: header} :
            {uri: Utils.getImageDetail() + header}
    }

    static getStudentAvatar(header, sex) {
        return Utils.isNullHeader(header) ? sex === 0 ? require('../assets/class/image_girl_stu_head.png') :
            require('../assets/class/image_boy_stu_head.png') : {uri: Utils.getImageDetail() + header}
    }

    static getClassAvatar(header) {
        return Utils.isNullHeader(header) ? require('../assets/class/image_class_head.png') : {uri: Utils.getImageDetail() + header}
    }

    static getTeamAvatar(header) {
        return Utils.isNullHeader(header) ? require('../assets/class/image_group_head.png') : {uri: Utils.getImageDetail() + header}
    }

    /**
     * 获取表扬待改进系统头像
     */
    static getSystemAvatar(key) {
        switch (key) {
            case "#601":
                return require('../assets/systemImage/praise_image_think.png');
            case "#602":
                return require('../assets/systemImage/praise_image_cooperate.png');
            case "#603":
                return require('../assets/systemImage/praise_image_raise_hands.png');
            case "#604":
                return require('../assets/systemImage/praise_image_homework.png');
            case "#605":
                return require('../assets/systemImage/punish_image_inattention.png');
            case "#606":
                return require('../assets/systemImage/punish_image_chase.png');
            case "#607":
                return require('../assets/systemImage/punish_image_no_homework.png');
            case "#701":
                return require('../assets/systemImage/image_custom_items.png');
            default:
                return Utils.isNullHeader(key) ? require('../assets/systemImage/image_custom_items.png') : {uri: Utils.getImageThumbnail() + key};
        }
    }

    static getFamilyName(type) {
        switch (type) {
            case 0:
                return '妈妈';
            case 1:
                return '爸爸';
            case 2:
                return '爷爷';
            case 3:
                return '奶奶';
            case 4:
                return '家长';
        }
    }

    /**
     * 手机号验证
     * @param num
     * @return {boolean}
     */
    static isPhoneNum(num) {
        // let reg = /^((13[0-9])|(14[0,1,4-9])|(15[0-9])|(16[5,6])|(17[0-8])|(18[0-9])|198|199)\d{8}$/;
        let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
        return reg.test(num);
    }

    /**
     * 身份证号验证
     * @param num
     * @return {boolean}
     */
    static isIDCard(num) {
        let reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        return reg.test(num);
    }

    static getMessageTitle(type) {
        switch (type) {
            case 0:
                return "公告消息";
            case 1:
                return "作业消息";
            case 2:
                return "提示消息";
            case 3:
                return "审批消息";
            case 4:
                return "验证消息";
        }
    }

    static getWeekWithChinese(week) {
        week = parseInt(week, 10);
        switch (week) {
            case 0:
                return "一";
            case 1:
                return "二";
            case 2:
                return "三";
            case 3:
                return "四";
            case 4:
                return "五";
            case 5:
                return "六";
            case 6:
                return "日";
            default:
                return "";
        }
    }

    /**
     * 网址验证
     * @param url
     * @return {boolean}
     */
    static isURL(url) {
        let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/;
        return reg.test(url);
    }

    static getSortDataByKey(data, key, sortKey) {
        let sortObj = {};

        let noKeyArray = [];
        let hasKeyArray = [];
        let keyArray = [];
        for (let obj of data) {
            if (Utils.isNull(obj[key])) {
                noKeyArray.push(obj);
            } else {
                hasKeyArray.push(obj);
                if (!keyArray.find((keyObj) => keyObj.id === obj[key])) {
                    keyArray.push({
                        id: obj[key],
                        sort: obj[sortKey]
                    });
                }
            }
        }

        keyArray.sort((a, b) => {
            return a.sort - b.sort;
        });

        if (!Utils.isArrayNull(noKeyArray)) {
            keyArray.push({
                id: '',
                sort: ''
            });
        }
        for (let i = 0; i < keyArray.length; i++) {
            if (keyArray[i].id === '') {
                sortObj[''] = noKeyArray;
            } else {
                sortObj[keyArray[i].id] = [];
                for (let obj of hasKeyArray) {
                    if (obj[key] === keyArray[i].id) {
                        sortObj[keyArray[i].id].push(obj);
                    }
                }
            }
        }
        return sortObj;
    };
}

export default Utils;
