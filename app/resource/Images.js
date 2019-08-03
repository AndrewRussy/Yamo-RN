const Images = {
  emptyImage: null,

  splashImage:                  require('../assets/splash.png'),
  appIconImage:                 require('../assets/app_icon.png'),

  // 4 guide images for startup screen
  firstStepImage:               require('../assets/firstStep.jpg'),
  secondStepImage:              require('../assets/secondStep.jpg'),
  thirdStepImage:               require('../assets/thirdStep.jpg'),
  fourthStepImage:              require('../assets/fourthStep.jpg'),
  
  // tabbar icon images
  firstTabIcon:                 require('../assets/icon_tab1.png'),
  secondTabIcon:                require('../assets/icon_tab2.png'),
  thirdTabIcon:                 require('../assets/icon_tab3.png'),
  fourthTabIcon:                require('../assets/icon_tab4.png'),
  fifthTabIcon:                 require('../assets/icon_tab5.png'),
  firstTabIconRed:              require('../assets/icon_tab1_red.png'),
  secondTabIconRed:             require('../assets/icon_tab2_red.png'),
  thirdTabIconRed:              require('../assets/icon_tab3_red.png'),
  fourthTabIconRed:             require('../assets/icon_tab4_red.png'),
  fifthTabIconRed:              require('../assets/icon_tab5_red.png'),
  
  // find people navbar button images
  dropdownNavButton:            require('../assets/dropDownNavButton.png'),
  notificationNavButton:        require('../assets/alamNavButton.png'),

  // signup Image
  femaleImage:                  require('../assets/femaleAvatar.png'),
  maleImage:                    require('../assets/maleAvatar.png'),

  // Help Screen
  faqIconImage:                 require('../assets/icon_faq.png'),
  licencesIconImage:            require('../assets/icon_licences.png'),
  termsIconImage:               require('../assets/icon_terms.png'),
  contactIconImage:             require('../assets/icon_contact.png'),

  // Profile Screen
  profileEditIcon:              require('../assets/profileEditIcon.png'),
  profileAvatar:                require('../assets/profileAvatar.png'),

  // Edit Profile Screen
  deletePhotoIcon:              require('../assets/deletePhotoIcon.png'),

  gallerySelectIcon:            require('../assets/gallerySelectIcon.png'),
  takePhotoIcon:                require('../assets/takePhotoIcon.png'),

  // Message/Chat Screen
  shareGalleryPhoto: require('../assets/chat/001-image.jpg'),
  shareSticker: require('../assets/chat/002-happiness.jpg'),
  shareFile: require('../assets/chat/003-folder.jpg'),
  shareGIF: require('../assets/chat/004-gif.jpg'),
  shareAudioRecord: require('../assets/chat/005-microphone.jpg'),
  shareTakenPhoto: require('../assets/chat/006-photo-camera.jpg'),

  // //Stickers
  // stickers: [
  //   require('../assets/stickers/DjossGirl.png'),
  //   require('../assets/stickers/Djoss.png'),
  //   require('../assets/stickers/FlatterBoy.png'),
  //   require('../assets/stickers/FlatterGirl.png'),
  //   require('../assets/stickers/Gift.png'),
  //   require('../assets/stickers/HowGirl.png'),
  //   require('../assets/stickers/How.png'),
  //   require('../assets/stickers/KissBoy.png'),
  //   require('../assets/stickers/KissGirl.png'),
  //   require('../assets/stickers/lapboy.png'),
  //   require('../assets/stickers/lapgirl.png'),
  //   require('../assets/stickers/mimbaboy.png'),
  //   require('../assets/stickers/mimbagirl.png'),
  //   require('../assets/stickers/NdemBoy.png'),
  //   require('../assets/stickers/NdemGo.png'),
  //   require('../assets/stickers/NdoloBoy.png'),
  //   require('../assets/stickers/NdoloGirl.png'),
  //   require('../assets/stickers/RdvBoy.png'),
  //   require('../assets/stickers/RdvGirl.png'),
  //   require('../assets/stickers/SadGirl002.png'),
  //   require('../assets/stickers/SexyBoy.png'),
  //   require('../assets/stickers/SexyGirl.png'),
  //   require('../assets/stickers/SorryBoy.png'),
  //   require('../assets/stickers/SorryGirl.png'),
  //   require('../assets/stickers/vexboy.png'),
  //   require('../assets/stickers/vexgirl.png')
  // ],

  //Stickers
  stickers: {
    djossGirl: require('../assets/DjossGirl.png'),
    djossBoy: require('../assets/Djoss.png'),
    flatterBoy: require('../assets/FlatterBoy.png'),
    flatterGirl: require('../assets/FlatterGirl.png'),
    gift: require('../assets/Gift.png'),
    howGirl: require('../assets/HowGirl.png'),
    howBoy: require('../assets/How.png'),
    kissBoy: require('../assets/KissBoy.png'),
    kissGirl: require('../assets/KissGirl.png'),
    lapBoy: require('../assets/lapboy.png'),
    lapGirl: require('../assets/lapgirl.png'),
    mimbaBoy: require('../assets/mimbaboy.png'),
    mimbaGirl: require('../assets/mimbagirl.png'),
    ndemBoy: require('../assets/NdemBoy.png'),
    ndemGirl: require('../assets/NdemGo.png'),
    ndoloBoy: require('../assets/NdoloBoy.png'),
    ndoloGirl: require('../assets/NdoloGirl.png'),
    rvdBoy: require('../assets/RdvBoy.png'),
    rvdGirl: require('../assets/RdvGirl.png'),
    sadGirl: require('../assets/SadGirl002.png'),
    sexyBoy: require('../assets/SexyBoy.png'),
    sexyGirl: require('../assets/SexyGirl.png'),
    sorryBoy: require('../assets/SorryBoy.png'),
    sorryGirl: require('../assets/SorryGirl.png'),
    vexBoy: require('../assets/vexboy.png'),
    vexGirl: require('../assets/vexgirl.png'),
  },

  stickersNameList: {
    djossGirl: '../assets/DjossGirl.png',
    djossBoy: '../assets/Djoss.png',
    flatterBoy: '../assets/FlatterBoy.png',
    flatterGirl: '../assets/FlatterGirl.png',
    gift: '../assets/Gift.png',
    howGirl: '../assets/HowGirl.png',
    howBoy: '../assets/How.png',
    kissBoy: '../assets/KissBoy.png',
    kissGirl: '../assets/KissGirl.png',
    lapBoy: '../assets/lapboy.png',
    lapGirl: '../assets/lapgirl.png',
    mimbaBoy: '../assets/mimbaboy.png',
    mimbaGirl: '../assets/mimbagirl.png',
    ndemBoy: '../assets/NdemBoy.png',
    ndemGirl: '../assets/NdemGo.png',
    ndoloBoy: '../assets/NdoloBoy.png',
    ndoloGirl: '../assets/NdoloGirl.png',
    rvdBoy: '../assets/RdvBoy.png',
    rvdGirl: '../assets/RdvGirl.png',
    sadGirl: '../assets/SadGirl002.png',
    sexyBoy: '../assets/SexyBoy.png',
    sexyGirl: '../assets/SexyGirl.png',
    sorryBoy: '../assets/SorryBoy.png',
    sorryGirl: '../assets/SorryGirl.png',
    vexBoy: '../assets/vexboy.png',
    vexGirl: '../assets/vexgirl.png',
  }
}
export default Images;