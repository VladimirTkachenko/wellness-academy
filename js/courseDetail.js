import { fetchCourses } from './courses.js';
import { generateRatingStars } from './ratingStars.js';
import { createPopup } from './popup.js';

export async function loadCourseData() {
  try {
    const courseId = getCourseIdFromURL();
    if (!courseId) redirectToHome();

    const { courses } = await fetchCourses();
    const course = findCourseById(courses, courseId);
    if (!course) redirectToHome();

    renderCoursePage(course);
  } catch (error) {
    console.error('Error loading course data:', error);
    redirectToHome();
  }
}

function getCourseIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('courseId');
}

function redirectToHome() {
  window.location.href = '../index.html';
}

function findCourseById(courses, courseId) {
  return courses.find((c) => c.id === parseInt(courseId));
}

function renderCoursePage(course) {
  renderHeroSection(course);
  renderMainContent(course);
  renderInstructorInfo(course.instructor);
}

function renderHeroSection(course) {
  const hero = document.getElementById('detailedHeroContent');
  if (!hero) return;

  hero.innerHTML = `
    <div class="detailed-hero__image-container">
      <img src="${course.image}" alt="${course.title}" class="detailed-hero__image">
    </div>
    <div class="detailed-hero__text-content">
      <h2 class="section__title detailed-hero__title">${course.title}</h2>
      <p class="section__subtitle detailed-hero__subtitle">${course.description}</p>
      <div class="detailed-hero__meta">
        <span class="detailed-hero__meta-item"><i class="fas fa-clock"></i> ${course.duration}</span>
        <span class="detailed-hero__meta-item"><i class="fas fa-signal"></i> ${course.difficulty}</span>
        <span class="detailed-hero__meta-item"><i class="fas fa-tag"></i> ${course.topic}</span>
      </div>
    </div>
  `;
}

function renderMainContent(course) {
  const mainContent = document.getElementById('detailedMainContent');
  if (!mainContent) return;

  mainContent.innerHTML = `
    <div class="detailed-content__block">
      <h2 class="detailed-content__block-title detailed-content__block-title--main" >Course Description</h2>
      <p class="detailed-content__block-text">${course.promotionalMessage}</p>
    </div>

    <div class="detailed-content__block">
      <h3 class="detailed-content__block-title">What You'll Learn</h3>
      <ul class="detailed-content__block-list">
        <li class="detailed-content__block-item">Master the fundamentals of ${course.topic.toLowerCase()}</li>
        <li class="detailed-content__block-item">Develop practical skills you can apply immediately</li>
        <li class="detailed-content__block-item">Learn from ${course.instructor.name}'s extensive experience</li>
        <li class="detailed-content__block-item">Join a community of like-minded wellness enthusiasts</li>
      </ul>
    </div>

    <div class="detailed-content__block">
      <h3 class="detailed-content__block-title">Course Structure</h3>
      <div class="detailed-content__features">
        <div class="detailed-content__feature">
          <i class="fas fa-video detailed-content__feature-icon"></i>
          <h4 class="detailed-content__feature-title">Video Lessons</h4>
          <p class="detailed-content__feature-text">High-quality instructional videos for each module</p>
        </div>
        <div class="detailed-content__feature">
          <i class="fas fa-book detailed-content__feature-icon"></i>
          <h4 class="detailed-content__feature-title">Reading Materials</h4>
          <p class="detailed-content__feature-text">Curated resources to deepen your understanding</p>
        </div>
        <div class="detailed-content__feature">
          <i class="fas fa-tasks detailed-content__feature-icon"></i>
          <h4 class="detailed-content__feature-title">Practical Exercises</h4>
          <p class="detailed-content__feature-text">Hands-on activities to apply what you've learned</p>
        </div>
      </div>
    </div>

    <div class="detailed__enrollment">
      <div class="detailed__enrollment-price">${course.price} ${course.currency}</div>
      <div class="detailed__enrollment-rating">
        ${generateRatingStars(course.rating)}
        <span class="detailed__enrollment-rating-value">${course.rating}/5</span>
      </div>
      <button class="btn detailed__enrollment-button">Enroll Now</button>
    </div>
  `;
  const enrollButton = mainContent.querySelector('.detailed__enrollment-button');
  if (enrollButton) {
    enrollButton.addEventListener('click', () => {
      const popupContent = `
        <h2>Enroll Now</h2>
        <p>Please visit our contact form and fill it out – our manager will contact you shortly.</p>
        <a href="contacts.html#contactForm" class="popup-link">Go to Contact Form</a>
      `;

      createPopup(popupContent);
    });
  }
}

function renderInstructorInfo(instructor) {
  const instructorSection = document.getElementById('detailedInstructorCard');
  if (!instructorSection) return;

  instructorSection.innerHTML = `
      <img src="${instructor.image}" alt="${instructor.name}" class="detailed-instructor__card-image">
      <div class="detailed-instructor__card-details">
        <h3 class="detailed-instructor__card-name">${instructor.name}</h3>
        <p class="detailed-instructor__card-role">${instructor.role}</p>
        <p class="detailed-instructor__card-bio">${instructor.bio}</p>
      </div>
  `;
}
