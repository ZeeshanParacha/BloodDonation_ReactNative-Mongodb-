import React, { Component } from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

class Settings extends Component {
    static navigationOptions = {
        header : null,
        drawerLabel: 'Settings',
        drawerIcon: ({ tintColor }) => (
            <Ionicons name="ios-settings" size={24} color="#222222" />
        ),
        
      };

    render() {
        
        return (
            <View style={styles.container}>
                <Text>Settings Screen</Text>
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

export default Settings;