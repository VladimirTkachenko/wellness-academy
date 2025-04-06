import { createPopup } from './popup.js';

export function setupFormValidation() {
  setupSpecificFormValidation('#guideForm', ['first_name', 'last_name', 'email'], (formData) => {
    return `Thank you, ${formData.first_name} ${formData.last_name} for subscribing! <br> Your Free Guide has been sent to your email: ${formData.email}.`;
  });

  setupSpecificFormValidation('#contactForm', ['name', 'email', 'message'], (formData) => {
    return `Thank you, ${formData.name}! Your message has been sent. We'll respond to ${formData.email} as soon as possible.`;
  });
}

function setupSpecificFormValidation(formSelector, requiredFields, successMessageTemplate) {
  const form = document.querySelector(formSelector);
  if (!form) {
    return;
  }

  requiredFields.forEach((fieldName) => {
    const input = form.elements[fieldName];
    if (input) {
      input.addEventListener('blur', () => {
        validateField(input);
      });

      input.addEventListener('focus', () => {
        const formGroup = input.closest('.guide__form-group') || input.closest('.form-group');
        if (formGroup) {
          const errorElem = formGroup.querySelector('.field-error');
          if (errorElem) {
            errorElem.textContent = '';
          }
        }
      });
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let formValid = true;

    requiredFields.forEach((fieldName) => {
      const input = form.elements[fieldName];
      if (input && !validateField(input)) {
        formValid = false;
      }
    });

    if (!formValid) {
      return;
    }

    const formData = {};
    for (const element of form.elements) {
      if (element.name) {
        formData[element.name] = element.value.trim();
      }
    }
    const message = successMessageTemplate(formData);
    createPopup(`<p>${message}</p>`);

    form.reset();
  });
}

function isValidEmail(str) {
  if (str === null || str === undefined) return false;

  const [personalInfo, domain] = str.split('@');
  if (!personalInfo || !domain) return false;

  const personalInfoRegex = /^[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9.]+$/;
  const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

  if (
    personalInfo.startsWith('.') ||
    personalInfo.endsWith('.') ||
    personalInfo.includes('..') ||
    personalInfo.length > 64 ||
    domain.length > 253
  ) {
    return false;
  }

  return personalInfoRegex.test(personalInfo) && domainRegex.test(domain);
}

function validateField(input) {
  const value = input.value.trim();
  let errorMessage = '';
  const NAME_REGEX = /^[a-zA-Z\u0400-\u04FF\s]+$/;

  if (input.name === 'first_name' || input.name === 'last_name' || input.name === 'name') {
    if (value === '') {
      errorMessage = 'This field is required.';
    } else if (!NAME_REGEX.test(value)) {
      errorMessage = 'Only letters allowed!';
    }
  } else if (input.name === 'email') {
    if (value === '') {
      errorMessage = 'Email is required.';
    } else if (!isValidEmail(value)) {
      errorMessage = 'Please enter a valid email.';
    }
  } else if (input.name === 'message') {
    if (value === '') {
      errorMessage = 'Message is required.';
    } else if (value.length < 10) {
      errorMessage = 'Message must be at least 10 characters.';
    }
  }

  const formGroup = input.closest('.guide__form-group') || input.closest('.form-group');
  if (formGroup) {
    let errorElem = formGroup.querySelector('.field-error');
    if (!errorElem) {
      errorElem = document.createElement('div');
      errorElem.className = 'field-error';
      formGroup.appendChild(errorElem);
    }
    errorElem.textContent = errorMessage;
  }

  return errorMessage === '';
}
