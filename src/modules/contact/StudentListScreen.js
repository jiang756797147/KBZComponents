import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import BaseScreen from '../../base/BaseScreen';
import KBHeader from '../../components/KBHeader';
import theme from '../../constants/theme';
import colors from '../../constants/colors';
import fetchUrl from '../../constants/fetchUrl';
import Utils from '../../utils/Utils';

import ContactList from './view/ContactList';


export default class StudentListScreen extends BaseScreen {

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.classId = params.classId;
        this.isMaster = Utils.isNull(params.isMaster) ? false : params.isMaster;
        this.refreshClassEdit = params.refreshData;
        this.state = Object.assign({
            data: [],
            isEdit: false,
            isRefreshing: false,
            attributes: [
                {key: 'isShowPhone', value: false},
            ],
        }, this.state);
    }


    getApiUrl() {
        return fetchUrl.getClassStudentList + 'classIds=' + this.classId;
    }

    onSuccess(responseData) {
        for (let item of responseData.data) {
            item.headerUrl = Utils.getStudentAvatar(item.header, item.sex);
        }
        this.setState({data: responseData.data});
        if (!Utils.isNull(this.refreshClassEdit)) {
            this.refreshClassEdit();
        }
    }

    onEnd() {
        super.onEnd();
        this.setState({isRefreshing: false});
    }

    renderData() {
        return (
            <ContactList listData={this.state.data}
                         letterTop={theme.headerHeight}
                         customAttribute={this.state.attributes}
                         isRefreshing={this.state.isRefreshing}
                         refresh={() => this.onRefresh()}
                         itemClick={this.itemClick}
                         listKey={'name'}/>
        );
    }

    renderHeaderRight() {
        return (
            <View>
                <Image source={require('../../assets/icon_add.png')}
                       style={{width: 25, height: 25}}
                       resizeMode={'contain'}/>
            </View>
        );
    }

    render() {
        let renderView = super.render();
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <KBHeader isLeft={true} {...this.props} title={'学生列表'}
                          rightComponent={this.isMaster ? this.renderHeaderRight : null}
                          touchRight={() => {
                              navigate('AddStudent', {classId: this.classId, onRefresh: this.onRefresh});
                          }}/>
                {renderView}
            </View>
        );
    }

    itemClick = (student) => {
        const {navigate} = this.props.navigation;
        navigate('StudentInfoNew', {student: student, isMaster: this.isMaster, backRefresh: this.onRefresh});
    };

    onRefresh = () => {
        this.setState({isRefreshing: true});
        super.componentDidMount();
    };
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1,
    },
});