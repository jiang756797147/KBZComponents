import React,{Component} from 'react';
import {Image,View,Text,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import colors from "../../../constants/colors";
import theme from "../../../constants/theme";

export default class KBScoreListView extends Component{

    static defaultProps={
        data:[],
        image:require('../../../assets/image3.5/circle_blue.png'),
        name:'未知',
    }

    static propTypes={
        data:PropTypes.array,
        name:PropTypes.string,
        image:PropTypes.any,
        style:PropTypes.any,
    }
    constructor(props){
        super(props)
    }

    render(){
        return(
            <View style={[{flexDirection: 'row', marginHorizontal: 15, alignItems: 'flex-start'},this.props.style]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{width: 8, height: 8}}
                           source={this.props.image}/>
                    <Text style={{fontSize: 15, marginLeft: 10,color:colors.text26}}>{this.props.name}</Text>
                </View>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {this.props.data.map((item, index, i) => {
                        return (
                            <View key={index} style={{alignItems:'center',flexDirection: 'row', marginBottom: 10,width:(theme.screenWidth-30)/4}}>
                                <View style={{width: 24, height: 24, marginLeft: 20, justifyContent: 'center',alignItems:'center'}}>
                                    <Image style={{width: 24, height: 24, position: 'absolute'}}
                                           source={require('../../../assets/image3.5/number_back.png')}/>
                                    <Text style={{fontSize: 13, color: colors.white}}>{item.name}</Text>
                                </View>
                                <Text
                                    style={{fontSize: 14, marginLeft: 5,color:colors.text26}}>{`${item.score}分`}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

}