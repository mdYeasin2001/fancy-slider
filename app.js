const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
// selected image
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";


// show images
const showImages = (images) => {
  imagesArea.style.display = "block";
  gallery.innerHTML = "";
  // if any images not found
  if (images.length == 0) {
    document.getElementById("slider-create-area").classList.add("d-none");
    gallery.innerHTML = `
    <div id="alert" class="alert alert-warning col-sm-8" role="alert">
    Oops no images found! Please search for another image name.
    </div>
    `;
  } else {
    // show gallery title
    document.getElementById("slider-create-area").classList.remove("d-none");
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  }
  // spinner will stop to spin here
  toggleSpinner();
};

const getImages = (query) => {
  // spinner will start to spin here
  toggleSpinner();
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => showImages(data.hits))
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  // image select and deselect functionality
  if (item === -1) {
    sliders.push(img);
    element.classList.add('added')
  }else{
    sliders.splice(item, 1);
    element.classList.remove('added');
  }
};
var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  let duration = document.getElementById("duration").value || 1000;
  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  if (duration < 0) {
    duration = parseInt(duration) * -1;
  }
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};

searchBtn.addEventListener("click", function () {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  if(search.value == ""){
    // alert("no name typed in!");
    gallery.innerHTML = `
    <div id="alert" class="alert alert-danger col-sm-8" role="alert">
    Search box is empty! Please enter a name you are looking for.
    </div>
    `;
  }else{
    getImages(search.value);
  }
  
  sliders.length = 0;
});
document.getElementById("search").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});

sliderBtn.addEventListener("click", function () {
  createSlider();
});


// toggle spinner when data loading
const toggleSpinner = () => {
  const spinner = document.getElementById("spinner");
  spinner.classList.toggle("d-none");
  gallery.classList.toggle("d-none");
};
