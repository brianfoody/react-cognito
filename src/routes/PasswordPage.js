import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

export default ({ onPasswordUpdate }) => (
  <div style={styles.container}>

    <h2>Update password</h2>
    <p>You need to change your password on first login.</p>

    <TextField
      ref={component => this._password = component}
      hintText='Password'
    /><br />

    <TextField
      ref={component => this._confirmPassword = component}
      hintText='Confirm password'
    /><br />

    <FlatButton
      backgroundColor='#542D6B'
      label='Update password'
      primary={true}
      style={{color: 'white'}}
      onClick={() => onPasswordUpdate(this._password, this._confirmPassword)}
    />

  </div>
)

const styles = {
  container: {
    flex: 1,
    margin: 20
  }
}
