import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

export default () => (
  <div style={styles.container}>
    <CircularProgress size={60} thickness={7} color='#542D6B' />    
  </div>
)

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}
