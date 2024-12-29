document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch the next video details
  function fetchNextVideo() {
    // Here you would fetch data from your server or API
    // For demonstration purposes, we are using dummy data
    const nextVideoData = {
      videoSrc: 'path/to/next/video.mp4',
      publisherProfile: 'path/to/next/publisher/profile.png',
      publisherName: 'Next Publisher Name',
      videoDescription: 'Next video description goes here... ' +
        'Next video description goes here... ' +
        'Next video description goes here... ', // Example long description
      likeCount: Math.floor(Math.random() * 1000), // Example like count
      commentCount: Math.floor(Math.random() * 100) // Example comment count
    };

    return nextVideoData;
  }

  // Function to create a new video container
  function createVideoContainer(videoData) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    const videoElement = document.createElement('video');
    videoElement.src = videoData.videoSrc;
    videoElement.autoplay = true;
    videoElement.muted = true;
    videoElement.playsInline = true;
    videoElement.loop = true;

    const videoDetails = document.createElement('div');
    videoDetails.className = 'video-details';

    const publisherDetails = document.createElement('div');
    publisherDetails.className = 'publisher-details';

    const publisherProfile = document.createElement('img');
    publisherProfile.src = videoData.publisherProfile;
    publisherProfile.alt = 'Publisher Profile';
    publisherProfile.className = 'publisher-profile';

    const publisherName = document.createElement('span');
    publisherName.className = 'publisher-name';
    publisherName.textContent = videoData.publisherName;

    const followIcon = document.createElement('i');
    followIcon.id = 'follow-icon';
    followIcon.className = 'fas fa-plus follow-icon';
    followIcon.addEventListener('click', toggleFollow);

    publisherDetails.appendChild(publisherProfile);
    publisherDetails.appendChild(publisherName);
    publisherDetails.appendChild(followIcon);

    const videoDescription = document.createElement('div');
    videoDescription.className = 'video-description';
    videoDescription.id = 'video-description';
    videoDescription.textContent = videoData.videoDescription;

    const showMore = document.createElement('span');
    showMore.className = 'show-more';
    showMore.id = 'show-more';
    showMore.textContent = 'Show more';
    videoDescription.appendChild(showMore);

    const useSoundButton = document.createElement('button');
    useSoundButton.id = 'use-sound';
    useSoundButton.className = 'use-sound';
    useSoundButton.textContent = 'Use sound';

    videoDetails.appendChild(publisherDetails);
    videoDetails.appendChild(videoDescription);
    videoDetails.appendChild(useSoundButton);

    const videoActions = document.createElement('div');
    videoActions.className = 'video-actions';

    const likeAction = document.createElement('div');
    likeAction.className = 'action-item';
    const likeIcon = document.createElement('i');
    likeIcon.className = 'fas fa-thumbs-up';
    const likeCount = document.createElement('span');
    likeCount.className = 'action-count';
    likeCount.textContent = videoData.likeCount;
    likeAction.appendChild(likeIcon);
    likeAction.appendChild(likeCount);

    const commentAction = document.createElement('div');
    commentAction.className = 'action-item';
    const commentIcon = document.createElement('i');
    commentIcon.className = 'fas fa-comments';
    const commentCount = document.createElement('span');
    commentCount.className = 'action-count';
    commentCount.textContent = videoData.commentCount;
    commentAction.appendChild(commentIcon);
    commentAction.appendChild(commentCount);

    const favoriteAction = document.createElement('div');
    favoriteAction.className = 'action-item';
    const favoriteIcon = document.createElement('i');
    favoriteIcon.className = 'fas fa-heart';
    favoriteAction.appendChild(favoriteIcon);

    const shareAction = document.createElement('div');
    shareAction.className = 'action-item';
    const shareIcon = document.createElement('i');
    shareIcon.className = 'fas fa-share';
    shareAction.appendChild(shareIcon);

    const menuAction = document.createElement('div');
    menuAction.className = 'action-item';
    const menuIcon = document.createElement('i');
    menuIcon.className = 'fas fa-ellipsis-v';
    menuAction.appendChild(menuIcon);

    videoActions.appendChild(likeAction);
    videoActions.appendChild(commentAction);
    videoActions.appendChild(favoriteAction);
    videoActions.appendChild(shareAction);
    videoActions.appendChild(menuAction);

    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(videoDetails);
    videoContainer.appendChild(videoActions);

    return videoContainer;
  }

  // Function to handle intersection observer callback
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Fetch the next video when the current video is fully visible
        const nextVideoData = fetchNextVideo();
        const newVideoContainer = createVideoContainer(nextVideoData);
        document.body.appendChild(newVideoContainer);
        observer.observe(newVideoContainer); // Observe the new video container
      }
    });
  }

  // Set up the intersection observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0 // Trigger when 100% of the video container is visible
  };

  const observer = new IntersectionObserver(handleIntersection, observerOptions);

  // Observe the initial video container
  const initialVideoContainer = document.getElementById('video-container');
  observer.observe(initialVideoContainer);

  // Event listener to show full text on "Show more" click
  document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'show-more') {
      const videoDescription = event.target.parentElement;
      videoDescription.style.maxHeight = 'none';
      event.target.style.display = 'none';
    }
  });

  // Function to toggle follow/unfollow
  function toggleFollow(event) {
    const icon = event.target;
    if (icon.classList.contains('fa-plus')) {
      icon.classList.remove('fa-plus');
      icon.classList.add('fa-check');
    } else {
      icon.classList.remove('fa-check');
      icon.classList.add('fa-plus');
    }
  }

  // Initial setup for follow icon in the first video
  const followIcon = document.getElementById('follow-icon');
  followIcon.addEventListener('click', toggleFollow);

  // Event listener for "Go to lives" button
  const overlayButton = document.getElementById('overlay-button');
  overlayButton.addEventListener('click', () => {
    // Logic for handling "Go to lives" button click
    alert('Go to lives clicked!');
  });
});