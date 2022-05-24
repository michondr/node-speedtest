import 'dotenv/config'
import {
  createWebsocketServer,
} from "./src/websockets.js";
import { app } from "./src/app.js";

const port = process.env.APP_PORT
const target = process.env.TARGET

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
  console.log(`Target server ${target}`)
})

createWebsocketServer(server)
