
import axios from 'axios';

const BASE_URL = `https://pixabay.com/api/`;

export class PixabayApi {
  BASE_URL = `https://pixabay.com/api/`;
  API_KEY = `31697968-406cab2af0ae45e7393df2600`;
    
  constructor() {
    this.page = 1;
    this.query = null;
    this.per_page = 40;
  }
      
  fetchPhotosByQuery() {
    return axios.get(`${this.BASE_URL}?${this.API_KEY}`, {
      params: {
        q: this.query,
        page: this.page,
        per_page: this.per_page,
        key: this.API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    });
  }
}




