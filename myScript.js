  // This is where you'll load your JSON data
  let videoData;
  let currentIndex = 0;
  let isEditing = false;

  // Load JSON data
  async function loadData() {
      try {
          const response = await fetch('sign_language_data.json');
          videoData = await response.json();
          initializeUI();
      } catch (error) {
          console.error('Error loading JSON data:', error);
      }
  }

  function initializeUI() {
      document.getElementById('totalVideos').textContent = videoData.videos.length;
      updateVideo();
      populateDropdowns();
  }

  function updateVideo() {
      const currentVideo = videoData.videos[currentIndex];
      const videoPlayer = document.getElementById('videoPlayer');
      videoPlayer.src = currentVideo.videoPath;
      
      document.getElementById('currentVideo').textContent = currentIndex + 1;
      document.getElementById('signerSelect').value = currentVideo.signer;
      document.getElementById('categorySelect').value = currentVideo.category;
      document.getElementById('wordSelect').value = currentVideo.word;
  }

  function populateDropdowns() {
      // Populate categories
      const categorySelect = document.getElementById('categorySelect');
      categorySelect.innerHTML = videoData.categories.map(category =>
          `<option value="${category}">${category}</option>`
      ).join('');

      // Update words based on selected category
      updateWords();
  }

  function updateWords() {
      const category = document.getElementById('categorySelect').value;
      const wordSelect = document.getElementById('wordSelect');
      wordSelect.innerHTML = videoData.words[category].map(word =>
          `<option value="${word}">${word}</option>`
      ).join('');
  }

  // Event Listeners
  document.getElementById('correctBtn').addEventListener('click', () => {
      if (currentIndex < videoData.videos.length - 1) {
          currentIndex++;
          updateVideo();
          setEditingMode(false);
      }
  });

  document.getElementById('wrongBtn').addEventListener('click', () => {
      setEditingMode(true);
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
      saveChanges();
      setEditingMode(false);
  });

  document.getElementById('categorySelect').addEventListener('change', updateWords);

  function setEditingMode(editing) {
      isEditing = editing;
      document.getElementById('categorySelect').disabled = !editing;
      document.getElementById('wordSelect').disabled = !editing;
      document.getElementById('correctBtn').style.display = editing ? 'none' : 'block';
      document.getElementById('wrongBtn').style.display = editing ? 'none' : 'block';
      document.getElementById('saveBtn').style.display = editing ? 'block' : 'none';
  }

  function saveChanges() {
      const currentVideo = videoData.videos[currentIndex];
      currentVideo.category = document.getElementById('categorySelect').value;
      currentVideo.word = document.getElementById('wordSelect').value;
      // Here you could add code to save changes back to the server
  }

  // Initialize the application
  loadData();