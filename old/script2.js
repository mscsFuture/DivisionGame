var menuButton = document.getElementById('menuButton');
var gameButton = document.getElementById('gameButton');
var menuPage = document.getElementById('menuPage');
var gamePage = document.getElementById('gamePage');

menuButton.addEventListener('click', function() {
  menuPage.style.display = 'block';
  gamePage.style.display = 'none';
});

gameButton.addEventListener('click', function() {
  menuPage.style.display = 'none';
  gamePage.style.display = 'block';
});
