import React from 'react'

import FlatButton from 'material-ui/FlatButton'

export default ({ logout }) => (
  <div style={styles.container}>

    <h2>TABtouch</h2>
    <p>You are now logged in.</p>

    <FlatButton
      backgroundColor='#542D6B'
      label='Logout'
      primary={true}
      style={{color: 'white'}}
      onClick={logout}
    />

  </div>
)

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
}
