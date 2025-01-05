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
                    <span class="timestamp received-time">10:30 AM</span>
                </div>
                <div class="message sent">
                    <p>I'm good, thank you! How about you?</p>
                    <span class="timestamp sent-time">10:32 AM</span>
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

  // Hide the navbar and top bar
  parent.document.querySelector('.bottom-navbar').classList.add('hidden');
  parent.document.querySelector('.top-bar').classList.add('hidden');

  // Add event listeners to handle keyboard events
  const chatInput = document.querySelector('.chat-input');
  const inputField = chatInput.querySelector('input');
  const chatMessages = document.querySelector('.chat-messages');

  inputField.addEventListener('focus', () => {
    setTimeout(() => {
      chatInput.style.bottom = `${window.innerHeight - inputField.getBoundingClientRect().bottom}px`;
      chatMessages.scrollTop = chatMessages.scrollHeight; // Keep the recent message in view
    }, 300); // Delay to allow keyboard to open
  });

  inputField.addEventListener('blur', () => {
    chatInput.style.bottom = '0';
  });
}

function filterContacts() {
  var input, filter, contacts, contact, i, txtValue;
  input = document.getElementById('search-input');
  filter = input.value.toLowerCase();
  contacts = document.getElementsByClassName('contact');

  for (i = 0; i < contacts.length; i++) {
    contact = contacts[i];
    txtValue = contact.textContent || contact.innerText;
    if (txtValue.toLowerCase().indexOf(filter) > -1) {
      contact.style.display = "";
    } else {
      contact.style.display = "none";
    }
  }
}