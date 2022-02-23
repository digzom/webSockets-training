import React from "react"
import Chat from "./Chat"
import { ChakraProvider } from "@chakra-ui/provider"
import { theme } from "@chakra-ui/react"

const App = () => (
  <ChakraProvider theme={theme}>
    <Chat />
  </ChakraProvider>
)

export default App
