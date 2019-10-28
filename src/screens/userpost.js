import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, List } from 'native-base';
import * as Font from 'expo-font';
class UserPosts extends Component {
    static navigationOptions = {
        header: null,
        drawerLabel: 'My Posts',
        drawerIcon: ({ tintColor }) => (
            <Entypo active name="documents" size={24} color="#222222" />
        ),
        headerTitleStyle: {
            fontFamily: 'Raleway-Regular',
        }

    };
    constructor(props) {
        super(props)
        this.state = {
            UserPost: [],
            fontLoaded: false,
        }
        this.detailScreen = this.detailScreen.bind(this)
    }
    componentWillMount() {
        const userId = this.props.navigation.getParam('_id', 'NO-ID')
        let UserPost = [];
        let newArr;
        fetch('http://192.168.0.87:3000/Post/getMyPost', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                _id: userId
            })
        })
            .then(res => (res.json()))
            .then((res) => {
                let result = res.result;
                for (let key in result) {
                    newArr = result[key];
                    newArr.initial = result[key].username[0]

                    UserPost.push(newArr)
                }
                this.setState({ UserPost })
            })
            console.log('AllPostsrender--->', this.state.UserPost)
    }

    async componentDidMount() {
        await Font.loadAsync({
            'Raleway-Regular': require('../assets/fonts/Montserrat-Regular.otf'),
        });
        this.setState({ fontLoaded: true });

    }

    detailScreen(postId){
            this.props.navigation.navigate('MyPostDetail' , {postId : postId})
    }
    render() {
        console.log('AllPostsrender--->', this.state.UserPost)
        return this.state.fontLoaded ? (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={{ justifyContent: 'center' }}>
                    {this.state.UserPost.map((item, index) => {

                        return (
                            <TouchableOpacity style={{ margin: 10 }} key={item._id} onPress={()=> this.detailScreen(item._id)}>
                                <View padder>
                                    <Card>
                                        <CardItem bordered>
                                            <Body>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>Required {item.units} units of {item.bloodgroup} Blood At {item.hospital}.</Text>
                                                <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>Status : Not Fulfilled</Text>

                                            </Body>
                                        </CardItem>
                                    </Card>
                                </View>
                            </TouchableOpacity>
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

export default UserPosts;