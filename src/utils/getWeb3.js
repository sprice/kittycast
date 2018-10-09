import Web3 from "web3"
import { infuraApiUrl } from "./config"

const networks = {}

networks.mainnet = `${infuraApiUrl}/${process.env.REACT_APP_INFURA_API_KEY}`

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener("load", function() {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== "undefined") {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      results = {
        web3: web3
      }

      resolve(results)
    } else {
      // We require an injected web3
      const error = new Error("No web3 browser detected")
      reject(error)
    }
  })
})

export default getWeb3
