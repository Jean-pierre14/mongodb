document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();

  window.fetch(`/chat?message=${window.input.value}`);
  console.log(window.input.value);
  window.input.value = "";
});

const messagesElement = document.getElementById("messages");
const eventSource = new EventSource("/sse");

eventSource.onmessage = function (event) {
  const messageElement = document.createElement("p");
  messageElement.textContent = event.data;
  messagesElement.appendChild(messageElement);
};
