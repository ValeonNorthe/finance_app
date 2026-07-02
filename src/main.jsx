import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // 追加
import App from './App.jsx';
import store from './store/index.js';   // 追加

// スタイルの読み込み
import './index.css';
import './App.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);