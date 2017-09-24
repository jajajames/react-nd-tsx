import * as React from "react";
import {Route} from "react-router-dom";
import "./App.css";
import Bookcase from "./Bookcase";
import * as BooksAPI from "./BooksAPI";
import {IBook, IShelvedBookIds} from "./interfaces";
import SearchBooks from "./SearchBooks";

interface IAppState {
  books: IBook[];
  query: string;
}

class App extends React.Component {

  public state: IAppState = {
    books: [],
    query: "",
  };

  public componentDidMount() {
    BooksAPI.getAll()
    .then((books) => {
      this.setState({ books });
    });
  }

  public updateQuery = (query: string): void => {
    BooksAPI.search(query).then((searchResults) => {
      const books = this.state.books;

      if (searchResults && searchResults.hasOwnProperty("length") && searchResults.length > 0) {
        searchResults.forEach((result: any) => {
          return (this.findBookById(result.id, books) !== undefined) || (books.push(result));
        });
      }

      this.setState({ query, books });
    });
  }

  public update = (book: IBook, shelf: string): void => {
    const books = this.state.books;

    if (shelf === "none") {
      const bookToUnshelve: IBook | undefined = this.findBookById(book.id, books);
      if (bookToUnshelve) {
        bookToUnshelve.shelf = undefined;
      }
    }

    BooksAPI.update(book, shelf)
    .then((shelvedBookIds: IShelvedBookIds) => {
      const updatedBooks = this.updateBookShelves(books, shelvedBookIds);

      this.setState({ books: updatedBooks });
    });
  }

  public render() {
    return (
      <div className="app">
        <Route
          exact path="/search"
          render={({ history }) => (
            <SearchBooks
              query={this.state.query}
              updateQuery={this.updateQuery}
            />
        )}/>
        <Route
          exact path="/"
          render={({ history }) => (
            <Bookcase
              books={this.state.books}
              query={this.state.query}
              update={this.update}
            />
        )}/>
      </div>
    );
  }

  private findBookById = (bookId: string, books: IBook[]) => {
    return books.find((book) => (bookId === book.id));
  }

  private updateBookShelves = (books: IBook[], shelvedBookIds: IShelvedBookIds) => {
    const shelvedBookIdKeys: string[] = Object.keys(shelvedBookIds);

    shelvedBookIdKeys.forEach((shelfKey: string) => {
      shelvedBookIds[shelfKey].forEach((bookId: string) => {
        const book: IBook | undefined = this.findBookById(bookId, books);

        if (book) {
          book.shelf = shelfKey;
        }
      });
    });

    return books;
  }

}

export default App;
