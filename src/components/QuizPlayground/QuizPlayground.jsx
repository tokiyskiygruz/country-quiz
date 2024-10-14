import styles from "./QuizPlayground.module.css";
import Chip from "../Chip";
import QuizButton from "../QuizButton";
import { useState } from "react";
import PropTypes from "prop-types";

import CheckIcon from "../../assets/icons/Check_round_fill.svg";
import CrossIcon from "../../assets/icons/Close_round_fill.svg";
import CongratulationIcon from "../../assets/icons/congrats.svg";

const QuizPlayground = ({ questionData, updateQuestion, resetQuestions }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = questionData[activeStageIndex];

  const quizComplete = questionData.every((question) => question?.answered);

  const correctAnswersCount = questionData.filter(
    (question) => question.correctAnswer === question?.answered
  ).length;

  const handleChipClick = (stageIndex) => {
    setActiveStageIndex(stageIndex);
  };

  const handleButtonClick = (option) => {
    if (!activeStage.answered) {
      const updatedStage = {
        ...activeStage,
        answered: option,
      };
      updateQuestion(updatedStage, activeStageIndex);
    }
    return;
  };

  const handlePlayAgain = () => {
    resetQuestions();
    setActiveStageIndex(0);
  };

  if (quizComplete) {
    return (
      <div
        className={`${styles["congratulation-wrapper"]} ${styles.background}`}
      >
        <div>
          <img src={CongratulationIcon} alt="Congratulation Icon" />
        </div>
        <h1>Congrats! You completed the quiz.</h1>
        <p>You answered {correctAnswersCount}/10 correctly.</p>
        <QuizButton className={styles.completed} onClick={handlePlayAgain}>
          Play again
        </QuizButton>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${styles.background}`}>
      <header>
        <h4>Country Quiz</h4>
      </header>
      <main>
        <div className={`${styles["chip-wrapper"]}`}>
          {questionData?.length &&
            questionData?.map((stage, index) => (
              <Chip
                isActive={index === activeStageIndex}
                onClick={() => handleChipClick(index)}
                key={index}
              >
                {index + 1}
              </Chip>
            ))}
        </div>
        <div className={styles["question-wrapper"]}>
          <h2>{activeStage?.question}</h2>
        </div>
        <div className={`${styles["button-wrapper"]}`}>
          {activeStage?.options.map((option, index) => (
            <QuizButton onClick={() => handleButtonClick(option)} key={index}>
              <div className={styles["button-content"]}>
                {option}
                {activeStage.answered &&
                  option === activeStage.correctAnswer && (
                    <img src={CheckIcon} alt="Check Icon" />
                  )}
                {activeStage.answered &&
                  option === activeStage.answered &&
                  option !== activeStage.correctAnswer && (
                    <img src={CrossIcon} alt="Cross Icon" />
                  )}
              </div>
            </QuizButton>
          ))}
        </div>
      </main>
      <footer></footer>
    </div>
  );
};

QuizPlayground.propTypes = {
  questionData: PropTypes.array.isRequired,
  updateQuestion: PropTypes.func.isRequired,
  resetQuestions: PropTypes.func.isRequired,
};

export default QuizPlayground;
