const btnLinks = document.querySelectorAll('.btn[href="/game.html"]');

const data = {};

btnLinks.forEach((btnLink) => {
  btnLink.addEventListener('click', (e) => {
    e.preventDefault();

    data.numOfQuestions = Number(document.querySelector('#numOfQuestions').value);
    data.category = Number(e.target.getAttribute('data-category'));

    localStorage.setItem('data', JSON.stringify(data));

    location.assign('/game.html');
  });
});
