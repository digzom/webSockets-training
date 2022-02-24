import React, { useState } from "react"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  gql,
  useMutation,
} from "@apollo/client"
import {
  Container,
  Flex,
  Grid,
  Input,
  Button,
  GridItem,
  FormLabel,
} from "@chakra-ui/react"
import { WebSocketLink } from "@apollo/client/link/ws"

const link = new WebSocketLink({
  uri: "ws://localhost:4000",
  options: {
    reconnect: true,
  },
})

const client = new ApolloClient({
  link,
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
})

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      user
      content
    }
  }
`
const POST_MESSAGE = gql`
  mutation ($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`

type MessageType = {
  content?: string
  id?: string
  user?: string
}
type DataType = {
  messages: MessageType[]
}
const Messages = ({ user }: { user?: string }) => {
  const { data } = useSubscription<DataType>(GET_MESSAGES)

  if (!data) return null

  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }: MessageType) => (
        <Flex
          justifyContent={user === messageUser ? "flex-end" : "flex-start"}
          paddingBottom={"1em"}
          key={id}
        >
          {user !== messageUser && (
            <Flex
              height={50}
              width={50}
              marginRight="0.5em"
              border="2px solid #e5e6ea"
              borderRadius={25}
              textAlign="center"
              justifyContent="center"
              paddingTop="2"
              fontSize={"16pt"}
            >
              {messageUser?.slice(0, 2).toUpperCase()}
            </Flex>
          )}
          <Flex
            backgroundColor={user === messageUser ? "#58bf56" : "#e5e6ea"}
            color={user === messageUser ? "white" : "black"}
            padding="1em"
            borderRadius={"1em"}
            maxWidth="60%"
          >
            {content}
          </Flex>
        </Flex>
      ))}
    </>
  )
}

type MessageUser = { user?: string; content?: string }
const Chat = () => {
  const [postMessage] = useMutation(POST_MESSAGE)
  const [messageData, setMessageData] = useState<MessageUser>({
    user: "",
  })

  const onSend = () => {
    if (messageData?.content !== undefined && messageData.content.length > 0) {
      postMessage({
        variables: messageData,
      })
    }

    setMessageData({
      ...messageData,
      content: "",
    })
  }

  return (
    <Container>
      <Messages user={messageData?.user} />
      <Grid templateColumns="repeat(4, 1fr)" gap="5">
        <GridItem colSpan={1}>
          <Input
            id="user"
            value={messageData?.user}
            onChange={(e) =>
              setMessageData({ ...messageData, user: e.target.value })
            }
          />
        </GridItem>
        <GridItem colSpan={2}>
          <Input
            id="content"
            value={messageData?.content}
            onChange={(e) =>
              setMessageData({ ...messageData, content: e.target.value })
            }
            onKeyDown={(e) => {
              e.key === "Enter" && onSend()
            }}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Button onClick={() => onSend()}>Enviar</Button>
        </GridItem>
      </Grid>
    </Container>
  )
}

const ApolloProviderCascade = () => {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  )
}

export default ApolloProviderCascade
