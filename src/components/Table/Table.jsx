import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import styles from "./table.module.scss";
import { Button, IconButton, Radio } from "@mui/material";
import { RadioButtonCheckedRounded, Delete } from "@mui/icons-material";
import Modal from "../Modal/Modal";
import DeleteModalContent from "../Modal/DeleteModalContent/DeleteModalContent";
import axios from "../../axios";
import { toast } from "react-toastify";

export default function DataTable(props) {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [activeQuestion, setActiveQuestion] = React.useState();

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const onDeleteQuestion = (id) => {
    openModal();
    setActiveQuestion(id);
  };

  const onConfirmDelete = async () => {
    closeModal();
    try {
      const res = await axios.delete(`/question/${activeQuestion}`);
      console.log(res.data);
      toast.success("Question deleted successfully");
      await fetchQuestions();
    } catch (error) {
      console.log(error);
    }
  };

  const renderColorStatus = (status) => {
    let color = { backgroundColor: "black" };
    if (status === "g") {
      color = { backgroundColor: "green" };
    } else if (status === "y") {
      color = { backgroundColor: "yellow" };
    } else if (status === "r") {
      color = { backgroundColor: "red" };
    }
    return color;
  };

  const columns = [
    {
      field: "col0",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Radio
          checked={params.id == selectedRowId}
          value={params.id}
          onChange={(e) => {
            console.log(e.target.value);
            setSelectedRowId(e.target.value);
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Title",
      width: 200,
      renderCell: (params) => {
        return <Link to={`/show/${params.id}`}>{params.row.name}</Link>;
      },
    },
    {
      field: "domain",
      headerName: "Domain",
      width: 200,
    },
    {
      field: "subDomain",
      headerName: "Sub Domain",
      width: 200,
    },
    {
      field: "quizData",
      headerName: "Quiz Schedule",
      width: 150,
    },
    {
      field: "gradeOfQuiz",
      headerName: "Total grade",
      width: 140,
    },
    {
      field: "successGrade",
      headerName: "The pass score",
      width: 150,
    },
    {
      field: "durationOfQuiz",
      headerName: "Quiz Duration",
      width: 100,
    },
    {
      field: "complexity",
      headerName: "Complexity",
      width: 100,
    },
  ];

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    const res = await axios.get(`/interactive-quizs`);
    const data = res.data;
    if (!!data.docs.length) {
      setRows(
        data.docs.map((item) => ({
          id: item._id,
          name: item.quizName,
          domain: item.domainName,
          subDomain: item.subDomainName,
          quizData: item.quizSchedule,
          gradeOfQuiz: item.totalGrade,
          successGrade: item.ThePassScore,
          durationOfQuiz:item.quizDuration,
          complexity:item.complexity,
        }))
      );
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const onClickAddQuiz = () => {
    navigate("/add-quiz");
  };

  const onClickEditQuestion = () => {
    navigate(`/editQuiz/${selectedRowId}`);
  };

  return (
    <>
      <Modal show={showModal} handleClose={closeModal}>
        <DeleteModalContent
          handleClose={closeModal}
          onDelete={onConfirmDelete}
        />
      </Modal>
      <div className={styles.table}>
        <div className={styles.actions}>
          <Button variant="contained" onClick={onClickAddQuiz}>
            Add Quiz
          </Button>
          <Button variant="contained" onClick={onClickEditQuestion}>
            Edit
          </Button>
        </div>
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          baseCheckbox={RadioButtonCheckedRounded}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </>
  );
}
