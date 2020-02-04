import React, { Component, Fragment } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Image } from 'react-native';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import Icon from 'react-native-ionicons';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
export default class LoginController extends Component {
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
				<StatusBar barStyle="dark-content" />
				<SafeAreaView>
					<ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
						{global.HermesInternal == null ? null : (
							<View style={styles.engine}>
								<Text style={styles.footer}>Engine: Hermes</Text>
							</View>
						)}
						<View style={styles.body}>
							<Image
								style={styles.image}
								resizeMode={'contain'}
								source={require('../assets/shipments/add.png')}
							/>
							<View style={styles.sectionContainer}>
								<LoginButton
									onLoginFinished={(error, result) => {
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
										})}
								/>
								<GoogleSigninButton
									style={{ width: 312, height: 48 }}
									size={GoogleSigninButton.Size.Wide}
									color={GoogleSigninButton.Color.Light}
									onPress={this._signIn}
								/>
							</View>
							<View style={styles.buttonContainer}>
								{!this.state.loggedIn && <Text>You are currently logged out</Text>}
							</View>
							{this.state.loggedIn && (
								<View>
									<View style={styles.listHeader}>
										<Text>User Info</Text>
									</View>
									<View style={styles.detailContainer}>
										<Text style={styles.title}>ID</Text>
										<Text style={styles.message}>{this.state.userID}</Text>
									</View>
								</View>
							)}
						</View>
					</ScrollView>
				</SafeAreaView>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: 'white'
	},
	listHeader: {
		backgroundColor: '#eee',
		color: '#222',
		height: 44,
		padding: 12
	},
	detailContainer: {
		paddingHorizontal: 20
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		paddingTop: 10
	},
	message: {
		fontSize: 14,
		paddingBottom: 15,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1
	},
	image: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1
	},
	dp: {
		marginTop: 32,
		paddingHorizontal: 24,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	engine: {
		position: 'absolute',
		right: 0
	},
	body: {
		backgroundColor: '#cdcdcd',
		height: '100%',
		flex: 1,
		flexDirection: 'column',
		width: '100%'
	},
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	buttonContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: 'black'
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
		color: 'black'
	},
	highlight: {
		fontWeight: '700'
	},
	footer: {
		color: 'black',
		fontSize: 12,
		fontWeight: '600',
		padding: 4,
		paddingRight: 12,
		textAlign: 'right'
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	},
	imageStyle: {
		width: 200,
		height: 300,
		resizeMode: 'contain'
	},
	button: {
		alignItems: 'center',
		backgroundColor: '#DDDDDD',
		padding: 10,
		width: 300,
		marginTop: 30
	}
});
