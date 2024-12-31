function loadChat(contactName) {
  // Fetch the chat area element
  var chatArea = document.getElementById('chat-area');

  // Load the chat content dynamically (for simplicity, using static HTML here)
  var chatContent = `
        <div class="chat-area">
            <div class="chat-header">
                <img src="../../assets/profile.png" alt="Profile Image">
                <span class="chat-name">${contactName}</span>
            </div>
            <div class="chat-messages">
                <div class="message received">
                    <p>Hello, how are you?</p>
                    <span class="timestamp">10:30 AM</span>
                </div>
                <div class="message sent">
                    <p>I'm good, thank you! How about you?</p>
                    <span class="timestamp">10:32 AM</span>
                </div>
                <!-- Add more messages as needed -->
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type a message...">
                <button>Send</button>
            </div>
        </div>
    `;

  // Insert the chat content into the chat area
  chatArea.innerHTML = chatContent;

  // Optionally, you can hide the contacts list for a more focused chat view
  document.getElementById('contacts-list').style.display = 'none';
}