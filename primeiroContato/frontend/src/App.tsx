import React, { useState } from "react"
import useWebSocket from "react-use-websocket/"
import { Options } from "react-use-websocket"
import { JsonObjectExpression } from "typescript"

const webSocketConfig: Options = {
  onOpen: () => console.log(`Connected to App WS`),
  queryParams: { token: "123456" },
  onError: (event: Event) => {
    console.error(event)
  },
  shouldReconnect: (closeEvent: CloseEvent) => true,
  reconnectInterval: 3000,
}

function App() {
  const [number, setNumber] = useState<any>()

  const { lastJsonMessage, sendMessage } = useWebSocket("ws://localhost:3001", {
    ...webSocketConfig,
    onMessage: () => setNumber(lastJsonMessage?.n),
  })
  return <div>{number}</div>
}

export default App
