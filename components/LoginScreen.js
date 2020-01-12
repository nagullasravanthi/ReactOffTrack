import React, { Component, Fragment } from 'react';
import TouchableHighlight from 'react-native';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Image } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import Icon from 'react-native-ionicons';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
export default class LoginScreen extends Component {
	render() {
		return (
			<Fragment>
				<StatusBar barStyle="dark-content" />
				<SafeAreaView>
					<ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
						{global.HermesInternal == null ? null : (
							<View style={styles.engine}>
								<Text style={styles.footer}>Engine: Hermes</Text>
							</View>
						)}
						<View style={styles.container}>
							<Image
								style={styles.image}
								resizeMode={'contain'}
								source={require('../assets/shipments/add.png')}
							/>

							<Text style={styles.title}>OffTrack</Text>

							<Text style={styles.signin}>Sign in with</Text>

							<View style={styles.sectionContainer}>
								<Image
									style={styles.image}
									resizeMode={'contain'}
									source={require('../assets/shipments/add.png')}
								/>
								<TouchableHighlight onPress={() => this.moveToAddNewCustomer()}>
									<Image style={styles.image} source={require('../assets/shipments/add.png')} />
								</TouchableHighlight>
							</View>
							<Text style={styles.signin}>Or</Text>
							<Text style={styles.signin}>Create An Account</Text>
						</View>
					</ScrollView>
				</SafeAreaView>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'center'
	},
	signin: {
		marginTop: 50,
		fontSize: 18
	},
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	image: {
		margin: 10
	},
	scrollView: {
		backgroundColor: 'white'
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		paddingTop: 10
	}
});
