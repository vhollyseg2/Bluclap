document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch the next video details
  function fetchNextVideo() {
    // Here you would fetch data from your server or API
    // For demonstration purposes, we are using dummy data
    const nextVideoData = {
      videoSrc: 'path/to/next/video.mp4',
      publisherProfile: 'path/to/next/publisher/profile.png',
      publisherName: 'Next Publisher Name',
      videoDescription: 'Next video description goes here...'
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
    videoElement.style.width = '100%';
    videoElement.style.height = 'calc(100vh - 60px)';
    videoElement.style.objectFit = 'contain';

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

    publisherDetails.appendChild(publisherProfile);
    publisherDetails.appendChild(publisherName);

    const videoDescription = document.createElement('span');
    videoDescription.className = 'video-description';
    videoDescription.textContent = videoData.videoDescription;

    const useSoundButton = document.createElement('button');
    useSoundButton.id = 'use-sound';
    useSoundButton.className = 'use-sound';
    useSoundButton.textContent = 'Use sound';

    videoDetails.appendChild(publisherDetails);
    videoDetails.appendChild(videoDescription);
    videoDetails.appendChild(useSoundButton);

    videoContainer.appendChild(videoElement);
    videoContainer.appendChild(videoDetails);

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
});