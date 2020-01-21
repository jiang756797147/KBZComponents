import React, {Component} from 'react';
import {Image, View, Text, StyleSheet} from "react-native";
import PropTypes from "prop-types";
import colors from "../../../constants/colors";
import KBDropPopMenu from "../../../components/popMenu/KBDropPopMenu";
import {renderers} from "../../../components/popMenu/src";

export default class TypeChooseView extends Component {

    static defaultProps = {
        titleText: '',
        dataArray: [],
        hasCustom: false,
        timeSelected: () => {

        },
        uniqueKey: 'text',
    };

    static propTypes = {
        titleText: PropTypes.string,
        dataArray: PropTypes.array,
        style: PropTypes.any,
        timeSelected: PropTypes.func,
        btnScreenStyle: PropTypes.any,
        hasCustom: PropTypes.bool,
        uniqueKey: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = Object.assign({

            rankingTimeDown: false,  //班级活跃度排行时间弹框

            rankingTime: this.props.dataArray[0][this.props.uniqueKey],

        }, this.state);

    }

    render() {
        const {
            titleText,
            hasCustom,
            timeSelected,
            uniqueKey,
            dataArray,
            btnScreenStyle,
            style,
        } = this.props;
        return (
            <View style={[{flexDirection: 'row', alignItems: 'center', marginHorizontal: 10}, style]}>
                <Text style={{
                    fontWeight: '900',
                    flex: 1,
                    fontSize: 15,
                    color: colors.text1f
                }}>{titleText}</Text>
                <KBDropPopMenu
                    onOpen={() => {
                        this.setState({rankingTimeDown: true})
                    }}
                    onClose={() => {
                        this.setState({rankingTimeDown: false})
                    }}
                    renderer={renderers.PopoverNew}
                    rendererProps={{
                        placement: 'bottom',
                        preferredPlacement: 'top',
                        anchorStyle: {backgroundColor: colors.white}
                    }}
                    optionsStyle={{
                        marginTop: 0,
                        width: 100,
                        backgroundColor: colors.white,
                        borderRadius: 5,
                        marginRight: 14
                    }}
                    optionStyle={{paddingLeft: 0}}
                    menuStyle={{}}
                    menuTrigger={() =>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text
                                style={{fontSize: 13, color: colors.black}}>{this.state.rankingTime}</Text>
                            <Image
                                source={this.state.rankingTimeDown ? require('../../../assets/image3.5/time_up.png') :
                                    require('../../../assets/image3.5/time_down.png')}
                                style={{width: 8, height: 8, marginLeft: 5}} resizeMode={'contain'}/>
                        </View>}
                    onSelect={(item) => {
                        if (item.value.value === 7 && hasCustom) {
                            const {navigate} = this.props.navigation;
                            navigate('KBDate', {
                                isSingle: false,
                                getDate: (startDate, endDate) => {
                                    this.setState({
                                        startTime: (startDate.timestamp / 1000).toString(),
                                        endTime: (endDate.timestamp / 1000).toString(),
                                        rankingTime: item.value[uniqueKey],
                                    }, () => {
                                        timeSelected(item.value, this.state.startTime, this.state.endTime);
                                    })
                                }
                            });
                        } else {
                            this.setState({
                                rankingTime: item.value[uniqueKey],
                                startTime: '',
                                endTime: '',
                            });
                            timeSelected(item.value);
                        }
                    }}
                    menuTriggerStyle={Object.assign({
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: 60,
                        height: 26,
                        justifyContent: 'center'
                    }, btnScreenStyle)}
                    dataArray={dataArray}
                    uniqueKey={uniqueKey}
                />
            </View>
        )
    }
}
