var websocket = new WebSocket("ws://"+location.host+"/connect")

let handlers = {}

websocket.onmessage = (message) => {
  let data = JSON.parse(message.data)
  if (!!window.LOG_MSG) {
    console.dir(data)
  }
  if (!!handlers[data.p]) {
    handlers[data.p](data)
  }
}

// Handle a websocket message from server!
export function on(path, handler) {
  if (!!handlers[path]) {
    console.error("handler already exists")
    return
  }
  handlers[path] = handler
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
