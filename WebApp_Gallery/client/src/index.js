import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import SearchPage from './pages/SearchPage';

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
		<Route exact
							path="/home"
							render={() => (
								<HomePage />
							)}/>
        <Route exact
							path="/search"
							render={() => (
								<SearchPage />
							)}/>
        <Route exact
							path="/Analysis"
							render={() => (
								<AnalysisPage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

