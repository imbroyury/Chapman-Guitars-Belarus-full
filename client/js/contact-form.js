let form = document.querySelector('.contact-form');

form.addEventListener('click', function(event) {
  let el = event.target,
    elTag = el.tagName;
  if ((elTag === 'INPUT' || elTag === 'TEXTAREA') && el.hasAttribute('required')) {
    el.classList.add('check-required-input');
  }
});