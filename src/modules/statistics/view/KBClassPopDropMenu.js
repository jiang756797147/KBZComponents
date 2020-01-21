import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, SectionList} from 'react-native';
import PropTypes from 'prop-types';
import {renderers} from '../../../components/popMenu/src';
import theme from '../../../constants/theme';
import Menu from 'react-native-popup-menu/src/Menu';
import MenuTrigger from 'react-native-popup-menu/src/MenuTrigger';
import MenuOptions from 'react-native-popup-menu/src/MenuOptions';
import MenuOption from 'react-native-popup-menu/src/MenuOption';
import Utils from '../../../utils/Utils';

export default class KBClassPopDropMenu extends Component {


    static defaultProps = {
        dropDownView: function () {
        },
        onOpen: function () {
        },
        onClose: function () {
        },
        dataArray: [],
        renderer: renderers.ContextMenu1,
    };

    static propTypes = {
        dropDownView: PropTypes.func,
        btnForScreenStyle: PropTypes.any,
        menuStyle: PropTypes.any,
        optionsStyle: PropTypes.object,
        optionStyle: PropTypes.object,
        textStyle: PropTypes.object,
        dataArray: PropTypes.array,
        onSelect: PropTypes.func,
        renderer: PropTypes.oneOf([renderers.ContextMenu, renderers.ContextMenu1, renderers.SlideInMenu, renderers.NotAnimatedContextMenu, renderers.Popover, renderers.PopoverNew]),
        rendererProps: PropTypes.any,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        uniqueKey: PropTypes.string,
        MenuOption: PropTypes.oneOf(['option', 'section']),
    };

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Menu style={[styles.dropDown]} renderer={this.props.renderer}
                  onOpen={this.props.onOpen}
                  onClose={this.props.onClose}
                  onSelect={(value) => this.props.onSelect(value)}
                  rendererProps={this.props.rendererProps}>
                <MenuTrigger style={[styles.btnForScreen, this.props.btnForScreenStyle]}>
                    {this.props.dropDownView()}
                </MenuTrigger>
                <MenuOptions optionsContainerStyle={[styles.dropDownOptions, this.props.optionsStyle]}>
                    {this.props.dataArray.map((item, index, data) => {
                        let value = {item: item, index: index, data: data};
                        return (
                            <MenuOption key={index} value={value} style={[styles.dropDownItems]}>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image style={{width: 30, height: 30}} source={Utils.getClassAvatar(item.header)}/>
                                    <Text style={{marginLeft: 10}}>
                                        {item.name}
                                    </Text>
                                </View>
                            </MenuOption>
                        );
                    })}
                </MenuOptions>


            </Menu>
        );

    }

}

const styles = StyleSheet.create({
    dropDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnForScreen: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDownOptions: {
        width: theme.screenWidth,
    },
    dropDownItems: {
        height: 40,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropDownItemText: {
        fontSize: 13,
    },
});
