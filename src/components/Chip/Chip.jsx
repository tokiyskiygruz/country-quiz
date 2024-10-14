import styles from "./Chip.module.css";
import PropTypes from "prop-types";

//NOTE: Probably not the best solution to make it as a single component

const Chip = ({ children, onClick, className, isActive }) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.chip} ${isActive ? styles.active : ""}`}
    >
      {children}
    </button>
  );
};

Chip.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  isActive: PropTypes.bool,
};

export default Chip;
