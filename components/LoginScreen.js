import React, { Component, Fragment } from 'react';
import {
	SafeAreaView, StyleSheet, ScrollView, View, Text,
	StatusBar, Button, Image, ImageBackground, Dimensions, TouchableHighlight, Platform, TouchableOpacity
} from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import Colors from '../constants/Colors.js'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
export default class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pushData: [],
			loggedIn: false,
			//Gmail
			userInfo: null,
			gettingLoginStatus: true
		};
	}
	componentDidMount() {
		//initial configuration
		GoogleSignin.configure({
			//It is mandatory to call this method before attempting to call signIn()
			scopes: ['https://www.googleapis.com/auth/drive.readonly'],
			// Repleace with your webClientId generated from Firebase console
			webClientId: '428166041313-nfb3l5v7ba1ecgk1eio1iop5sj5a9uie.apps.googleusercontent.com',
			iosClientId: '428166041313-0p7l7gcan3rarj74ngnc3njpgvv4rrf8.apps.googleusercontent.com'
		});
		//Check if user is already signed in
		this._isSignedIn();
	}
	_isSignedIn = async () => {
		const isSignedIn = await GoogleSignin.isSignedIn();
		if (isSignedIn) {
			alert('User is already signed in');
			//Get the User details as user is already signed in
			this._getCurrentUserInfo();
		} else {
			//alert("Please Login");
			console.log('Please Login');
		}
		this.setState({ gettingLoginStatus: false });
	};

	_getCurrentUserInfo = async () => {
		try {
			const userInfo = await GoogleSignin.signInSilently();
			console.log('User Info --> ', userInfo);
			this.setState({ userInfo: userInfo });
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_REQUIRED) {
				alert('User has not signed in yet');
				console.log('User has not signed in yet');
			} else {
				alert("Something went wrong. Unable to get user's info");
				console.log("Something went wrong. Unable to get user's info");
			}
		}
	};

	_signIn = async () => {
		//Prompts a modal to let the user sign in into your application.
		try {
			await GoogleSignin.hasPlayServices({
				//Check if device has Google Play Services installed.
				//Always resolves to true on iOS.
				showPlayServicesUpdateDialog: true
			});
			const userInfo = await GoogleSignin.signIn();
			console.log('User Info --> ', userInfo);
			this.setState({ userInfo: userInfo });
			_sendDetailsToServer(true);
		} catch (error) {
			console.log('Message', error.message);
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log('User Cancelled the Login Flow');
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log('Signing In');
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log('Play Services Not Available or Outdated');
			} else {
				console.log('Some Other Error Happened');
			}
		}
	};

	_sendDetailsToServer = async (isGoogleLogin) => {
		Console.log(userInfo);
		fetch('http://52.17.234.14:8022/api/Register', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				first_name: 'yourValue',
				last_name: 'yourOtherValue',
				phone_no: 'yourOtherValue',
				Country: 'yourOtherValue',
				google_token: 'yourOtherValue',
				facebook_token: 'yourOtherValue',
			}),
		}).then((response) => response.json())
			.then((responseJson) => {
				return responseJson.movies;
			})
			.catch((error) => {
				console.error(error);
			});
	}

	_signOut = async () => {
		//Remove user session from the device.
		try {
			await GoogleSignin.revokeAccess();
			await GoogleSignin.signOut();
			this.setState({ userInfo: null }); // Remove the user from your app's state as well
		} catch (error) {
			console.error(error);
		}
	};
	render() {
		return (
			<Fragment>
				<StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
				<ImageBackground
					source={require('../assets/Login/cutebirds.png')}
					//source={{ uri: 'https://wallpapershome.com/images/pages/pic_v/3443.jpg' }}
					style={{
						height: Dimensions.get('window').height,
						width: Dimensions.get('window').width, overflow: 'hidden', flex: 1,
					}}>
					<SafeAreaView style={styles.container}>
						<ScrollView style={styles.scrollView}>
							{global.HermesInternal == null ? null : (
								<View style={styles.engine}>
									<Text style={styles.footer}>Engine: Hermes</Text>
								</View>
							)}
							<View style={styles.content}>
								<Image
									style={styles.logo}
									source={require('../assets/Login/lovebird.png')} />

								<Text style={styles.title}>OffTrack</Text>

								<Text style={styles.signin}>Sign in with</Text>

								<View style={styles.sectionContainer}>
									<TouchableOpacity onLoginFinished={(error, result) => {
										if (error) {
											console.log('login has error: ' + result.error);
										} else if (result.isCancelled) {
											console.log('login is cancelled.');
										} else {
											console.log(result);
											AccessToken.getCurrentAccessToken().then((data) => {
												this.setState({
													loggedIn: true,
													userID: data.userID
												});
												console.log(data, data.accessToken.toString());
											});
										}
									}}
										onLogoutFinished={() =>
											this.setState({
												loggedIn: false,
												userID: ''
											})}>
										<Image
											style={styles.image}
											resizeMode={'contain'}
											source={require('../assets/Login/fb.png')} />
									</TouchableOpacity>
									<View style={styles.line} />
									<TouchableOpacity onPress={() => { this._signIn() }}>
										<Image style={styles.image} source={require('../assets/Login/googleplus.png')} />
									</TouchableOpacity>
								</View>
								<Text style={styles.signin}>Or</Text>
								<Text style={styles.signin}> Create An Account</Text>
							</View>
						</ScrollView>
					</SafeAreaView>
				</ImageBackground>
			</Fragment >

		);
	}
}

const styles = StyleSheet.create({
	container: {
		//backgroundColor: '',
		alignItems: 'center',
		flex: 1,
		width: "100%",
		height: "100%",
		justifyContent: 'center'
	},

	content: {
		justifyContent: "center",
		alignItems: "center",
	},

	line: {
		borderStyle: 'dotted',
		height: 30,
		marginTop: 20,
		borderLeftWidth: 2
	},
	logo: {
		//tintColor: Colors.primary,
		marginTop: 10,
		marginBottom: 10,
	},
	signin: {
		marginTop: 20,
		fontSize: 18
	},
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	image: {
		margin: 10,
		//tintColor: "red",
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 50,
	}
});
