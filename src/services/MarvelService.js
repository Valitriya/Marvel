import {useHttp} from '../hooks/http.hook';

//Класс на чистом JS, сетевая часть
const useMarvelService = () => {
  const {loading, request, error, clearError} = useHttp();

  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=c77128a809855b0a1f17233c400eb41c";
  const _baseOfset = 300;


//Получение всех персонажей
  const getAllCharacters = async (offset = _baseOfset) => {
    const res = await request(
      `$ _apiBase}characters?limit=9&offset=${offset}&$ _apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };
//Получение одного персонажа
  const getCharacter = async (id) => {
    const res = await request(
      `${_apiBase}characters/${id}?${_apiKey}`
    );
    return _transformCharacter(res.data.results[0]);
  };

//Получение и трансформирование данных
  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items
    };
  };
  return {loading, error, clearError, getAllCharacters, getCharacter}
}

export default useMarvelService;
