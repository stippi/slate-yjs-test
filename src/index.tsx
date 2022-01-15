import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { v4 as uuid } from 'uuid';
import reportWebVitals from './reportWebVitals';

const id = uuid();

ReactDOM.render(
  <React.StrictMode>
    <App id={id}
         name="Max Mustermann"
         slug="slug"/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
