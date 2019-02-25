// -----------GLOBAL VARIABLES----------------
var create = document.getElementById('create');
var photoFile = document.getElementById('file');
var photoGallery = document.querySelector('.images');
var title = document.getElementById('title');
var caption = document.getElementById('caption');
var searchInput = document.querySelector('.search-input');
var showBtn = document.getElementById('show-more');
var cardContainer = document.querySelector('.card-area');
var favoritesFilter = document.getElementById('favorites-filter')
var imagesArr = JSON.parse(localStorage.getItem('stringifiedPhotos')) || [];
var reader = new FileReader();


// -----------EVENT LISTENERS-----------------
window.addEventListener('load', appendPhotos(imagesArr), findNumberOfFavorites());
create.addEventListener('click', loadImg);
cardContainer.addEventListener('keydown', saveOnReturn);
cardContainer.addEventListener('focusout', saveCardAgain);
cardContainer.addEventListener('click', deleteCard);
searchInput.addEventListener('keyup', filterText);
showBtn.addEventListener('click', showPhotos);
cardContainer.addEventListener('click', favoritePhoto);
favoritesFilter.addEventListener('click', filterFavorites);


// -----------FUNCTIONS-----------------------
function loadImg(e) {
  e.preventDefault();
  if (photoFile.files[0]) {
    reader.readAsDataURL(photoFile.files[0]); 
    reader.onload = addPhoto
  }
}

function appendPhotos(oldPhotos) {
  imagesArr = [];
  oldPhotos.forEach(function(photo) {
    var newPhoto = new Photo(photo.title, photo.caption, photo.id, photo.file, photo.favorite);
    imagesArr.push(newPhoto);
  })
  limitPhotos(imagesArr);
}

function limitPhotos(incomingArr) {
  if (incomingArr.length >= 10) {
  var mostRecent = imagesArr.slice(-10);
  mostRecent.forEach(function(photo) {
  generateCard(photo);
  });
 } else {
  imagesArr.forEach(function(photo) {
  generateCard(photo);
  });
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
        <img class="footer-icons delete" src="assets/delete.svg" onmouseover="this.src='assets/delete-active.svg';" onmouseout="this.src='assets/delete.svg';">
        <img class="footer-icons" src="assets/favorite.svg" onmouseover="this.src='assets/favorite-active.svg';" onmouseout="this.src='assets/favorite.svg';">
      </div>
    </article>
    `
  cardContainer.insertAdjacentHTML('afterbegin', card);
  promptMsg();
  showShowButton();
}

// function persistFavorite() {
//   if (newObject.favorite === true) {
    
//   }
// }

function promptMsg() {
  var msgBtn = document.querySelector('#add-request')
  msgBtn.classList.add('hidden-msg');
}

function showShowButton() {
  var showMore = document.getElementById('show-more');
  if (imagesArr.length >= 9) {
    showMore.classList.remove('hidden-msg');
  } else {
    showMore.classList.add('hidden-msg');
  }
}

function addBtn() {
  var showBtn = `
    <input class="show-btn form-btn" type="submit" value="Show Less">
    `
  cardContainer.insertAdjacentHTML('afterend', showBtn)  
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
  if (favoritesFilter.value === 'Show All Cards') {
    var searchValue = searchInput.value;
    var filteredPhotos = imagesArr.filter(function(photo) {
      return photo.title.toLowerCase().includes(searchValue) || photo.caption.toLowerCase().includes(searchValue) && photo.favorite === true; 
    }); 
    filteredPhotos.forEach(function(photo) {
    generateCard(photo);
    });
  } else {
    var searchValue = searchInput.value;
    var filteredPhotos = imagesArr.filter(function(photo) {
      return photo.title.toLowerCase().includes(searchValue) || photo.caption.toLowerCase().includes(searchValue); 
    }); 
    filteredPhotos.forEach(function(photo) {
    generateCard(photo);
    });
  }
}

function filterFavorites(e) {
  e.preventDefault();
  removeAllCards();
  if (favoritesFilter.value === 'Show All Cards') {
    imagesArr.forEach(function(photo) {
    generateCard(photo);
    });
    favoritesFilter.value = 'View 1 Favorites';
  } else {
    favoritesFilter.value = 'Show All Cards';
    var searchValue = true;
    var filteredPhotos = imagesArr.filter(function(photo) {
      return photo.favorite === searchValue;  
    }); 
    filteredPhotos.forEach(function(photo) {
    generateCard(photo);
    });
  }
}

function showPhotos() {
  removeAllCards();
  if (showBtn.value === 'Show less') {
    var mostRecent = imagesArr.slice(-10);
    mostRecent.forEach(function(photo) {
    generateCard(photo);
    });
    showBtn.value = 'Show more';
  } else if (imagesArr.length >= 10) {
    imagesArr.forEach(function(photo) {
    generateCard(photo);
    });
    showBtn.value = 'Show less';
  }
}

function favoritePhoto() {
  var cardId = parseInt(event.target.closest('.box').dataset.id);
  imagesArr.forEach(function (photo) {
    if (photo.id === cardId) {
      photo.favoritePhoto();
    }
  });
  findNumberOfFavorites();
}

function findNumberOfFavorites() {
  var numOfFavorites = 0
  imagesArr.forEach(function (photo) {
    if (photo.favorite === true) {
      numOfFavorites++
    }
  });
  updateFilterFavoritesButton(numOfFavorites);
}

function updateFilterFavoritesButton(num) {
  favoritesFilter.value = `View ${num} Favorites`;
}

function removeAllCards() {
  cardContainer.innerHTML = '';
}
