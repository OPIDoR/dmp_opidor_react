import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import Global from './components/context/Global';
import './i18n';
import 'react-tooltip/dist/react-tooltip.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Global>
    <Toaster position="top-center" reverseOrder={false} />
  </Global>,
);
