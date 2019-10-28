import React, { Component } from 'react';
import { Image, TouchableOpacity, Dimensions, View, Text } from 'react-native';


import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';




import HomeScreen from '../screens/home'
import LoginScreen from '../screens/login';
import SignupScreen from '../screens/signup';
import NotificationScreen from '../screens/Notificationscreen';
import DonateBloodScreen from '../screens/Postadd'
import SettingScreen from '../screens/settings';
import PostDetailScreen from '../screens/postdetailscreen'
import MyPostScreen from '../screens/userpost'
import MyDetailPostScreen from '../screens/userdetailpost'


// const AuthNavigator = createStackNavigator(
//     {
//         Auth : AuthScreen
//     }
// );

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: HomeScreen,
  },
  Notifications: {
    screen: NotificationScreen,
  },
  DonateBlood: {
    screen: DonateBloodScreen,
  },
  Setting: {
    screen: SettingScreen,
  },
  MyPosts: {
    screen: MyPostScreen
  }


});

const HomeNavigation = createStackNavigator(
  {
    Login: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
    Home: { screen: MyDrawerNavigator },
    PostDetail: {
      screen: PostDetailScreen,
    },
    MyPostDetail: {
      screen: MyDetailPostScreen
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerTitle: (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', paddingBottom: 16 }}><Text style={{ fontSize: 22, fontWeight: 'bold', paddingTop: 8, color: '#222222', fontFamily: 'Raleway-Regular', }}>SAVE</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold', paddingTop: 8, color: '#e51433', fontFamily: 'Raleway-Regular', }}>LIFE</Text></View>),
        headerTitleStyle: { flex: 1, textAlign: 'center', paddingBottom: 6, fontFamily: 'Raleway-Regular', },
        headerLayoutPreset: 'center',
        headerLeft: (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{
              left: Dimensions.get('window').height < 667 ? '8%' : '3%',
              // backgroundColor: 'red',
              width: '100%',
              marginLeft: 10,
              paddingBottom: 10
            }}>
            <Image
              style={{ width: 30, height: 30 }}
              source={require('../assets/images/toggle.png')}
            />
          </TouchableOpacity>
        ),
        headerRight: <View style={{ height: 50, width: 50 }}></View>,
        headerStyle: { height: 40, },
      };
    }
  },
  // {
  //     initialRouteName: 'Login',

  // },


);

// const AppNavigator = createSwitchNavigator(
//     {
//         Home: HomeNavigation,
//         Auth: AuthScreen,
//     },

//   );



export default createAppContainer(HomeNavigation);