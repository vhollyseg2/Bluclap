// Utility function for formatting dates
const formatTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);

  // If same day
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // If yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // If within a week
  if (now - messageDate < 7 * 24 * 60 * 60 * 1000) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  }

  // Otherwise return date
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Current user info
const currentUser = {
  login: 'vhollyseg2',
  avatar: '../../assets/profile.png'
};

function loadChat(contactName) {
  const chatArea = document.getElementById('chat-area');

  const chatContent = `
        <div class="chat-area">
            <!-- Chat Header -->
            <div class="chat-header">
                <div class="chat-header-left">
                    <button class="icon-button back-button" onclick="showContactsList()">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <img src="../../assets/profile.png" alt="${contactName}">
                    <div class="chat-header-info">
                        <span class="chat-name">${contactName}</span>
                        <span class="active-status-text">Active now</span>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button class="icon-button">
                        <i class="fas fa-phone"></i>
                    </button>
                    <button class="icon-button">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="icon-button">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>

            <!-- Chat Messages -->
            <div class="chat-messages" id="chat-messages">
                <div class="message received">
                    <p>Hey there! 👋</p>
                    <span class="timestamp">${formatTime(new Date(Date.now() - 3600000))}</span>
                </div>
                <div class="message sent">
                    <p>Hi! How are you?</p>
                    <span class="timestamp">${formatTime(new Date())}</span>
                </div>
            </div>

            <!-- Chat Input -->
            <div class="chat-input">
                <button class="icon-button">
                    <i class="fas fa-plus-circle"></i>
                </button>
                <button class="icon-button">
                    <i class="far fa-image"></i>
                </button>
                <button class="icon-button">
                    <i class="fas fa-sticker-mule"></i>
                </button>
                <input type="text" placeholder="Aa" id="message-input">
                <button class="icon-button">
                    <i class="fas fa-thumbs-up"></i>
                </button>
            </div>
        </div>
    `;

  chatArea.innerHTML = chatContent;

  // Add message input handlers
  const input = document.getElementById('message-input');
  const messages = document.getElementById('chat-messages');

  // Function to add a new message
  function addMessage(text, isSent = true) {
    const messageHTML = `
            <div class="message ${isSent ? 'sent' : 'received'}">
                <p>${text}</p>
                <span class="timestamp">${formatTime(new Date())}</span>
            </div>
        `;
    messages.insertAdjacentHTML('beforeend', messageHTML);
    messages.scrollTop = messages.scrollHeight;
  }

  // Handle input events
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
      addMessage(this.value.trim());
      this.value = '';

      // Simulate received message after a delay
      setTimeout(() => {
        addMessage('Sure, I\'ll get back to you soon! 👍', false);
      }, 1000);
    }
  });

  // Handle thumbs up button
  const thumbsUp = chatArea.querySelector('.fa-thumbs-up').parentElement;
  thumbsUp.addEventListener('click', () => {
    addMessage('👍');
  });

  // Mobile view handling
  if (window.innerWidth <= 768) {
    document.getElementById('contacts-list').style.display = 'none';
    chatArea.style.display = 'block';
  }

  // Scroll to bottom of messages
  messages.scrollTop = messages.scrollHeight;
}

// Function to show contacts list (mobile view)
function showContactsList() {
  if (window.innerWidth <= 768) {
    document.getElementById('contacts-list').style.display = 'block';
    document.getElementById('chat-area').style.display = 'none';
  }
}

// Filter contacts
function filterContacts() {
  const input = document.querySelector('.search-wrapper input');
  const filter = input.value.toLowerCase();
  const contacts = document.getElementsByClassName('contact');

  Array.from(contacts).forEach(contact => {
    const name = contact.querySelector('.contact-name').textContent;
    const message = contact.querySelector('.contact-last-message').textContent;
    if (name.toLowerCase().includes(filter) || message.toLowerCase().includes(filter)) {
      contact.style.display = '';
    } else {
      contact.style.display = 'none';
    }
  });
}

// Initialize search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-wrapper input');
  searchInput.addEventListener('input', filterContacts);

  // Handle filter buttons
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
});

// Handle typing indicator
function showTypingIndicator(contactName) {
  const contact = Array.from(document.getElementsByClassName('contact'))
    .find(el => el.querySelector('.contact-name').textContent === contactName);

  if (contact) {
    const messagePreview = contact.querySelector('.contact-last-message');
    messagePreview.textContent = 'Typing...';
    setTimeout(() => {
      messagePreview.textContent = 'Last message';
    }, 2000);
  }
}