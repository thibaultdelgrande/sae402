const carousel = document.querySelector('.carousel');
const container = carousel.querySelector('.carousel-container');
const items = carousel.querySelectorAll('.carousel-item');

let currentIndex = 0;
let itemWidth = 0;
let slideInterval;

function init() {
  itemWidth = items[0].offsetWidth;
  container.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
  updateItems();
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
    const carousel = document.querySelector('.carousel');
    const container = carousel.querySelector('.carousel-container');
    const items = carousel.querySelectorAll('.carousel-item');
    
    let currentIndex = 0;
    let itemWidth = 0;
    let slideInterval;
    
    function init() {
      itemWidth = items[0].offsetWidth;
      container.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
      updateItems();
    }
    
    function slide(direction) {
      if (direction === 'prev') {
        currentIndex--;
      } else {
        currentIndex++;
      }
      container.style.transform = `translateX(${-itemWidth * currentIndex}px)`;
      updateItems();
    } items[1].classList.remove('next');
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

items.forEach((item, index) => {
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
  });
  

startSlide();


init();
