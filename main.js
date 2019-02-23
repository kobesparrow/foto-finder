// -----------GLOBAL VARIABLES----------------
var 

// -----------EVENT LISTENERS-----------------
window.addEventListener('load', onLoad(photos));


// -----------FUNCTIONS-----------------------

function generateCard(newObject) {
  var card = `
    <article class="box" data-id=${newObject.id}>
      <h2>${newObject.title}</h2>
      <img class="card-image" src="${TKTKTK}">
      <h3>${newObject.caption}</h3>
      <div class="card-footer">
        <img class="footer-icons" src="assets/delete.svg">
        <img class="footer-icons" src="assets/favorite.svg">
      </div>
    </article>
    `
    cardContainer.insertAdjacentHTML('afterbegin', card);
}