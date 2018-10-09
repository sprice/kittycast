import React, { Component } from "react"
import PropTypes from "prop-types"
import ChromecastButton from "./ChromecastButton"

class KittyGrid extends Component {
  render() {
    let kittyGrid = ""
    if (this.props.kitties && this.props.kitties.length) {
      kittyGrid = this.props.kitties.map(kitty => {
        const altText = kitty.name
          ? `CryptoKitty ${kitty.name}`
          : `Unnamed CryptoKitty`
        const kittyName = kitty.name ? kitty.name : "unnamed"
        return (
          <div key={kitty.id} className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
            <img src={kitty.image_url} width="200" alt={altText} /> <br />
            <p>{kittyName}</p>
            <ChromecastButton
              image={kitty.image_url}
              sendCast={this.props.sendCast}
            />
          </div>
        )
      })
    }

    return <div className="kitty-grid pure-u-1">{kittyGrid}</div>
  }
}

KittyGrid.propTypes = {
  kitties: PropTypes.array,
  sendCast: PropTypes.func
}

export default KittyGrid
