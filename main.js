// -----------GLOBAL VARIABLES----------------
var create = document.getElementById('create');
var photoFile = document.getElementById('file');
var photoGallery = document.querySelector('.images');
var title = document.getElementById('title');
var caption = document.getElementById('caption');

var cardContainer = document.querySelector('.card-area');
var imagesArr = JSON.parse(localStorage.getItem('stringifiedPhotos')) || [];
var reader = new FileReader();


// -----------EVENT LISTENERS-----------------
window.addEventListener('load', appendPhotos(imagesArr));
create.addEventListener('click', loadImg);


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
  var newPhoto = new Photo(title.value, caption.value, Date.now(), e.target.result);
  generateCard(newPhoto);
  imagesArr.push(newPhoto);
  newPhoto.saveToStorage(imagesArr);
  title.value = '';
  caption.value = '';
}

function generateCard(newObject) {
  var card = `
    <article class="box" data-id=${newObject.id}>
      <h2>${newObject.title}</h2>
      <img class="card-image" src="${newObject.file}">
      <h3>${newObject.caption}</h3>
      <div class="card-footer">
        <img class="footer-icons" src="assets/delete.svg">
        <img class="footer-icons" src="assets/favorite.svg">
      </div>
    </article>
    `
    cardContainer.insertAdjacentHTML('afterbegin', card);
}

function removeAllCards() {
  cardContainer.innerHTML = '';
}
