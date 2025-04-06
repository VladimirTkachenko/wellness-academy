import { setupMenu } from './menu.js';
import { initHeroHeight } from './hero.js';
import { fetchCourses, renderFeaturedCourses } from './courses.js';
import { renderCreators } from './creators.js';
import { setupFormValidation } from './formValidation.js';

document.addEventListener('DOMContentLoaded', async () => {
  setupMenu();
  initHeroHeight();

  const { courses } = await fetchCourses();

  if (courses.length > 0) {
    renderFeaturedCourses(courses);
    renderCreators(courses);
  }
  setupFormValidation();

  const currentYearElem = document.querySelector('#current-year');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

  if (document.querySelector('.course-detail-page')) {
    import('./courseDetail.js')
      .then((module) => {
        module.loadCourseData();
      })
      .catch((err) => {
        console.error('Error loading courseDetail.js module:', err);
        window.location.href = '../index.html';
      });
  }

  if (document.querySelector('.gallery-page')) {
    import('./gallery.js')
      .then((module) => {
        module.setupGallery(courses);
      })
      .catch((err) => {
        console.error('Error loading gallery.js module:', err);
      });
  }

  if (document.querySelector('.contacts-page')) {
    import('./contacts.js')
      .then((module) => {
        module.setupContactPage();
      })
      .catch((err) => {
        console.error('Error loading contacts.js module:', err);
      });
  }
});
