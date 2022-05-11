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
    download: [{'4kb': 120}, {'64mb': 50}],
    upload: [{'8kb': 14}, {'1b': 15}, {'2b': 29}, {'4b': 30}, {'8b': 31}, {'16b': 32}, {'32b': 33}, {'64b': 34}, {'128b': 35}, ],
  }

  const jsonData = JSON.stringify(data);

  for (const connection of connections) {
    connection.send(jsonData)
  }
}
