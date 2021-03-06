import * as React from "react";
import * as ReactDOM from "react-dom";
import {AppContainer} from "react-hot-loader";
import {BrowserRouter} from "react-router-dom";

import App from "./App";

const render = (AppComponent: any) => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <AppComponent />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById("root"),
  );
};

render(App);

if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });
}
