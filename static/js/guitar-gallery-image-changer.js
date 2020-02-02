let gallery = document.querySelector('.guitar-gallery-wrap');

gallery.addEventListener('click', function (event) {
  if (event.target.classList.contains('color-circle')) {
    let circle = event.target,
      circleTag = circle.dataset.circleTag,
      guitarName = circle.closest('.guitar-item').dataset.guitarName,
      currentImageAttr = guitarName + '-' + circleTag,
      requiredGuitarImage = document.querySelector(`.guitar-image[data-guitar-image='${currentImageAttr}']`);

    if (!circle.classList.contains('current-color-circle')) {
      circle.parentNode.querySelector('.current-color-circle').classList.remove('current-color-circle');
      circle.classList.add('current-color-circle');
      requiredGuitarImage.parentNode.querySelector('.current-guitar-image').classList.remove('current-guitar-image');
      requiredGuitarImage.classList.add('current-guitar-image');
    }
  }
});