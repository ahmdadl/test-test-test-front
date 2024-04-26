import React from "react";
import { Link } from "react-router-dom";
import QuestionList from "../../components/QuestionList/QuestionList";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./quizList.module.scss";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import SelectQuestionTypeModal from "../../components/Modal/SelectQuestionTypeModal/SelectQuestionTypeModal";
import Modal from "../../components/Modal/Modal";
const QuizList = (props) => {
  
  const navigate = useNavigate();
  const { data: state, setFormState } = useStore();
  const SelectFromLibrary = () => {
    navigate("/library")
  };
  const onClickCancel = () => {
    navigate("/");
  };
  const onAddObject = async () => {
    navigate("/add-question");
  }
  
  return (
 
    <div className={`container  ${styles.home}`}>
      <p>Questions in {state.quizName}: </p>
      <div className={styles.questionType}>
        <Button variant="outlined" onClick={onClickCancel}>
          <ClearIcon />
          <span>cancel</span>
        </Button>
        <Button variant="contained" color="info"  onClick={onAddObject}>
          <span>Add new Question</span>
        </Button>
        <Button variant="contained" color="info"  onClick={SelectFromLibrary}>
          <span>Select from Q-Bank</span>
        </Button>
    
      </div>
      <QuestionList />
    </div>
  );
};

export default QuizList;
