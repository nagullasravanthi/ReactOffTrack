import React, { Component, Fragment } from 'react';
import {
	SafeAreaView, StyleSheet, ScrollView, View, Text,
	StatusBar, Button, Image, ImageBackground, Dimensions, TouchableHighlight, Platform, TouchableOpacity
} from 'react-native';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import Colors from '../constants/Colors.js'
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
export default class LoginScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pushData: [],
			loggedIn: false,
			facebookLoginInfo: null,
			userID: "",
			showDefaultLoginButton: false,
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
			//console.log('User Info --> ', userInfo);
			this.setState({ userInfo: userInfo });
			this._sendDetailsToServer(true);
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_REQUIRED) {
				alert('User has not signed in yet');
				console.log('User has not signed in yet');
			} else {
				alert("Something went wrong. Unab le to get user's info");
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
			//	console.log('User Info --> ', userInfo);
			this.setState({ userInfo: userInfo });
			this._sendDetailsToServer(true);
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
		if (isGoogleLogin)
			console.log('User Info sravs--> ', this.state.userInfo);
		//else console.log("fb id");
		else console.log("fb id", this.state.facebookLoginInfo);
		console.log(JSON.stringify({
			first_name: 'yourValue',
			last_name: 'yourOtherValue',
			phone_no: 'yourOtherValue',
			Country: 'yourOtherValue',
			google_token: 'yourOtherValue',
			facebook_token: 'yourOtherValue',
		}));
		fetch('http://52.17.234.14:8022/api/Register', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				first_name: 'yourValue',
				last_name: 'yourOtherValue',
				phone_no: 7876876876,
				Country: 'yourOtherValue',
				google_token: 'yourOtherValue',
				facebook_token: 'yourOtherValue',
			}),

		}).then((response) => response.json())
			.then((responseJson) => {
				console.log("Response", responseJson);
				//return responseJson.movies;
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
	handleFacebookLogin = async () => {
		LoginManager.logInWithPermissions(['public_profile']).then(
			(result) => {
				if (result.isCancelled) {
					console.log('Login cancelled')
				} else {
					console.log('Login success with permissions: ' + JSON.stringify(result));

					AccessToken.getCurrentAccessToken().then((data) => {
						//console.log("data is ", data);
						this.setState({
							loggedIn: true,
							userID: data.userID,
							facebookLoginInfo: data,
						});
						this._sendDetailsToServer(false);
					});
				}
			},
			(error) => {
				console.log('Login fail with error: ' + error)
			}
		)
	}
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
									<TouchableOpacity onPress={() => { this.handleFacebookLogin() }}>
										<Image style={styles.image} source={require('../assets/Login/fb.png')} />
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
