import React from "react";
import { Link } from "react-router-dom";
import ShowQuiz from "../../components/ShowQuiz/ShowQuiz";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./show.module.scss";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import SelectQuestionTypeModal from "../../components/Modal/SelectQuestionTypeModal/SelectQuestionTypeModal";
import Modal from "../../components/Modal/Modal";
const Show = (props) => {
  
  const navigate = useNavigate();
  const { data: state, setFormState } = useStore();
  const SelectFromLibrary = () => {
    navigate("/library")
  };
  const onClickCancel = () => {
    navigate("/");
  };
  const onClickSubmit = async () => {
    
  };
  
  return (
 
    <div className={`container  ${styles.home}`}>
      <p>Questions in {state.quizName}: </p>
      <div className={styles.questionType}>
        <Button variant="outlined" onClick={onClickCancel}>
          <ClearIcon />
          <span>cancel</span>
        </Button>
        <Button variant="contained" color="info"  type="submit" onClick={onClickSubmit}>
          <span>Submit</span>
        </Button>
    
      </div>
      <ShowQuiz />
    </div>
  );
};

export default Show;
