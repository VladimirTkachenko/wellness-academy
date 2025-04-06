export function generateRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
  if (hasHalfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';

  return starsHTML;
}
