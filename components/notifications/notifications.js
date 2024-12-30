function showTab(tabName) {
  // Hide all tab content
  var tabContents = document.getElementsByClassName('tab-content');
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove('active');
  }

  // Remove active class from all tab buttons
  var tabButtons = document.getElementsByClassName('tab-button');
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove('active');
  }

  // Show the selected tab content
  document.getElementById(tabName).classList.add('active');

  // Add active class to the selected tab button
  event.currentTarget.classList.add('active');
}