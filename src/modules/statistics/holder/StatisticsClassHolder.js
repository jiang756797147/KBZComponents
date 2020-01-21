import React,{Component} from 'react'
import PropTypes from "prop-types";
import {View, Text, Image, StyleSheet} from 'react-native';
import colors from "../../../constants/colors";

export default class StatisticsClassHolder extends Component{

    static defaultProps={
        showMore:false,
        isStudent:false,
    }

    static propTypes={
        style:PropTypes.any,
        showMore:PropTypes.bool,
        isStudent:PropTypes.bool,
    }

    constructor(props){
        super(props);
    }

    render(){

        let img1=require('../../../assets/image3.5/ranking_one_1.png');
        let img2=require('../../../assets/image3.5/ranking_one_2.png');
        switch (this.props.itemIndex) {
            case 1:
                img1=require('../../../assets/image3.5/ranking_one_1.png');
                img2=require('../../../assets/image3.5/ranking_one_2.png');
                break;
            case 2:
                img1=require('../../../assets/image3.5/ranking_two_1.png');
                img2=require('../../../assets/image3.5/ranking_two_2.png');
                break;
            case 3:
                img1=require('../../../assets/image3.5/ranking_three_1.png');
                img2=require('../../../assets/image3.5/ranking_three_2.png');
                break;
            default:
                img1=require('../../../assets/image3.5/ranking_four_1.png');
                img2=require('../../../assets/image3.5/ranking_four_2.png');
                break;
        }

        return(
            <View style={{borderRadius:5,flexDirection: 'row',alignItems: 'center',marginHorizontal:10,paddingRight:10,paddingVertical:8,backgroundColor:colors.textf9}}>
                <View style={{width:35,height:35,alignItems:'center',justifyContent: 'center'}}>
                    <Image style={{width:35,height:35,position:'absolute'}} source={img1}/>
                    <Text style={{fontSize:12,color:colors.white}}>{this.props.itemIndex}</Text>
                </View>
                <Text style={{marginLeft:5,fontWeight:'900',fontSize:15,color:colors.text1f}}>{this.props.itemData.name}</Text>
                <Text style={{flex:1,fontSize:12,color:colors.text85,marginLeft: 4}}>{this.props.isStudent?
                    this.props.itemData.parent_name?`(${this._getStudentParentName(this.props.itemData.type)}${this.props.itemData.parent_name})`:null:this.props.itemData.teacher_name?`(${this.props.itemData.teacher_name})`:null}</Text>
                <Text style={{fontSize:13,color:colors.text1f}}>{`奖票${this.props.itemData.ticket_num}票`}</Text>
                {this.props.showMore?
                    <Image style={{width: 16, height: 16, marginLeft: 20}} source={img2}/>
                    :null
                }
            </View>
        )
    }

    _getStudentParentName=(type)=>{

        let name='';
        switch (type) {
            case 0:
                name='妈妈:';
                break;
            case 1:
                name='爸爸:';
                break;
            case 2:
                name='爷爷:';
                break;
            case 3:
                name='奶奶:';
                break;
            case 4:
                name='其他:';
                break;
        }
        return name;

    }

}

