const btnBack = document.querySelector('.btn-back');
const information = document.querySelector('.information');
const catchCitie = document.querySelector('.catch-citie');

btnBack.addEventListener('click', () => {
    information.style.display = 'none';
    catchCitie.style.display = 'block';
});
