import React from "react"
import ReactDOM from "react-dom"
import ReactGA from "react-ga"
import "./index.css"
import App from "./App"
import ChromecastProvider from "./ChromecastProvider"
import * as serviceWorker from "./serviceWorker"

if (process.env.NODE_ENV !== "development") {
  ReactGA.initialize(process.env.REACT_APP_GA_ID)
} else {
  ReactGA.initialize("example", { testMode: true })
}

ReactDOM.render(
  <ChromecastProvider>
    <App />
  </ChromecastProvider>,
  document.getElementById("root")
)

serviceWorker.unregister()
