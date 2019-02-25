class Photo {
  constructor(title, caption, id, file, favorite) {
    this.title = title;
    this.caption = caption;
    this.id = id;
    this.file = file;
    this.favorite = favorite || false;
  }

  saveToStorage(incomingArr) {
    var stringified = JSON.stringify(incomingArr);
    localStorage.setItem("stringifiedPhotos", stringified);
  }

  deleteFromStorage(index) {
    imagesArr.splice(index, 1);
    this.saveToStorage(imagesArr);
  }

  updatePhoto(cardText, category) {
    this[category] = cardText
    this.saveToStorage(imagesArr);
  }

  favoritePhoto() {
    var favStatus = this.favorite = !this.favorite;
    this.updatePhoto(favStatus, 'favorite')
  }
}