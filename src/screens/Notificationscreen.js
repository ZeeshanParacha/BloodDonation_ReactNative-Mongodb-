import React, { Component } from 'react';
import { StyleSheet, Text, View , Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

class NotificationScreen extends Component {
    static navigationOptions = {
       
        drawerLabel: 'Notifications',
        drawerIcon: ({ tintColor }) => (
            <MaterialIcons name="notifications-none" size={24} color="#222222" />
        ),
        
      };

    render() {
        return (
            <View style={styles.container}>
                <Text>NotificationScreen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 24,
        height: 24,
      },
});

export default NotificationScreen;