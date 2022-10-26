import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

import "./charList.scss";

const CharList = (props) => {

  const [charList, setCharList] = useState([]);
  const [newItemLoading, setNewItem] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const {loading, error, getAllCharacters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, []);

  // Метод, отвечающий за прогрузку дополнительных 9 персонажей
  const onRequest = (offset, initial) => {
    initial ? setNewItem(false) : setNewItem(true);
      getAllCharacters(offset)
      .then(onCharListLoaded)
  };
  
  // Метод, отвечающий за успешную загрузку
  const onCharListLoaded = (newCharList) => {
    // Удаление кнопки из видимости, когда все персонажи прогружены
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }
    setCharList(() => [...charList, ...newCharList]);
    setNewItem((newItemLoading) => false);
    setOffset((offset) => offset + 9);
    setCharEnded((charEnded) => ended);
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
  const spinner = loading && !newItemLoading ? <Spinner /> : null;


  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
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
