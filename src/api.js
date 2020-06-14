const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michellej/bookmarks';

const bookmarksApiFetch = (...args) => { 
  let error = null;
  return fetch(...args)
    .then(res => {
      // console.log(`res: ${res}`);
      if (!res.ok) {
        error = { code: res.status };
      }
      return res.json(); 
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      // console.log(`data: ${data}`);
      return data;
    });
};

const deleteBookmark = id => {
  return bookmarksApiFetch(`${BASE_URL}/${id}`, {
    'method': 'DELETE',
    'headers': {
      'Content-Type': 'application/json'
    }
  });
};

const createNewBookmark = bookmark => { 
  const newBookmark = JSON.stringify(bookmark);
  return bookmarksApiFetch(BASE_URL, {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': newBookmark
  });
};

const getBookmarks = () => {
  return bookmarksApiFetch(BASE_URL, {
    'method': 'GET',
    'headers': {
      'Content-Type': 'application/json'
    }
  });
};

export default {
  deleteBookmark,
  createNewBookmark,
  getBookmarks
};