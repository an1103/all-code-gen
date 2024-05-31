import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import Discovery from './components/Learning/Discovery';
import Practice from './components/Learning/Practice';
import Showcase from './components/Learning/Showcase';
import OnePlayerStory from './components/StoryMode/OnePlayerStory';
import TwoPlayerStory from './components/StoryMode/TwoPlayerStory';
import ProgressTracker from './components/Progress/ProgressTracker';
import Feedback from './components/Progress/Feedback';
import AdminDashboard from './components/Dashboard/AdminDashboard';

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/discovery" component={Discovery} />
        <Route path="/practice" component={Practice} />
        <Route path="/showcase" component={Showcase} />
        <Route path="/one-player-story" component={OnePlayerStory} />
        <Route path="/two-player-story" component={TwoPlayerStory} />
        <Route path="/progress-tracker" component={ProgressTracker} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/admin-dashboard" component={AdminDashboard} />
      </Switch>
    </div>
  );
};

export default App;
