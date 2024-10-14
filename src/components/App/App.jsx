import { useState, useReducer, useEffect } from "react";
import QuizPlayground from "../QuizPlayground";
import styles from "./App.module.css";

const BASE_URL = "https://restcountries.com";
const QUESTION_DATA_URL = new URL(
  "/v3.1/all?fields=name,capital,flags,currencies,languages,cca2",
  BASE_URL
);

const countryCodeToFlagEmoji = (countryCode) => {
  return countryCode.replace(/./g, (char) =>
    String.fromCodePoint(char.charCodeAt(0) + 0x1f1e6 - 0x41)
  );
};

const countriesReducer = (state, action) => {
  switch (action.type) {
    case "success":
      return {
        data: action.payload.data,
        error: null,
        isLoading: false,
      };
    case "loading":
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    case "error":
      return {
        data: null,
        error: action.payload.error,
        isLoading: false,
      };
    case "idle":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const isValidCountry = (country) =>
  country.name && country.capital && country.currencies && country.cca2;

const generateQuestionAndAnswer = (country, questionType) => {
  let questionText = "";
  let correctAnswer = "";
  let flagEmoji = "";

  switch (questionType) {
    case 0:
      questionText = `What is the capital of ${country.name.common}?`;
      correctAnswer = country.capital[0];
      break;
    case 1: {
      const currencyCode = Object.keys(country.currencies)[0];
      questionText = `What is the currency code used in ${country.name.common}?`;
      correctAnswer = currencyCode;
      break;
    }
    case 2:
      flagEmoji = countryCodeToFlagEmoji(country.cca2);
      questionText = `Which country does this flag ${flagEmoji} belong to?`;
      correctAnswer = country.name.common;
      break;
  }

  return { questionText, correctAnswer, flagEmoji };
};

const createQuizQuestions = (countriesArray) => {
  const questions = [];
  const totalQuestions = 10;

  while (questions.length < totalQuestions) {
    const shuffledCountries = shuffleArray([...countriesArray]);
    const selectedCountry = shuffledCountries[0];
    const options = shuffledCountries.slice(0, 4);

    if (!isValidCountry(selectedCountry)) {
      console.warn("Skipping country due to missing data:", selectedCountry);
      continue;
    }

    const questionType = Math.floor(Math.random() * 3);
    const { questionText, correctAnswer, flagEmoji } =
      generateQuestionAndAnswer(selectedCountry, questionType);

    if (!questionText || !correctAnswer || (questionType === 2 && !flagEmoji)) {
      console.warn("Generated question is missing data, skipping:", {
        questionText,
        correctAnswer,
        flagEmoji,
      });
      continue;
    }

    const questionOptions = options.map((country) => {
      if (questionType === 0) return country.capital[0];
      if (questionType === 1) return Object.keys(country.currencies)[0];
      return country.name.common;
    });

    const questionObject = {
      options: shuffleArray(questionOptions),
      answered: null,
      question: questionText,
      correctAnswer: correctAnswer,
      flagEmoji: flagEmoji,
    };

    questions.push(questionObject);
  }

  return questions;
};

const App = () => {
  const [countriesState, dispatch] = useReducer(countriesReducer, {
    data: null,
    error: null,
    isLoading: false,
  });

  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    const getQuestionData = async () => {
      dispatch({ type: "loading" });
      try {
        const promise = await fetch(QUESTION_DATA_URL);
        const response = await promise.json();

        const filteredData = response.filter(
          (countryData) =>
            countryData.capital?.[0] !== undefined &&
            countryData.name.common !== undefined &&
            countryData.flags.png !== undefined &&
            countryData.currencies !== undefined &&
            countryData.languages !== undefined &&
            countryData.cca2 !== undefined
        );

        dispatch({
          type: "success",
          payload: { data: filteredData },
        });

        setQuizQuestions(createQuizQuestions(filteredData));
      } catch (error) {
        dispatch({ type: "error", payload: { error } });
      } finally {
        dispatch({ type: "idle" });
      }
    };

    getQuestionData();
  }, []);

  const updateQuizQuestions = (updatedQuestion, index) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index] = updatedQuestion;
    setQuizQuestions(updatedQuestions);
  };

  const updateAllQuestions = () => {
    console.log(quizQuestions);
    const updatedQuestions = quizQuestions.map((question) => ({
      ...question,
      answered: null,
    }));

    setQuizQuestions(updatedQuestions);
  };

  return (
    <div className={styles.container}>
      {countriesState.isLoading ? (
        <div className={styles.loader}></div>
      ) : (
        quizQuestions.length > 0 && (
          <QuizPlayground
            questionData={quizQuestions}
            updateQuestion={updateQuizQuestions}
            resetQuestions={updateAllQuestions}
          />
        )
      )}
    </div>
  );
};

export default App;
