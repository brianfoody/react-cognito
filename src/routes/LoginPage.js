import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

export default ({ onLogin }) => (
  <div style={styles.container}>

    <h2>Login</h2>

    <TextField
      ref={component => this._username = component}
      hintText='Username'
    /><br />

    <TextField
      ref={component => this._password = component}
      hintText='Password'
    /><br />

    <FlatButton
      backgroundColor='#542D6B'
      label='Login'
      primary={true}
      style={{color: 'white'}}
      onClick={() => onLogin(this._username, this._password)}
    />
  </div>
)

const styles = {
  container: {
    flex: 1,
    margin: 20
  }
}
