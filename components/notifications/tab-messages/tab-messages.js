// Constants and Configuration
const CURRENT_UTC = new Date('2025-01-05T21:46:08Z');
const CURRENT_USER = {
  login: 'vhollyseg2',
  avatar: '#'
};

// Sample contacts data with proper timestamps
const contacts = [
  {
    name: "John Doe",
    lastMessage: "Hello, how are you?",
    time: new Date('2025-01-05T21:40:08Z'), // 6 minutes ago
    avatar: "#",
    isActive: true,
    unreadCount: 2,
    lastMessageSender: "you"
    },
  {
    name: "Sarah Smith",
    lastMessage: "See you tomorrow! 👋",
    time: new Date('2025-01-04T21:46:08Z'), // Yesterday
    avatar: "#",
    isActive: false,
    unreadCount: 0,
    lastMessageSender: "them"
    },
  {
    name: "Mike Johnson",
    lastMessage: "Thanks for your help!",
    time: new Date('2025-01-03T21:46:08Z'), // 2 days ago
    avatar: "#",
    isActive: true,
    unreadCount: 1,
    lastMessageSender: "them"
    }
];

// Format time for contact list
function formatTime(date) {
  const diff = CURRENT_UTC - date;

  // If less than 24 hours
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // If yesterday
  const yesterday = new Date(CURRENT_UTC);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // If within a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.ceil(diff / (24 * 60 * 60 * 1000))}d`;
  }

  // Otherwise show date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Handle contact click and open chat
function openChat(contact) {
  // Create URL with contact information
  const chatURL = `chat/chat.html?contact=${encodeURIComponent(contact.name)}` +
    `&avatar=${encodeURIComponent(contact.avatar)}` +
    `&active=${contact.isActive}`;

  // Store current contact info in sessionStorage
  sessionStorage.setItem('currentChat', JSON.stringify(contact));

  // Open chat in the same window
  window.location.href = chatURL;
}

// Update contact list UI
function updateContactsList() {
  const contactsContainer = document.querySelector('.contacts-scroll');
  contactsContainer.innerHTML = ''; // Clear existing contacts

  contacts.forEach(contact => {
    const contactElement = document.createElement('div');
    contactElement.className = 'contact';
    contactElement.onclick = () => openChat(contact);

    contactElement.innerHTML = `
            <div class="contact-avatar">
                <img src="${contact.avatar}" alt="${contact.name}">
                ${contact.isActive ? '<span class="active-status"></span>' : ''}
            </div>
            <div class="contact-info">
                <div class="contact-header">
                    <span class="contact-name">${contact.name}</span>
                    <span class="contact-time">${formatTime(contact.time)}</span>
                </div>
                <div class="message-preview">
                    <span class="contact-last-message">
                        ${contact.lastMessageSender === 'you' ? 
                          `<span class="message-status"><i class="fas fa-check-circle"></i></span>You: ` : 
                          ''}${contact.lastMessage}
                    </span>
                    ${contact.unreadCount > 0 ? 
                      `<span class="unread-badge">${contact.unreadCount}</span>` : 
                      ''}
                </div>
            </div>
        `;

    contactsContainer.appendChild(contactElement);
  });
}

// Search functionality
function setupSearch() {
  const searchInput = document.querySelector('.search-wrapper input');
  searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();
    const contactElements = document.querySelectorAll('.contact');

    contactElements.forEach(contactElement => {
      const name = contactElement.querySelector('.contact-name').textContent.toLowerCase();
      const lastMessage = contactElement.querySelector('.contact-last-message').textContent.toLowerCase();

      if (name.includes(searchText) || lastMessage.includes(searchText)) {
        contactElement.style.display = '';
      } else {
        contactElement.style.display = 'none';
      }
    });
  });
}

// Filter buttons functionality
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Add filter logic here if needed
      if (button.textContent === 'Communities') {
        // Handle communities filter
      } else {
        // Handle inbox filter
      }
    });
  });
}

// Initialize the contacts list
document.addEventListener('DOMContentLoaded', () => {
  updateContactsList();
  setupSearch();
  setupFilters();

  // Check if returning from chat
  const returnedFromChat = sessionStorage.getItem('returnedFromChat');
  if (returnedFromChat) {
    // Handle any necessary UI updates after returning from chat
    sessionStorage.removeItem('returnedFromChat');
  }
});

// Handle back navigation
window.addEventListener('popstate', () => {
  sessionStorage.setItem('returnedFromChat', 'true');
});