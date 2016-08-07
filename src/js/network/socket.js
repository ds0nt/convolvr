import { secure } from '../config.js'

var websocket = new WebSocket((secure ? 'wss:' : 'ws:')+"//"+location.host+"/connect")

let handlers = {}

websocket.onmessage = (message) => {
  let data = JSON.parse(message.data)
  if (!!window.LOG_MSG) {
    console.dir(data)
  }

  if (!!handlers[data.p]) {
    handlers[data.p].map(v => v(data))
  }
}

// Handle a websocket message from server!
export function on(path, handler) {
  if (!handlers[path]) {
    handlers[path] = []
  }
  handlers[path].push(handler)
}

// Handle a websocket message from server!
export function off(path, handler) {
  if (!!handlers[path]) {
    console.warn("trying to remove a handler that is not there")
  }
  handlers[path] = handlers[path].filter(v => v != handler)
}

// Send a websocket message to server!
export function send(path, data) {
  if (websocket.readyState == WebSocket.OPEN) {
    websocket.send(JSON.stringify({
      p: path,
      d: JSON.stringify(data),
    }))
  } else {
    console.warn("socket not ready, will not send", path)
  }
}

var rqid = 1;

// Send a websocket message to server!
export function sendReceive(path, data, cb) {
  data.request_id = rqid
  rqid++
  let hook = res => {
    if (typeof res.request_id !== 'undefined' && res.request_id == data.request_id) {
      cb(res)
      off(path, x)
    }
  }

  on(path, hook)
  send(path, data)
}
