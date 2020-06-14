import api from './api.js';
import store from './store.js';
import bookmarks from './bookmarks.js';

const main =  function() {
  bookmarks.run();
};

$(main);