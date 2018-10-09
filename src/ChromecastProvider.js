import React, { Component } from "react"
import PropTypes from "prop-types"
import ReactGA from "react-ga"

class ChromecastProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      session: null,
      namespace: "urn:x-cast:com.google.cast.kittycast.app",
      appId: process.env.REACT_APP_CHROMECAST_APP_ID,
      chrome: null
    }

    this.initializeCastApi = this.initializeCastApi.bind(this)
    this.onInitSuccess = this.onInitSuccess.bind(this)
    this.onError = this.onError.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.sessionListener = this.sessionListener.bind(this)
    this.sessionUpdateListener = this.sessionUpdateListener.bind(this)
    this.receiverMessage = this.receiverMessage.bind(this)
    this.receiverListener = this.receiverListener.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.sendCast = this.sendCast.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      if (window.chrome && window.chrome.cast.isAvailable) {
        this.setState({ chrome: window.chrome })
        this.initializeCastApi()
      }
    }, 1000)
  }

  initializeCastApi() {
    const sessionRequest = new this.state.chrome.cast.SessionRequest(
      this.state.appId
    )
    var apiConfig = new this.state.chrome.cast.ApiConfig(
      sessionRequest,
      this.sessionListener,
      this.receiverListener
    )

    this.state.chrome.cast.initialize(
      apiConfig,
      this.onInitSuccess,
      this.onError
    )
  }

  // eslint-disable-next-line no-unused-vars
  onInitSuccess() {
    // console.log('onInitSuccess')
  }

  onError(message) {
    ReactGA.event({
      category: "Cast",
      action: "Error",
      label: JSON.stringify(message)
    })
  }

  onSuccess() {
    ReactGA.event({
      category: "Cast",
      action: "Start"
    })
  }

  sessionListener(e) {
    this.setState({ session: e })
    this.state.session.addUpdateListener(this.sessionUpdateListener)
    this.state.session.addMessageListener(
      this.state.namespace,
      this.receiverMessage
    )
  }

  sessionUpdateListener(isAlive) {
    var message = isAlive ? "Session Updated" : "Session Removed"
    message += ": " + this.state.session.sessionId
    console.log(message)
    if (!isAlive) {
      this.setState({ session: null })
    }
  }

  receiverMessage(namespace, message) {
    console.log("receiverMessage: " + namespace + ", " + message)
  }

  // eslint-disable-next-line no-unused-vars
  receiverListener(e) {
    // if(e === 'available') {
    //   console.log('receiver found');
    // }
    // else {
    //   console.log('receiver list empty');
    // }
  }

  sendMessage(message) {
    // @FIXME: We are currently creating a new session for each cast event. Otherwise, once
    // the casting session is stopped, the status of the session is set to `stopped`, and it
    // will return an error if we try to use it again.

    // if (this.state.session !== null) {
    //   this.state.session.sendMessage(
    //     this.state.namespace,
    //     message,
    //     this.onSuccess.bind(this, "Message sent: " + message),
    //     this.onError
    //   )
    // } else {
    this.state.chrome.cast.requestSession(e => {
      this.setState({ session: e })
      this.state.session.sendMessage(
        this.state.namespace,
        message,
        this.onSuccess.bind(this, "Message sent: " + message),
        this.onError
      )
    }, this.onError)
    // }
  }

  sendCast = image => {
    this.sendMessage(image)
  }

  render() {
    return (
      <div>
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, {
            sendCast: this.sendCast
          })
        )}
      </div>
    )
  }
}

ChromecastProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default ChromecastProvider
