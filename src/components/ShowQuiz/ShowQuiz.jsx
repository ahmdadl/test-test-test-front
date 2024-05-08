import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import styles from './showQuiz.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
} from '@mui/icons-material';
import Modal from '../Modal/Modal';
import DeleteModalContent from '../Modal/DeleteModalContent/DeleteModalContent';
import axios from '../../axios';
import { toast } from 'react-toastify';
import { useStore } from '../../store/store';
import DomainFilter from './Filters/DomainFilter';
import SubDomainFilter from './Filters/SubDomainFilter';
import LanguageFilter from './Filters/LanguageFilter';
import IsAnsweredFilter from './Filters/IsAnsweredFilter';

export default function DataShowQuiz(props) {
    const location = useLocation();
    const params = useParams();
    const { data: state } = useStore();
    const { id } = params;
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
            toast.success('Question deleted successfully');
            await fetchQuestions();
        } catch (error) {
            console.log(error);
        }
    };

    const renderColorStatus = (status) => {
        let color;
        // let color = { backgroundColor: "red" };
        if (status === 'g') {
            color = { backgroundColor: 'green' };
        } else if (status === 'y') {
            color = { backgroundColor: 'yellow' };
        } else if (status === 'r') {
            color = { backgroundColor: 'red' };
        }
        return color;
    };

    const columns = [
        {
            field: 'col0',
            headerName: '',
            width: 70,
            renderCell: (params) => (
                <Checkbox
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
            field: 'name',
            headerName: 'Title',
            width: 200,
            renderCell: (params) => {
                return <Link to={`/show/${params.id}`}>{params.row.name}</Link>;
            },
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 200,
        },
        {
            field: 'domain',
            headerName: 'Domain',
            width: 200,
        },
        {
            field: 'subDomain',
            headerName: 'Sub Domain',
            width: 200,
        },
        {
            field: 'dateModified',
            headerName: 'Date Modified',
            width: 150,
        },
        {
            field: 'hasAnswered',
            headerName: 'States',
            width: 150,
            renderCell: (params) => {
                return (
                    <div
                        className={styles['circular-status']}
                        style={renderColorStatus(params.row.hasAnswered)}
                    ></div>
                );
            },
        },
    ];

    const fetchQuestions = React.useCallback(async () => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(
            `/questionInQuize/66053cf9a4fa64136ce6e60f`
        );
        const data = res.data;
        console.log(data);
        if (!!data.length) {
            setRows(
                data.map((item) => ({
                    id: item._id,
                    name: item.questionName,
                    type: item.type,
                    domain: item.domainName,
                    subDomain: item.subDomainName,
                    dateModified: new Date(item.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
                    hasAnswered: item.isAnswered,
                }))
            );
        }
        setLoading(false);
    }, []);

    const fetchData = React.useCallback(async (id) => {
        const data1 = {
            ...state,
        };
        setLoading(true);
        console.log(data1);
        const res = await axios.get(`/questionInQuize/${id}`);
        console.log(res.data);
        const data = res.data;
        console.log(data);
        if (!!data.length) {
            setRows(
                data.map((item) => ({
                    id: item._id,
                    name: item.questionName,
                    type: item.type,
                    domain: item.domainName,
                    subDomain: item.subDomainName,
                    dateModified: new Date(item.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
                    hasAnswered: item.isAnswered,
                }))
            );
        }
        setLoading(false);
    }, []);
    React.useEffect(() => {
        if (location.pathname.includes('/show/')) {
            const { id } = params;
            fetchData(id);
        } else {
            fetchQuestions();
        }
    }, []);

    const onClickAddQuiz = () => {
        navigate('/add-quiz');
    };

    const onClickEditQuestion = () => {
        navigate(`/edit/${selectedRowId}`);
    };

    const selectDomain = async (domainId) => {
        return await loadDataAfterFilter(
            `/questionInQuize/${id}/?domain=${domainId}`
        );
    };

    const selectSubDomain = async (subDomainId) => {
        return await loadDataAfterFilter(
            `/questionInQuize/${id}/?subDomain=${subDomainId}`
        );
    };

    const selectLanguage = async (lang) => {
        return await loadDataAfterFilter(
            `/questionInQuize/${id}/?language=${lang}`
        );
    };
    const selectAnswerStatus = async (status) => {
        return await loadDataAfterFilter(
            `/questionInQuize/${id}/?answerStatus=${status}`
        );
    };

    const loadDataAfterFilter = async (url) => {
        setLoading(true);
        const res = await axios.get(url);
        console.log(res.data);
        const data = res.data;
        console.log(data);
        if (!!data.length) {
            setRows(
                data.map((item) => ({
                    id: item._id,
                    name: item.questionName,
                    type: item.type,
                    domain: item.domainName,
                    subDomain: item.subDomainName,
                    dateModified: new Date(item.createdAt).toLocaleDateString(
                        'en-GB'
                    ),
                    hasAnswered: item.isAnswered,
                }))
            );
        }
        setLoading(false);
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
                {/* <div className={styles.actions}>
          <Button variant="contained" onClick={onClickAddQuiz}>
            Add Quiz
          </Button>
          <Button variant="contained" onClick={onClickEditQuestion}>
            Edit
          </Button>
        </div> */}
                <div style={{ margin: '1rem 0' }}>
                    <DomainFilter handleSelect={selectDomain} />
                    <SubDomainFilter handleSelect={selectSubDomain} />
                    <LanguageFilter handleSelect={selectLanguage} />
                    <IsAnsweredFilter handleSelect={selectAnswerStatus} />
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
