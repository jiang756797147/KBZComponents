import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import KBHeader from '../../components/KBHeader';
import colors from '../../constants/colors';
import ContactHomePage from './ContactHomePage';
import BaseScreen from '../../base/BaseScreen';


export default class ContactScreen extends BaseScreen {

    constructor(props) {
        super(props);
        this.reloads = [];
    }

    renderData() {
        return (
            <View style={styles.container}>
                <ContactHomePage navigation={this.props.navigation} tabLabel='学生家长'
                                 getChildReload={this.getChildReload}/>
            </View>
        );
    }

    renderHeader() {
        return <KBHeader title={'通讯录'}
                         backgroundColor={colors.yellowColor}
                         isLeft={false}
                         headerStyle={'dark'}
                         {...this.props}/>;
    }

    getChildReload = (reload) => {
        this.reloads.push(reload);
    };
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1,
    },
});
