import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity , ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, List } from 'native-base';
import * as Font from 'expo-font';
class HomeScreen extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'Home',
        drawerIcon: ({ tintColor }) => (
            <MaterialCommunityIcons active name="home-outline" size={24} color="#222222" />
        ),
        headerTitleStyle: {
            fontFamily: 'Raleway-Regular',
            
          }

    };
    constructor(props) {
        super(props)
        this.state = {
            AllPosts: [],
            fontLoaded: false,
            bgColor: ['#8a2be2', '#daa520', '#daa520', '#ff7f50', '#ffa500', '#5ac18e'],
            selectedColor: '',
            volunteercount : 0

        }
        this._getRandomColor = this._getRandomColor.bind(this)
        this._getVolunteer = this._getVolunteer.bind(this)
    }
    componentWillMount() {

        let AllPosts = [];
        let newArr;
        fetch('http://192.168.0.87:3000/Post/getAllPosts')
            .then(res => (res.json()))
            .then((res) => {
                let result = res.result;
                for (let key in result) {
                    newArr = result[key];
                    newArr.initial = result[key].username[0]

                    AllPosts.push(newArr)

                }
                this.setState({ AllPosts })
            });




    }
    _getRandomColor() {
        var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
        return item;
    }
    async componentDidMount() {
        this._getRandomColor()

        await Font.loadAsync({
            'Raleway-Regular': require('../assets/fonts/Montserrat-Regular.otf'),
        });
        this.setState({ fontLoaded: true });

    }
    _getVolunteer(postid) {
       
        const volunteerId = this.props.navigation.getParam('_id', 'NO-ID')
        console.log('_id--->' , postid)
        fetch('http://192.168.0.87:3000/Post/AddVolunteer', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
             method: 'POST',
              body: JSON.stringify({
              _id :postid,
              volunteers : volunteerId
             })
           }).then(res=>res.json())
           .then(res => console.log('Added'));
    }

    render() {
        console.log('AllPostsrender--->', this.state.AllPosts)
        console.log('postId' ,this.props.navigation.getParam('_id', 'NO-ID'))
        console.log(this.props.navigation.getParam('userId', 'NO-ID'))

      

        return this.state.fontLoaded ? (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ justifyContent: 'center' }}>
                    {this.state.AllPosts.map((item, index) => {

                        return (
                            <View style={{margin: 10}} key={item._id}>
                                <View padder>
                                    <Card>
                                        <CardItem header bordered>
                                            <Left>
                                                <TouchableOpacity>
                                                    <Text style={{
                                                        width: 50, height: 50, borderRadius: 50, fontSize: 28, backgroundColor: this._getRandomColor(),
                                                        color: '#fff', fontFamily: 'Raleway-Regular', textAlign: 'center', paddingTop: 8, textTransform: 'uppercase'
                                                    }}> {item.initial} </Text>
                                                </TouchableOpacity>
                                                <Body>
                                                    <Text style={{ fontFamily: 'Raleway-Regular' }}>{item.username}</Text>
                                                    <Text style={{ fontFamily: 'Raleway-Regular' }} note>{item.userBloodGroup}</Text>
                                                </Body>
                                            </Left>
                                        </CardItem>
                                        <CardItem bordered>
                                            <Body>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• {item.units} Units of Blood Required.</Text>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Location : {item.hospital}</Text>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• City : {item.city}</Text>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Urgency : {item.urgency}</Text>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Contact At :  {item.contact}</Text>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Volunteers : {item.volunteer}</Text>

                                            </Body>
                                        </CardItem>
                                        <View footer bordered style={{ flexDirection: 'row', justifyContent: 'space-evenly', flex: 1, color: 'white' }}>
                                            <View style={{ backgroundColor: '#ccc', flex: 0.5 , textAlign : 'center' , borderRightColor : '#eee' , borderRightWidth : 1 }}>
                                                <TouchableOpacity onPress={() => { this._getVolunteer(item._id) }} >
                                                    <Text style={{ textAlign : 'center', fontFamily: 'Raleway-Regular', padding: 10, color: '#fff' }}>Volunteer</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ backgroundColor: '#ccc', flex: 0.5 , textAlign : 'center' }}>
                                                <TouchableOpacity onPress={()=> {this.props.navigation.navigate('PostDetail' , {postid :item._id , initial : item.initial , username : item.username ,userblood : item.userBloodGroup , contact : item.contact  })}}>
                                                    <Text style={{ fontFamily: 'Raleway-Regular', padding: 10, color: '#fff' , textAlign : 'center' }}>Comment</Text>
                                                </TouchableOpacity>
                                            </View>


                                        </View>
                                    </Card>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        ) : null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default HomeScreen;