let photos = {} // global object to keep searching results
let pages = 0;  // global counter for pagination

// get xml request

async function getPhotos(query = 'fantastic'){
  try {
      const xmlFetch = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=70149d386a530cbcf9d45aa6247577ca&text=${query}&sort=interestingness-desc&privacy_filter=1&safe_search=1&format=rest`)
      const xmlText = await xmlFetch.text()
      const xml = await (new window.DOMParser()).parseFromString(xmlText, "text/xml")
      return photos = await xml.getElementsByTagName("photo");
    } catch (error) {
      console.log(error);
    }
}

// convert xml respond to straight links

async function imageAppend(query = 'fantastic') {

  const controlSection = document.querySelector('.control');      // hiding controls button
  controlSection.classList.add('control__onload');
  const controlFwd = document.querySelector('.control__fwd');
  const controlBack = document.querySelector('.control__back');
  controlFwd.classList.remove('control__hover');
  controlBack.classList.remove('control__hover');
  removePreviousEnlarged();

  const image = document.querySelectorAll(".images__wrapper img");
  const imageError = document.querySelectorAll('.images__error');
  const imageList = await getPhotos(query);

  for (let i = 0; i < image.length; i++) {                        // check for errors and display error instead of photo
    if (imageList[i+1] == undefined) {
      imageError[i].classList.remove('images__error_hide');
      image[i].classList.add('images__error_hide');
      continue;
    }

    if (image[i].classList.contains('images__error_hide')) {
      image[i].classList.remove('images__error_hide');
      imageError[i].classList.add('images__error_hide');
    }

    let url = 'https://live.staticflickr.com/';                   // creating url query
    url += imageList[i+1].getAttribute('server') + '/';
    url += imageList[i+1].getAttribute('id') + '_';
    url += imageList[i+1].getAttribute('secret') + '_b.jpg';

    image[i].src = url;
  }


  for (const items of Object.getOwnPropertyNames(photos)) {
    delete photos[items];
  }
  photos = { ...imageList};
  controls();
}


// searching and making new photos

const searchField = document.getElementById('search');
searchField.addEventListener('keyup', startSearch);

const searchButton = document.querySelector('.search__ico');
searchButton.addEventListener('click', searchFromButton);

const clearSearch = document.querySelector('.search__delete');
clearSearch.addEventListener('click', deleteSearch);

function startSearch(event) {
  if (searchField.value != '') {
    clearSearch.classList.remove('search__delete_hided');
  } else {
    clearSearch.classList.add('search__delete_hided');
  }
  if (event.key === 'Enter'){
    imageAppend(event.target.value);
  }
}

function searchFromButton() {
  if (searchField.value === '') {return}
  imageAppend(searchField.value);
}

function deleteSearch() {
  searchField.value = '';
  clearSearch.classList.add('search__delete_hided');
}


// Onload is here:

window.addEventListener("load", () => {
  const x = window.scrollX, y = window.scrollY;
  searchField.focus();                            // making focus on search field
  window.scrollTo(x, y);                          // and scroll back to top when page is loaded


  // display current date in header
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
  const todayDate = new Date();
  const todayDay = weekDays[todayDate.getDay()];
  const todayMonth = months[todayDate.getMonth()];
  const dayDate = todayDate.getDate();
  const todayYear = todayDate.getFullYear();

  const date = document.querySelector('.header__date');
  date.innerText = todayDay + ', ' + todayMonth + ' ' + dayDate + ', ' + todayYear;

});

// Animating images in grid

const images = document.querySelectorAll('.images__wrapper');
images.forEach((e) => e.addEventListener('click', imageLargeToggle));


function imageLargeToggle() {
  if (window.innerWidth < 500) {return}                                           // disable enlarging on small screen

  removePreviousEnlarged(this);

  if(window.innerWidth > 700 && this.classList.contains('grid_item3')) {          // rule for wide screen's large images enlarging
    let moved = this.getAttribute('position');
    this.style = `transform-origin: ${moved}`;
    this.classList.toggle('images__wrapper_large2');
  }
  if(window.innerWidth > 700 && this.classList.contains('grid_item10')) {          // rule for wide screen's large images enlarging
    let moved = this.getAttribute('position');
    this.style = `transform-origin: ${moved}`;
    this.classList.toggle('images__wrapper_large2');}

  if(window.innerWidth < 700) {                                                   // block wor medium screen enlarging rules
    if (this.classList.contains('grid_item1')) {
      this.style = `transform-origin: top left`;
      this.classList.toggle('images__wrapper_large');
      return;
    }
    if (this.classList.contains('grid_item2')) {
      this.style = `transform-origin: top right`;
      this.classList.toggle('images__wrapper_large');
      return;
    }
    if (this.classList.contains('grid_item13')) {
      this.style = `transform-origin: bottom left`;
      this.classList.toggle('images__wrapper_large');
      return;
    }
    if (this.classList.contains('grid_item14')) {
      this.style = `transform-origin: bottom right`;
      this.classList.toggle('images__wrapper_large');
      return;
    }
    if (this.classList.contains('even')) {
      this.style = `transform-origin: right`;
      this.classList.toggle('images__wrapper_large');
      return;
    }
    this.style = `transform-origin: left`;
    this.classList.toggle('images__wrapper_large');
    return;
  }
  
  let move = this.getAttribute('position');
  this.style = `transform-origin: ${move}`;
  this.classList.toggle('images__wrapper_large');
}

function removePreviousEnlarged(element) {
  images.forEach((e) => {
    if (e !== element && e.classList.contains('images__wrapper_large')) {
      e.classList.remove('images__wrapper_large');
    }
    if (e !== element && e.classList.contains('images__wrapper_large2')) {
      e.classList.remove('images__wrapper_large2');
    }
  });
}


// controls. back - forward gallery

function controls() {
  pages = 0;
  if (photos[1 + (pages + 2) * 14] == undefined) {return} // yeah, magic numbers. 14 is the number of images on page and we check if the next page is available :)
  
  const controlSection = document.querySelector('.control');
  const image = document.querySelectorAll(".images__wrapper img");

  if (image[image.length - 1].classList.contains('images__error_hide')) {     // remove buttons if search incomplete
    controlSection.classList.add('control__onload');
    return
  }

  controlSection.classList.remove('control__onload');
  const controlBack = document.querySelector('.control__back');
  const controlFwd = document.querySelector('.control__fwd');
  controlFwd.classList.add('control__hover');

  controlBack.addEventListener('click', back);
  controlFwd.addEventListener('click', forward);
}

function back() {
  if (pages === 0) {return}
  removePreviousEnlarged();
  pages -=1;

  const image = document.querySelectorAll(".images__wrapper img");
  let counter = 1 + pages * 14;
  for (let i = 0; i < image.length; i++) {
    let url = 'https://live.staticflickr.com/';
    url += photos[counter + i].getAttribute('server') + '/';
    url += photos[counter + i].getAttribute('id') + '_';
    url += photos[counter + i].getAttribute('secret') + '_b.jpg';
    image[i].src = url;
  }

  if (pages === 0) {
    const controlBack = document.querySelector('.control__back');
    controlBack.classList.remove('control__hover');
  }


  const controlFwd = document.querySelector('.control__fwd');
  controlFwd.classList.add('control__hover');
}

function forward() {
  if (photos[1 + (pages + 2) * 14] == undefined) {return}
  removePreviousEnlarged();
  pages +=1;
  const controlBack = document.querySelector('.control__back'); // making back button active
  controlBack.classList.add('control__hover');

  const image = document.querySelectorAll(".images__wrapper img");
  let counter = 1 + pages * 14;
  for (let i = 0; i < image.length; i++) {
    let url = 'https://live.staticflickr.com/';
    url += photos[counter + i].getAttribute('server') + '/';
    url += photos[counter + i].getAttribute('id') + '_';
    url += photos[counter + i].getAttribute('secret') + '_b.jpg';
    image[i].src = url;
  }

  if (photos[1 + (pages + 2) * 14] == undefined) {              // if there is no photo for next page, make it inactive
    const controlFwd = document.querySelector('.control__fwd');
    controlFwd.classList.remove('control__hover');
  }
}


//  Link:
//  https://www.flickr.com/services/api/misc.urls.html
//
//  Search:
//  https://www.flickr.com/services/api/flickr.photos.search.html
//
//  Search generator:
//  https://www.flickr.com/services/api/explore/flickr.photos.search
