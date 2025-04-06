export function setupGallery(courses) {
  let filteredCourses = [...courses];
  let currentPage = 1;
  const coursesPerPage = 10;
  let currentSortOrder = 'default';

  let currentTopic = 'all';
  let currentDifficulty = 'all';
  let currentSearchQuery = '';

  const container = document.getElementById('gallery-cards-container');
  const paginationNumbersContainer = document.querySelector('.pagination__numbers');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const loadMoreBtn = document.getElementById('load-more-btn');

  function filterCoursesByAll(topic, difficulty, query) {
    const topicLower = topic.toLowerCase();
    const difficultyLower = difficulty.toLowerCase();
    const queryLower = query.toLowerCase();

    filteredCourses = courses.filter((course) => {
      const matchTopic = topicLower === 'all' || course.topic.toLowerCase() === topicLower;

      const matchDifficulty =
        difficultyLower === 'all' || course.difficulty.toLowerCase() === difficultyLower;

      const combinedText = [
        course.title,
        course.instructor ? course.instructor.name : '',
        course.instructor ? course.instructor.role : '',
        course.description,
        course.promotionalMessage,
      ]
        .join(' ')
        .toLowerCase();

      const matchQuery = queryLower === '' || combinedText.includes(queryLower);

      return matchTopic && matchDifficulty && matchQuery;
    });

    currentPage = 1;
  }

  function sortCourses(criteria) {
    switch (criteria) {
      case 'title-asc':
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredCourses.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filteredCourses = [
          ...courses.filter((course) => {
            const matchTopic =
              currentTopic === 'all' || course.topic.toLowerCase() === currentTopic;
            const matchDifficulty =
              currentDifficulty === 'all' || course.difficulty.toLowerCase() === currentDifficulty;
            const combinedText = [
              course.title,
              course.instructor ? course.instructor.name : '',
              course.instructor ? course.instructor.role : '',
              course.description,
              course.promotionalMessage,
            ]
              .join(' ')
              .toLowerCase();
            const matchQuery =
              currentSearchQuery === '' || combinedText.includes(currentSearchQuery);
            return matchTopic && matchDifficulty && matchQuery;
          }),
        ];
        break;
    }
  }

  function createCourseCard(course) {
    const cardLink = document.createElement('a');
    cardLink.classList.add('course-card-link');
    cardLink.href = `/src/pages/courseDetail.html?courseId=${course.id}`;
    const card = document.createElement('div');
    card.classList.add('course-card');
    card.innerHTML = `
    <img class="course-card-image" src="${course.image}" alt="${course.title}" width="300" height="300" loading="lazy">
    <div class="course-card-info">
      <h2 class="course-card-title">${course.title}</h2>
      <p class="course-card-instructor">By: ${course.instructor.role} · ${course.instructor.name} </p>
      <p class="course-card-description">${course.description}</p>
      <p class="course-card-row">
        <span class="course-card-price">Total: ${course.price} ${course.currency}</span>
        <span class="course-card-rating"> ${course.rating} ★ </span>
      </p>
      <p class="course-card-row">
        <span class="course-card-topic">${course.topic}</span>
        <span class="course-card-difficulty">${course.difficulty}</span>
      </p>
    </div>
  `;
    cardLink.appendChild(card);

    return cardLink;
  }

  function renderCourses(shouldAppend = false) {
    if (!shouldAppend) {
      container.innerHTML = '';
    }
    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const coursesToRender = filteredCourses.slice(startIndex, endIndex);

    if (coursesToRender.length === 0 && !shouldAppend) {
      // Show "no results" message
      const noResults = document.createElement('div');
      noResults.classList.add('no-results');
      noResults.textContent = 'No courses found matching your criteria.';
      container.appendChild(noResults);
    } else {
      coursesToRender.forEach((course) => {
        container.appendChild(createCourseCard(course));
      });
    }

    renderPagination();
    updateNavButtons();
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    if (paginationNumbersContainer) {
      paginationNumbersContainer.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('pagination__button', 'pagination__button--number');
        if (i === currentPage) {
          btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
          currentPage = i;
          renderCourses();
        });
        paginationNumbersContainer.appendChild(btn);
      }
    }
  }

  function updateNavButtons() {
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    if (prevPageBtn) {
      prevPageBtn.disabled = currentPage === 1;
    }
    if (nextPageBtn) {
      nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    if (loadMoreBtn) {
      loadMoreBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
  }

  function applyFiltersAndSort() {
    filterCoursesByAll(currentTopic, currentDifficulty, currentSearchQuery);
    sortCourses(currentSortOrder);
    renderCourses();
  }

  function setupDropdowns() {
    const sortDropdown = document.getElementById('sort-dropdown');
    if (sortDropdown) {
      sortDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          e.preventDefault();
          const sortValue = e.target.getAttribute('data-sort');
          const button = document.querySelector('#sort-filter .gallery-controls__dropdown-toggle');
          if (button) {
            button.innerHTML = `Sort by: ${e.target.textContent} <span class="gallery-controls__caret"></span>`;
          }
          currentSortOrder = sortValue;
          applyFiltersAndSort();
        }
      });
    }

    const topicDropdown = document.getElementById('topic-dropdown');
    if (topicDropdown) {
      topicDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          e.preventDefault();
          const filterValue = e.target.getAttribute('data-filter');
          const button = document.querySelector('#topic-filter .gallery-controls__dropdown-toggle');
          if (button) {
            button.innerHTML = `Filter by Topic: ${e.target.textContent} <span class="gallery-controls__caret"></span>`;
          }
          currentTopic = filterValue;
          applyFiltersAndSort();
        }
      });
    }

    const difficultyDropdown = document.getElementById('difficulty-dropdown');
    if (difficultyDropdown) {
      difficultyDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          e.preventDefault();
          const filterValue = e.target.getAttribute('data-filter');
          const button = document.querySelector(
            '#difficulty-filter .gallery-controls__dropdown-toggle'
          );
          if (button) {
            button.innerHTML = `Filter by Difficulty: ${e.target.textContent} <span class="gallery-controls__caret"></span>`;
          }
          currentDifficulty = filterValue;
          applyFiltersAndSort();
        }
      });
    }

    const dropdownToggles = document.querySelectorAll('.gallery-controls__dropdown-toggle');
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.querySelectorAll('.gallery-controls__dropdown.open').forEach((dropdown) => {
          if (dropdown !== toggle.parentElement) {
            dropdown.classList.remove('open');
          }
        });

        toggle.parentElement.classList.toggle('open');

        const isExpanded = toggle.parentElement.classList.contains('open');
        toggle.setAttribute('aria-expanded', isExpanded);
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.gallery-controls__dropdown.open').forEach((dropdown) => {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('.gallery-controls__dropdown-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function setupSearch() {
    const searchForm = document.querySelector('.gallery-controls__search-form');
    const searchInput = document.getElementById('search-courses');

    if (searchForm && searchInput) {
      searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
          currentSearchQuery = '';
          applyFiltersAndSort();
        }
      });

      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentSearchQuery = searchInput.value.trim().toLowerCase();
        applyFiltersAndSort();
      });

      const searchButton = document.getElementById('search-course-button');
      if (searchButton) {
        searchButton.addEventListener('click', (e) => {
          e.preventDefault();
          currentSearchQuery = searchInput.value.trim().toLowerCase();
          applyFiltersAndSort();
        });
      }
    }
  }

  function setupPagination() {
    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderCourses();
        }
      });
    }

    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderCourses();
        }
      });
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderCourses(true);
        }
      });
    }
  }

  function init() {
    setupDropdowns();
    setupSearch();
    setupPagination();
    renderCourses();
  }

  init();
}
