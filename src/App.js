import React, { Component } from 'react'

import { 
  AuthenticationDetails,
  CognitoUserPool, 
  CognitoUser 
} from 'amazon-cognito-identity-js'

import AWS from 'aws-sdk'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Loader from './components/Loader'
import LandingPage from './routes/LandingPage'
import LoginPage from './routes/LoginPage'
import PasswordPage from './routes/PasswordPage'

import iphoneCase from './img/iphone.svg'
import './App.css'

const poolData = { 
    UserPoolId : 'us-east-2_QZkdRCfgF',
    ClientId: '710b5sfpc77i37bki1ae6606cs'
}

const identityPoolId = 'us-east-2:e9a7031e-9b01-4851-ae49-ce7ee7e969c6'

const userPool = new CognitoUserPool(poolData)

AWS.config.region = 'us-east-2'

const initialiseCognito = (accessToken, callback) => {

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId : identityPoolId, // your identity pool id here 
      Logins : {
          // Change the key below according to the specific region your user pool is in. 
          'cognito-idp.us-east-2.amazonaws.com/us-east-2_QZkdRCfgF' : accessToken
      }
  })

  AWS.config.credentials.get(callback)
}

let completePasswordChallenge

class App extends Component {

  state = {
    loading: true,
    passwordUpdateRequired: false,
    user: undefined
  }

  componentDidMount() {
    const cognitoUser = userPool.getCurrentUser()

    if (!cognitoUser) {
      this.setState({
        loading: false
      })
      return
    }

    var that = this

    cognitoUser.getSession(function(err, session) {
      if (err) {
        console.log('No existing session for user')
      } else {
        initialiseCognito(session.getIdToken().getJwtToken(), () => {
          that.setState({
            loading: false,
            user: cognitoUser
          })
        })
      }
    })
  }

  _onLogin = (usernameField, passwordField) => {
    const username = usernameField.input.value
    const password = passwordField.input.value

    var that = this

    this.setState({
      loading: true
    })

    const authenticationData = {
      Username : username,
      Password : password
    }

    const authenticationDetails = new AuthenticationDetails(authenticationData)

    const userData = {
      Username : authenticationData.Username,
      Pool : userPool
    }

    const cognitoUser = new CognitoUser(userData)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        initialiseCognito(result.getIdToken().getJwtToken(), (err) => {
          if (err) {
            window.alert("An error occurred; " + err)
          } else {
            that.setState({
              loading: false,
              user: cognitoUser,
              passwordUpdateRequired: false
            })
          }
        })
        
      },

      onFailure: function(err) {
        that.setState({
          loading: false
        })
        window.alert(err)
      },

      newPasswordRequired: function(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new  
        // password and required attributes, if any, to complete  
        // authentication. 

        that.setState({
          loading: false,
          passwordUpdateRequired: true
        })

        completePasswordChallenge = (newPassword) => {
          cognitoUser.completeNewPasswordChallenge(newPassword, {}, this)
        }
      }
    })
  }

  _onPasswordUpdate = (passwordField, confirmPasswordField) => {
    const password = passwordField.input.value
    const confirmPassword = confirmPasswordField.input.value

    if (password !== confirmPassword) {
      window.alert('Passwords are not identical.')
      return
    }

    completePasswordChallenge(password)
  }

  _onLogout = () => {
    this.state.user && this.state.user.signOut()

    AWS.config.credentials.clearCachedId()

    this.setState({
      user: undefined
    })
  }

  render() {
    const {
      loading,
      passwordUpdateRequired,
      user
    } = this.state

    const authenticated = !!user

    return (
      <div className="App">
        <div className="AppWrapper">
          <img src={iphoneCase} className="AppWrapperCase" alt="iPhone" />

          <MuiThemeProvider>
            <div className="AppWrapperContent">
              { loading && <Loader /> }

              { 
                !loading && !authenticated && !passwordUpdateRequired && 
                <LoginPage onLogin={this._onLogin}/>
              }

              { 
                !loading && !authenticated && passwordUpdateRequired && 
                <PasswordPage onPasswordUpdate={this._onPasswordUpdate}/>
              }

              {
                !loading && authenticated && 
                <LandingPage logout={this._onLogout} />
              }
            </div>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

export default App
