class Photo {
  constructor(title, caption, id, file) {
    this.title = title;
    this.caption = caption;
    this.id = id;
    this.file = file;
  }

  saveToStorage(incomingArr) {
    var stringified = JSON.stringify(incomingArr);
    localStorage.setItem("stringifiedPhotos", stringified);
  }

  deleteFromStorage() {

  }

  updatePhoto(cardText, check) {
    check ? this.title = cardText : this.caption = cardText;
    this.saveToStorage(imagesArr);
  }
}