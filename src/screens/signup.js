import React, { Component } from 'react';
import { Item, Label, Input, Button, Picker, Icon } from 'native-base';
import { StyleSheet, View, ScrollView, Image, Text, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
class SignupScreen extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            selected2: 'A Positive',
            username: '',
            expoToken : '',
        }
        this.userSignUp = this.userSignUp.bind(this)

    }

    onValueChange2(value) {
        this.setState({
            selected2: value
        });
    }

    registerForPushNotificationAsync = async () => {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
       
        this.setState({ expoToken: token })
    }

    async componentDidMount() {
        await this.registerForPushNotificationAsync();
    }

    userSignUp(email, password, username) {
        Keyboard.dismiss()
        const selectedValue = this.state.selected2;
        console.log(email, password, username, selectedValue)

        fetch('http://192.168.0.87:3000/Auth/Signup', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                email: email.toLowerCase(),
                password: password,
                username: username,
                bloodgroup: selectedValue,
                token : this.state.expoToken,

            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isUser === false) {
                    this.setState({ isAuth: true , email : '', password :'',username : '' , selected2 : '' })
                } else {
                    this.props.navigation.navigate('Login')
                }
            });
    }
    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={styles.container}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../assets/images/donation.png')} style={{ width: 140, height: 140, borderRadius: 100 }} />
                        </View>
                        <View>
                            <Item floatingLabel
                                style={{ borderBottomColor: '#222222', paddingBottom: 4, marginBottom: 4 }}
                            >
                                <Label>Username</Label>
                                <Input value={this.state.username}
                                    onChangeText={(text) => { this.setState({ username: text }) }}
                                />
                            </Item>
                        </View>
                        <View>
                            <Item floatingLabel
                                style={{ borderBottomColor: '#222222', paddingBottom: 4, marginBottom: 4 }}
                            >
                                <Label>Email</Label>
                                <Input value={this.state.email}
                                    onChangeText={(text) => { this.setState({ email: text }) }}
                                />
                            </Item>
                        </View>


                        <View>
                            <Item floatingLabel
                                style={{ borderBottomColor: '#222222', paddingBottom: 4, marginBottom: 4 }}
                            >
                                <Label>Password</Label>
                                <Input
                                    secureTextEntry={true}
                                    value={this.state.password}
                                    onChangeText={(text) => this.setState({ password: text })}
                                />
                            </Item>
                        </View>
                        <View>
                            <Item picker>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Blood Group"
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.selected2}
                                    onValueChange={this.onValueChange2.bind(this)}
                                >
                                    <Picker.Item label="A Positive" value="A Positive" />
                                    <Picker.Item label="B Positive" value="B Positive" />
                                    <Picker.Item label="O Positive" value="O Positive" />
                                    <Picker.Item label="A Negative" value="A Negative" />
                                    <Picker.Item label="B Negative" value="B Negative" />
                                </Picker>
                            </Item>
                        </View>
                        {this.state.isAuth && <View>
                            <Text style={{ fontSize: 12, color: 'red' }}>Email already registered.</Text>
                        </View>}
                        <View>

                            <Button style={{ margin: 10, justifyContent: 'center', marginTop: 30, backgroundColor: '#bc0000' }}
                                onPress={() => { this.userSignUp(this.state.email, this.state.password, this.state.username) }} >
                                <Text style={{ fontSize: 18, color: 'white' }}>Signup</Text>
                            </Button>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Text style={{ textAlign: 'center' }}>Already have an Account?</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 10
    },
});


export default SignupScreen;