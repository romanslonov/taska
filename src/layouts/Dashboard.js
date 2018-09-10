import React from "react";
import {Route, Switch} from "react-router-dom";
import HomePage from "../pages/Home";
import ProfilePage from "../pages/Profile";
import Navigation from '../components/Navigation';

function Dashboard() {
  return (
    <div className="dashboard-layout">
      <header>
        <Navigation />
      </header>
      <main className="main">
        <Switch>
          <Route exact path="/" component={HomePage}/>
          <Route path="/profile" component={ProfilePage}/>
        </Switch>
      </main>
    </div>
  )
}

export default Dashboard;
