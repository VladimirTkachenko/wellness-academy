export function createPopup(contentHTML) {
  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'popup-overlay';
  popupOverlay.innerHTML = `
    <div class="popup-content">
      ${contentHTML}
      <button class="btn close-popup-btn">Close</button>
    </div>
  `;

  document.body.appendChild(popupOverlay);

  const closeButton = popupOverlay.querySelector('.close-popup-btn');
  const timer = setTimeout(() => {
    if (popupOverlay.parentNode) {
      popupOverlay.remove();
    }
  }, 10000);

  closeButton.addEventListener('click', () => {
    clearTimeout(timer);
    popupOverlay.remove();
  });

  return popupOverlay;
}
