import { WebSocketServer } from "ws";

/** @type {Set<WebSocket>} */
const connections = new Set()

export const createWebsocketServer = (server) => {
  const wss = new WebSocketServer({server});

  wss.on('connection', (ws) => {
    console.log('created, size: ', connections.size)
    connections.add(ws)

    ws.on('close', () => {
      console.log('closed, size: ', connections.size)
      connections.delete(ws)
    })

  });
}

export const sendCurrentData = async () => {
  const data = {
    url: 'https://foo.cz',
    freshData: [1, 2, 4, 5],
  }

  const jsonData = JSON.stringify(data);

  for (const connection of connections) {
    connection.send(jsonData)
  }
}
