import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./confirmModalContent.module.scss";

const ConfirmModalContent = (props) => {
  const { handleClose, onDelete } = props;
  return (
    <div className={styles["modal-content"]}>
      <div className={styles["delete-icon"]}>
        <DeleteIcon color="error" fontSize="large" />
      </div>
      <h4>Confirm Exit</h4>
      <p>Are you sure to exit this exam?</p>

      <div>
        <Button variant="outlined" onClick={handleClose}>
          <ClearIcon />
          <span>Cancel</span>
        </Button>
        <Button variant="contained" color="error" onClick={onDelete}>
          <DeleteIcon />
          <span>Exit</span>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmModalContent;
