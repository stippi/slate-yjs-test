import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { name } from 'faker'
import { v4 as uuid } from 'uuid';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App id={uuid()}
         name={`${name.firstName()} ${name.lastName()}`}
         slug="slug"/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
