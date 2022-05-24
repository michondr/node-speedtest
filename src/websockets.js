import { WebSocketServer } from "ws";
import { runSpeedTest } from "./packetData.js";

/** @type {Set<WebSocket>} */
const connections = new Set()

export const createWebsocketServer = (server) => {
  const wss = new WebSocketServer({server});

  wss.on('connection', (ws) => {
    connections.add(ws)
    // console.log('created, size: ', connections.size)

    ws.on('close', () => {
      connections.delete(ws)
      // console.log('closed, size: ', connections.size)
    })

    ws.on('message', async (data) => {
      await runSpeedTest(JSON.parse(data))
    });

  });
}

const powerOfTwoToName = (powerOfTwo) => {

  let number = Math.pow(2, powerOfTwo)

  if (powerOfTwo > 20) {
    return (number / 1024 / 1024 + 'mb')
  } else if (powerOfTwo > 10) {
    return (number / 1024 + 'kb')
  } else {
    return (number + 'b')
  }
}

export const sendDownload = async (powerOfTwo, mbps, latencyMiliseconds) => {
  const data = {
    type: 'download',
    field: powerOfTwoToName(powerOfTwo),
    value: mbps,
    latency: latencyMiliseconds,
  }

  const jsonData = JSON.stringify(data);

  for (const connection of connections) {
    connection.send(jsonData)
  }
}

export const sendUpload = async (powerOfTwo, upload, latencyMiliseconds) => {
  const data = {
    type: 'upload',
    field: powerOfTwoToName(powerOfTwo),
    value: upload,
    latency: latencyMiliseconds,
  }

  const jsonData = JSON.stringify(data);

  for (const connection of connections) {
    connection.send(jsonData)
  }
}

