import React, { Component } from 'react';
import { Item, Label, Input, Button } from 'native-base';
import { StyleSheet, View, Image, Text, TouchableOpacity, KeyboardAvoidingView, Alert, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import * as Font from 'expo-font';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      isAuth: false,
      fontLoaded: false,
    }
    this.userSignIn = this.userSignIn.bind(this)

  }
  async componentWillMount() {

    await Font.loadAsync({
      'Raleway-Regular': require('../assets/fonts/Montserrat-Regular.otf'),
    });
    this.setState({ fontLoaded: true });

  }

  userSignIn(email, password) {

    Keyboard.dismiss()
    console.log(email, password)
    fetch('http://192.168.0.87:3000/Auth/Login', {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    }).then(res => res.json())
      .then((res) => {
        if (res.isUser === false) {
          this.setState({ isAuth: true, email: '', password: '' })
        } else {
          let username;
          let _id;
          let bloodgroup;
          let userId;
          const result = res.result;
          // console.log('res----->', result)
          for (let key in result) {
            console.log('res123--->', result[key].username)
            username = result[key].username;
            _id = result[key]._id;
            bloodgroup = result[key].bloodgroup;
            userId = result[key].userId;

          }

          this.props.navigation.replace('Home', { email: email, username: username, _id: _id, bloodgroup: bloodgroup, userId: userId })

        }
      });
    //  this.props.navigation.replace('Home')

  }

  render() {
    return this.state.fontLoaded ? (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
         <KeyboardAvoidingView style={{flex:1 , paddingBottom : 10}}>
          <View style={styles.container}>
         
          <View style={{ alignItems: 'center' }}>
            <Image source={require('../assets/images/donation.png')} style={{ width: 140, height: 140, borderRadius: 100 }} />
          </View>

          <Item floatingLabel
            style={{ borderBottomColor: '#ccc', fontFamily: 'Raleway-Regular', paddingBottom: 4, fontSize: 10, marginBottom: 6 }}
          >
            <Label style={{ fontFamily: 'Raleway-Regular', }} >Email</Label>
            <Input value={this.state.email}
              onChangeText={(text) => { this.setState({ email: text }) }}
              style={{ fontFamily: 'Raleway-Regular', }}
            />
          </Item>

          <Item floatingLabel
            style={{ borderBottomColor: '#ccc', fontFamily: 'Raleway-Regular', paddingBottom: 4, fontSize: 10 }}
          >
            <Label style={{ fontFamily: 'Raleway-Regular', }} >Password</Label>
            <Input style={{ fontFamily: 'Raleway-Regular', }}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(text) => this.setState({ password: text })}
            />
          </Item>
          {this.state.isAuth && <View>
            <Text style={{ fontSize: 12, color: 'red' }}>Username or Password Incorrect.</Text>
          </View>}

          <Button style={{ margin: 10, justifyContent: 'center', fontFamily: 'Raleway-Regular', marginTop: 30, backgroundColor: '#bc0000' }}
            onPress={() => { this.userSignIn(this.state.email, this.state.password) }} >
            <Text style={{ fontSize: 18, color: 'white', fontFamily: 'Raleway-Regular', }}>Login</Text>
          </Button>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Signup')}
          >
            <Text style={{ textAlign: 'center', fontFamily: 'Raleway-Regular', }}>Don't Have An Account?</Text>
          </TouchableOpacity>
          </View>
          </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
  
  },
});


export default LoginScreen;