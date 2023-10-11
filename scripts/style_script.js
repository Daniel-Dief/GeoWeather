const body = document.querySelector('body');
const btnBack = document.querySelector('.btn-back');
const information = document.querySelector('.information');
const catchCitie = document.querySelector('.catch-citie');
const logo = document.querySelector('#logo');
const modal = document.querySelector('.modal');
const modalButton = document.querySelector('.modal-button');
const close = document.querySelector('.modal span');

btnBack.addEventListener('click', () => {
    information.style.display = 'none';
    catchCitie.style.display = 'block';
    logo.style.display = 'block';
    document.querySelector('#citie_input').value = "";
    document.querySelector('#citie_input').focus();
});

if (sessionStorage.log == null) {
    modal.style.display = 'flex';
    document.querySelector('.dark-overlay').style.zIndex = 0;
    sessionStorage.log = true;
    logo.style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (modal.style.display === 'flex' && !modal.contains(e.target)) {
        modal.style.display = 'none';
        document.querySelector('.dark-overlay').style.zIndex = -1;
        document.querySelector('.catch-citie input').focus();
        logo.style.display = 'block';
    }
});

modalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    document.querySelector('.dark-overlay').style.zIndex = -1;
    document.querySelector('.catch-citie input').focus();
    logo.style.display = 'block';
});
