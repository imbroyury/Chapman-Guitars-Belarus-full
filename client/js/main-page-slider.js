let imageArray = document.querySelectorAll('.main-section .image-item'),
    currentImage = 0;

setInterval(nextSlide, 3000);

function nextSlide() {
    imageArray[currentImage].classList.remove('current-image');
    currentImage < imageArray.length - 1 ? currentImage++ : currentImage = 0;
    imageArray[currentImage].classList.add('current-image');
}