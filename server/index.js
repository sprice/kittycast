const express = require("express")
const path = require("path")
const favicon = require("serve-favicon")
const server = express()

server.use(favicon(path.join(__dirname, "../build", "favicon.ico")))

server.use("/", express.static(path.join(__dirname, "../build")))

server.get("/chromecast-receiver/player", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/chromecast-receiver.html"))
})

server.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"))
})

const port = process.env.PORT || 5000
server.listen(port, () => {
  console.log("server listening on port " + port)
})
