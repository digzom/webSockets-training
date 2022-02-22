const { token } = require("morgan")
const WebSocket = require("ws")

const onError = (ws, err) => {
  console.log(`onError: ${err.message}`)
}

// Essa função será disparada sempre que o servidor receber uma mensagem do cliente
// ws é um objeto, a conexão do cliente com o servidor e podemos utilizá-lo para
// enviar mensagens de volta
const onMessage = (ws, data) => {
  console.log(`onMessage: ${data}`)
  broadcast(data)
  ws.send("recebido!")
}

// através do objeto ws podemos saber qual cliente enviou a mensagem ou lançou o erro
const onConnection = (ws, req) => {
  ws.on("message", (data) => onMessage(ws, data))
  ws.on("error", (error) => onError(ws, error))
  console.log("onConnection")
}

const corsValidation = (origin) => {
  return (
    process.env.CORS_ORIGIN === "*" ||
    process.env.CORS_ORIGIN.startsWith(origin)
  )
}

const verifyClient = (info, callback) => {
  if (!corsValidation(info.origin)) return callback(false)

  const token = info.req.url.split("token=")[1]

  if (token) {
    if (token === "1234") return callback(true)

    return callback(true)
  }

  return callback(false)
}

function broadcast(jsonObject) {
  if (!this.clients) return
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(jsonObject))
    }
  })
}

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server,
    verifyClient,
  })

  wss.on("connection", onConnection)
  wss.broadcast = broadcast

  console.log(`App web socket server is running!`)
  return wss
}
