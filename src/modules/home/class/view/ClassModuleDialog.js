import React, {Component} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import PropTypes from 'prop-types'

import colors from '../../../../constants/colors';
import theme from "../../../../constants/theme";

import KBButton from "../../../../components/KBButton";
import KBPopupDialog from "../../../../components/dialog/KBPopupDialog";

import Utils from "../../../../utils/Utils";

export default class ClassModuleDialog extends Component {

    static defaultProps = {
        dataSource: [],
        onSelect: function () {

        }
    };

    static propTypes = {
        dataSource: PropTypes.array.isRequired,
        onSelect: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.dialogWidth = theme.screenWidth - 30;
        this.dialogHeight = 140;
        this.dialogItemWidth = this.dialogWidth / this.props.dataSource.length;

    }

    render() {
        return (
            <KBPopupDialog
                ref={(c) => this.customPop = c}
                {...this.props}>
                <View style={{
                    flexDirection: 'row',
                    width: this.dialogWidth,
                    height: this.dialogHeight,
                    alignItems: 'center',
                    backgroundColor: colors.white,
                    borderRadius: 8,
                }}>
                    {this.props.dataSource.map(this.renderItem)}
                </View>
            </KBPopupDialog>
        );
    }

    renderItem = (item, index) => {
        return (
            <KBButton key={index}
                      onPress={() => {
                          this.dismiss();
                          this.props.onSelect(item, index);
                      }}
            >
                <View style={{width: this.dialogItemWidth, justifyContent: 'center', alignItems: 'center'}}>
                    <Image style={{width: 36, height: 36}}
                           resizeMode={'contain'}
                           source={item.canUse?item.icon:item.iconNot}
                    />
                    <Text style={{marginTop: 15, fontSize: 14, color: colors.text666}}>{item.title}</Text>
                </View>
            </KBButton>
        )
    };


    show = () => {
        this.customPop.show();
    };
    dismiss = () => {
        this.customPop.dismiss();
    };
};
