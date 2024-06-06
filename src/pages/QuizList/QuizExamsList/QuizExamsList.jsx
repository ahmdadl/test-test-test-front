import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import styles from './examsList.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
    Info,
    Edit,
    ViewColumn,
} from '@mui/icons-material';
import axios from '../../../axios';
import { toast } from 'react-toastify';
import DeleteModalContent from '../../../components/Modal/DeleteModalContent/DeleteModalContent';
import Modal from '../../../components/Modal/Modal';
import { useStore } from '../../../store/store';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';

export default function QuizExamsList(props) {
    const { id: quizId } = useParams();
    const { data: state } = useStore();
    const [rows, setRows] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedRowId, setSelectedRowId] = React.useState();
    const [showModal, setShowModal] = React.useState(false);
    const [activeExam, setActiveExam] = React.useState();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchExams();
    }, []);

    const onClickAddExam = () => {
        navigate('/add-exam');
    };

    const onClickEditQuestion = (id = null) => {
        navigate(`/edit-exam/${id ?? selectedRowId}`);
    };
    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const onDeleteExam = (id) => {
        openModal();
        setActiveExam(id);
    };

    const onConfirmDelete = async () => {
        closeModal();
        try {
            const res = await axios.delete(`/exams/${activeExam}`);
            console.log(res.data);
            toast.success('Exam deleted successfully');
            await fetchExams();
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
        },
        {
            field: 'studentName',
            headerName: 'Student Name',
            flex: 0.8,
        },
        {
            field: 'quizTitle',
            headerName: 'Quiz Title',
            flex: 1,
        },
        {
            field: 'isPassed',
            headerName: 'Is Passed',
            flex: 1,
        },
        {
            field: 'successPercentage',
            headerName: 'Percentage',
            flex: 1,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.3,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            aria-label='edit'
                            color='info'
                            onClick={() => onClickEditQuestion(params.id)}
                        >
                            <ViewColumn />
                        </IconButton>
                        <IconButton
                            aria-label='delete'
                            color='error'
                            onClick={() => onDeleteExam(params.id)}
                        >
                            <Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    const fetchExams = React.useCallback(async () => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(`/exams`, {
            quizId: quizId,
        });
        const data = res.data;
        console.log(data.docs);
        if (!!data.docs.length) {
            setRows(
                data.docs.map((item) => ({
                    id: item._id,
                    name: item.name,
                    studentName: item.studentName,
                    quizTitle: item.quizTitle,
                    isPassed: item.isPassed,
                    successPercentage: item.successPercentage,
                    dateModified: new Date(item.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
                }))
            );
        }
        setLoading(false);
    }, []);

    return (
        <>
            <Modal show={showModal} handleClose={closeModal}>
                <DeleteModalContent
                    handleClose={closeModal}
                    onDelete={onConfirmDelete}
                />
            </Modal>

            <div className={styles.actionsWrapper}>
                <div>
                    <h3>Exams</h3>
                </div>
                <div className={styles.actions}>
                    <Button variant='contained' onClick={onClickAddExam}>
                        Add Exam
                    </Button>
                </div>
            </div>

            <div className={styles.table}>
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
