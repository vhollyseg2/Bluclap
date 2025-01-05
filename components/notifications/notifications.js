document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');

  // Function to filter contacts based on search input
  window.filterContacts = function() {
    const filter = searchInput.value.toLowerCase();
    const contacts = document.querySelectorAll('.contact');

    contacts.forEach(contact => {
      const contactName = contact.querySelector('.contact-name').textContent.toLowerCase();
      if (contactName.includes(filter)) {
        contact.style.display = '';
      } else {
        contact.style.display = 'none';
      }
    });
  };

  // Function to hide top bar and navbar
  function hideUIElements() {
    document.querySelector('.top-bar').classList.add('hidden');
    document.querySelector('.bottom-navbar').classList.add('hidden');
  }

  // Function to show top bar and navbar
  function showUIElements() {
    document.querySelector('.top-bar').classList.remove('hidden');
    document.querySelector('.bottom-navbar').classList.remove('hidden');
  }

  // Attach click event to contacts to load chat and hide UI elements
  document.querySelectorAll('.contact').forEach(contact => {
    contact.addEventListener('click', function() {
      const contactName = this.querySelector('.contact-name').textContent;
      loadChat(contactName);
      hideUIElements();
    });
  });

  // Function to load chat for a specific contact
  window.loadChat = function(contactName) {
    const chatArea = document.getElementById('chat-area');

    // Load the chat content dynamically (for simplicity, using static HTML here)
    const chatContent = `
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
  };
});