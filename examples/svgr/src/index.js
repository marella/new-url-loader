import React from 'react';
import { render } from 'react-dom';
import './index.css';
import starUrl, { ReactComponent as Star } from './star.svg';

const App = () => (
  <div>
    <img src={starUrl} alt="star" />
    <Star />
    <span className="star"></span>
  </div>
);

render(<App />, document.getElementById('root'));
