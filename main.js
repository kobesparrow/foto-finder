// -----------GLOBAL VARIABLES----------------
var create = document.getElementById('create');
var photoFile = document.getElementById('file');
var photoGallery = document.querySelector('.images');
var title = document.getElementById('title');
var caption = document.getElementById('caption');
var searchInput = document.querySelector('.search-input');

var cardContainer = document.querySelector('.card-area');
var imagesArr = JSON.parse(localStorage.getItem('stringifiedPhotos')) || [];
var reader = new FileReader();


// -----------EVENT LISTENERS-----------------
window.addEventListener('load', appendPhotos(imagesArr));
create.addEventListener('click', loadImg);
cardContainer.addEventListener('keydown', saveOnReturn);
cardContainer.addEventListener('focusout', saveCardAgain);
cardContainer.addEventListener('click', deleteCard);
searchInput.addEventListener('keyup', filterText);


// -----------FUNCTIONS-----------------------
function appendPhotos(oldPhotos) {
  imagesArr = [];
  oldPhotos.forEach(function(photo) {
    var newPhoto = new Photo(photo.title, photo.caption, photo.id, photo.file);
    imagesArr.push(newPhoto);
    generateCard(photo);
  })
}

function loadImg(e) {
  e.preventDefault();
  if (photoFile.files[0]) {
    reader.readAsDataURL(photoFile.files[0]); 
    reader.onload = addPhoto
  }
}

function addPhoto(e) {
   if (title.value !== '' && caption.value !== '') {
    var newPhoto = new Photo(title.value, caption.value, Date.now(), e.target.result);
    generateCard(newPhoto);
    imagesArr.push(newPhoto);
    newPhoto.saveToStorage(imagesArr);
    title.value = '';
    caption.value = '';
  }
}

function saveOnReturn(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    saveCardAgain(event);
    event.target.blur();  
  }
}

function saveCardAgain(event) {
  var cardId = parseInt(event.target.closest('.box').dataset.id);
  var cardText = event.target.innerText;
  var category = event.target.classList.contains('card-title') ? 'title' : 'caption';
   imagesArr.forEach(function (photo) {
      if(photo.id === cardId) {
        photo.updatePhoto(cardText, category);
      } 
    });
}

function generateCard(newObject) {
  var card = `
    <article class="box" data-id=${newObject.id}>
      <h2 class='card-title' contenteditable>${newObject.title}</h2>
      <img class="card-image" src="${newObject.file}">
      <h3 contenteditable>${newObject.caption}</h3>
      <div class="card-footer">
        <img class="footer-icons delete" src="assets/delete.svg">
        <img class="footer-icons" src="assets/favorite.svg">
      </div>
    </article>
    `
    cardContainer.insertAdjacentHTML('afterbegin', card);
}

function deleteCard(event) { 
  var cardId = parseInt(event.target.closest('.box').dataset.id);
  if (event.target.className.includes('delete')) {
    event.target.closest('.box').remove();
    var card = imagesArr.find(function(onePhoto) {
      return onePhoto.id === cardId;
    });
    var index = imagesArr.indexOf(card);
    imagesArr[0].deleteFromStorage(index);
  }
}

function filterText() {
  removeAllCards();
  var searchValue = searchInput.value;
  var filteredIdeas = imagesArr.filter(function(photo) {
    return photo.title.toLowerCase().includes(searchValue) || photo.caption.toLowerCase().includes(searchValue); 
  }); 
  filteredIdeas.forEach(function(photo) {
  generateCard(photo);
  });
}

function removeAllCards() {
  cardContainer.innerHTML = '';
}
