const btnBack = document.querySelector('.btn-back');
const information = document.querySelector('.information');
const catchCitie = document.querySelector('.catch-citie');
const logo = document.querySelector('#logo');

btnBack.addEventListener('click', () => {
    information.style.display = 'none';
    catchCitie.style.display = 'block';
    logo.style.display = 'block';


});
