new window.EventSource("/sse").onmessage = function (event) {
  window.messages.innerHTML += `<p>${event.data}</p>`;
};

// alert("Code"); Test the JS path

window.FormData.addEventListener("submit", function (event) {
  event.preventDefault();

  window.fetch(`/chat?message=${window.input.value}`);
  window.input.value = "";
});
