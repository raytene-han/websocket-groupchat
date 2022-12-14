"use strict";

/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);


const name = prompt("Username? (no spaces)");


/** called when connection opens, sends join info to server. */

ws.onopen = function (evt) {
  console.log("open", evt);

  let data = { type: "join", name: name };
  ws.send(JSON.stringify(data));
};


/** called when msg received from server; displays it. */

ws.onmessage = function (evt) {
  debugger;
  console.log("message", evt);
  debugger;
  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  } else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);


  } else {
    return console.error(`bad message: ${msg}`);
  }

  $("#messages").append(item);
};


/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};


/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};


/** send message when button pushed. */

$("form").submit(function (evt) {
  evt.preventDefault();

  // if input id value === "/joke", set type to "get-joke", else, set as chat
  let type;
  const chatInput = $("#m").val();

  if (chatInput === "/joke") type = "get-joke";
  else if (chatInput === "/members") type = "get-members";
  else if (chatInput.startsWith("/priv")) type = "private";
  else {
    type ="chat";
  }

  const data = { type: type, text: chatInput };

  ws.send(JSON.stringify(data));

debugger;
$("#m").val("");
});
