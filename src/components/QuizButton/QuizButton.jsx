import styles from "./QuizButton.module.css";
import PropTypes from "prop-types";
const QuizButton = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles["quiz-button"]} ${className}`}
    >
      {children}
    </button>
  );
};

QuizButton.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default QuizButton;
