import React, { Component } from "react"

class NoWeb3 extends Component {
  render() {
    return (
      <div className="pure-u-1">
        <div>
          <h2>The kitties you own, know, and love &ndash; on your TV.</h2>
          <p className="logos">
            <img src="/ck-logomark.svg" height="100" alt="CryptoKitties" />{" "}
            <br />
            <span className="plus">+</span> <br />
            <img src="/chromecast.svg" height="50" alt="Chromecast" /> <br />
            <span className="equals">=</span> <br />
            <span className="cat" role="img" aria-label="cat">
              😻
            </span>
            <span className="tv" role="img" aria-label="tv">
              📺
            </span>
          </p>
        </div>
        <div>
          <p>
            To use KittyCast you will need to use the{" "}
            <a href="https://metamask.io/">MetaMask Chrome extension</a> to
            connect to the Ethereum wallet which holds your CryptoKitties.
          </p>
        </div>
      </div>
    )
  }
}

export default NoWeb3
