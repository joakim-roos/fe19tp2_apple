import React, { Component } from 'react';
import * as Styled from './styled';
import { withFirebase } from '../Firebase';


const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.withFirebase.doPasswordUpdate(passwordOne).then(() => {
      this.setState({ ...INITIAL_STATE });
    });

    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === '';
    return (
      <Styled.Grid>
        <form onSubmit={this.onSubmit}>
          <input
            name='passwordOne'
            value={passwordOne}
            onChange={this.onChange}
            type='password'
            placeholder='New Password'
          />
          <input
            name='passwordTwo'
            value={passwordTwo}
            onChange={this.onChange}
            type='password'
            placeholder='Confirm New Password'
          />
          <button disabled={isInvalid} type='submit'>
            Reset My Password
        </button>
          {error && <p>{error.message}</p>}
        </form>
      </Styled.Grid>
    );
  }
}
export default withFirebase(PasswordChangeForm);
