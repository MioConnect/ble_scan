import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Admin from './admin/admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Switch>
          <Route path="/" render={props => <Admin/>} />
      </Switch>
  </BrowserRouter>
);

