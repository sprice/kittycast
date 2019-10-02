import React, { Component } from "react"
import PropTypes from "prop-types"
import KittyGrid from "./KittyGrid"
import NoWeb3 from "./NoWeb3"
import Loading from "./Loading"
import axios from "axios"
import ReactGA from "react-ga"
import "purecss/build/pure-min.css"
import "purecss/build/grids-responsive-min.css"
import "./App.css"
import "typeface-open-sans"
import getWeb3 from "./utils/getWeb3"
import { ckApiUrl } from "./utils/config"

class App extends Component {
  constructor(props) {
    super(props)

    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)

    this.state = {
      account: null,
      kitties: null,
      web3: null,
      noWeb3: false,
      noAccounts: false,
      accountHasNoKitties: null,
      offset: 0,
      pageLimit: 12,
      totalKitties: 0,
      loading: false
    }
  }

  componentWillMount() {
    this.initializeApi()
  }

  componentWillUnmount() {
    if (this.accountInterval) {
      clearInterval(this.accountInterval)
    }
  }

  initializeApi() {
    axios.defaults.baseURL = ckApiUrl
    axios.defaults.headers.common["x-api-token"] =
      process.env.REACT_APP_CK_API_TOKEN
    this.loadWeb3()
  }

  loadWeb3() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })
        ReactGA.event({
          category: "Page",
          action: "Load",
          label: "With Web3"
        })
        this.loadAccounts()
      })
      .catch(error => {
        ReactGA.event({
          category: "Page",
          action: "Load",
          label: "No Web3"
        })
        if (error.message === "No web3 browser detected") {
          this.setState({ noWeb3: true })
        }
      })
  }

  loadAccounts() {
    this.setState({ accountHasNoKitties: false })
    this.state.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.error("Error getting account")
        return
      }
      if (accounts.length) {
        this.setState({ account: accounts[0] }, () => {
          ReactGA.event({
            category: "CK API",
            action: "Load Kitties",
            label: "Initial"
          })
          this.getKitties()
        })
      } else {
        this.setState({ noAccounts: true })
      }
      this.listenToMetamask()
    })
  }

  listenToMetamask() {
    if (this.accountInterval) {
      clearInterval(this.accountInterval)
    }
    this.accountInterval = setInterval(() => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        if (error) return
        if (accounts[0] !== this.state.account) {
          // Changed account
          if (accounts.length) {
            this.setState({ noAccounts: false })
            this.loadAccounts()
          } else {
            // Logged out
            this.setState({
              kitties: null,
              account: null,
              noAccounts: true
            })
          }
        }
      })
    }, 250)
  }

  getKitties() {
    if (this.state.account) {
      this.setState({ loading: true })
      const address = this.state.account.toLowerCase()
      const url = `/kitties?offset=${this.state.offset}&limit=${
        this.state.pageLimit
      }&owner_wallet_address=${address}`
      axios
        .get(url)
        .then(response => {
          ReactGA.event({
            category: "CK API",
            action: "Load Kitties",
            label: "General"
          })
          const kitties = response.data.kitties
          this.setState({
            kitties,
            totalKitties: response.data.total,
            loading: false
          })
          if (!kitties.length) {
            this.setState({ accountHasNoKitties: true, loading: false })
          }
        })
        .catch(error => {
          console.error("There was an error making the request", error)
        })
    }
  }

  prev(event) {
    event.preventDefault()
    const offset = this.state.offset - this.state.pageLimit
    this.setState({ offset }, () => {
      this.getKitties()
    })
  }

  next(event) {
    event.preventDefault()
    const offset = this.state.offset + this.state.pageLimit
    this.setState({ offset }, () => {
      this.getKitties()
    })
  }

  render() {
    if (this.state.loading) return <Loading />

    let noAccounts
    if (this.state.noAccounts) {
      noAccounts = (
        <div className="pure-u-1">
          {/*<p>Please connect to your Ethereum account using MetaMask.</p>*/}
          <p>
            Thanks for poking around. This side-project needs to be updated to
            the latest and greatest web3 tech.
          </p>
        </div>
      )
    }

    let accountHasNoKitties
    if (this.state.accountHasNoKitties) {
      accountHasNoKitties = (
        <div className="pure-u-1">
          <p>This Ethereum account has no kitties.</p>
        </div>
      )
    }

    let prevLink
    if (this.state.offset >= this.state.pageLimit) {
      prevLink = (
        <span>
          <a href="/" onClick={this.prev}>
            prev
          </a>
        </span>
      )
    }

    let nextLink
    if (
      this.state.totalKitties > this.state.pageLimit &&
      this.state.totalKitties > this.state.offset + this.state.pageLimit
    ) {
      nextLink = (
        <span>
          <a href="/" onClick={this.next}>
            next
          </a>
        </span>
      )
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">KittyCast</h1>
        </header>
        <div className="pure-g">
          {noAccounts}
          {accountHasNoKitties}
          {this.state.noWeb3 && <NoWeb3 />}
          {this.state.kitties &&
            this.state.kitties.length && (
              <div className="pure-u-1">
                <KittyGrid
                  sendCast={this.props.sendCast}
                  kitties={this.state.kitties}
                />
                <div className="pure-u-1">
                  <p>
                    {prevLink} {nextLink}
                  </p>
                </div>
              </div>
            )}
          <footer className="pure-u-1">
            <span>
              This is a <a href="http://www.shawnprice.com">Shawn Price</a>{" "}
              project. KittyCast is not affiliated with CryptoKitties.
            </span>
          </footer>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  sendCast: PropTypes.func
}

export default App
