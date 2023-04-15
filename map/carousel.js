const carousel = document.querySelector('.carousel');
const container = carousel.querySelector('.carousel-container');
let items;

let carousel_initialized = false;

let currentIndex = 0;
let itemWidth = 0;
let slideInterval;



function init() {
  // Tant que item n'est pas définit, on attend
  itemWidth = items[0].offsetWidth;
  container.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
  updateItems();
  startSlide();
}

function slide(direction) {
  if (direction === 'prev') {
    currentIndex--;
  } else {
    currentIndex++;
  }
  container.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
  updateItems();
}

function updateItems() {
  if (currentIndex === 0) {
    items[items.length - 1].classList.add('prev');
    items[1].classList.remove('next');
  } else if (currentIndex === items.length - 1) {
    items[0].classList.remove('prev');
    items[currentIndex - 1].classList.add('next');
  } else {
    items[currentIndex - 1].classList.add('prev');
    items[currentIndex + 1].classList.remove('next');
  }
}
function slide(direction) {
  const previousIndex = currentIndex;
  if (direction === 'next') {
    currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
  } else if (direction === 'prev') {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
  }
  if (currentIndex === previousIndex) {
    return;
  }
  updateItems();
  container.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function updateItems() {
  items.forEach((item, index) => {
    if (index === currentIndex) {
      item.style.opacity = 1;
    } else {
      item.style.opacity = 0;
    }
  });
}

function startSlide() {
  slideInterval = setInterval(() => {
    if (currentIndex < items.length - 1) {
      slide('next');
    } else {
      currentIndex = 0;
      container.style.transform = `translateX(0)`;
      updateItems();
    }
  }, 15000);
}

function stopSlide() {
  clearInterval(slideInterval);
}

async function initCarousel() {
  fetch('etapes.json')
    .then(response => response.json())
    .then(data => {
      etapes = data.etapes;
      // Si aucune valeur pour id_status n'est trouvée dans les cookies, on initialise à 0
      if (document.cookie.indexOf("id_status") == -1) {
          id_status = 0;
          document.cookie = "id_status="+id_status+" ; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      }
      else {
          id_status = parseInt(document.cookie.split("id_status=")[1].split(";")[0]);
      }
      // Si le type de l'étape est goto
      if (etapes[id_status].type === "goto"){
        // Afficher le carousel
        document.querySelector(".carousel").style.display = "block";
        // Récupère les données du fichier facts.json
        fetch('facts.json')
        .then(response => response.json())
        .then(data => {
            data[etapes[id_status].name].forEach(function(fact){
                let element = document.createElement("div");
                element.classList.add("carousel-item");
                element.innerHTML = `
                        <img src="img_anecdotes/${fact.image_path}" alt="">
                        <div class="info">
                            <h1>${etapes[id_status].name}</h1>
                            <p>
                                ${fact.anecdote}
                            </p>
                        </div>`;
                document.querySelector(".carousel-container").appendChild(element);
            });
              items = carousel.querySelectorAll('.carousel-item');
              items.forEach((item) => {
                item.addEventListener('click', (event) => {
                  const boundingRect = item.getBoundingClientRect();
                  const clickX = event.clientX - boundingRect.left;
                  if (clickX < boundingRect.width / 2) {
                    if (currentIndex > 0) {
                      slide('prev');
                    }
                  } else {
                    if (currentIndex < items.length - 1) {
                      slide('next');
                    }
                  }
                });
              init();
            });
        })
        .catch(error => console.log(error));
      }
      else {
        document.querySelector(".carousel").style.display = "none";
        // On attends et on relance la fonction
        setTimeout(initCarousel, 1000);
      }
  })
}

initCarousel();





