export function renderCreators(courses) {
  const container = document.querySelector('.creators__container');
  const paginationContainer = document.querySelector('.creators__pagination');

  if (!container || !paginationContainer) return;

  container.innerHTML = '';
  paginationContainer.innerHTML = '';

  courses.forEach((course) => {
    const { instructor, id: courseId } = course;
    const { role, name, image, bioLink } = instructor;
    const creatorCard = document.createElement('div');

    creatorCard.classList.add('creator-card');

    creatorCard.innerHTML = `
      <img
        src="${image}"
        alt="${name}"
        class="creator-card__image"
      >
      <h3 class="creator-card__name">
        ${name ? name.split(' ').join('<br>') : 'Unknown Instructor'}
      </h3>
      <p class="creator-card__role">${role || 'Instructor'}</p>
      <a
        href="/src/pages/courseDetail.html?courseId=${courseId}"
        class="creator-card__link"
      >
        Go to course
      </a>
    `;

    container.appendChild(creatorCard);
  });

  setupSlider(courses.length);
}
function setupSlider(totalCreators) {
  const container = document.querySelector('.creators__container');
  const prevBtn = document.querySelector('.slider-button--prev');
  const nextBtn = document.querySelector('.slider-button--next');
  const paginationContainer = document.querySelector('.creators__pagination');
  const cards = document.querySelectorAll('.creator-card');

  if (cards.length === 0) return;

  const getVisibleCards = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) return 1;
    if (screenWidth < 1024) return 2;
    return 3;
  };

  let visibleCards = getVisibleCards();
  let maxIndex = Math.max(0, totalCreators - visibleCards);
  let currentIndex = 0;
  const maxVisibleDots = 5;

  function generatePaginationElements(totalPages, currentIndex, maxVisible = 5) {
    const pages = [];

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      let start = Math.max(currentIndex - 1, 1);
      let end = Math.min(currentIndex + 1, totalPages - 2);

      if (start > 1) {
        pages.push('ellipsis');
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages - 1);
    }
    return pages;
  }

  function updatePagination() {
    const totalPages = maxIndex + 1;
    const paginationItems = generatePaginationElements(totalPages, currentIndex, maxVisibleDots);

    paginationContainer.innerHTML = '';
    paginationItems.forEach((item) => {
      if (item === 'ellipsis') {
        const span = document.createElement('span');
        span.textContent = '...';
        span.classList.add('pagination-ellipsis');
        paginationContainer.appendChild(span);
      } else {
        const dot = document.createElement('span');
        dot.classList.add('pagination-dot');
        if (item === currentIndex) dot.classList.add('active');
        dot.dataset.index = item;
        dot.addEventListener('click', () => {
          currentIndex = Number(item);
          updateSlider();
        });
        paginationContainer.appendChild(dot);
      }
    });
  }

  function updateSlider() {
    visibleCards = getVisibleCards();
    maxIndex = Math.max(0, totalCreators - visibleCards);
    currentIndex = Math.min(currentIndex, maxIndex);

    const cardWidth = cards[0].offsetWidth;
    const cardGap = 14;
    const offset = -currentIndex * (cardWidth + cardGap);
    container.style.transform = `translateX(${offset}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    updatePagination();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener('resize', updateSlider);

  updateSlider();
}
