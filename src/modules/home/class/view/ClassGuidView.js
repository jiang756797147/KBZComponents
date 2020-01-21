import React, {Component} from 'react';
import {Button} from 'native-base';
import {View, Text, Image} from 'react-native';
import PropTypes from 'prop-types'

import theme from "../../../../constants/theme";
import KBPopupDialog from "../../../../components/dialog/KBPopupDialog";

export default class ClassGuidView extends Component {

    static defaultProps = {
        onSelect: function () {

        },
        onCancel: function () {

        },
        guidType: 'pk'
    };

    static propTypes = {
        onSelect: PropTypes.func,
        onCancel: PropTypes.func,
        guidType: PropTypes.oneOfType(['pk', 'board']),
    };

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <KBPopupDialog
                ref={(c) => this.customPop = c}
                {...this.props}>
                {this.props.guidType === 'pk' ?
                    this.renderPKOverlayView()
                    :
                    this.renderBoardOverlayView()
                }
            </KBPopupDialog>
        );
    }


    renderBoardOverlayView() {
        return (
            <View style={{
                width: theme.screenWidth,
                height: theme.screenHeight,
            }}>
                <Image style={{
                    position: 'absolute',
                    top: theme.headerHeight + 90,
                    right: (theme.screenWidth - 277) / 2,
                    width: 277,
                    height: 84,
                }} source={require('../../../../assets/image3.3/class/class_guid_content.png')}/>

                <Button transparent style={{
                    position: 'absolute',
                    top: theme.headerHeight + 90 + 120,
                    left: (theme.screenWidth - 168) / 2
                }}
                        onPress={() => {
                            this.dismiss();
                            this.props.onSelect();
                        }}
                >
                    <Image style={{width: 168, height: 35,}}
                           source={require('../../../../assets/image3.3/class/class_active_btn.png')}
                    />
                </Button>
                <Button transparent style={{
                    position: 'absolute',
                    top: theme.headerHeight + 90 + 120 + 35 + 80,
                    left: (theme.screenWidth - 120) / 2
                }}
                        onPress={() => {
                            this.dismiss();
                            this.props.onCancel();
                        }}
                >
                    <Image style={{width: 120, height: 88,}}
                           resizeMode={'contain'}
                           source={require('../../../../assets/image3.3/class/class_guid_alert.png')}
                    />
                </Button>
            </View>
        )
    }

    renderPKOverlayView() {
        return (
            <View style={{
                width: theme.screenWidth,
                height: theme.screenHeight,
            }}>
                <Image style={{
                    position: 'absolute',
                    top: theme.statusHeight,
                    right: 50,
                    width: 40,
                    height: 40,
                }} source={require('../../../../assets/image3.3/class/class_active_add.png')}/>
                <View style={{
                    position: 'absolute',
                    top: theme.headerHeight,
                    right: 50,
                    width: 90,
                    height: 90,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Image style={{
                        width: 52,
                        height: 62,
                    }} source={require('../../../../assets/image3.3/class/class_active_arrow.png')}/>
                </View>

                <Image style={{
                    position: 'absolute',
                    top: theme.headerHeight + 90,
                    right: (theme.screenWidth - 277) / 2,
                    width: 277,
                    height: 84,
                }} source={require('../../../../assets/image3.3/class/class_active_content.png')}/>

                <Button transparent style={{
                    position: 'absolute',
                    top: theme.headerHeight + 90 + 120,
                    left: (theme.screenWidth - 168) / 2
                }}
                        onPress={() => {
                            this.dismiss();
                            this.props.onSelect();
                        }}
                >
                    <Image style={{width: 168, height: 35,}}
                           source={require('../../../../assets/image3.3/class/class_active_btn.png')}
                    />
                </Button>
            </View>
        )
    }

    show = () => {
        this.customPop.show();
    };
    dismiss = () => {
        this.customPop.dismiss();
    };
};
