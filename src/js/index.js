import axios from 'axios';
import Notiflix from 'notiflix';
import { createGalleryItem } from './createGalleryItems';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '36237308-42aa754ef31b34db7b4fcf11d';
const apiUrl = 'https://pixabay.com/api/?';
const limit = 40;
const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('#gallery');
const LoadMoreBtnEl = document.querySelector('#load-more');

let displayingPage = 1;
let allPages = 0;
let searchInput = '';

const searchParams = () =>
  new URLSearchParams({
    key: apiKey,
    q: searchInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: displayingPage,
    per_page: limit,
  });

const getImages = async () => {
  try {
    const response = await axios.get(apiUrl + searchParams());
    if (response.data.hits.length === 0) throw new Error();
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const firstPhotosBatch = async () => {
  const data = await getImages();
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  allPages = Math.ceil(data.totalHits / limit);
  data.hits.forEach(photo => createGalleryItem(galleryEl, LoadMoreBtnEl, photo));
  new SimpleLightbox('#gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    uniqueImages: true,
    scrollZoom: true,
    download: "Download it",
   
  });
};

const nextPhotosBatch = async () => {
  displayingPage++;
  try {
    if (displayingPage > allPages) throw new Error(error);
    const data = await getImages();
    data.hits.forEach(photo => createGalleryItem(galleryEl, LoadMoreBtnEl, photo));
    new SimpleLightbox('#gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }).refresh();
  } catch (error) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
};

const createGallery = event => {
  event.preventDefault();
  searchInput = event.currentTarget.elements.searchQuery.value;
  displayingPage = 1;
  allPages = 0;
  galleryEl.innerHTML = '';
  LoadMoreBtnEl.classList.add('hidden');
  firstPhotosBatch();
};

searchFormEl.addEventListener('submit', createGallery);
LoadMoreBtnEl.addEventListener('click', () => nextPhotosBatch());