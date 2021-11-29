import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import Translator from './component/Translator';

import 'antd/lib/message/style/index.css';
import 'antd/lib/upload/style/index.css';
import 'antd/lib/input/style/index.css';
import 'antd/lib/button/style/index.css';

import './App.css';

declare global {
  interface Window {
    electron?: any;
  }
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Translator} />
      </Switch>
    </Router>
  );
}
