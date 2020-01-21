import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Button} from 'native-base';
import {View, Text, Image} from 'react-native';

import theme from '../constants/theme';

class KBHeader extends Component {

    static defaultProps = {
        isLeft: false,
        headerStyle: 'dark',

        touchBack: null,
        touchRight: null,

        leftComponent: null,
        titleComponent: null,
        rightComponent: null,

        backgroundColor: '#fff',
        rightStyle: {},

        showDriver: true,
        driverColor: '#F4F4F4',
        containsStatusBar: true,
    };

    static propTypes = {
        isLeft: PropTypes.bool,
        headerStyle: PropTypes.oneOf(['dark', 'light']),

        touchBack: PropTypes.func,
        touchRight: PropTypes.func,

        title: PropTypes.string,
        rightText: PropTypes.string,
        rightStyle: PropTypes.object,
        backgroundColor: PropTypes.string,


        titleComponent: PropTypes.func,
        rightComponent: PropTypes.func,
        leftComponent: PropTypes.func,

        showDriver: PropTypes.bool,
        driverColor: PropTypes.string,
        containsStatusBar: PropTypes.bool,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[theme.navigatorStyle, {
                backgroundColor: this.props.backgroundColor,
                borderBottomWidth: this.props.showDriver ? 0.7 : 0,
                borderBottomColor: this.props.driverColor,
                height: this.props.containsStatusBar ? theme.headerHeight : theme.withoutStatusHeight,
            }, this.props.style]}>
                {
                    this.props.isLeft ?
                        <Button transparent onPress={() => {
                            if (this.props.touchBack) {
                                this.props.touchBack();
                            } else {
                                const {goBack} = this.props.navigation;
                                goBack();
                            }
                        }} style={{
                            position: 'absolute',
                            left: 0,
                            width: 50,
                            height: theme.withoutStatusHeight,
                            top: this.props.containsStatusBar ? theme.statusHeight : 0,
                        }}>
                            <Image
                                source={this.props.headerStyle === 'dark' ? require('../assets/componentImages/icon_back_black.png') : require('../assets/componentImages/icon_back_white.png')}
                                style={{
                                    marginLeft: 20,
                                    width: 10,
                                    height: 15,
                                }}/>
                        </Button> :
                        null
                }
                {
                    this.props.leftComponent ?
                        <View style={{
                            position: 'absolute',
                            left: 0,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            top: this.props.containsStatusBar ? theme.statusHeight : 0,
                            height: theme.withoutStatusHeight,
                        }}>
                            {this.props.leftComponent()}
                        </View>
                        :
                        null
                }
                <View style={{
                    marginTop: this.props.containsStatusBar ? theme.statusHeight : 0,
                    width: theme.screenWidth - (this.props.leftComponent ? 200 : 100),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {
                        this.props.titleComponent ?
                            this.props.titleComponent() :
                            <Text style={{
                                fontSize: 17,
                                color: this.props.headerStyle === 'dark' ? 'black' : 'white',
                            }}>{this.props.title ? this.props.title : null}</Text>
                    }
                </View>

                {this.props.rightText || this.props.rightComponent ?
                    <Button transparent style={{
                        position: 'absolute',
                        right: 0,
                        paddingHorizontal: 15,
                        top: this.props.containsStatusBar ? theme.statusHeight : 0,
                        height: theme.withoutStatusHeight,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} onPress={() => {
                        if (this.props.touchRight) {
                            this.props.touchRight();
                        }
                    }}>
                        {this.props.rightComponent && this.props.rightComponent() ?
                            this.props.rightComponent()
                            :
                            this.props.rightText ?
                                <Text style={[{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                }, this.props.rightStyle]}>{this.props.rightText}</Text>
                                :
                                null
                        }
                    </Button>
                    :
                    null
                }
            </View>
        );
    }
}

export default KBHeader;
