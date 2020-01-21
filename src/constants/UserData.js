import StorageUtils from "../utils/StorageUtils";
import Toast from 'react-native-root-toast';
import Utils from "../utils/Utils";
import DialogUtils from "../utils/DialogUtils";

let instance = null;
export default class UserData {

    constructor() {
        this.mineDataListners = [];
    }

    static getInstance() {
        if (Utils.isNull(instance)) {
            instance = new UserData();
            this.studentsListeners = [];
            this.mineDataListners = [];
        }
        return instance;
    }

    saveData(userData) {
        this.setId(userData.id);
        this.setSn(userData.sn);
        this.setUserData(userData);
        this.setAppId(userData.appId);
        this.setPushType(userData.pushType);
        if (!Utils.isNull(userData.token)) {
            StorageUtils._sava("token", userData.token);
            this.setToken(userData.token)
        }
    }

    setPushType(type){
        this.pushType=type;
    }

    getPushType(){
        return this.pushType;
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setSn(sn) {
        this.sn = sn;
    }

    getSn() {
        return this.sn;
    }

    setAppId(appId) {
        this.appId = appId;
    }

    getAppId() {
        return this.appId;
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    setClassIds(classIds) {
        this.classIds = classIds;
    }

    getClassIds() {
        return this.classIds;
    }

    // setClassConfig(classConfig){
    //     this.classConfig = classConfig;
    // }
    // getClassConfig() {
    //     return this.classConfig;
    // }

    setClass(classData) {
        this.classData = classData;
    }

    getClass() {
        return this.classData
    }


    registerUserDataListener(listener) {
        this.mineDataListners.push(listener)
    }

    unRegisterUserDataListener(listener) {
        let index = -1;
        for (let i in this.mineDataListners) {
            if (listener === this.mineDataListners[i])
                index = i;
        }
        if (index >= 0) {
            this.mineDataListners.remove(index);
        }
    }

    setUserData(userData) {
        this.userData = userData;
    }

    setUserDataAndRefresh(userData) {
        this.userData = userData;
        for (let listener of this.mineDataListners) {
            if (!Utils.isNull(listener)) {
                listener();
            }
        }
    }

    getUserData() {
        return this.userData;
    }

    setUuid(uuid) {
        this.uuid = uuid;
    }
    getUuid() {
        return this.uuid;
    }

    setOrgCode(orgCode) {
        this.orgCode = orgCode;
    }
    getOrgCode() {
        return this.orgCode;
    }

    setUserName(userName) {
        this.userName = userName;
    }
    getUserName() {
        return this.userName;
    }

    setPassword(password) {
        this.password = password;
    }
    getPassword() {
        return this.password;
    }

    setScoreFilter(filter) {
        this.scoreFilter = filter;
    }
    getScoreFilter() {
        return this.scoreFilter;
    }

}

