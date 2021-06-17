import React from 'react';
import { render } from 'react-dom';

import starUrl, { ReactComponent as Star } from './star.svg';

const App = () => (
  <div>
    <img src={starUrl} alt="star" />
    <Star />
  </div>
);

render(<App />, document.getElementById('root'));
