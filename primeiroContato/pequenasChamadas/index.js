const app = require("./app")
const appWs = require("./app-ws")

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log(`App running in port ${port}`)
})

const wss = appWs(server) // passando o retorno do listen (que é um servidor http) para a função appWs

setInterval(() => {
  wss.broadcast({ n: Math.random() })
}, 1000)
