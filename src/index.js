import { PixabayApi } from './PixabayApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchFormElem = document.querySelector(`.search-form`);
const loadMoreBtn = document.querySelector(`.load-more`);
const picturesGallery = document.querySelector(`.gallery`);

const pixabayApiExemp = new PixabayApi();


function onSearch(event) {
    event.preventDefault();
    pixabayApiExemp.page = 1;
    pixabayApiExemp.query = event.currentTarget.elements.query.value;
   
    pixabayApiExemp.fetchPhotosByQuery()   
        .then((data) => {
            if (data.total === 0) {
                picturesGallery.innerHTML = '';
                loadMoreBtn.classList.add(`is-hidden`)
                onFetchError();
                event.target.reset();
                return;
            }
           
            console.log(data)

            renderPicturesGallery(data.hits);
            
            simpleLightbox.refresh();
            
            onFetchMessage(data.totalHits);

            loadMoreBtn.classList.remove(`is-hidden`)
        
        })
         .catch(err => {
      console.log(err);
    });
}


function renderPicturesGallery(data) {
    const markup = data
    .map((data) => {
        return `
        <div class="photo-card">
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
            
            if (pixabayApiExemp.page > data.hits) {
                loadMoreBtn.classList.add(`is-hidden`)
                onFetchInfo();
                return;
            }
            
        
            renderPicturesGallery(data.hits);
            
            simpleLightbox.refresh();
            scroll();
            
        })
        .catch(err => {
      console.log(err);
    });
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


const simpleLightbox = new SimpleLightbox('.gallery a', { 
  captionsData: `alt`,
  captionDelay: `250`
 });

function scroll() {
    const { height: cardHeight } =
    picturesGallery.firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
 }

searchFormElem.addEventListener(`submit`, onSearch);
loadMoreBtn.addEventListener(`click`, onClickLoad)
















    

