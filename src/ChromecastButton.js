import React, { Component } from "react"
import PropTypes from "prop-types"

class ChromecastButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      image: props.image
    }
  }

  sendCast = () => {
    this.props.sendCast(this.state.image)
  }

  render() {
    return (
      <h5>
        <button
          onClick={this.sendCast}
          className="button-small pure-button pure-button-primary"
        >
          Cast
        </button>
      </h5>
    )
  }
}

ChromecastButton.propTypes = {
  image: PropTypes.string.isRequired,
  sendCast: PropTypes.func.isRequired
}

export default ChromecastButton
