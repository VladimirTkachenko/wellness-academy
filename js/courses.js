import { generateRatingStars } from './ratingStars.js';
export async function fetchCourses() {
  try {
    const response = await fetch('/wellness-academy/data/courses.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log('Fetched courses:', data);
    return data;
  } catch (error) {
    console.error('JSON upload error:', error);
    return { courses: [] };
  }
}

export function createCourseCard(course) {
console.log(course.image);
  const card = document.createElement('div');
  card.classList.add('featured-card');
 
  card.innerHTML = `
    <div class="featured-card__image-container">
      <img src="${course.image}" alt="${course.title}" class="featured-card__image">
    </div>
    <div class="featured-card__content">
      <h3 class="featured-card__title">${course.title}</h3>
      <p class="featured-card__description">${course.description}</p>
      <a href="/src/pages/courseDetail.html?courseId=${course.id}" class="featured-card__enroll-button btn">Learn more</a>
      <p class="featured-card__promo">${course.promotionalMessage}</p>
      <div class="featured-card__rating">${generateRatingStars(course.rating)}</div>
    </div>
  `;

  return card;
}

export function getRandomCourses(courses, count = 2) {
  return courses.sort(() => 0.5 - Math.random()).slice(0, count);
}

export function renderFeaturedCourses(courses) {
  const container = document.getElementById('featuredCoursesContainer');
  if (!container) return;

  container.innerHTML = '';

  const randomCourses = getRandomCourses(courses, 2);
  randomCourses.forEach((course) => {
    const courseCard = createCourseCard(course);
    container.insertBefore(courseCard, container.querySelector('.view-all'));
  });
}
