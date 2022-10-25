import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./charList.scss";

const CharList = (props) => {

  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItem] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  // Метод, отвечающий за прогрузку дополнительных 9 персонажей
  const onRequest = (offset) => {
    onCharListLoading();
    marvelService
      .getAllCharacters(offset)
      .then(onCharListLoaded)
      .catch(onError);
  };
  // Метод, отвечающий за запуск запроса
  const onCharListLoading = () => {
    setNewItem(true);
  };

  // Метод, отвечающий за успешную загрузку
  const onCharListLoaded = (newCharList) => {
    // Удаление кнопки из видимости, когда все персонажи прогружены
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    setCharList(() => [...charList, ...newCharList]);
    setLoading((loading) => false);
    setNewItem((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
  };

  const onError = () => {
    setError(true);
    setLoading((loading) => false);
  };

  const itemRef = useRef([]);

  // Реализация и с классом и фокусом
  const focusOnItem = (id) => {
    itemRef.current.forEach((item) =>
      item.classList.remove("char__item_selected"));
    itemRef.current[id].classList.add("char__item_selected");
    itemRef.current[id].focus();
  };

  // Метод для оптимизации вне конструкции метода render
  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          className="char__item"
          tabIndex={0}
          ref={(el) => (itemRef.current[i] = el)}
          key={item.id}
          onClick={() => {
            props.onCharSelected(item.id);
            focusOnItem(i);
          }}
          onKeyPress={(e) => {
            if (e.key === "" || e.key === "Enter") {
              props.onCharSelected(item.id);
              focusOnItem(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className="char__name">{item.name}</div>
        </li>
      );
    });
    // Конструкция вынесена для центровки спиннера/ошибки
    return <ul className="char__grid">{items}</ul>;
  }

  const items = renderItems(charList);

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error) ? items : null;

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{ display: charEnded ? "none" : "block" }}
        onClick={() => onRequest(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
