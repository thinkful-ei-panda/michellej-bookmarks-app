const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
};

const addBookmark = function (bookmark) {
  // console.log(`bookmark added`);
  this.bookmarks.push(bookmark);
};

const filterBookmarks = function (rating) {
  this.filter = rating;
};

const toggleAdding = function () {
  this.adding = !this.adding;
};

const toggleExpanded = function (id) {
  const bookmark = this.bookmarks.find(bookmark => bookmark.id === id);
  bookmark.expanded = !bookmark.expanded;
};

const setBookmarks = function (bookmarks) {
  this.bookmarks = bookmarks;
};

const setError = function (msg) {
  this.error = msg;
};

export default {
  bookmarks,
  error,
  adding,
  filter,
  findAndDelete,
  addBookmark,
  filterBookmarks,
  toggleAdding,
  toggleExpanded,
  setBookmarks,
  setError
};