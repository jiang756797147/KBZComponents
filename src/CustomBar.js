import KBHeader from "./KBHeader";
import React, {Component} from 'react'
import {StyleSheet, Text, View, Animated, Button, Image} from 'react-native'
import PropTypes from 'prop-types'

import TabButton from 'react-native-scrollable-tab-view/Button'
import KBButton from '../components/KBButton';
import Color from '../constants/colors'
import theme from '../constants/theme'
import Divider from "./Divider";

class CustomBar extends Component {

    static defaultProps = {
        tabBtnWidth: 90,
        tabUnderlineMarginLeft: 20,
        isHeaderBar: false,
        checkTextColor: Color.text555,
        unCheckTextColor: Color.text333,
        checkTextSize: 16,
        unCheckTextSize: 15,
        isCheckBold: true,
        underLineColor: Color.text333,
        isShowUnderDivider: false,
        rightComponent: null,
        leftComponentView: null,
        leftComponent: null,
        touchBack: null,
        headerStyle: 'dark',
        tabLock: false,
    };

    static propTypes = {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        renderTab: PropTypes.func,
        tabs: PropTypes.array,
        tabBtnWidth: PropTypes.number,
        tabUnderlineMarginLeft: PropTypes.number,
        isHeaderBar: PropTypes.bool,
        checkTextColor: PropTypes.string,
        unCheckTextColor: PropTypes.string,
        checkTextSize: PropTypes.number,
        unCheckTextSize: PropTypes.number,
        isCheckBold: PropTypes.bool,
        underLineColor: PropTypes.string,
        isShowUnderDivider: PropTypes.bool,
        rightComponent: PropTypes.any,
        leftComponentView:PropTypes.any,
        leftComponent: PropTypes.func,
        barStyle: PropTypes.object,
        touchBack: PropTypes.func,
        headerStyle: PropTypes.oneOf(['dark', 'light']),
        tabLock: PropTypes.bool,  //tab禁止切换
    };


    renderTab(name, page, isTabActive, onPressHandler) {
        return <TabButton
            style={{height: theme.withoutStatusHeight, width: this.props.tabBtnWidth}}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => {
                if (this.props.tabLock){
                    return
                }
                onPressHandler(page);
            }}
        >
            <View style={[styles.tab]}>
                <Text style={[{
                    fontFamily: 'System',
                    color: isTabActive ? this.props.checkTextColor : this.props.unCheckTextColor,
                    fontSize: isTabActive ? this.props.checkTextSize : this.props.unCheckTextSize
                }, {textAlignVertical: 'center'}, this.props.isCheckBold ? {fontWeight: isTabActive ? 'bold' : 'normal'} : {}]}>
                    {name}
                </Text>
            </View>
        </TabButton>
    }

    render() {

        return (
            <View style={this.props.barStyle}>
                {
                    this.props.isHeaderBar ?
                        <KBHeader
                            {...this.props}
                            rightStyle={{color: Color.text666, fontSize: 15, fontWeight: "400"}}
                            isLeft={false}
                            leftComponent={
                                () => {
                                    return (
                                        <View>
                                            {
                                                this.props.leftComponent ?
                                                    this.props.leftComponent()
                                                    :
                                                    <KBButton transparent onPress={() => {
                                                        if (this.props.touchBack) {
                                                            this.props.touchBack();
                                                        } else {
                                                            const {goBack} = this.props.navigation;
                                                            goBack()
                                                        }
                                                    }}>
                                                        <View style={{
                                                            alignItems:'center',
                                                            justifyContent:'center',
                                                            width: 50,
                                                            height: theme.withoutStatusHeight,
                                                        }}>
                                                            <Image
                                                                source={this.props.headerStyle === 'dark' ? require('../assets/icon_back_black.png') : require('../assets/icon_back_white.png')}
                                                                style={{
                                                                    width: 10,
                                                                    height: 15,
                                                                }}/>
                                                        </View>
                                                    </KBButton>
                                            }
                                        </View>
                                    )
                                }
                            }
                            titleComponent={() => {
                                return (
                                    <View>
                                        {this.renderTabView()}
                                    </View>
                                )
                            }}
                        />
                        :
                        this.renderTabView()
                }
            </View>

        );
    }

    renderTabView() {

        const numberOfTabs = this.props.tabs.length;
        const containerWidth = this.props.tabBtnWidth * numberOfTabs;

        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs - this.props.tabUnderlineMarginLeft * 2,
            bottom: 0,
            left: this.props.tabUnderlineMarginLeft,
        };

        const translateX = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / numberOfTabs],
        });

        return (
            <View style={[{flexDirection: 'row', alignItems: 'center',}, this.props.tabViewStyle]}>
                <View>
                    <View style={[{
                        flexDirection: "row",
                        height: theme.withoutStatusHeight,
                        width: containerWidth,
                    }]}>
                        {this.props.tabs.map((name, page) => {
                            const isTabActive = this.props.activeTab === page;
                            const renderTab = this.props.renderTab || this.renderTab.bind(this);
                            return renderTab(name, page, isTabActive, this.props.goToPage);
                        })}
                        <Animated.View
                            style={[
                                tabUnderlineStyle,
                                {
                                    transform: [
                                        {translateX},
                                    ]
                                },
                                styles.underlineStyle, {backgroundColor: this.props.underLineColor}
                            ]}
                        />
                    </View>
                    {this.props.isShowUnderDivider ? <Divider/> : null}
                </View>
                {this.props.leftComponentView && !this.props.isHeaderBar ? this.props.leftComponentView : null}
                {this.props.rightComponent && !this.props.isHeaderBar ? this.props.rightComponent : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    underlineStyle: {
        height: 2,
    }
});

export default CustomBar;
