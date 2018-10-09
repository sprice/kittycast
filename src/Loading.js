import React, { Component } from "react"

import "./loading.css"

class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <div className="spinner">
          <div className="spin" />
        </div>
      </div>
    )
  }
}

export default Loading
