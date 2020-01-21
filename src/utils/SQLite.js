import React, {Component} from 'react';
import {
    ToastAndroid,
    DeviceEventEmitter,
} from 'react-native';
import Utils from './Utils';
import PropTypes from 'prop-types';
import SQLiteStorage from 'react-native-sqlite-storage';
import {UPDATE_OPTION} from "../constants/notify";

SQLiteStorage.DEBUG(false);
let database_name = "test.db";//数据库文件
let database_version = "1.0";//版本号
let database_displayname = "MySQLite";
let database_size = -1;//-1应该是表示无限制
let db;

export default class SQLite extends Component {

    componentWillUnmount() {
        if (db) {
            this._successCB('close');
            db.close();
        } else {
            console.log("SQLiteStorage not open");
        }
    }

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.state);

        this.eventEmitter = DeviceEventEmitter;
    }

    open() {
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            () => {
                this._successCB('open');
            },
            (err) => {
                this._errorCB('open', err);
            });
        return db;
    }

    createTable(tableName, sql) {
        if (!db) {
            this.open();
        }
        //创建用户表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS' + tableName + '('
                + sql
                + ')'
                , [], () => {
                    this._successCB('建表');
                }, (err) => {
                    this._errorCB('executeSql', err);
                });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
    }

    /**
     * 创建回执单表
     *
     */
    createReceiptTable(){
        if(!db){
            this.open();
        }
        //创建回执单表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS RECEIPTTABLE (' +
                'id VARCHAR,' +
                'teacherId VARCHAR,' +
                'classId VARCHAR,' +
                'type INTEGER,' +
                'entryType INTEGER,' +
                'sort INTEGER)', [], () => {
                this._successCB('创建排序表');
            }, (err) => {
                this._errorCB('executeSql', err);
            });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })


    }

    /**
     * 向表中添加回执表单数据
     */
    insertReceiptTable(data){
        let len = data.length;
        if(!db){
                this.open();
            }
            this.createReceiptTable();
        db.transaction((tx)=>{
            for(let i=0; i<len; i++){
                let user = data[i];
                let name= user.name;
                let age = user.age;
                let sex = user.sex;
                let phone = user.phone;
                let email = user.email;
                let qq = user.qq;
                let sql = "INSERT INTO user(name,age,sex,phone,email,qq)"+
                    "values(?,?,?,?,?,?)";
                tx.executeSql(sql,[name,age,sex,phone,email,qq],()=>{

                    },(err)=>{
                        console.log(err);
                    }
                );
            }
        },(error)=>{
            this._errorCB('transaction', error);
            // ToastAndroid.show("数据插入失败",ToastAndroid.SHORT);
        },()=>{
            this._successCB('transaction insert data');
            // ToastAndroid.show("成功插入 "+len+" 条用户数据",ToastAndroid.SHORT);
        });

    }

    /**
     * 查询回执单表中的数据
     */



    /**
     * 创建排序表
     *
     * @param id  === optionId
     * @param classId       班级ID
     * @param teacherId     教师ID
     * @param type          事项类型     0 表扬  1 待改进
     * @param pid           事项分类ID
     * @param ertryType     排序分类     0 学生排序  1 小组排序  -1 全部排序
     * @param sort          序号
     */
    createSortTable() {
        if (!db) {
            this.open();
        }
        //创建用户表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS SORTTABLE (' +
                'id VARCHAR,' +
                'teacherId VARCHAR,' +
                'classId VARCHAR,' +
                'type INTEGER,' +
                'entryType INTEGER,' +
                'sort INTEGER)', [], () => {
                this._successCB('创建排序表');
            }, (err) => {
                this._errorCB('executeSql', err);
            });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
    }

    /**
     * 创建事项表
     * @param id === optionId
     * @param createBy   创建者
     * @param header     头像
     * @param kindType   事项分类适用 0 学生 1 小组 2 全部 3 自定义 4 家长端
     * @param name       事项名称
     * @param pid        事项分类ID
     * @param score      事项分数
     * @param type       加减分事项  0 表扬  1 待改进
     */
    createOptionTable() {
        if (!db) {
            this.open();
        }
        //创建用户表
        db.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS OPTIONTABLE (' +
                'id VARCHAR,' +
                // 'entryType INTEGER,' +
                'createBy VARCHAR,' +
                'header VARCHAR,' +
                'kindType INTEGER,' +
                'name VARCHAR,' +
                'pid VARCHAR,' +
                'score INTEGER,' +
                'type INTEGER' +
                ')', [], () => {
                this._successCB('创建事项表');
            }, (err) => {
                this._errorCB('executeSql', err);
            });
        }, (err) => {//所有的 transaction都应该有错误的回调方法，在方法里面打印异常信息，不然你可能不会知道哪里出错了。
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('transaction');
        })
    }

    /**
     * 查询数据排序
     * @param teacherId  教师ID
     * @param classId    班级ID
     * @param type       事项类型     0 表扬  1 待改进
     * @param kindType   事项适用类型  0 学生  1 小组 2 全部  3 自定义  4 家长端
     * @param entryType  排序事项显示入口  0 学生 1 小组  -1 全部
     */
    select(teacherId, classId, type, entryType, callBack) {

        if (!db) {
            this.open();
        }
        let selectArray = [];
        let kindTypeSql = "";
        switch (entryType){
            case 0:
                kindTypeSql = '(option.kindType = 0 or option.kindType = 2)';
                break;
            case 1:
                kindTypeSql = '(option.kindType = 1 or option.kindType = 2)';
                break;
            case -1:
                kindTypeSql = 'option.kindType < 3 ';
                break;
        }
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT' +
                ' option.createBy AS createBy,' +
                // ' option.entryType AS entryType,' +
                ' option.header AS header,' +
                ' option.id AS id,' +
                ' option.kindType AS kindType,' +
                ' option.name AS name,' +
                ' option.pid AS pid,' +
                ' option.score AS score,' +
                ' option.type AS type,' +
                ' b.teacherId AS teacherId,' +
                ' b.classId AS classId,' +
                ' b.sort AS sort' +
                ' FROM OPTIONTABLE option' +
                // '(SELECT * FROM OPTIONTABLE option' +
                // ' WHERE option.type = ' + type +
                // ' AND option.entryType = ' + entryType +
                // ') AS a' +
                ' LEFT JOIN' +
                ' (SELECT * FROM SORTTABLE sort' +
                ' WHERE sort.teacherId = "' + teacherId + '"' +
                ' AND sort.classId = "' + classId + '"' +
                ' AND sort.type = ' + type +
                ' AND sort.entryType = ' + entryType +
                ') AS b' +
                ' ON option.id = b.id' +
                ' WHERE option.type = ' + type +
                ' AND ' + kindTypeSql +
                ' ORDER BY ifNULL (b.sort, 10000)', [], (tx, results) => {
                    let len = results.rows.length;
                    for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        if (!Utils.isNull(row.id)) {
                            selectArray.push(row);
                        }
                        // console.log("查询数据00000000000", row);
                        // console.log(`Employee name: ${row.name}`);
                    }
                    if (Utils.isArrayNull(selectArray)) {
                        callBack.onNullData(selectArray);
                    } else {
                        callBack.onSuccess(selectArray);
                    }
                    // if (callback.onEnd)
                    //     callback.onEnd();
                });
        }, (error) => {
            this._errorCB('transaction数据查询失败', error);
            // ToastUtils.showToast("数据查询失败");
        }, () => {
            this._successCB('transaction select data成功查询数据');
            // ToastUtils.showToast("成功查询数据");
        });
    }


    /**
     * 排序表新增数据
     * @param data
     * @param teacherId
     * @param type         事项类型     0 表扬  1 待改进
     * @param pid
     * @param entryType
     * @param optionId
     * @param sort
     * @param classId
     */
    insertSortData(data, callBack) {
        let len = data.length;
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            for (let i = 0; i < len; i++) {
                let obj = data[i];
                let id = obj.id;
                let teacherId = obj.teacherId;
                let classId = obj.classId;
                let type = obj.type;
                let entryType = obj.entryType;
                let sort = obj.sort;
                let sql = "INSERT INTO SORTTABLE(id,teacherId,classId,type,entryType,sort)" +
                    "values(?,?,?,?,?,?)";
                tx.executeSql(sql, [id, teacherId, classId, type, entryType, sort], () => {

                    }, (err) => {
                        // console.log(err);
                    }
                );
            }
        }, (error) => {
            this._errorCB('transaction排序数据插入失败', error);
            // ToastUtils.showToast("数据插入失败");
        }, () => {
            this._successCB('transaction insert data 成功插入' + len + '排序数据');
            // ToastUtils.showToast("成功插入数据");
            callBack();
            this.eventEmitter.emit(UPDATE_OPTION, "refresh");
        });
    }

    /**
     * 事项表新增数据
     * optionId,config,createBy,header,kindType,name,pid,score,type
     */
    insertOptionData(data) {
        let len = data.length;
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            for (let i = 0; i < len; i++) {
                let obj = data[i];
                let id = obj.id;
                let createBy = obj.createBy;
                let header = obj.header;
                let kindType = obj.kindType;
                let name = obj.name;
                let pid = obj.pid;
                let score = obj.score;
                let type = obj.type;
                let sql = "INSERT INTO OPTIONTABLE(id,createBy,header,kindType,name,pid,score,type)" +
                    "values(?,?,?,?,?,?,?,?)";
                tx.executeSql(sql, [id, createBy, header, kindType, name, pid, score, type], () => {

                    }, (err) => {
                        console.log(err);
                    }
                );
            }

        }, (error) => {
            this._errorCB('transaction事项数据插入失败', error);
            // ToastUtils.showToast("数据插入失败");
        }, () => {
            this._successCB('transaction insert data 成功插入' + len + '条事项数据');
            // ToastUtils.showToast("成功插入 "+len+" 条用户数据");
            this.eventEmitter.emit(UPDATE_OPTION, "refresh");
        });
    }

    /**
     * 删出所有数据
     */

    deleteAllData(tableName) {
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            tx.executeSql('delete from ' + tableName, [], () => {

            });
        }, (error) => {
            this._errorCB('transaction数据删除全部失败', error);
            // ToastUtils.showToast("数据删除失败");
        }, () => {
            this._successCB('transaction delete data删除全部成功');
            // ToastUtils.showToast("删除成功");
            this.eventEmitter.emit(UPDATE_OPTION, "refresh");
        });
    }

    /**
     * 删除当前排序数据
     * @param teacherId
     * @param entryType
     * @param optionId
     */
    deleteSortData(teacherId, classId, entryType, type) {
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            tx.executeSql('delete from SORTTABLE' +
                ' WHERE teacherId = "' + teacherId + '"' +
                ' AND classId = "' + classId + '"' +
                ' AND entryType=' + entryType +
                ' AND type=' + type
                , [], () => {
                });
        }, (error) => {
            this._errorCB('transaction 排序数据删除失败', error);
            // ToastUtils.showToast("数据删除失败");
        }, () => {
            this._successCB('transaction delete data 排序数据删除成功');
            // ToastUtils.showToast("删除成功");
            this.eventEmitter.emit(UPDATE_OPTION, "refresh");
        });
    }

    /**
     * 根据字段删除事项数据
     * @param value  int
     *
     */
    deleteOption(key, value) {
        if (!db) {
            this.open();
        }

        db.transaction((tx) => {
            tx.executeSql('delete from OPTIONTABLE WHERE ' + key + " = '" + value + "'", [], () => {

            })

        }, (error) => {
            this._errorCB('transaction 事项删除' + key + '字段失败', error);
            // ToastUtils.showToast("数据删除失败");
        }, () => {
            this._successCB('transaction delete data 删除' + key + '字段事项成功');
            this.eventEmitter.emit(UPDATE_OPTION, "refresh");
        });
    }

    /**
     * 删除事项单条数据
     * @param optionId
     */
    deleteSingleOption(optionId) {
        if (!db) {
            this.open();
        }

        db.transaction((tx) => {
            tx.executeSql('delete from OPTIONTABLE WHERE id = "' + optionId + '"', [], () => {

            })

        }, (error) => {
            this._errorCB('transaction 事项删除失败', error);
            // ToastUtils.showToast("数据删除失败");
        }, () => {
            this._successCB('transaction delete data 事项删除成功');
            // ToastUtils.showToast("删除成功");
            this.eventEmitter.emit(UPDATE_OPTION, "refresh");
        });
    }

    /**
     * 删除事项多条数据
     * @param optionId
     */
    deleteOptionData(data) {
        let len = data.length;
        if (!db) {
            this.open();
        }

        db.transaction((tx) => {

            for (let i = 0; i < len; i++) {
                let obj = data[i];
                let id = obj.id;
                tx.executeSql('delete from OPTIONTABLE WHERE id = "' + id + '"', [], () => {

                }, (err) => {
                    console.log("11111111111")
                });
            }

        }, (error) => {
            this._errorCB('transaction 事项删除失败', error);
            // ToastUtils.showToast("数据删除失败");
        }, () => {
            this._successCB('transaction delete data 事项删除成功');
            // ToastUtils.showToast("删除成功");
            this.eventEmitter.emit(UPDATE_OPTION, "refresh");
        });
    }

    // 删除表
    dropTable(tableName) {
        if (!db) {
            this.open();
        }
        db.transaction((tx) => {
            tx.executeSql('drop table ' + tableName, [], () => {

            });
        }, (err) => {
            this._errorCB('transaction', err);
        }, () => {
            this._successCB('删除表');
        });
    }

    close() {
        if (db) {
            this._successCB('close');
            db.close();
        } else {
            console.log("SQLiteStorage not open");
        }
        db = null;
    }

    _successCB(name) {
        // console.log("SQLiteStorage "+name+" success");
    }

    _errorCB(name, err) {
        // console.log("SQLiteStorage "+name);
        // console.log(err);
    }

    render() {
        return null;
    }
};