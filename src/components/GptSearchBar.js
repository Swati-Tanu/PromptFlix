import openai from "../utils/openai";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lang from "../utils/languageConstants";
import { API_OPTIONS } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await data.json();

    return json.results;
  };

  const handleGptSearchClick = async () => {
    try {
      setErrorMessage("");
      const gptQuery =
        "Act as a Movie Recommendation system and suggest some movies for the query : " +
        searchText.current.value +
        ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

      const gptResults = await openai.chat.completions.create({
        messages: [{ role: "user", content: gptQuery }],
        model: "gpt-3.5-turbo",
      });

      if (
        !gptResults ||
        !gptResults.choices ||
        gptResults.choices.length === 0
      ) {
        console.error("GPT response is invalid:", gptResults);
        setErrorMessage(
          "Failed to fetch movie recommendations. Please try again."
        );
        return;
      }

      const gptMovies = gptResults.choices?.[0]?.message?.content.split(",");

      if (!gptMovies || gptMovies.length === 0) {
        console.error(
          "No movies parsed from GPT response:",
          gptResults.choices[0]
        );
        setErrorMessage(
          "Could not parse movie list. Please try a different search."
        );
        return;
      }

      // const trimmedMovies = gptMovies.map((movie) => movie.trim()).filter((movie) => movie !== "");

      const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));

      const tmdbResults = await Promise.all(promiseArray);

      dispatch(
        addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
      );
    } catch (error) {
      console.error("Error in handleGptSearchClick:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="pt-[35%] md:pt-[10%] flex justify-center">
      <form
        className="w-full md:w-1/2 bg-black grid grid-cols-12 "
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className=" p-4 m-4 col-span-9"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg"
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
        {errorMessage && (
          <div className="text-red-500 text-sm mx-10 py-5 w-full">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};
export default GptSearchBar;
