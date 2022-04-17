import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import ArtworkPage from './pages/ArtworkPage';
import SearchPage from './pages/SearchPage';
import AnalysisPage from './pages/AnalysisPage';

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        {/* <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
		<Route exact
							path="/home"
							render={() => (
								<HomePage />
							)}/>  */}

		<Route exact
							path="/artwork"
							render={() => (
								<ArtworkPage />
							)}/> 		

        <Route exact
							path="/search"
							render={() => (
								<SearchPage />
							)}/>
        <Route exact
							path="/analysis"
							render={() => (
								<AnalysisPage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

