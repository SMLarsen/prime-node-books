$(document).ready(function() {
    console.log('document ready');

    getGenres();

//=============  Event Handlers  ========================
    // add a book
    $('#book-add').on('click', postBook);
    // get books
    $('#book-submit').on('click', getBooks);
    // delete a book
    $("#book-list").on('click', '.delete', deleteBook);
    // update a book
    $("#book-list").on('click', '.update', updateBook);
});

//==================  Functions  ========================
/**
 * Retrieve books from server and append to DOM
 */
function getBooks() {
    var selectedGenre = $(".genre").val();
    console.log(selectedGenre);
    $.ajax({
        type: 'GET',
        url: '/books/' + selectedGenre,
        success: function(books) {
            appendBooks(books);
        },
        error: function() {
            console.log('Database error');
        }
    });
} // end getBooks
/**
 * Add a new book to the database and refresh the DOM
 */
function postBook() {
    event.preventDefault();

    var book = {};

    $.each($('#book-form').serializeArray(), function(i, field) {
        book[field.name] = field.value;
    });
    // convert edition to integer
    book.edition = parseInt(book.edition);

    // console.log('book: ', book);

    $.ajax({
        type: 'POST',
        url: '/books',
        data: book,
        success: function(response) {
            getBooks();
        },
        error: function() {
            console.log('could not post a new book');
        }
    });
} // end postBook

/**
 * Delete a book from the database and refresh the DOM
 */
function deleteBook() {
    var id = $(this).parent().data('id');
    console.log(id);

    $.ajax({
        type: 'DELETE',
        url: '/books/' + id,
        success: function(result) {
            getBooks();
        },
        error: function(result) {
            console.log('could not delete book.');
        }
    });
} // end deleteBook

/**
 * Update book on the database and refresh the DOM
 */
function updateBook() {
    var id = $(this).parent().data('id');
    console.log(id);

    // make book object
    var book = {};
    var fields = $(this).parent().children().serializeArray();
    fields.forEach(function(field) {
        book[field.name] = field.value;
    });
    // console.log(book);

    $.ajax({
        type: 'PUT',
        url: '/books/' + id,
        data: book,
        success: function(result) {
            console.log('updated!!!!');
            getBooks();
        },
        error: function(result) {
            console.log('could not update book!');
        }
    });
} // end updateBook

/**
 * Append books to the DOM
 */
function appendBooks(books) {
    $("#book-list").empty();

    for (var i = 0; i < books.length; i++) {
        $("#book-list").append('<div class="row book"></div>');
        $el = $('#book-list').children().last();
        var book = books[i];
        $el.data('id', book.id);

        var convertedDate = book.published.substr(0, 10);

        $el.append('<div class="row">');
        $el.append('<input class="bookInput col-md-6" type="text" name="title" value="' + book.title + '" />');
        $el.append('<input class="bookInput col-md-5" type="text" name="author" value="' + book.author + '" />');
        $el.append('</div><div class="row">');
        $el.append('<input class="bookInput col-md-2" type="text" name="genre" value="' + book.genre + '" />');
        var newDate = $('<input class="bookInput col-md-3" type="date" name="published" />');
        newDate.val(convertedDate);
        $el.append(newDate);
        $el.append('<input class="bookInput col-md-1" type="number" name="edition" value="' + book.edition + '" />');
        $el.append('<input  class="bookInput col-md-3"type="text" name="publisher" value="' + book.publisher + '" />');

        $el.append('<button class="bookInput update btn btn-default col-md-offset-1">Update</button>');
        $el.append('<button class="bookInput delete btn btn-default">Delete</button>');
        $el.append('</div>');
    }
} // end appendBooks

/**
 * Retrieve books from server and append to DOM
 */
function getGenres() {
    $.ajax({
        type: 'GET',
        url: '/books/genreList',
        success: function(genres) {
          console.log('genres', genres);
            buildGenreSelection(genres);
        },
        error: function() {
            console.log('Database error');
        }
    });
} // end getGenres


/**
 * Append select options to DOM
 */
function buildGenreSelection(genreList) {
  console.log('genreList', genreList);
  $('#genreDropdown').append('<option value="All">All</option>');

  $el = $('#genreDropdown').last();
  console.log($el.val());

  for (var i = 0; i < genreList.length; i++) {
    var string = '<option value="' + genreList[i].genre + '">' +
     genreList[i].genre + '</option>';
     $el.append(string);
  }
} // end buildGenreSelection
