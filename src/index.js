import { PixabayApi } from './PixabayApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const searchFormElem = document.querySelector(`.search-form`);
// const formInput = document.querySelector(`input`);
const loadMoreBtn = document.querySelector(`.load-more`);
const picturesGallery = document.querySelector(`.gallery`);

 // Створюємо екземпляр від класу
const pixabayApiExemp = new PixabayApi();

// Функція пошуку картинки
function onSearch(event) {
    event.preventDefault();
    pixabayApiExemp.page = 1;
    
    // Дістаємо значення інпуту
    pixabayApiExemp.query = event.currentTarget.elements.query.value;
    // console.log(pixabayApiExemp)

    pixabayApiExemp.fetchPhotosByQuery()   
        .then((data) => {
            console.log(data)

            renderPicturesGallery(data.hits);
            new SimpleLightbox('.gallery a').refresh();

            onFetchMessage(data.totalHits);
            loadMoreBtn.classList.remove(`is-hidden`)
           
        })
        .catch(onFetchError)
}

// // Функція відмалювання в HTML списку картинок
function renderPicturesGallery(data) {
    const markup = data
    .map((data) => {
        return `<div class="photo-card">
        <a href="${data.largeImageURL}"><img class="images" src="${data.webformatURL}" alt="${data.tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item"><b>Likes</b>${data.likes}</p>
    <p class="info-item"><b>Views</b>${data.views}</p>
    <p class="info-item"><b>Comments</b>${data.comments}</p>
    <p class="info-item"><b>Downloads</b>${data.downloads}</p>
  </div>
</div>`
    })
    .join("");
    picturesGallery.innerHTML = markup;
    
}

function onClickLoad(event) {
    pixabayApiExemp.page += 1;
    
    pixabayApiExemp.fetchPhotosByQuery()
        .then(data => {
            
            if (pixabayApiExemp.page === data.totalHits) {
                loadMoreBtn.classList.add(`is-hidden`)
                
                onFetchInfo();
            }
            
            picturesGallery.insertAdjacentHTML(`beforeend`, renderPicturesGallery(data.hits));
            
        })
        .catch(err => {
        
    })
}

function onFetchError(error) {
    Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
}

function onFetchInfo(message) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
}

function onFetchMessage(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
}

// Вішаємо слухача подію сабміту 
searchFormElem.addEventListener(`submit`, onSearch);
loadMoreBtn.addEventListener(`click`, onClickLoad)
















    

