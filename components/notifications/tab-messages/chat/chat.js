// Constants and Configuration
const CURRENT_UTC = new Date('2025-01-05T22:07:56Z');
const CURRENT_USER = {
  login: 'vhollyseg2',
  avatar: '#'
};

// Viewport height handling
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Handle viewport and keyboard
function setupViewportHandling() {
  // Initial viewport height
  setViewportHeight();

  // Handle resize and orientation change
  window.addEventListener('resize', () => {
    setViewportHeight();
    scrollToBottom();
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      setViewportHeight();
      scrollToBottom();
    }, 100);
  });

  // Focus handling for input
  const messageInput = document.getElementById('message-input');

  messageInput.addEventListener('focus', () => {
    setTimeout(scrollToBottom, 300); // Delay to ensure keyboard is fully open
  });

  messageInput.addEventListener('blur', () => {
    setTimeout(scrollToBottom, 100);
  });

  // iOS specific handling
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.addEventListener('focusin', () => {
      setTimeout(scrollToBottom, 300);
    });

    window.addEventListener('focusout', () => {
      setTimeout(scrollToBottom, 100);
    });
  }
}

// Initialize chat with contact information
function initializeChat(name, avatar, isActive) {
  // Update header information
  document.getElementById('contact-name').textContent = name;
  document.getElementById('contact-avatar').src = avatar;

  // Show/hide active status
  const statusElement = document.getElementById('active-status');
  if (isActive) {
    statusElement.style.display = 'block';
    document.getElementById('contact-status').textContent = 'Active now';
  } else {
    statusElement.style.display = 'none';
    document.getElementById('contact-status').textContent = 'Inactive';
  }

  // Load any existing messages
  loadExistingMessages();
}

// Format time for messages
function formatMessageTime(date) {
  const diff = CURRENT_UTC - date;

  if (diff < 60000) { // Less than 1 minute
    return 'Just now';
  } else if (diff < 3600000) { // Less than 1 hour
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  } else if (diff < 86400000) { // Less than 24 hours
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

// Add a new message
function addMessage(content, isSent = true, isEmoji = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

  const contentDiv = document.createElement('div');
  contentDiv.className = `message-content ${isEmoji ? 'emoji-message' : ''}`;
  contentDiv.textContent = content;

  const timeDiv = document.createElement('div');
  timeDiv.className = 'message-time';
  timeDiv.textContent = formatMessageTime(new Date());

  messageDiv.appendChild(contentDiv);
  messageDiv.appendChild(timeDiv);

  document.getElementById('chat-messages').appendChild(messageDiv);

  // Use requestAnimationFrame for smooth scrolling
  requestAnimationFrame(() => {
    scrollToBottom();
  });

  if (isSent) {
    simulateReceivedMessage();
  }
}

// Scroll chat to bottom
function scrollToBottom() {
  const chatMessages = document.getElementById('chat-messages');
  const lastMessage = chatMessages.lastElementChild;

  if (lastMessage) {
    lastMessage.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }
}

// Set up message input handlers
function setupMessageHandlers() {
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  // Handle input field resize
  messageInput.addEventListener('input', function() {
    this.style.height = '20px';
    this.style.height = (this.scrollHeight) + 'px';
    scrollToBottom();
  });

  // Send message on Enter key
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && messageInput.value.trim()) {
      e.preventDefault();
      sendMessage(messageInput.value.trim());
      messageInput.value = '';
      messageInput.style.height = '20px';
    }
  });

  // Send message on button click
  sendButton.addEventListener('click', () => {
    if (messageInput.value.trim()) {
      sendMessage(messageInput.value.trim());
      messageInput.value = '';
      messageInput.style.height = '20px';
    } else {
      // Send thumbs up if input is empty
      sendMessage('👍', true);
    }
  });

  // Handle input changes to toggle send button icon
  messageInput.addEventListener('input', () => {
    const icon = sendButton.querySelector('i');
    icon.className = messageInput.value.trim() ? 'fas fa-paper-plane' : 'fas fa-thumbs-up';
  });
}

// Send a message
function sendMessage(content, isEmoji = false) {
  addMessage(content, true, isEmoji);
}

// Simulate received message
function simulateReceivedMessage() {
  setTimeout(() => {
    const responses = [
            'Thanks for your message! 👋',
            'I\'ll get back to you soon',
            'Got it! 👍',
            'Thanks!'
        ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, false);
  }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
}

// Load existing messages (placeholder)
function loadExistingMessages() {
  // This would typically load messages from a backend
  addMessage('Hey there! 👋', false);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Get contact data from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const contactName = urlParams.get('contact');
  const contactAvatar = urlParams.get('avatar');
  const isActive = urlParams.get('active') === 'true';

  if (contactName) {
    initializeChat(contactName, contactAvatar, isActive);
  }

  // Set up message handlers
  setupMessageHandlers();

  // Set up viewport handling
  setupViewportHandling();
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    setTimeout(scrollToBottom, 100);
  }
});

// Handle back button
document.querySelector('.back-button')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.history.back();
});

// Export chat interface for external use
window.chatInterface = {
  initializeChat,
  addMessage,
  CURRENT_USER
};