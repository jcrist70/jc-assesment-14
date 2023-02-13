import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import './style/image.component.css';
import './style/button.component.css';
import './style/weather.component.css';
import './style/info.component.css';
import App from './app';
import {
    BrowserRouter as Router,
    Switch,
    Link,
    Route
} from "react-router-dom";

const Root = () => (
    <div>
        <Link to="/page-one">Page One</Link><br />
        <Link to="/page-two">Page Two</Link><br />
        <Link to="/page-three">Page Three</Link>
    </div>
);

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Root />
                </Route>
                <Route path="/:id">
                    <App />
                </Route>
            </Switch>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
