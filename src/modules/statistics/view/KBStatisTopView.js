import React,{Component} from 'react';
import {Image, View,Text,StyleSheet} from "react-native";
import colors from "../../../constants/colors";
import PropTypes from "prop-types";

export default class KBStatisTopView extends Component{

    static defaultProps={
        style:{},
    }

    static propTypes={
        data:PropTypes.array,
        nameStr:PropTypes.string,
        numberStr:PropTypes.string,
        style:PropTypes.any,
    }


    constructor(props){
        super(props);
    }

    render(){

        return(
            <View style={[styles.allStyle,this.props.style]}>
                {this.props.data.map((item,index,i)=>{
                    return(
                        <View key={index} style={{alignItems: 'center'}}>
                            <Text style={{fontSize:20,fontWeight: '900',color:colors.text1f}}>{item[this.props.numberStr]}</Text>
                            <Text style={{fontSize:12,color:colors.text1f,marginTop: 8}}>{item[this.props.nameStr]}</Text>
                        </View>
                    )
                })}
            </View>
        )

    }

}

const styles=StyleSheet.create({
    allStyle:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'space-around',
        marginVertical: 20
    }
})