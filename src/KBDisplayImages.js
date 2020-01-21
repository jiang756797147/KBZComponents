import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
    View,
    StyleSheet,
    Image,
    DeviceEventEmitter
} from 'react-native';
import lodash from 'lodash';

import KBImagePlusView from "./KBImagePlusView";
import KBButton from "./KBButton";
import colors from '../constants/colors';
import theme from "../constants/theme";
import Utils from "../utils/Utils";
import ImageDowlodUtils from "../utils/ImageDowlodUtils";
import image from "../constants/image";


export default class KBDisplayImages extends Component {

    defaultImage = require('../assets/class/message/icon_empty.png');

    static defaultProps = {
        ticketImgs: [],
        imgWidth: (theme.screenWidth - 100) / 3,
        isDeleteImg: false,

        isNetwork: false,
    };

    static propTypes = {
        ticketImgs: PropTypes.array.isRequired,
        imgWidth: PropTypes.number,
        isDeleteImg: PropTypes.bool,
        imageDeleteClick: PropTypes.func,
        imageItemStyle: PropTypes.any,

        isNetwork: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            imageArray: [],
            imageUrls: [],
            imageIndex: 0,
        };
        this.listeners = [];
        this.localImages = [];
    }

    componentDidMount() {
        if (this.props.isNetwork) {
            this.download(this.props.ticketImgs);
            this.localImages = this.props.ticketImgs;
        } else {
            let imageArray = [];
            let imageUrls = [];
            for (let imageObj of this.props.ticketImgs) {
                imageArray.push({uri: imageObj});
                imageUrls.push({url: imageObj});
            }
            this.setState({
                imageArray: imageArray,
                imageUrls: imageUrls,
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
        if (nextProps.isNetwork) {

            if (!lodash.isEqual(this.localImages, nextProps.ticketImgs)) {
                this.download(nextProps.ticketImgs);
                this.localImages = nextProps.ticketImgs;
            }
        } else {
            let imageArray = [];
            let imageUrls = [];
            for (let imageObj of nextProps.ticketImgs) {
                imageArray.push({uri: imageObj});
                imageUrls.push({url: imageObj})
            }
            this.setState({
                imageArray: imageArray,
                imageUrls: imageUrls,
            })
        }
    }

    download(urls) {
        this.state.imageArray = [];
        this.state.imageUrls = [];
        for (let index = 0; index < urls.length; index++) {
            let uri = urls[index];
            ImageDowlodUtils.getImagePath(uri).then(cachePath => {
                if (cachePath) this.updateSource(index, cachePath);
                else {
                    this.listeners.push(DeviceEventEmitter.addListener(ImageDowlodUtils.event.render, (originalUri, cachePath) => {
                        if (uri === originalUri) {
                            this.updateSource(index, cachePath)
                        }
                    }))
                }
            }).catch((e) => {
                // this.updateSource({uri})
                ImageDowlodUtils.printLog(e)
            })

        }
    }

    updateSource(index, path) {
        this.state.imageArray[index] = {uri: path};
        this.state.imageUrls[index] = {url: path};
        this.setState({});
    }

    renderItemImage = (imageUrl, index) => {
        return (
            <View key={index}
                  style={[{
                      padding: 10,
                      paddingTop: this.props.isDeleteImg ? 10 : 0,
                      backgroundColor: colors.white
                  }, this.props.imageItemStyle]}>
                <KBButton
                    onPress={() => {
                        if (Utils.isNull(imageUrl)) {
                            return;
                        }
                        this.setState({imageIndex: index}, () => {
                            this.checkImage.show()
                        })
                    }}>
                    <View>
                        <Image style={{
                            width: this.props.imgWidth,
                            height: this.props.imgWidth,
                        }}
                            // resizeMode={'contain'}
                               source={!Utils.isNull(imageUrl) ? imageUrl : this.defaultImage}/>
                        {this.props.isDeleteImg ?
                            <KBButton
                                transparent
                                onPress={() => {
                                    this.props.imageDeleteClick(index);
                                }}
                                style={{position: 'absolute', right: 0, top: 0}}>
                                <View style={{
                                    position: 'absolute', right: 0, top: 0,
                                    width: 16,
                                    height: 16,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Image resizeMode={'cover'} style={{width: 16, height: 16}}
                                           source={require('../assets/componentImages/image_delete.png')}/>
                                </View>
                            </KBButton>
                            :
                            null
                        }
                    </View>

                </KBButton>


            </View>
        )
            ;
    };

    render() {
        return (
            this.state.imageArray.length > 0 ?
                <View>
                    <View style={[{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginLeft: -10,
                    }, this.props.style]}>
                        {this.state.imageArray.map(this.renderItemImage)}
                    </View>
                    <KBImagePlusView ref={(c) => this.checkImage = c} imageIndex={this.state.imageIndex}
                                     imageUrls={this.state.imageUrls}/>
                </View>
                :
                null
        );
    }
}

const styles = StyleSheet.create({
    divider: {
        backgroundColor: colors.divider,
    }
});
