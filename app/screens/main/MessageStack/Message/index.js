import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions, Platform, YellowBox,
  TextInput, Keyboard, Animated, Easing } from 'react-native';
import { Button } from 'react-native-ui-lib';
import { connect } from 'react-redux';
import { Switch } from 'react-native-switch';
import { GiftedChat, Bubble, Send, Composer, Message, MessageImage, } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NavigationEvents } from "react-navigation";
import deepDiffer from 'react-native/lib/deepDiffer';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import _ from 'lodash-es';

import CircleAvatarView from '../../../../components/CircleAvatarView';
import LoadingIndicator from '../../../../components/LoadingIndicator';

import { setUserData } from '../../../../store/userData';
import { sendMessage, loadMessages, loadFriendList, 
  clearUnreadMessages, loadUnreadMessageCounts } from '../../../../store/chat';
import { setOnlineUserStatus, uploadPhoto, getUserPhotos, deletePhoto } from '../../../../store/firebaseData';
import { getChatItems } from '../../../../store/chat/selectors'

import Globals from '../../../../Globals'
import Images from '../../../../resource/Images';
import styles from './styles';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module SafeAreaManager']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export const isIphoneX = () => {
  let d = Dimensions.get('window');
  const { height, width } = d;

  return (
    // This has to be iOS duh
    Platform.OS === 'ios' &&

    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
}

class MessageScreen extends Component {
  initKeyboardHeight = new Animated.Value(0)
  initAccessoryHeight = new Animated.Value(0)
  initInputHeight = new Animated.Value(0)
  openedKeyboardHeight = null
  keyboardHeight = this.openedKeyboardHeight ? this.openedKeyboardHeight : 305
  // keyboardHeight = 305
  accessoryHeight = this.openedKeyboardHeight ? this.openedKeyboardHeight + 50 : 305 + 50
  // accessoryHeight = 355
  minInputHeight = 100
  maxInputHeight = this.openedKeyboardHeight ? this.openedKeyboardHeight + this.minInputHeight : 305 + this.minInputHeight
  // maxInputHeight = 405


  state = {
    userList: [],
    photoList: [],
    isModalMenSwitch: true,
    avatarNum: 0,
    messages: [],
    originalMessages: [],
    messageRoom1: '',
    messageRoom2: '',
    client: null,
    avatar: '',
    user: null,
    isStickersOpen: false,
    isKeyboardShow: false,
    loading: false,
    refreshed: false,
    type: '',
  }
  
  constructor(props) {
    super(props);
  };

  componentDidMount() {
    Keyboard.addListener('keyboardWillShow', (e) => {
      console.log(e)
      this.openedKeyboardHeight = e.endCoordinates.height;
      this.setState({
        isStickersOpen: false,
        isKeyboardShow: true
      })
    })
    Keyboard.addListener('keyboardWillHide', (e) => {
      console.log(e)
      this.setState({ isKeyboardShow: false })
    })

    this.setState({
      user: Globals.userData,
    });

    this.props.dispatch(loadFriendList(Globals.userData.uid));
    this.props.dispatch(setOnlineUserStatus(Globals.userData.uid));
    this.props.dispatch(loadUnreadMessageCounts(Globals.userData.uid));
    this.props.dispatch(getUserPhotos(Globals.userData.uid, 'Message'));
  }

  componentDidUpdate(prevProps) {
    if (! _.eq(prevProps, this.props)){
      if (this.props.messages) {
        // console.log(this.props)
        const data = getChatItems(this.props.messages).reverse();
        let messageList = [];
        if (deepDiffer(data, this.state.originalMessages) && data.length > 0) {
          data.forEach((item) => {
            let messageItem = {
              _id: item.id,
              text: item.text,
              type: item.type,
              image: typeof item.image === 'string' ? item.image : '',
              createdAt: item.createdAt,
              user: item.user.id == Globals.userData.uid ? {} : {
                _id: item.user.id,
                name: item.user.name,
                // avatar: item.user.avatar,
                avatar: this.state.client && this.state.client.avatar != "" ? this.state.client.avatar : item.user.avatar,
              },
              // user: {},
              // system: true,
            }
            messageList.push(messageItem);
          });
          this.setState({
            originalMessages: data,
            messages: messageList
          })
        }
        if (this.state.client != null && Globals.isMessageTab == true) {
          this.props.dispatch(clearUnreadMessages(Globals.userData.uid, this.state.client.uid));
        }
      }
  
      if (this.props.friends) {
        const data = getChatItems(this.props.friends).reverse();
        if (deepDiffer(data, this.state.userList) && data.length > 0) {
          this.setState({
            userList: data,
          });
  
          if ( this.state.client == null) {
            this.onAvatarPress(data[0]);
          }
        }
      }
  
      if (this.props.photoList && prevProps.photoList !== null) {
        const data = getChatItems(this.props.photoList).reverse();
        if (deepDiffer(data, this.state.photoList) && data.length > 0 && this.props.photoList.length !== this.state.photoList.length) {
          console.log(prevProps, this.props)
          this.setState({
            photoList: data,
            loading: false,
            type: 'photo',
          }, this.sendPhotoMessage())
        }
      }
    }
  }

  componentWillFocus() {
  }

  componentWillUnmount() {
    Keyboard.removeAllListeners()
  }

  setInitialClient() {
  }

  back(number) {
    Globals.isMessageTab = false;

    switch (Globals.tabNumber) {
      case 1:
        this.props.navigation.navigate("First");
        break;
      case 2:
        this.props.navigation.navigate("Second");
        break;
      case 3:
        if (Globals.tabClientNumber == 3) {
          this.props.navigation.navigate("First");
        } else {
          this.props.navigation.navigate("Third");
        }
        break;
      case 4:
        this.props.navigation.navigate("Fourth");
        break;
      case 5:
        this.props.navigation.navigate("Fifth");
        break;
      default:
        this.props.navigation.navigate("First");
        break;
    }
  }

  getChildrenStyle() {
    return {
      width: Dimensions.get('window').width * 0.18,
      // height: parseInt(Math.random() * 20 + 12) * 10,
      height: WINDOW_WIDTH * 0.24 - 2,
      top: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 1)',
    };
  }

  getAutoResponsiveProps() {
    return {
      itemMargin: 6,
    };
  }

  onAvatarPress = (item) => {
    this.setState({
      avatarNum: item.userId,
      client: {
        uid: item.userId,
        name: item.userName,
        roomId: item.roomId,
        avatar: item.avatar,
      },
      avatar: item.avatar,
      originalMessages: [],
      messages: []
    });
    this.props.dispatch(loadMessages(Globals.userData.uid, item.userId));
    this.props.dispatch(clearUnreadMessages(Globals.userData.uid, item.userId));
  }

  stickerElem = (url, name) => {
    return (
      <TouchableOpacity 
        style={{ 
          height: WINDOW_WIDTH / 4 >= 70 ? (WINDOW_WIDTH / 4 <= 100 ? WINDOW_WIDTH / 4 : 100) : WINDOW_WIDTH / 3,
          width: WINDOW_WIDTH / 4 >= 70 ? (WINDOW_WIDTH / 4 <= 100 ? WINDOW_WIDTH / 4 : 100) : WINDOW_WIDTH / 3,
        }} 
        key={name}
        onPress={(e) => {
          RNFetchBlob.fs
          .exists(RNFetchBlob.wrap(RNFetchBlob.fs.asset(Images.stickers[name])))
          .then(res => console.log(res))
          .catch(e => console.log(e))
          this.setState({ type: 'sticker' }, () => {
            this.sendPhotoMessage(name)
            this.closeKeyboard()
          })
        }}
      >
        <Image 
          source={url} 
          resizeMode={'contain'}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </TouchableOpacity>
    );
  }

  showStickers = () => {
    const that = this
    let arr = Object.entries(Images.stickers);
    return (
      <ScrollView style={{ width: '100%', }}>
        <View 
          style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            height: '100%', 
            width: '100%' 
          }}
        >
          {
            arr.map(value => {
              return that.stickerElem(value[1], value[0])
            })
          }
        </View>
      </ScrollView>
    );
  }

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#efefef',
          },
          right: {
            backgroundColor: '#5564d5',
          }
        }}
        textStyle={{
          right: {
            color: 'white',
            // fontFamily: 'Montserrat-Light',
            fontSize: 17
          },
          left: {
            color: '#222222',
            // fontFamily: 'Montserrat-Light',
            fontSize: 17
          }
        }}
      />
    )
  }

  renderSend = (props) => {
    return (
      <Send
        {...props}
      >
        <View style={{marginRight: 10, marginBottom: 5 }}>
          <Icon2 name="md-send" size={30} color="#fe1394" />
        </View>
      </Send>
    );
  }

  renderMessageImage = (props) => {
    console.log(props)
    if (props.currentMessage.type === 'sticker') {
      let stickerName = props.currentMessage.image
      let reqURL = Images.stickers[stickerName]
      return (
        <Image 
          style={[{
            width: 150,
            height: 150,
            borderRadius: 13,
            margin: 3,
            resizeMode: 'contain',
          },

         ]}
         source={reqURL}
        />
      );
    } else if (props.currentMessage.type === 'photo') {
      return (
        <MessageImage {...props} 
        />
      );
    }
  }

  renderMessage = (props) => {
    return (
      <View onTouchStart={(e) => {this.closeKeyboard(e)}}>
        <Message {...props}

        />
      </View>
    );
  }

  renderInputToolbar = (props) => {
    this.animatedInputHeight = this.initInputHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [this.minInputHeight, this.maxInputHeight]
    })
    this.animatedKeyboardHeight = this.initKeyboardHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.keyboardHeight]
    })
    this.animatedAccessoryHeight = this.initAccessoryHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [50, this.accessoryHeight]
    })
    if (this.state.isKeyboardShow) {
      this.inputPos = 'relative'
    } else {
      this.inputPos = 'absolute'
    }
    return (
      <Animated.View
        {...props}
        style={[
          {
            height: this.animatedInputHeight,
            flexDirection: 'column', 
            position: this.inputPos,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: '#222222',
            backgroundColor: "white",
            bottom: 0,
            left: 0,
            right: 0,
          }
        ]}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}> 
          <Composer {...props} composerHeight={33} />
          {this.renderSend(props)}
        </View>
        <Animated.View 
          style={{
            bottom: 0,
            left: 0,
            right: 0,        
            flexDirection: 'column', 
            height: this.animatedAccessoryHeight,
            position: this.inputPos,
            width: '100%',
            borderTopWidth: .25,
            borderTopColor: '#222222',
          }}
        >
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 1, }}>
              <TouchableOpacity 
                style={{ margin: 5, alignItems: 'center', }}
                onPress={() => {
      
                }}
              >
                <Image source={Images.shareFile} resizeMode={'contain'} style={[styles.toolbarImages]} />
              </TouchableOpacity>
            </View>
            <View style={{ height: '100%' }}>
              <TouchableOpacity 
                style={{ margin: 5, alignItems: 'center' }}
                onPress={() => {

                }}
              >
                <Image source={Images.shareAudioRecord} resizeMode={'contain'} style={[styles.toolbarImages]} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, }}>
              <TouchableOpacity 
                style={{ margin: 5, alignItems: 'center' }}
                onPress={() => {
                  this.chooseGalleryPhotoURI()
                  
                }}
              >
                <Image source={Images.shareGalleryPhoto} resizeMode={'contain'} style={[styles.toolbarImages]} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, }}>
              <TouchableOpacity 
                style={{ margin: 5, alignItems: 'center' }}
                onPress={() => {
                  this.chooseCameraPhotoURI()
                }}
              >
                <Image source={Images.shareTakenPhoto} resizeMode={'contain'} style={[styles.toolbarImages]} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, }}>
              <TouchableOpacity 
                style={{ margin: 5, alignItems: 'center' }}
                onPress={() => {

                }}
              >
                <Image source={Images.shareGIF} resizeMode={'contain'} style={[styles.toolbarImages]} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, }}>
              <TouchableOpacity 
                style={{ margin: 5, alignItems: 'center' }}
                onPress={() => {
                    this.toggleStickers()
                }}
              >
                <Image source={Images.shareSticker} resizeMode={'contain'} style={[styles.toolbarImages]} />
              </TouchableOpacity>
            </View>
          </View>
          {
            this.state.isStickersOpen && (
              <Animated.View style={{ height: this.animatedKeyboardHeight, width: '100%', position: 'relative', bottom: 0, backgroundColor: '#abcbff' }}>
                {this.showStickers()}
              </Animated.View>
            )
          }
        </Animated.View>

      </Animated.View>
    );
  }

  closeKeyboard = () => {
    this.setState({ 
      isStickersOpen: false, 
      isKeyboardShow: false
    }, () => {
      this.state.isKeyboardShow ? this.inputPos = 'relative' : this.inputPos = 'absolute'
      this.animateChat()
      this.GiftedChatRef.onKeyboardWillHide()
      Keyboard.dismiss()
      // console.log("Gifted Ref: ", this.GiftedChatRef)
      // console.log("Stickers opened? ", this.state.isStickersOpen, 
      // " ,keyboard is showed: ", this.state.isKeyboardShow,
      // " ,elem position props is: ", this.inputPos)
    })
  }

  toggleStickers = async() => {
    if (!this.state.isStickersOpen) {
      this.GiftedChatRef.textInput.blur()
    } else if (this.state.isStickersOpen) {
      this.GiftedChatRef.textInput.focus()
    }
    this.setState(({isStickersOpen}) => ({ 
      isStickersOpen: !isStickersOpen, 
      isKeyboardShow: isStickersOpen
    }), () => {
      this.state.isKeyboardShow ? this.inputPos = 'relative' : this.inputPos = 'absolute'
      this.animateChat()
      // console.log("Gifted Ref: ", this.GiftedChatRef)
      // console.log("Stickers opened? ", this.state.isStickersOpen, 
      // " ,keyboard is showed: ", this.state.isKeyboardShow,
      // " ,elem position props is: ", this.inputPos)
    })
  }
  
  animateChat = () => {
    console.log('animating chat')
    Animated.parallel([
      Animated.timing(this.initInputHeight, {
        toValue: this.state.isStickersOpen ? 1 : 0,
        duration: 100,
        easing: Easing.linear,
      }),
      Animated.timing(this.initAccessoryHeight, {
        toValue: this.state.isStickersOpen ? 1 : 0,
        duration: 100,
        easing: Easing.linear,
      }),
      Animated.timing(this.initKeyboardHeight, {
        toValue: this.state.isStickersOpen ? 1 : 0,
        duration: 100,
        easing: Easing.linear,
      })
    ])
    .start()
  }

  onSend(messages = []) {
    // { text: 'Hi',
    // user: {},
    // createdAt: Fri Sep 07 2018 23:41:58 GMT+0800 (CST),
    // _id: '8add5027-da28-447d-917f-458fc4fa5d80' }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
    this.props.dispatch(sendMessage(this.state.user.uid, this.state.client.uid, messages[0].text, this.state.user.name, Globals.avatarPhoto != null ? Globals.avatarPhoto.url : Globals.BaseDefaultAvatarMale, this.state.client.name, this.state.avatar != null || this.state.avatar != '' ? this.state.avatar : Globals.BaseDefaultAvatarMale, messages[0].type, messages[0].image));
  }

  setCustomText(text) {
    // this.props.updateMessage(text)
  }

  chooseCameraPhotoURI = async() => {
    const options = {
      title: 'Take a photo',
      storageOptions: {
        cameraRoll: true,
        skipBackup: true,
      }
    };
    await ImagePicker.launchCamera(options, (res) => this.usePhotoURI(res)
    .then((res) => {
      if (res && res.didCancel !== true) {
        try {
          uri = res.uri;
          this.setState({ loading: true, type: 'photo' }, () => {
            this.props.dispatch(uploadPhoto(Globals.userData.uid, uri, 'Message'))
            this.props.dispatch(getUserPhotos(Globals.userData.uid, 'Message'))
          })
        } catch (e) {
          console.log(e)
        }
      }
    })
    .catch(e => console.log(e)))
  }

  chooseGalleryPhotoURI = async() => {
    const options = {
      title: 'Choose photo',
      chooseFromLibraryButtonTitle: '',
      noData: true,
    };
    await ImagePicker.launchImageLibrary(options, (res) => this.usePhotoURI(res)
    .then((res) => {
      if (res && res.didCancel !== true) {
        try {
          uri = res.uri;
          this.setState({ loading: true, type: 'photo' }, () => {
            this.props.dispatch(uploadPhoto(Globals.userData.uid, uri, 'Message'))
            this.props.dispatch(getUserPhotos(Globals.userData.uid, 'Message'))
          })
        } catch (e) {
          this.setState({ loading: false, type: '' })
        }
      }
    })
    .catch(e => console.log(e)))
  }

  useStickerURI = (uri) => {
    try {
      this.setState({ loading: true, type: 'sticker' })
      // this.props.dispatch(uploadPhoto(Globals.userData.uid, uri, 'Message'))
      // this.props.dispatch(getUserPhotos(Globals.userData.uid, 'Message'))
    } catch (e) {
      this.setState({ loading: false, type: '' })
    }
  }

  usePhotoURI = async (res) => {
    return res
  }

  sendPhotoMessage = (stickerName) => {
    console.log('sending photo message')
    if (this.state.type === 'photo' && this.state.loading !== true) {
      console.log('sending photo message type photo')
      this.onSend([{
        user: {},
        _id: Globals.userData.uid,
        text: '',
        type: 'photo',
        image: this.state.photoList[0].url,
      }])
    } else if (this.state.type === 'sticker' && stickerName && this.state.loading !== true) {
      this.onSend([{
        user: {},
        _id: Globals.userData.uid,
        text: '',
        type: 'sticker',
        image: stickerName,
      }])
    } else {
      setTimeout(() => this.sendPhotoMessage(), 500)
    }
    this.setState({
      type: ''
    })
  }

  renderChildren() {
    const rUserList = this.state.userList;

    return rUserList.map((item, key) => {
      return (
        <View style={ [this.getChildrenStyle(), this.state.avatarNum == item.userId ? {borderBottomWidth: 2, borderBottomColor: '#fd2191'} : null ] } key={key}>
          <TouchableOpacity style={{ flex: 1 }} onPress={()=> this.onAvatarPress(item)}>
            <View style={{ flex: 1, padding: 2, justifyContent: 'center', alignItems: 'center' }} >
              <View style={{ width: this.state.avatarNum == item.userId ? WINDOW_WIDTH * 0.18 - 10 : WINDOW_WIDTH * 0.18 - 22, height: this.state.avatarNum == item.userId ? WINDOW_WIDTH * 0.24 - 2 : WINDOW_WIDTH * 0.24 - 14, position: 'absolute', bottom: -5 }} >
                <CircleAvatarView 
                  width={ this.state.avatarNum == item.userId ? WINDOW_WIDTH * 0.18 - 10 : WINDOW_WIDTH * 0.18 - 22 }
                  height={ this.state.avatarNum == item.userId ? WINDOW_WIDTH * 0.24 - 2 : WINDOW_WIDTH * 0.24 - 14}
                  name={item.userName}
                  status = {item.isOnline == true ? 'online' : 'away'}
                  farAway={''}
                  avatarSource={item.avatar != '' ? {uri: item.avatar} : Images.profileAvatar}
                  badgeNumber={item.unseenCounts}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }, this);
  }

  render() {
    let strLabel = {
      autoDelete: {
        en: "Auto delete",
        fr: "Effacement\n automatique"
      },
      writeYourMessage: {
        en: "Write your message",
        fr: "Ecris ton message"
      },
    }

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {

            if (this.state.client != null) {
              this.props.dispatch(clearUnreadMessages(Globals.userData.uid, this.state.client.uid));
            }

            if (payload.state.params) {
              if (deepDiffer(this.state.client, payload.state.params.client)) {
                if (payload.state.params.client != null) {
                  this.setState({
                    avatarNum: payload.state.params.client.uid,
                    client: {
                      uid: payload.state.params.client.uid,
                      name: payload.state.params.client.name,
                      roomId: Globals.userData.uid + "-" + payload.state.params.client.uid,
                      avatar: payload.state.params && payload.state.params.avatar ? payload.state.params.avatar : '',
                    },
                    avatar: payload.state.params && payload.state.params.avatar ? payload.state.params.avatar : '',
                    originalMessages: [],
                    messages: []
                  });
                  this.props.dispatch(loadMessages(Globals.userData.uid, payload.state.params.client.uid));
                }
              }
            }

            if ( this.state.client == null && this.state.userList.length > 0) {
              this.onAvatarPress(this.state.userList[0])
            }
          }}
        />
        <View style={{height: WINDOW_WIDTH * 0.24, marginTop: isIphoneX() ? 35 : 10, borderBottomColor: '#e8e8e8', borderBottomWidth: 2, backgroundColor: 'white'}}>
          <ScrollView horizontal={true} style={{ flex: 1 }} >
            {this.renderChildren()}
          </ScrollView>
        </View>

        <View style={{height: WINDOW_WIDTH * 0.16, paddingLeft: 15, paddingRight: 15, backgroundColor: 'white'}}>
          <View style={{flex: 1, borderBottomColor: '#e8e8e8', borderBottomWidth: 2, flexDirection:'row', justifyContent: 'space-between'}}>
            <View style={{ flexDirection:'row' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={()=>{ this.back(Globals.tabNumber); }}>
                  <Icon name="chevron-left" size={35} color="#000000" />
                </TouchableOpacity>
              </View>
              
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingLeft: 20 }}>
                <Text style={{color: '#222222', fontSize: 20 }} >{this.state.client && this.state.client.name ? this.state.client.name : ''}</Text>
                <Text style={{color: '#00e10b', fontSize: 14 }} >{this.state.client ? 'online now' : ''}</Text>
              </View>
            </View>

            <View style={{ flexDirection:'row'}}>
              <View style={{ justifyContent: 'center', paddingRight: 10 }}>
                <Text style={{color: '#a9a9a9', fontSize: 14, textAlign: 'center'}} >{strLabel.autoDelete.fr}</Text>
              </View>
              <View style={{justifyContent: 'center' }}>
                <Switch
                  value={this.state.isModalMenSwitch}
                  onValueChange={(val) => {this.setState({isModalMenSwitch: !this.state.isModalMenSwitch})}}
                  disabled={false}
                  activeText={''}
                  inActiveText={''}
                  backgroundActive={'#febcde'}
                  backgroundInactive={'#e8e8e8'}
                  circleActiveColor={'#fd2191'}
                  circleInActiveColor={'#a8a8a8'}
                  barHeight={Platform.OS === 'ios' ? 14 : 24}
                  circleSize={24}
                  circleBorderWidth={0}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={{height: isIphoneX() ? WINDOW_HEIGHT - WINDOW_WIDTH * 0.4 - 60 : WINDOW_HEIGHT - WINDOW_WIDTH * 0.4 - 40, 
           backgroundColor: 'white' }}>
          { this.state.client &&
            <GiftedChat 
              ref={node => this.GiftedChatRef = node}
              placeholder={strLabel.writeYourMessage.fr}
              onSend={messages => this.onSend(messages)}
              renderBubble={this.renderBubble}
              renderMessage={this.renderMessage}
              renderMessageImage={this.renderMessageImage}
              messages={this.state.messages}
              renderInputToolbar={this.renderInputToolbar}
              minInputToolbarHeight={
                !this.state.isStickersOpen ?
                this.minInputHeight :
                this.maxInputHeight
              }
              showAvatarForEveryMessage={true}
              bottomOffset={30}
            />
          }
        </View>
        <View style={{height: isIphoneX() ? 30 : 0}} ></View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const props = {
    user: state.userData.user,
    photoList: state.firebaseData.photoList,
    messages: state.chat.messages,
    error: state.chat.loadMessagesError,
    friends: state.chat.friends,
    friendsError: state.chat.loadFriendsError

  };
  return props;
}

export default connect( mapStateToProps )(MessageScreen)
