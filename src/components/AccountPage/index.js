import React, { Component } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
import PasswordChangeForm from '../PasswordChange';
import { withFirebase } from '../Firebase';
import { withTheme } from '../Theme';
import LogoUploader from './LogoUploader';
import Colorpicker from './Colorpicker';
import * as Styled from './styled';

class AccountPage extends Component {
  render() {
    //theme
    const { color } = this.props.theme.state;
    const { saveChanges } = this.props.theme.setters;
    return (
      <Styled.Grid>
        <Styled.Wrapper themeBg={color.hex}>
          <AuthUserContext.Consumer>
            {authUser => (
              <div>
                <h1>Admin: {authUser.email}</h1>
                <PasswordChangeForm />
              </div>
            )}
          </AuthUserContext.Consumer>

          <LogoUploader />

          <Colorpicker />
          <button type="button" onClick={saveChanges}>
            Save Changes
        </button>
        </Styled.Wrapper>
      </Styled.Grid>
    );
  }
}
const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withTheme,
  withAuthorization(condition)
)(AccountPage);