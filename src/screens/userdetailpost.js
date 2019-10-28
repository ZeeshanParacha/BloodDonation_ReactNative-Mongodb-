import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Card, CardItem, Left, Body, Icon, Item, Input } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


class MyPostDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            // headerTitle: (<View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10, marginLeft: -40, justifyContent: 'flex-start', marginRight: 10 }}>
            //     <View style={{ marginLeft: 20 }}>
            //         <Text style={{
            //             width: 40, height: 40, borderRadius: 50, fontFamily: 'Raleway-Regular', fontSize: 25, backgroundColor: '#ffa500',
            //             color: '#fff', fontFamily: 'Raleway-Regular', textAlign: 'center', paddingTop: 5, marginLeft: 5, textTransform: 'uppercase'
            //         }}> {navigation.state.params.initial} </Text>
            //     </View>

            //     <View style={{ flexDirection: 'column', marginLeft: 10, alignItems: 'flex-start' }}>
            //         <Text style={{ fontSize: 18, paddingTop: 8, fontFamily: 'Raleway-Regular', color: '#222222' }}>{navigation.state.params.username}</Text>
            //         <Text style={{ fontSize: 12, color: '#8b8b8b', fontFamily: 'Raleway-Regular' }}>{navigation.state.params.contact}</Text>
            //     </View>


            // </View>),
            // headerTitleStyle: { flex: 1, textAlign: 'left', paddingBottom: 6, marginRight: 20, justifyContent: 'flex-start', alignItems: 'flex-start' },
            // headerLayoutPreset: 'left',

            headerLeft: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('MyPosts')}
                    style={{
                        left: Dimensions.get('window').height < 667 ? '8%' : '3%',
                        // backgroundColor: 'red',
                        width: '100%',
                        marginLeft: 10,
                        marginBottom: 8
                    }}>
                    <Ionicons name="ios-arrow-round-back" size={32} color="black" />
                </TouchableOpacity>
            ),
            headerRight: <View style={{ height: 50, width: 50 }}></View>,
            headerStyle: { height: 40, },
        };
    }
    constructor(props) {
        super(props)
        this.state = {

            fontLoaded: false,
            MyPost: [],
            VolunteersData: [],
            comment: '',
            comments: [],

        }
            this.donated = this.donated.bind(this)
    }
    async componentWillMount() {
        const postId = this.props.navigation.getParam('postId', 'NO-ID')
        console.log('PostId--->', postId)
        await Font.loadAsync({
            'Raleway-Regular': require('../assets/fonts/Montserrat-Regular.otf'),
        });


        let MyPost = [];
        let newArr;
        let volunteersArr;
        let VolunteersData = [];
        let comments = []

        fetch('http://192.168.0.87:3000/Post/getUserPost', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                _id: postId
            })
        })
            .then(res => (res.json()))
            .then((res) => {
                let result = res.result;
                for (let key in result) {
                    newArr = result[key];
                    newArr.initial = result[key].username[0]
                    volunteersArr = result[key].volunteers;

                    MyPost.push(newArr)
                }
                this.setState({ MyPost, volunteersArr })
            }).then(() => {
                console.log('volunteersList --->', volunteersArr)
                let donation;
                let newval;
                for(let key in volunteersArr){
                        donation = volunteersArr[key].donation
                }
                fetch('http://192.168.0.87:3000/Auth/getAllVolunteers', {
                    headers: { "Content-Type": "application/json; charset=utf-8" },
                    method: 'POST',
                    body: JSON.stringify({
                        list: volunteersArr,
                    })
                }).then(res => res.json())
                    .then((res) => {
                        let result = res.result;
                        for (let key in result) {
                            newval = result[key]
                            newval.donation = donation;
                            VolunteersData.push(newval)
                        }
                        this.setState({ VolunteersData })
                    })
            });

        fetch('http://192.168.0.87:3000/Comment/getAllComments', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                postId: postId,
            })
        }).then(res => res.json()).then((res) => {
            let commentres = res.result;
            for (let key in commentres) {
                comments.push(commentres[key])
            }
            this.setState({ comments })
            console.log('comments--->', comments)


        })


        this.setState({ fontLoaded: true });

    }

    sendMessage(comment) {
        console.log('çomments--->', comment)
        const postId = this.props.navigation.getParam('postid', 'NO-ID')
        const username = this.props.navigation.getParam('username', 'NO-username')

        fetch('http://192.168.0.87:3000/Comment/AddComment', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify({
                comment: comment,
                postId: postId,
                users: username
            })
        })
            .then(res => (res.json()))
            .then((res) => {

                this.setState({ comment: '' })
            })


    }

    donated(volunteerId){
        const postId = this.props.navigation.getParam('postId', 'NO-ID');
       
        fetch('http://192.168.0.87:3000/Post/donated', {
            headers: { "Content-Type": "application/json; charset=utf-8" },
             method: 'POST',
              body: JSON.stringify({
              _id :postId,
              volunteers : volunteerId
             })
           }).then(res=>res.json())
           .then(res => console.log('Added'));
    }
    render() {
        console.log('---->', this.state.VolunteersData)
        return this.state.fontLoaded ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAwareScrollView
                    enableOnAndroid
                    enableAutomaticScroll
                    keyboardOpeningTime={0}
                    extraHeight={Platform.select({ android: 200 })}
                >
                    <SafeAreaView style={styles.container}>
                        <Card>
                            {this.state.MyPost.map((item, index) => {

                                return (

                                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} key={item._id}>
                                        <View>
                                            <CardItem header bordered>
                                                <Left>
                                                    <TouchableOpacity>
                                                        <Text style={{
                                                            width: 50, height: 50, borderRadius: 50, fontSize: 28, backgroundColor: '#ffa500',
                                                            color: '#fff', fontFamily: 'Raleway-Regular', textAlign: 'center', paddingTop: 8, textTransform: 'uppercase'
                                                        }}> {item.initial} </Text>
                                                    </TouchableOpacity>
                                                    <Body>
                                                        <Text style={{ fontFamily: 'Raleway-Regular' }}>{item.username}</Text>
                                                        <Text style={{ fontFamily: 'Raleway-Regular', fontSize: 10, color: '#8d8d8d', }} note>{item.userBloodGroup}</Text>
                                                    </Body>
                                                </Left>
                                            </CardItem>
                                        </View>
                                        <View>
                                            <CardItem bordered>
                                                <Body>
                                                    <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• {item.units} Units of Blood Required.</Text>
                                                    <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Location : {item.hospital}</Text>
                                                    <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• City : {item.city}</Text>
                                                    <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Urgency : {item.urgency}</Text>
                                                    <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Contact At :  {item.contact}</Text>
                                                    <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>• Volunteers : {item.volunteer}</Text>
                                                    <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular', marginTop: 5 }}>{item.description}</Text>
                                                </Body>
                                            </CardItem>
                                        </View>
                                        <View style={{ borderColor: '#eee', borderWidth: 1, }}>
                                            <View style={{ backgroundColor: '#eee', marginBottom: 4 }}>
                                                <CardItem footer style={{ backgroundColor: '#eee' }}>
                                                    <Text style={{ fontFamily: 'Raleway-Regular', fontSize: 16, textTransform: 'uppercase' }}>Volunteers</Text>
                                                </CardItem>

                                            </View>

                                            <View header>

                                                {this.state.VolunteersData.map((item, index) => {
                                                    return (

                                                        <View key={index} style={{ padding: 10, paddingLeft: 14, borderColor: '#eee', borderWidth: 1, marginBottom: 6, marginLeft: 4, marginRight: 4 }}>

                                                            <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>
                                                                <Text style={{ color: '#222222', fontWeight: 'bold' }}>{item.username}</Text>
                                                                {"\n"}

                                                                <Text style={{ paddingLeft: 18 }}>{item.bloodgroup}</Text>

                                                            </Text>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', flex: 1, color: 'white' , marginTop : 8 }}>
                                                                <View style={{ backgroundColor: item.donation == 'Donated' ? 'green' : '#ccc', flex: 0.5, textAlign: 'center', borderRightColor: '#eee', borderRightWidth: 1 }}>
                                                                    <TouchableOpacity onPress={() => { this.donated(item._id) }} >
                                                                        <Text style={{ textAlign: 'center', fontFamily: 'Raleway-Regular', padding: 10, color: '#fff' }}>Donated</Text>
                                                                    </TouchableOpacity>
                                                                </View>

                                                                <View style={{ backgroundColor: item.donation == 'Not Donated' ? 'red' : '#ccc', flex: 0.5, textAlign: 'center' }}>
                                                                    <TouchableOpacity onPress={() => {this.notDonated()}}>
                                                                        <Text style={{ fontFamily: 'Raleway-Regular', padding: 10, color: '#fff', textAlign: 'center' }}>Not Donated</Text>
                                                                    </TouchableOpacity>
                                                                </View>


                                                            </View>
                                                        </View>

                                                    )
                                                })}

                                            </View>

                                            <View style={{ backgroundColor: '#eee', marginBottom: 4 }}>
                                                <CardItem footer style={{ backgroundColor: '#eee' }}>
                                                    <Text style={{ fontFamily: 'Raleway-Regular', fontSize: 16, textTransform: 'uppercase' }}>Comments</Text>
                                                </CardItem>

                                            </View>

                                            <View header>

                                                {this.state.comments.map((item, index) => {
                                                    return (

                                                        <View key={index} style={{ padding: 10, paddingLeft: 14, borderColor: '#eee', borderWidth: 1, marginBottom: 6, marginLeft: 4, marginRight: 4 }}>
                                                            <Text style={{ color: '#8d8d8d', fontFamily: 'Raleway-Regular' }}>
                                                                <Text style={{ color: '#222222', fontWeight: 'bold' }}>{item.users}</Text>
                                                                {"\n"}

                                                                <Text style={{ paddingLeft: 18 }}>{item.comment}</Text>

                                                            </Text>
                                                        </View>

                                                    )
                                                })}

                                            </View>
                                        </View>
                                        <View style={{ borderWidth: 1, borderColor: '#222222', marginBottom: 6, marginLeft: 4, marginRight: 4 }}>
                                            <Item>
                                                <Input placeholder='Comments...' value={this.state.comment} onChangeText={(text) => { this.setState({ comment: text }) }} style={{ fontFamily: 'Raleway-Regular', fontSize: 13 }} />
                                                <TouchableOpacity onPress={() => { this.sendMessage(this.state.comment) }}>
                                                    <Icon active name='ios-send' style={{ fontSize: 30, color: '#222222' }} />
                                                </TouchableOpacity>

                                            </Item>
                                        </View>
                                    </ScrollView>

                                )
                            })}
                        </Card>
                    </SafeAreaView>

                </KeyboardAwareScrollView>
            </TouchableWithoutFeedback>
        ) : null;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default MyPostDetail;