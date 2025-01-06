// profile.js
document.addEventListener('DOMContentLoaded', function() {
    // User data management
    const userData = {
        fullName: "Vincent Hollyway",
        username: "@vhollyseg2",
        followers: 1200,
        following: 150,
        likes: 500,
        views: 2000,
        bio: "Content Creator | Loves sharing fun moments 🎥✨",
        profilePicture: "https://via.placeholder.com/150",
        coverPhoto: "https://via.placeholder.com/800x200",
        lastUpdated: "2025-01-06T02:38:14Z"
    };

    // Content State Management
    const contentState = {
        currentTab: 'posts',
        isLoading: false,
        posts: [],
        favorites: [],
        lastFetch: null
    };

    // Initialize timestamp for data fetching
    const currentTimestamp = new Date("2025-01-06T02:38:14Z");
    const currentUser = 'vhollyseg2';

    // DOM Elements
    const postsContent = document.getElementById('postsContent');
    const favoritesContent = document.getElementById('favoritesContent');
    const contentLoader = document.getElementById('contentLoader');
    const noContentMessage = document.querySelector('.no-content-message');
    const modal = document.getElementById('editProfileModal');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const editProfileForm = document.getElementById('editProfileForm');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const coverPhotoInput = document.getElementById('coverPhotoInput');

    // Simulate API call to fetch content
    async function fetchContent(type) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock data with current timestamp
        const mockData = {
            posts: [
                {
                    id: 1,
                    imageUrl: 'https://picsum.photos/300/300?random=1',
                    likes: 1234,
                    comments: 56,
                    timestamp: new Date(currentTimestamp - 240000).toISOString() // 4 minutes ago
                },
                {
                    id: 2,
                    imageUrl: 'https://picsum.photos/300/300?random=2',
                    likes: 789,
                    comments: 23,
                    timestamp: new Date(currentTimestamp - 1080000).toISOString() // 18 minutes ago
                },
                {
                    id: 3,
                    imageUrl: 'https://picsum.photos/300/300?random=3',
                    likes: 432,
                    comments: 12,
                    timestamp: new Date(currentTimestamp - 1680000).toISOString() // 28 minutes ago
                }
            ],
            favorites: [
                {
                    id: 101,
                    imageUrl: 'https://picsum.photos/300/300?random=4',
                    likes: 456,
                    comments: 12,
                    timestamp: new Date(currentTimestamp - 2280000).toISOString() // 38 minutes ago
                },
                {
                    id: 102,
                    imageUrl: 'https://picsum.photos/300/300?random=5',
                    likes: 321,
                    comments: 8,
                    timestamp: new Date(currentTimestamp - 2880000).toISOString() // 48 minutes ago
                }
            ]
        };

        return mockData[type] || [];
    }

    // Format numbers for display
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Format timestamp to relative time
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = currentTimestamp;
        const diff = Math.floor((now - date) / 1000); // difference in seconds

        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    }

    // Create grid item HTML
    function createGridItem(item) {
        return `
            <div class="grid-item" data-id="${item.id}">
                <img src="${item.imageUrl}" alt="Content ${item.id}"
                     loading="lazy"
                     onload="this.parentElement.classList.add('loaded')">
                <div class="grid-item-overlay">
                    <div class="grid-item-stats">
                        <span class="likes">
                            <i class="fas fa-heart"></i>
                            ${formatNumber(item.likes)}
                        </span>
                        <span class="comments">
                            <i class="fas fa-comment"></i>
                            ${formatNumber(item.comments)}
                        </span>
                    </div>
                    <div class="grid-item-timestamp">
                        ${formatTimestamp(item.timestamp)}
                    </div>
                </div>
            </div>
        `;
    }

    // Show loading state
    function showLoading() {
        contentState.isLoading = true;
        contentLoader.classList.add('active');
        postsContent.style.opacity = '0';
        favoritesContent.style.opacity = '0';
        noContentMessage.style.display = 'none';
    }

    // Hide loading state
    function hideLoading() {
        contentState.isLoading = false;
        contentLoader.classList.remove('active');
    }

    // Switch content tabs
    async function switchContent(type) {
        if (contentState.isLoading) return;
        if (contentState.currentTab === type) return;

        contentState.currentTab = type;
        showLoading();

        try {
            const content = await fetchContent(type);
            const contentContainer = type === 'posts' ? postsContent : favoritesContent;
            const otherContainer = type === 'posts' ? favoritesContent : postsContent;

            if (content.length === 0) {
                noContentMessage.style.display = 'flex';
                contentContainer.style.display = 'none';
            } else {
                noContentMessage.style.display = 'none';
                contentContainer.style.display = 'grid';
                contentContainer.innerHTML = content.map(createGridItem).join('');
                
                // Animate new content in
                setTimeout(() => {
                    contentContainer.style.opacity = '1';
                    contentContainer.style.transform = 'translateY(0)';
                }, 100);
            }

            otherContainer.style.display = 'none';
            otherContainer.style.opacity = '0';
            otherContainer.style.transform = 'translateY(20px)';

        } catch (error) {
            console.error('Error fetching content:', error);
            noContentMessage.style.display = 'flex';
            noContentMessage.querySelector('p').textContent = 'Error loading content';
        } finally {
            hideLoading();
        }
    }

    // Modal functionality
    function openModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Populate form with current data
        document.getElementById('fullName').value = userData.fullName;
        document.getElementById('username').value = userData.username.replace('@', '');
        document.getElementById('bio').value = userData.bio;
        document.getElementById('profilePhotoPreview').src = userData.profilePicture;
        document.getElementById('coverPhotoPreview').src = userData.coverPhoto;
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Handle photo changes
    function handlePhotoChange(input, previewId) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById(previewId).src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Event Listeners
    editProfileBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Photo change buttons
    document.querySelectorAll('.change-photo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            const input = type === 'profile' ? profilePhotoInput : coverPhotoInput;
            input.click();
        });
    });

    profilePhotoInput.addEventListener('change', function() {
        handlePhotoChange(this, 'profilePhotoPreview');
    });

    coverPhotoInput.addEventListener('change', function() {
        handlePhotoChange(this, 'coverPhotoPreview');
    });

    // Form submission
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Update user data
        userData.fullName = document.getElementById('fullName').value;
        userData.username = '@' + document.getElementById('username').value;
        userData.bio = document.getElementById('bio').value;
        userData.lastUpdated = new Date().toISOString();

        // Update UI
        document.querySelector('.fullname').textContent = userData.fullName;
        document.querySelector('.username').textContent = userData.username;
        document.querySelector('.bio').textContent = userData.bio;

        // If new profile picture was selected
        const newProfilePic = document.getElementById('profilePhotoPreview').src;
        if (newProfilePic !== userData.profilePicture) {
            document.querySelector('.profile-picture').src = newProfilePic;
            userData.profilePicture = newProfilePic;
        }

        // If new cover photo was selected
        const newCoverPhoto = document.getElementById('coverPhotoPreview').src;
        if (newCoverPhoto !== userData.coverPhoto) {
            document.querySelector('.cover-photo-img').src = newCoverPhoto;
            userData.coverPhoto = newCoverPhoto;
        }

        closeModal();
    });

    // Initialize content
    switchContent('posts');

    // Initialize profile buttons
    document.querySelectorAll('.profile-btn').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.textContent.toLowerCase();
            document.querySelectorAll('.profile-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            switchContent(type);
        });
    });

    // Handle grid item clicks
    document.addEventListener('click', function(e) {
        const gridItem = e.target.closest('.grid-item');
        if (gridItem) {
            const contentId = gridItem.dataset.id;
            console.log(`Opening content ${contentId}`);
            // Implement content viewing functionality here
        }
    });
});