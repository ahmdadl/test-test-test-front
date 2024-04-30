import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import styles from './quizExam.module.scss';
import { Button, Checkbox, IconButton } from '@mui/material';
import {
    RadioButtonCheckedRounded,
    Delete,
    CheckBox,
    Info,
    Edit,
    Check,
    X,
    Error,
} from '@mui/icons-material';
import axios from '../../axios';
import { toast } from 'react-toastify';
import DeleteModalContent from '../../components/Modal/DeleteModalContent/DeleteModalContent';
import Modal from '../../components/Modal/Modal';
import { useStore } from '../../store/store';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import ConfirmModalContent from '../../components/Modal/ConfirmModalContent/ConfirmModalContent';
import QuizExamQuestion from './QuizExamQuestion';

export default function QuizSelectQuestions(props) {
    const { id: quizId } = useParams();
    const [quiz, setQuiz] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const navigate = useNavigate();

    const [questions, setQuestions] = React.useState([]);
    const [activeQuestion, setActiveQuestions] = React.useState(0);

    React.useEffect(() => {
        fetchQuestions();
    }, []);

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const onConfirmDelete = async () => {
        closeModal();
        showResultView();
    };

    const fetchQuiz = async () => {
        const res = await axios
            .get(`/interactive-quizs/${quizId}`)
            .catch((err) => {
                toast.error('Error fetching quiz');
            });

        if (!res) toast.error('Error fetching quiz');
        return res.data;
    };

    const fetchQuestions = React.useCallback(async () => {
        const quizResponse = await fetchQuiz();

        if (!quizResponse) return;

        setQuiz(quiz);

        setLoading(true);
        const res = await axios.get(`/interactive-objects`);
        const data = res.data;
        console.log(data.docs);
        setQuestions(data.docs);
        setLoading(false);
    }, []);

    const answerQuestion = (answer) => {
        if (answer === 'good') {
            setQuestions((prev) =>
                prev.map((q) => {
                    if (q._id === activeQuestion._id) {
                        return { ...q, isCorrect: true };
                    }
                    return q;
                })
            );
        } else if (answer === 'bad') {
            setQuestions((prev) =>
                prev.map((q) => {
                    if (q._id === activeQuestion._id) {
                        return { ...q, isCorrect: false };
                    }
                    return q;
                })
            );
        }

        selectNextQuestion();
    };

    const selectNextQuestion = () => {
        const index = questions.findIndex((q) => q._id === activeQuestion._id);

        if (index + 1 < questions.length) {
            setActiveQuestions(questions[index + 1]);
        }
    };

    const onTimeUp = () => {
        setQuestions((prev) =>
            prev.map((q) => {
                q.canNotBeAnswered = true;

                return q;
            })
        );
    };

    const onFinishAttempt = () => {
        // check if all questions was answered
        const unansweredQuestions = questions.filter(
            (q) => q.isCorrect === undefined
        );

        if (unansweredQuestions.length) {
            return openModal();
        }

        // show result
        showResultView();
    };

    const showResultView = () => setActiveQuestions({ _id: 'result' });

    return (
        <>
            <Modal show={showModal} handleClose={closeModal}>
                <ConfirmModalContent
                    handleClose={closeModal}
                    onDelete={onConfirmDelete}
                />
            </Modal>

            <div className={styles.tabsWrapper}>
                <div className={styles.tabs}>
                    <div
                        className={`${styles.tab}`}
                        onClick={() => setActiveQuestions({ _id: null })}
                    >
                        <div className={styles.number}>-</div>
                        <div
                            className={`${styles.status} ${
                                activeQuestion._id === null ? styles.active : ''
                            }`}
                        ></div>
                    </div>
                    {questions.map((question, index) => (
                        <div
                            className={`${styles.tab}`}
                            key={question._id}
                            onClick={() => setActiveQuestions(question)}
                        >
                            <div className={styles.number}>{index + 1}</div>
                            <div
                                className={`${styles.status} ${
                                    activeQuestion._id === question._id
                                        ? styles.active
                                        : ''
                                } ${
                                    question.isCorrect
                                        ? styles.correct
                                        : question.isCorrect === false
                                        ? styles.notCorrect
                                        : ''
                                } `}
                            >
                                {question.isCorrect === true && <Check />}
                                {question.isCorrect === false && <Error />}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <CountdownTimer
                        minutesLeft={Number(0.1)}
                        onTimeUp={onTimeUp}
                    />

                    <button onClick={onFinishAttempt}>Finish attempt</button>
                </div>
            </div>

            <div className={styles.questionsWrapper}>
                {!activeQuestion._id && (
                    <>
                        <h4>Questions list</h4>
                        <p>Please Answer all your quiz questions</p>
                    </>
                )}
                {activeQuestion._id === 'result' && (
                    <>
                        <h4>Quiz Result</h4>
                        <h5 style={{ color: 'teal' }}>
                            Questions Answered correct:{' '}
                            {
                                questions.filter((q) => q.isCorrect === true)
                                    .length
                            }{' '}
                            (
                            {
                                questions.filter((q) => q.isCorrect === true)
                                    .length
                            }{' '}
                            / {questions.length})
                        </h5>
                        <h5 style={{ color: 'red' }}>
                            Questions Answered Wrong:{' '}
                            {
                                questions.filter((q) => q.isCorrect === false)
                                    .length
                            }{' '}
                            (
                            {
                                questions.filter((q) => q.isCorrect === false)
                                    .length
                            }{' '}
                            / {questions.length})
                        </h5>
                        <h5 style={{ color: 'gray' }}>
                            Questions not answered:{' '}
                            {
                                questions.filter(
                                    (q) => q.isCorrect === undefined
                                ).length
                            }{' '}
                            (
                            {
                                questions.filter(
                                    (q) => q.isCorrect === undefined
                                ).length
                            }{' '}
                            / {questions.length})
                        </h5>
                    </>
                )}
                {!!activeQuestion._id && (
                    <>
                        <QuizExamQuestion question={activeQuestion} />

                        {!activeQuestion.canNotBeAnswered &&
                            activeQuestion.isCorrect === undefined &&
                            activeQuestion._id !== 'result' && (
                                <div className='actions'>
                                    <button style={{}}>
                                        Answer
                                    </button>
                                    {/* <button
                                        onClick={() => answerQuestion('good')}
                                    >
                                        correct
                                    </button>
                                    <button
                                        onClick={() => answerQuestion('bad')}
                                    >
                                        not correct
                                    </button> */}
                                </div>
                            )}
                    </>
                )}
            </div>
        </>
    );
}
