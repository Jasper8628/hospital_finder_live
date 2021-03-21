import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ContextProvider } from './utils/global';
import Admin from "./pages/admin/";
import Home from './pages/home/'

function App() {
  return (
    <ContextProvider>
      <Router>
        <Switch>
          <Route exact path="/"> <Home /></Route>
          <Route exact path="/admin"> <Admin /></Route>
        </Switch>
      </Router>
    </ContextProvider>
  );
}
export default App;
