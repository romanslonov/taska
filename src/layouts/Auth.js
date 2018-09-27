import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import injectSheet from 'react-jss';
import LoginPage from '../pages/auth/Login';
import RegisterPage from '../pages/auth/Register';
import AuthenticationChecker from '../components/Authentication';
import NotFoundPage from '../pages/NotFound';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
};

const AuthLayout = (props) => {
  const { classes } = props;
  return (
    <main className={classes.root}>
      <Switch>
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        {/* 404 route */}
        <Route component={AuthenticationChecker(NotFoundPage)} />
      </Switch>
    </main>
  );
};

AuthLayout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(AuthLayout);
