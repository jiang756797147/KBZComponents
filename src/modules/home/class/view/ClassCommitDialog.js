import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';
import {Tab, Tabs, TabHeading} from 'native-base';
import PropTypes from 'prop-types';
import theme from '../../../../constants/theme';
import colors from '../../../../constants/colors';
import image from '../../../../constants/image';
import Utils from '../../../../utils/Utils';
import KBButton from '../../../../components/KBButton';
import KBPolygonImage from '../../../../components/KBPolygonImage';
import CircleImage from '../../../../components/CircleImage';
import TextInputWithClear from '../../../../components/TextInputWithClear';
import KBScrollView from '../../../../components/KBScrollView';
import KBSourceView from '../../../../components/KBSourceView';


import Menu from 'react-native-popup-menu/src/Menu';
import MenuTrigger from 'react-native-popup-menu/src/MenuTrigger';
import MenuOptions from 'react-native-popup-menu/src/MenuOptions';


import {UPDATE_OPACITY} from '../../../../constants/notify';

export default class ClassCommitDialog extends Component {

    mainWidth = 0.9 * theme.screenWidth;
    mainHeight = 0.6 * theme.screenHeight;

    tabs = [
        {name: '表扬', isSelected: true},
        {name: '待改进', isSelected: false},
        {name: '自定义', isSelected: false},
    ];
    //自定义事项数组
    customData = {
        content: '',
        type: 0,
        score: '0',
    };

    static defaultProps = {
        title: '',
        mainComponent: null,
        titleComponent: null,
        rightComponent: null,

        praiseOptions: [],
        improveOptions: [],
        ownPraiseOptions: [],
        ownImproveOptions: [],

        dropDownView: function () {

        },
    };

    static propTypes = {
        title: PropTypes.string,
        touchRight: PropTypes.func,
        touchTitle: PropTypes.func,
        mainComponent: PropTypes.func,
        titleComponent: PropTypes.func,
        rightComponent: PropTypes.func,

        praiseOptions: PropTypes.array,      // 表扬事项
        improveOptions: PropTypes.array,     // 改进事项
        ownPraiseOptions: PropTypes.array,   // 自定义表扬事项
        ownImproveOptions: PropTypes.array,  // 自定义改进事项

        customConfirm: PropTypes.func,
        optionClick: PropTypes.func,
        editOptionClick: PropTypes.func,
        dropDownView: PropTypes.func,
    };

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0,
            isShowOwn: false, //显示自己创建的
        };

        this.eventEmitter = DeviceEventEmitter;
    }

    show() {
        this.menu.open();
    }

    hide() {
        this.menu.close();
    }

    render() {
        return (
            <Menu ref={(c) => this.menu = c} style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}
                // renderer={renderers.ContextMenu}
                  onOpen={() => {
                      this.eventEmitter.emit(UPDATE_OPACITY, 0.5);
                  }}
                  onClose={() => {
                      this.eventEmitter.emit(UPDATE_OPACITY, 0);
                  }}
                  rendererProps={this.props.rendererProps}
                  onSelect={(item) => {
                      this.menu.close();
                  }}
            >
                <MenuTrigger>
                    {this.props.dropDownView()}
                </MenuTrigger>
                <MenuOptions
                    optionsContainerStyle={this.styles.optionsStyle}>
                    <View style={this.styles.mainView}>
                        {this.renderHeader()}
                        <View
                            style={[this.styles.contentView, {height: 0.9 * this.mainHeight}]}>
                            {this.renderTabs()}
                        </View>
                    </View>
                </MenuOptions>
            </Menu>
        );
    }


    renderHeader() {
        return (
            <View style={this.styles.topView}>
                <KBButton style={{flex: 3}}
                          onPress={() => this.hide()}
                >
                    <View style={{
                        flex: 3,
                        height: 0.12 * this.mainHeight,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Image source={image.popClose}
                               style={{width: 15, height: 15}}
                        />
                    </View>
                </KBButton>
                <KBButton style={{flex: 6}}
                          onPress={() => this.props.touchTitle()}
                >
                    <View style={{
                        flex: 6,
                        height: 0.12 * this.mainHeight,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 17, color: colors.text555}}>
                                {this.props.title}
                            </Text>
                            <Image source={image.popEdit}
                                   style={{
                                       marginLeft: 5,
                                       width: 12,
                                       height: 12,
                                   }}
                            />
                        </View>
                    </View>
                </KBButton>
                {
                    this.props.rightComponent ?
                        <View style={{flex: 3}}>
                            {this.props.rightComponent()}
                        </View>
                        :
                        <KBButton onPress={() => this.props.touchRight()}
                                  style={{flex: 3}}
                        >
                            <View style={{
                                flex: 3,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                height: 0.12 * this.mainHeight,
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontSize: 13,
                                    color: colors.text666,
                                }}>查看表现</Text>
                            </View>
                        </KBButton>
                }
            </View>
        );
    }

    renderTabs() {

        let praiseOptions = this.state.isShowOwn ? this.props.ownPraiseOptions : this.props.praiseOptions;
        let improveOptions = this.state.isShowOwn ? this.props.ownImproveOptions : this.props.improveOptions;
        return (
            <Tabs tabBarBackgroundColor={colors.white}
                  tabBarUnderlineStyle={{
                      backgroundColor: colors.text333,
                      marginLeft: 10,
                      width: this.mainWidth / this.tabs.length - 20,
                      height: 1,
                  }}
                  tabContainerStyle={{height: 40, backgroundColor: colors.white}}
                  onChangeTab={(item) => {
                      this.setState({
                          tabIndex: item.i,
                      });
                  }}
            >
                <Tab heading={<TabHeading style={{backgroundColor: colors.white}}><Text style={{fontSize: 13}}>表扬</Text></TabHeading>}
                >
                    {this.renderTabView(praiseOptions)}
                </Tab>
                <Tab
                    heading={<TabHeading style={{backgroundColor: colors.white}}><Text style={{fontSize: 13}}>待改进</Text></TabHeading>}
                >
                    {this.renderTabView(improveOptions)}
                </Tab>
                <Tab
                    heading={<TabHeading style={{backgroundColor: colors.white}}><Text style={{fontSize: 13}}>自定义</Text></TabHeading>}
                >
                    {this.renderTabCustomView()}
                </Tab>
            </Tabs>
        );
    }

    renderTabView(data) {
        return (
            <View style={{flex: 1, width: this.mainWidth - 20}}>
                <KBScrollView>
                    <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                        {data.map((item, index) => this.renderOptionItem(item, index))}
                        <KBButton
                            onPress={() => this.props.editOptionClick(this.state.tabIndex)}
                        >
                            <View style={{
                                width: (this.mainWidth - 20) / 3,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20,
                            }}>
                                <KBPolygonImage
                                    imageUrl={image.popOptionEdit}
                                    width={'50'}
                                />
                                <Text style={{fontSize: 12, marginTop: 5, color: colors.text444}}>
                                    {'编辑'}
                                </Text>
                            </View>
                        </KBButton>
                    </View>
                </KBScrollView>
                {this.renderTabViewBottom()}
            </View>
        );
    }
    renderTabViewBottom() {
        return (
            <View style={{
                width: this.mainWidth,
                height: 40,
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <KBButton style={{flex: 1}} onPress={() => {
                    this.setState({
                        isShowOwn: !this.state.isShowOwn,
                    });
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Image source={this.state.isShowOwn ? image.classBtnChoiceS : image.classBtnChoiceD}
                               style={{
                                   width: 15,
                                   height: 15,
                                   marginRight: 10,
                               }}/>
                        <Text style={{
                            fontSize: 12,
                            color: colors.text888,
                        }}>只显示自己创建的事项类型</Text>
                    </View>
                </KBButton>
            </View>
        );
    }

    //小组头像
    renderHeaderItem = (item, index) => {
        if (index >= 3) {
            return;
        }
        return (
            <CircleImage
                key={index}
                customStyle={{marginLeft: -10}}
                customWidth={30}
                customHeight={30}
                imageUrl={Utils.getStudentAvatar(item.headUrl, item.sex)}
            />
        );
    };

    //表扬/待改进事项
    renderOptionItem(item, index) {

        let imageUrl = Utils.getSystemAvatar(item.header);
        return (
            <KBButton key={index}
                      onPress={() => this.props.optionClick(item, index)}
            >
                <View style={{
                    width: (this.mainWidth - 20) / 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                }}>
                    <View>
                        <KBPolygonImage imageUrl={imageUrl}
                                        width={'50'}
                        />
                        <View style={{
                            position: 'absolute',
                            width: 20,
                            height: 20,
                            bottom: 0,
                            right: 0,
                            backgroundColor: colors.trans,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Image style={{width: 20, height: 20}}
                                   source={image.classGradeBg}
                            />
                            <Text style={{
                                position: 'absolute',
                                fontSize: 9,
                                color: colors.reduceColor,
                                top: 3,
                            }}>
                                {this.state.tabIndex == 1 ?
                                    '-' + item.score
                                    :
                                    item.score
                                }
                            </Text>
                        </View>
                    </View>

                    <Text style={{fontSize: 12, marginTop: 5, color: colors.text444}}>
                        {item.name}
                    </Text>
                </View>
            </KBButton>
        );
    };

    //自定义事项
    renderTabCustomView() {
        let data = this.customData;
        return (
            <View style={{flex: 1, paddingHorizontal: 10}}>
                <View style={{
                    flex: 1,
                    paddingLeft: 20,
                    paddingRight: 15,
                }}>
                    <KBScrollView style={{flex: 1}}>
                        <View style={this.styles.customItemView}>
                            <View style={this.styles.customLeftView}>
                                <Text style={this.styles.customLeftText}>
                                    事项内容
                                </Text>
                            </View>
                            <View style={{flex: 7}}>
                                <TextInputWithClear
                                    inputStyle={{height: 60, textAlignVertical: 'top'}}
                                    viewStyle={{
                                        paddingHorizontal: 5,
                                        paddingVertical: 5,
                                        height: 60,
                                        borderRadius: 5,
                                        backgroundColor: colors.divider,
                                    }}
                                    defaultText={this.customData.content}
                                    showDriver={false}
                                    multiline={true}
                                    clearIconVisible={false}
                                    placeholderText={'请输入事项内容'}
                                    onTextChange={(text) => {
                                        this.customData.content = text;
                                        this.setState({});
                                    }}
                                />
                            </View>
                        </View>
                        <View style={this.styles.customItemView}>
                            <View style={this.styles.customLeftView}>
                                <Text style={this.styles.customLeftText}>
                                    积分类型
                                </Text>
                            </View>
                            <View style={this.styles.customRightView}>
                                <KBButton onPress={() => {
                                    data.type = 0;
                                    this.setState({});
                                }}
                                >
                                    <View style={{flexDirection: 'row'}}>
                                        <Image style={{width: 15, height: 15}}
                                               source={data.type == 0 ? image.classBtnChoiceS : image.classBtnChoiceD}
                                        />
                                        <Text style={{
                                            marginLeft: 5,
                                            color: colors.text666,
                                        }}>表扬</Text>
                                    </View>
                                </KBButton>

                                <KBButton onPress={() => {
                                    data.type = 1;
                                    this.setState({});
                                }}
                                >
                                    <View style={{flexDirection: 'row', marginLeft: 20}}>
                                        <Image style={{width: 15, height: 15}}
                                               source={data.type == 1 ? image.classBtnChoiceS : image.classBtnChoiceD}
                                        />
                                        <Text style={{
                                            marginLeft: 5,
                                            color: colors.text666,
                                        }}>待改进</Text>
                                    </View>
                                </KBButton>
                            </View>
                        </View>

                        <KBSourceView itemAllStyle={{flex: 7}} text={'来源'} ref={(c) => this.sourceView = c}
                                      textStyle={[this.styles.customLeftText, {flex: 3, padding: 0}]}
                                      style={[{justifyContent: 'flex-start', padding: 0}, this.styles.customItemView]}/>

                        <View style={this.styles.customItemView}>
                            <View style={this.styles.customLeftView}>
                                <Text style={this.styles.customLeftText}>
                                    分数
                                </Text>
                            </View>
                            <TextInputWithClear
                                viewStyle={{
                                    flex: 7,
                                    paddingHorizontal: 5,
                                    paddingVertical: 5,
                                    borderRadius: 5,
                                    backgroundColor: colors.divider,
                                }}
                                value={this.customData.score}
                                showDriver={false}
                                clearIconVisible={false}
                                keyboardType={'number-pad'}
                                placeholderText={'请输入事项分数'}
                                onTextChange={(text) => {

                                    if (text.length > 1 && text.substr(0, 1) == 0) {
                                        text = text.substr(1, text.length - 1);
                                    }
                                    this.customData.score = text;
                                    this.setState({});
                                }}

                                blurOnSubmit={true}
                            />

                        </View>
                    </KBScrollView>
                </View>
                <View style={{
                    height: 49,
                    alignItems: 'center',
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    paddingTop: 5,
                }}>
                    <KBButton onPress={() => {
                        this.customData.qualityType = this.sourceView._getSelectedId();
                        this.props.customConfirm(this.customData);
                    }}
                    >
                        <View style={{
                            backgroundColor: colors.yellowColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: this.mainWidth - 100,
                            height: 40,
                            borderRadius: 20,
                        }}
                        >
                            <Text style={{fontSize: 17, color: colors.text666}}>
                                提交
                            </Text>
                        </View>
                    </KBButton>
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        optionsStyle: {
            width: this.mainWidth,
            height: this.mainHeight,
            justifyContent: 'center',
            alignItems: 'center',
        },
        mainView: {
            width: this.mainWidth,
            backgroundColor: colors.white,
            borderRadius: 10,
        },
        topView: {
            width: this.mainWidth,
            height: 0.12 * this.mainHeight,
            backgroundColor: colors.yellowColor,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            paddingLeft: 10,
            paddingRight: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        contentView: {
            marginHorizontal: 10,
            paddingBottom: 10,

        },

        customItemView: {
            marginTop: 25, flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
        },
        customLeftView: {
            flex: 3,
            justifyContent: 'center',
        },
        customLeftText: {
            fontSize: 13,
            color: colors.text666,
        },
        customRightView: {
            flex: 7,
            alignItems: 'center',
            flexDirection: 'row',
        },

    });
}

