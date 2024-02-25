import { BrowserRouter } from "react-router-dom";
import Router from "./pages/Router";

import { BASE_PATH } from "constants/routes";

function App() {
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Router />
    </BrowserRouter>
  );
}

export default App;
