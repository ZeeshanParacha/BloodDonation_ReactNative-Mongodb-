import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Item, Label, Input, Button, Picker, Icon, Container, Header, Content, Card, CardItem,Textarea } from 'native-base';
import * as Font from 'expo-font';

import { MaterialCommunityIcons } from '@expo/vector-icons';

class Donateblood extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Donate Blood',
        drawerIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="flower-tulip-outline" size={24} color="#222222" />
        ),

    };
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            selected2: 'A Positive',
            username: '',
            noUnits: 1,
            urgency: 'Urgent',
            city: 'Karachi',
            hospital: 'Indus Hospital',
            relation: 'None',
            contact: '',
            description : '',
            fontLoaded: false,



        }
        this.donateBlood = this.donateBlood.bind(this)

    }

    async componentWillMount() {
 
        await Font.loadAsync({
            'Raleway-Regular': require('../assets/fonts/Montserrat-Regular.otf'),
        });

        this.setState({fontLoaded : true})
    }

    onValueChange2(value) {
        this.setState({
            selected2: value
        });
    }
    noUnit(value) {
        this.setState({
            noUnits: value
        });
    }
    urgency(value) {
        this.setState({
            urgency: value
        });
    }
    city(value) {
        this.setState({
            city: value
        });
    }
    hospital(value) {
        this.setState({
            hospital: value
        });
    }
    relation(value) {
        this.setState({
            relation: value
        });
    }

    donateBlood() {
        Keyboard.dismiss()
        const { selected2, noUnits, urgency, city, hospital, relation, contact  , description} = this.state;
        // console.log(selected2, noUnits, urgency, city, hospital, relation);
        // console.log('propss--->,', this.props.navigation.getParam('email', 'NO-ID'))
        // console.log('propss--->,', this.props.navigation.getParam('username', 'NO-ID'))
        // console.log('propss--->,', this.props.navigation.getParam('_id', 'NO-ID'))
        // console.log('propss--->,', this.props.navigation.getParam('bloodgroup', 'NO-ID'))

        const email = this.props.navigation.getParam('email', 'NO-ID');
        const username = this.props.navigation.getParam('username', 'NO-ID');
        const bloodgroup = this.props.navigation.getParam('bloodgroup', 'NO-ID');
        const userId = this.props.navigation.getParam('_id', 'NO-ID')


        fetch('http://192.168.0.87:3000/Post/AddPost', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                username: username,
                useremail: email,
                userBloodGroup: bloodgroup,
                userId: userId,
                bloodgroup: selected2,
                relation: relation,
                hospital: hospital,
                city: city,
                units: noUnits,
                urgency: urgency,
                contact: 0+contact, 
                volunteer : 0,
                description : description
            })
        }).then(res => res.json())
            .then((res) => {
                if (res.isUser === false) {
                    Alert.alert('No Post Has been Added!')
                } 
                else {
                    Alert.alert('Post Has been Added!')
                    let tokens = [];
                    fetch('http://192.168.0.87:3000/Auth/sendNotification').then(res => res.json())
                   .then((res) => {
                            let notificationdata = res.result;
                            console.log('notificationdata ---> ',notificationdata)
                            for(let key in notificationdata){
                                tokens.push(notificationdata[key].token)
                            }
                            for (let i = 0; i < tokens.length; i++) {
                                fetch('https://exp.host/--/api/v2/push/send', {
                                    method: 'POST',
                                    headers: {
                                        "Accept": 'application/json',
                                        "Content-Type": 'application/json'
                                    },
                                    body: JSON.stringify({
                                        to: tokens[i],
                                        body: noUnits + ' unit of '+ bloodgroup +' blood required at ' + hospital,
                                        title: username,
                                        sound: 'default',
            
                                    })
                                });
                            }
                       });
                    this.props.navigation.navigate('Home')
                }
            });
    }

    render() {
        return  this.state.fontLoaded ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={styles.container}>
                    <Container >
                        <Content padder>
                            <Card style={{padding: 10}}>
                                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 24,  fontFamily: 'Raleway-Regular', color: '#bc0000', fontWeight: 'bold', marginBottom: 10 }}>Post Blood Requirement</Text>
                                    </View>
                                    <View>
                                        <Item picker>
                                            <Label style={{ fontFamily: 'Raleway-Regular',fontSize : 12}}>Blood Group:</Label>
                                            <Picker style={{fontFamily: 'Raleway-Regular',}}
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                style={{ width: undefined }}
                                                placeholder="Blood Group"
                                                placeholderStyle={{ color: "#bfc6ea" }}
                                                placeholderIconColor="#007aff"
                                                selectedValue={this.state.bloodgroup}
                                                onValueChange={this.onValueChange2.bind(this)}
                                                itemStyle={{fontSize: 15}}
                                               
                                                
                                            >
                                                <Picker.Item label="A Positive" value="A Positive" />
                                                <Picker.Item label="B Positive" value="B Positive" />
                                                <Picker.Item label="O Positive" value="O Positive" />
                                                <Picker.Item label="A Negative" value="A Negative" />
                                                <Picker.Item label="B Negative" value="B Negative" />
                                            </Picker>
                                        </Item>
                                    </View>
                                    <View>
                                        <Item picker>
                                        <Label style={{ fontFamily: 'Raleway-Regular',fontSize : 12}}> No of units:</Label>
                                            <Picker style={{fontFamily: 'Raleway-Regular',}}
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                style={{ width: undefined }}
                                                placeholder="No of Units"
                                                placeholderStyle={{ color: "#bfc6ea" }}
                                                placeholderIconColor="#007aff"
                                                selectedValue={this.state.noUnits}
                                                onValueChange={this.noUnit.bind(this)}
                                            >
                                                <Picker.Item label="1" value="1" />
                                                <Picker.Item label="2" value="2" />
                                                <Picker.Item label="3" value="3" />

                                            </Picker>
                                        </Item>
                                    </View>
                                    <View>
                                        <Item picker>
                                        <Label style={{ fontFamily: 'Raleway-Regular',fontSize : 12}}>Urgency:</Label>
                                            <Picker style={{fontFamily: 'Raleway-Regular',}}
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                style={{ width: undefined }}
                                                placeholder="No of Units"
                                                placeholderStyle={{ color: "#bfc6ea" }}
                                                placeholderIconColor="#007aff"
                                                selectedValue={this.state.urgency}
                                                onValueChange={this.urgency.bind(this)}
                                            >
                                                <Picker.Item label="Urgent" value="Urgent" />
                                                <Picker.Item label="Within 5 hours" value="Within 5 hours" />
                                                <Picker.Item label="Within 12 hours" value="Within 12 hours" />

                                            </Picker>
                                        </Item>
                                    </View>
                                    <View>
                                        <Item picker>
                                        <Label style={{ fontFamily: 'Raleway-Regular',fontSize : 12}}>City:</Label>
                                            <Picker style={{fontFamily: 'Raleway-Regular',}}
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                style={{ width: undefined }}
                                                placeholder="No of Units"
                                                placeholderStyle={{ color: "#bfc6ea" }}
                                                placeholderIconColor="#007aff"
                                                selectedValue={this.state.city}
                                                onValueChange={this.city.bind(this)}
                                            >
                                                <Picker.Item label="Karachi" value="Karachi" />
                                                <Picker.Item label="Lahore" value="Lahore" />
                                                <Picker.Item label="Islamabad" value="Islamabad" />
                                                <Picker.Item label="Multan" value="Multan" />
                                                <Picker.Item label="Quetta" value="Quetta" />
                                                <Picker.Item label="Hydrabad" value="Hydrabad" />


                                            </Picker>
                                        </Item>
                                    </View>
                                    <View>
                                        <Item picker>
                                        <Label style={{ fontFamily: 'Raleway-Regular',fontSize : 12}}>Hospital:</Label>
                                            <Picker style={{fontFamily: 'Raleway-Regular',}}
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                style={{ width: undefined }}
                                                placeholder="No of Units"
                                                placeholderStyle={{ color: "#bfc6ea" }}
                                                placeholderIconColor="#007aff"
                                                selectedValue={this.state.hospital}
                                                onValueChange={this.hospital.bind(this)}
                                            >
                                                <Picker.Item label="Indus Hospital" value="Indus Hospital" />
                                                <Picker.Item label="Ziauddin Hospital" value="Ziauddin Hospital" />
                                                <Picker.Item label="Agha Khan Hospital" value="Agha Khan Hospital" />
                                                <Picker.Item label="Liaquat National Hospital" value="Liaquat National Hospital" />
                                                <Picker.Item label="OMI" value="OMI" />
                                                <Picker.Item label="Jinnah Hospital" value="Jinnah Hospital" />


                                            </Picker>
                                        </Item>
                                    </View>

                                    <View>
                                        <Item picker>
                                        <Label style={{ fontFamily: 'Raleway-Regular',fontSize : 12}}>Relation:</Label>
                                            <Picker style={{fontFamily: 'Raleway-Regular',}}
                                                mode="dropdown"
                                                iosIcon={<Icon name="arrow-down" />}
                                                style={{ width: undefined }}
                                                placeholder="No of Units"
                                                placeholderStyle={{ color: "#bfc6ea" }}
                                                placeholderIconColor="#007aff"
                                                selectedValue={this.state.relation}
                                                onValueChange={this.relation.bind(this)}
                                            >
                                                <Picker.Item label="Father" value="Father" />
                                                <Picker.Item label="Mother" value="Mother" />
                                                <Picker.Item label="Son" value="Son" />
                                                <Picker.Item label="Daughter" value="Daughter" />
                                                <Picker.Item label="Aunt" value="Aunt" />
                                                <Picker.Item label="None" value="None" />


                                            </Picker>
                                        </Item>
                                    </View>
                                    <View>
                                        <Item
                                            style={{ borderBottomColor: '#ccc', paddingBottom: 4, marginBottom: 4 }}
                                        >
                                            <Label style={{ fontFamily: 'Raleway-Regular',fontSize : 12}}>Contact:</Label>
                                            <Input value={this.state.contact} style={{fontFamily: 'Raleway-Regular',}}
                                                keyboardType='numeric'
                                                onChangeText={(text) => { this.setState({ contact: text }) }}
                                            />
                                        </Item>
                                    </View>

                                    <View>
                                        <Textarea rowSpan={5} bordered placeholder="What Happend?"  style={{fontFamily: 'Raleway-Regular', paddingTop : 6}} onChangeText={(text) => { this.setState({ description: text }) }} />
                                    </View>
                                    <View>

                                        <Button style={{ margin: 10, justifyContent: 'center', marginTop: 30, backgroundColor: '#bc0000' }}
                                            onPress={() => { this.donateBlood() }} >
                                            <Text style={{ fontSize: 18, color: 'white' }}>Post Requirement</Text>
                                        </Button>
                                    </View>


                                </ScrollView>
                            </Card>
                        </Content>
                    </Container>
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
        padding: 10
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default Donateblood;