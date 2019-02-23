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

  deleteFromStorage(index) {
    imagesArr.splice(index, 1);
    this.saveToStorage(imagesArr);
  }

  updatePhoto(cardText, category) {
    this[category] = cardText
    this.saveToStorage(imagesArr);
  }
}