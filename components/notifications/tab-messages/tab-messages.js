// Constants and Configuration
const CURRENT_UTC = new Date('2025-01-06T01:17:43Z');
const CURRENT_USER = {
    login: 'vhollyseg2',
    avatar: '#',
    preferences: {
        timeFormat: 'en-US',
        notifications: true
    }
};

// Cache DOM elements
const DOM = {
    contactsContainer: null,
    searchInput: null,
    filterButtons: null,
    init() {
        this.contactsContainer = document.querySelector('.contacts-scroll');
        this.searchInput = document.querySelector('.search-wrapper input');
        this.filterButtons = document.querySelectorAll('.filter-button');
    }
};

// Contact data with proper typing
/** @type {Contact[]} */
const contacts = [
    {
        id: '1',
        name: "John Doe",
        lastMessage: "Hello, how are you?",
        time: new Date('2025-01-06T01:11:43Z'), // 6 minutes ago
        avatar: "#",
        isActive: true,
        unreadCount: 2,
        lastMessageSender: "you",
        lastMessageStatus: "sent"
    },
    {
        id: '2',
        name: "Sarah Smith",
        lastMessage: "See you tomorrow! 👋",
        time: new Date('2025-01-05T01:17:43Z'), // Yesterday
        avatar: "#",
        isActive: false,
        unreadCount: 0,
        lastMessageSender: "them",
        lastMessageStatus: "read"
    },
    {
        id: '3',
        name: "Mike Johnson",
        lastMessage: "Thanks for your help!",
        time: new Date('2025-01-04T01:17:43Z'), // 2 days ago
        avatar: "#",
        isActive: true,
        unreadCount: 1,
        lastMessageSender: "them",
        lastMessageStatus: "received"
    }
];

// Time formatting with memoization
const timeFormatCache = new Map();
function formatTime(date) {
    const cacheKey = date.getTime();
    if (timeFormatCache.has(cacheKey)) {
        return timeFormatCache.get(cacheKey);
    }

    const diff = CURRENT_UTC - date;
    let result;

    // If less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
        result = date.toLocaleTimeString(CURRENT_USER.preferences.timeFormat, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    // If yesterday
    else if (diff < 48 * 60 * 60 * 1000) {
        result = 'Yesterday';
    }
    // If within a week
    else if (diff < 7 * 24 * 60 * 60 * 1000) {
        result = `${Math.ceil(diff / (24 * 60 * 60 * 1000))}d`;
    }
    // Otherwise show date
    else {
        result = date.toLocaleDateString(CURRENT_USER.preferences.timeFormat, {
            month: 'short',
            day: 'numeric'
        });
    }

    timeFormatCache.set(cacheKey, result);
    return result;
}

// Chat handling with error handling
function openChat(contact) {
    try {
        const chatURL = new URL('chat/chat.html', window.location.href);
        chatURL.searchParams.set('contact', contact.name);
        chatURL.searchParams.set('avatar', contact.avatar);
        chatURL.searchParams.set('active', contact.isActive);

        // Store chat state
        sessionStorage.setItem('currentChat', JSON.stringify({
            ...contact,
            lastAccessed: new Date().toISOString()
        }));

        window.location.href = chatURL.toString();
    } catch (error) {
        console.error('Error opening chat:', error);
        alert('Unable to open chat. Please try again.');
    }
}

// UI Updates with performance optimization
const contactListUI = {
    updateList(filteredContacts = contacts) {
        if (!DOM.contactsContainer) return;

        const fragment = document.createDocumentFragment();
        
        filteredContacts.forEach(contact => {
            const contactElement = this.createContactElement(contact);
            fragment.appendChild(contactElement);
        });

        DOM.contactsContainer.innerHTML = '';
        DOM.contactsContainer.appendChild(fragment);
    },

    createContactElement(contact) {
        const element = document.createElement('div');
        element.className = 'contact';
        element.dataset.contactId = contact.id;
        
        element.innerHTML = `
            <div class="contact-avatar">
                <img src="${contact.avatar}" alt="${contact.name}" loading="lazy">
                ${contact.isActive ? '<span class="active-status"></span>' : ''}
            </div>
            <div class="contact-info">
                <div class="contact-header">
                    <span class="contact-name">${contact.name}</span>
                    <span class="contact-time">${formatTime(contact.time)}</span>
                </div>
                <div class="message-preview">
                    <span class="contact-last-message">
                        ${this.formatLastMessage(contact)}
                    </span>
                    ${contact.unreadCount > 0 ? 
                      `<span class="unread-badge">${contact.unreadCount}</span>` : 
                      ''}
                </div>
            </div>
        `;

        element.addEventListener('click', () => openChat(contact));
        return element;
    },

    formatLastMessage(contact) {
        if (contact.lastMessageSender === 'you') {
            return `<span class="message-status">
                    <i class="fas fa-check-circle"></i>
                   </span>You: ${contact.lastMessage}`;
        }
        return contact.lastMessage;
    }
};

// Search with debouncing
const searchHandler = {
    timeout: null,
    
    setup() {
        if (!DOM.searchInput) return;

        DOM.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => this.performSearch(e.target.value), 300);
        });
    },

    performSearch(searchText) {
        const normalizedSearch = searchText.toLowerCase().trim();
        
        if (!normalizedSearch) {
            contactListUI.updateList();
            return;
        }

        const filtered = contacts.filter(contact => 
            contact.name.toLowerCase().includes(normalizedSearch) ||
            contact.lastMessage.toLowerCase().includes(normalizedSearch)
        );

        contactListUI.updateList(filtered);
    }
};

// Filter functionality with state management
const filterHandler = {
    currentFilter: 'inbox',

    setup() {
        if (!DOM.filterButtons) return;

        DOM.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilter(button));
        });
    },

    handleFilter(button) {
        DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        this.currentFilter = button.textContent.toLowerCase();
        this.applyFilter();
    },

    applyFilter() {
        // Add filter logic here
        if (this.currentFilter === 'communities') {
            // Handle communities filter
        } else {
            contactListUI.updateList();
        }
    }
};

// Initialize application
function initializeApp() {
    DOM.init();
    contactListUI.updateList();
    searchHandler.setup();
    filterHandler.setup();

    // Handle return from chat
    if (sessionStorage.getItem('returnedFromChat')) {
        const lastChat = JSON.parse(sessionStorage.getItem('currentChat') || '{}');
        if (lastChat.id) {
            // Update last accessed chat if needed
        }
        sessionStorage.removeItem('returnedFromChat');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('popstate', () => {
    sessionStorage.setItem('returnedFromChat', 'true');
});

// Export for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        contactListUI,
        searchHandler,
        filterHandler
    };
}