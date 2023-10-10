const btnBack = document.querySelector('.btn-back');
const information = document.querySelector('.information');
const catchCitie = document.querySelector('.catch-citie');
const logo = document.querySelector('#logo');
const modal = document.querySelector('.modal');
const close = document.querySelector('.modal span');

btnBack.addEventListener('click', () => {
    information.style.display = 'none';
    catchCitie.style.display = 'block';
    logo.style.display = 'block';
    document.querySelector('#citie_input').value = "";
    document.querySelector('#citie_input').focus();
});

if(sessionStorage.log == null){
    modal.style.display = 'flex';
    document.querySelector('#citie_input').disabled = true;
    document.querySelector('#search-form button').disabled = true;
    sessionStorage.log = true;
}

close.addEventListener('click', () => {
    modal.style.display = 'none';
    document.querySelector('#citie_input').disabled = false;
    document.querySelector('#search-form button').disabled = false;
});