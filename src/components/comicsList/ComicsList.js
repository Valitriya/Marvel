import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const ComicsList = () => {
  const [comicsList, setComicsList] = useState([]);
  const [newItemLoading, setNewItem] = useState(false);
  const [offset, setOffset] = useState(0);
  const [comicsEnded, setComicsEnded] = useState(false);

  const { loading, error, getAllComics } = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  // Метод, отвечающий за прогрузку комиксов
  const onRequest = (offset, initial) => {
    initial ? setNewItem(false) : setNewItem(true);
    getAllComics(offset).then(onCharListLoaded);
  };

  // Метод, отвечающий за успешную загрузку
  const onCharListLoaded = (newComicsList) => {
  // Удаление кнопки из видимости, когда все персонажи прогружены
    let ended = false;
    if (newComicsList.length < 7) {
      ended = true;
    }
    setComicsList(() => [...comicsList, ...newComicsList]);
    setNewItem((newItemLoading) => false);
    setOffset((offset) => offset + 8);
    setComicsEnded((comicsEnded) => ended);
  };

  // Метод для оптимизации вне конструкции метода render
  function renderItems(arr) {
    const items = arr.map((item, i) => {
      return (
        <li className="comics__item" key={i}>
          <a href="#">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.title}</div>
            <div className="comics__item-price">{item.price}</div>
          </a>
        </li>
      );
    });

    return <ul className="comics__grid">{items}</ul>;
  }

  const items = renderItems(comicsList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: comicsEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
