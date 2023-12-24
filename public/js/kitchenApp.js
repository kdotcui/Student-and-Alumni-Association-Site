$(document).ready(() => {
  $("#modal-button").click(() => {
    let apiToken = $("#apiToken").data("token");

    $(".modal-body").html("");
    $.get(`/api/events?apiToken=${apiToken}`, (results = {}) => {
      let data = results.data;
      if (!data || !data.events) return;
      data.events.forEach((event) => {
        $(".modal-body").append(
          `<div>
  <span class="course-title">
  ${event.title}
  </span>
  <div class='course-description'>
  ${event.description}
  </div>
  <button class='${event.joined ? "joined-button" : "join-button"}' data-id="${
            event._id
          }">${event.joined ? "Joined" : "Join"}</button>
      </div>`
        );
      });
      //Adjusts the button depending on if user joined/not joined
    }).then(() => {
      $(".join-button").click((event) => {
        let $button = $(event.target),
          eventId = $button.data("id");
        $.get(
          `/api/events/${eventId}/attend?apiToken=${apiToken}`,
          (results = {}) => {
            let data = results.data;
            if (data && data.success) {
              $button
                .text("Joined")
                .addClass("joined-button")
                .removeClass("join-button");
            } else {
              $button.text("Try again");
            }
          }
        );
      });
    });
  });
});

const socket = io();

//allows user to submit text to chat
$("#chatForm").submit(() => {
  let text = $("#chat-input").val(),
    userId = $("#chat-user-id").val(),
    userName = $("#chat-user-name").val();
  socket.emit("message", { content: text, userId: userId, userName: userName });

  $("#chat-input").val("");
  return false;
});

//on new message flashes the chat icon
socket.on("message", (message) => {
  displayMessage(message);
  for (let i = 0; i < 2; i++) {
    $(".chat-icon").fadeOut(200).fadeIn(200);
  }
});

//loadss all messages
socket.on("load all messages", (data) => {
  data.forEach((message) => {
    displayMessage(message);
  });
});


//SEnds a notification of user disconnect
socket.on("user disconnected", () => {
  displayMessage({
    userName: "Notice",
    content: "user left the chat",
  });
});

//displays a new user message
let displayMessage = (message) => {
  $("#chat").prepend(
    $("<li>").html(`${
      message.name
    } : <strong class="message ${getCurrentUserClass(message.user)}
    ">
    ${message.content}</strong>`)
  );
};

//gets the current class of a user
let getCurrentUserClass = (id) => {
  let userId = $("#chat-user-id").val();
  return userId === id ? "current-user" : "other-user";
};
