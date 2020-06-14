import store from './store.js';
import api from './api.js';

const generateButtonsBar = () => {
  return `
    <section class="main-buttons">
      <div class="main-btn add-new js-add-new"><button class="new-text">Add Bookmark</button></div>
      <div class="filter-btn"> 
          <select name="rating" id="rating-filter">
              <option value="0">Filter By</option>
              <option ${store.filter === 5 ? 'selected' : ''} value="5">&#129374&#129374&#129374&#129374&#129374</option>
              <option ${store.filter === 4 ? 'selected' : ''} value="4">&#129374&#129374&#129374&#129374</option>
              <option ${store.filter === 3 ? 'selected' : ''} value="3">&#129374&#129374&#129374</option>
              <option ${store.filter === 2 ? 'selected' : ''} value="2">&#129374&#129374</option>
              <option ${store.filter === 1 ? 'selected' : ''} value="1">&#129374</option>
          </select>
      </div>
    </section>`;
};

const generateBookmark = function(bookmark) {
  let rating = bookmark.rating ? `<span class="rating-expanded">${bookmark.rating}</span>` : '';

  let expandedSection = bookmark.expanded ? (`
    <div class="main-section hidden">
      <div class="button-rating">
          <a class="visit-site" target="_blank" href="${bookmark.url}">Visit Site</a>
          <p>Rating: ${rating} &#129374</p>
      </div>
      <p class="bookmark-desc">${bookmark.desc}</p>   
    </div>`) : '';


  const generateRating = function() {
    let html = '';
    for (let i = 1; i <= bookmark.rating; i++) {
      html += '&#129374';
    }
    return html;
  };

  let icon = bookmark.expanded ? '<span class="js-delete-bookmark trash-can">&#128465;</span>' : `${generateRating()}`;


  return (
    `<li class="js-bookmark-element" data-item-id="${bookmark.id}">
      <div class="title-section">
          <h2>${bookmark.title}</h2>
          <div class="bar-icon">${icon}</div>
      </div>
      ${expandedSection}
    </li>`
  );
};

const generateBookmarksSection = function() {
  if ($('#rating-filter').val() === 'default') {
    return `<ul>
        ${store.bookmarks.map(bookmark => generateBookmark(bookmark)).join('')}
    </ul>`;
  } else {
    return (`
      <ul>
        ${store.bookmarks.filter(bookmark => bookmark.rating >= store.filter).map(bookmark => generateBookmark(bookmark)).join('')}
      </ul>`
    );
  }
};

function generateNewBookmarkForm() {
  let errorBox = store.error ? `<div class="error-box"><em class="error-msg">${store.error}</em></div>` : '';
  return `
    ${errorBox}
    <form class="add-new-form" method="POST">
      <legend>Add New Bookmark</legend>
      <div class="field">
        <label for="add-url">Link: <span class="required-span"><em>Required</em></span></label>
        <input required placeholder="Begin with 'https://'" id="add-url" type="url">
      </div>

      <div class="field">
        <label for="add-title">Title: <span class="required-span"><em>Required</em></span></label>
        <input required placeholder="Title" id="add-title" type="text">
      </div>

      <div class="field">
        <label for="add-desc">Description:</label>
        <textarea name="add-desc" id="add-desc" cols="30" rows="10" placeholder="Add Description (optional)"></textarea>
      </div>

      <div class="field">
        <label for="add-rating">Add a Rating:</label>
        <select name="add-rating" id="add-rating">
            <option value="none">Rating</option>
            <option value="5">&#129374&#129374&#129374&#129374&#129374</option>
            <option value="4">&#129374&#129374&#129374&#129374</option>
            <option value="3">&#129374&#129374&#129374</option>
            <option value="2">&#129374&#129374</option>
            <option value="1">&#129374</option>
        </select>
      </div>

      <div class="form-buttons">
        <button class="btn submit-btn" type="submit">Add Bookmark</button>
        <button class="btn cancel-btn js-cancel-btn">Cancel</button>
      </div>
    </form>`;
}

// event handlers
const handleAddBookmarkClick = function () {
  $('main').on('click', '.js-add-new', e => {
    store.toggleAdding();
    render();
  });
};

const handleDeleteBookmarkClick = function () {
  $('main').on('click', '.js-delete-bookmark', error => {
    const id = getItemIdFromElement(error.currentTarget);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch(error => {
        console.log(`${error}`);
      });
  });
};

const handleFilter = function () {
  $('main').on('change', '#rating-filter', element => {
    const rating = element.currentTarget.value;
    store.filterBookmarks(rating);
    render();
  });
};

const handleFormSubmit = function () {
  $('main').on('submit', '.add-new-form', event => {
    event.preventDefault();
    let url = $('#add-url').val();
    let title = $('#add-title').val();
    let desc = $('#add-desc').val();
    let rating = $('#add-rating').val();
    let newBookmark = {
      title: title,
      url: url,
      desc: desc,
      expanded: false
    };

    let obj = {
      rating: rating
    };

    if (rating !== 'none') {
      Object.assign(newBookmark, obj);
    }

    api.createNewBookmark(newBookmark)
      .then(bookmark => {
        store.addBookmark(bookmark);
        store.toggleAdding();
        render();
      })
      .catch(error => {
        console.log(error);
        store.setError(error.message);
        render();
      });
  });
};

const handleExpandedClick = function () {
  $('main').on('click', '.title-section', element => {
    const id = getItemIdFromElement(element.currentTarget);
    store.toggleExpanded(id);
    render();
  });
};

const handleCancelClick = function () {
  $('main').on('click', '.js-cancel-btn', event => {
    store.toggleAdding();
    render();
  });
};

const bindEventListeners = () => {
  handleAddBookmarkClick();
  handleDeleteBookmarkClick();
  handleFilter();
  handleFormSubmit();
  handleExpandedClick();
  handleCancelClick();
};


const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-bookmark-element')
    .data('item-id');
};

const run = function () {
  bindEventListeners();
  api.getBookmarks()
    .then(bookmarks => {
      store.setBookmarks(bookmarks);
      render();
    });
};

const render = function () {
  let html = '';
  if (!store.adding) { // if we are not adding a bookmark...
    html += generateButtonsBar();
    html += generateBookmarksSection();
  } else {
    html += generateNewBookmarkForm();
  }
  $('main').html(html);
};


export default {
  run
};