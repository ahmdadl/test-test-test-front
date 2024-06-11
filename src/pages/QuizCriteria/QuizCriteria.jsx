import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from 'zustand';

import styles from './quizCriteria.module.scss';
import {
    Button,
    FormControl,
    Input,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { Clear, DesignServices } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TopicFormSection from './TopicFormSection';
import TopicQuestionType from './TopicQuestionType';
import {
    ActiveQuestionTypes,
    getDomainName,
    getSubDomainName,
} from '../../config';

export default function QuizCriteria(props) {
    const { id: quizId } = useParams();
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm();

    const [topics, setTopics] = useState([]);

    const [showTopicForm, setShowTopicForm] = useState(false);

    const [questionTypes, setQuestionTypes] = useState([]);

    useEffect(() => {
        getTopics();
    }, []);

    const onSubmit = async (values) => {
        const loaderId = toast.loading('saving..', {
            autoClose: 2000,
        });

        // if a topic was added
        // then get it`s data before saving
        if (values.topic) {
            values.topic = {
                ...values.topic,
                domainName: getDomainName(values.topic.domainId),
                subDomainName: getSubDomainName(
                    values.topic.domainId,
                    values.topic.subDomainId
                ),
            };
        }

        values.selectedQuestions =
            document.querySelector('[name="selectedQuestions"]')?.value ?? '';

        const res = await axios
            .post(`http://localhost:4000/api/topics-criteria/${quizId}`, values)
            .catch((err) =>
                toast.update(loaderId, {
                    render: 'an error occurred',
                    type: 'error',
                    isLoading: false,
                })
            );

        if (!res || !res.data) {
            toast.update(loaderId, {
                render: 'an error occurred',
                type: 'error',
                isLoading: false,
            });
        }

        // console.log(res.data);

        toast.update(loaderId, {
            render: 'saved',
            type: 'success',
            isLoading: false,
        });
        navigate('/show/' + quizId);
    };

    const onClickCancel = () => {
        navigate('/show/' + quizId);
    };

    const getTopics = async () => {
        const res = await axios.get(
            'http://localhost:4000/api/topics?paginate=false'
        );
        setTopics(res.data);
    };

    function onSelectTopic(e) {
        if (e.target.value === 'new') {
            setShowTopicForm(true);
        } else {
            setShowTopicForm(false);
        }
    }

    return (
        <>
            <div className={styles['add-question']}>
                <div className={styles.questionType}>
                    <Button
                        variant='contained'
                        color='info'
                        type='submit'
                        onClick={() => navigate('/add-topic')}
                    >
                        <span>Add Topic</span>
                    </Button>

                    <Button
                        variant='outlined'
                        color='error'
                        onClick={onClickCancel}
                    >
                        <Clear />
                        <span>cancel</span>
                    </Button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                        <legend>Add Questions Based On Criteria</legend>
                        <div className={styles.flexRow}>
                            <div style={{ width: '50%' }}>
                                <Select
                                    style={{ width: '100%' }}
                                    label='topic'
                                    name='topicId'
                                    {...register('topicId')}
                                    placeholder='select topic'
                                    errors={errors}
                                    defaultValue={0}
                                    onChange={onSelectTopic}
                                >
                                    <MenuItem value='0'>Select Topic</MenuItem>
                                    {topics.length > 0 &&
                                        topics.map((topic, idx) => (
                                            <MenuItem
                                                key={topic._id}
                                                value={topic._id}
                                            >
                                                {topic.title}
                                            </MenuItem>
                                        ))}
                                    <MenuItem value='new'>
                                        <Button
                                            size='xs'
                                            style={{
                                                textAlign: 'center',
                                                width: '100%',
                                            }}
                                            color='warning'
                                        >
                                            Add New Topic
                                        </Button>
                                    </MenuItem>
                                </Select>
                            </div>

                            <div style={{ width: '20%' }}>
                                <TextField
                                    style={{ width: '100%' }}
                                    label='Number of Questions'
                                    name='numberOfQuestions'
                                    type='number'
                                    {...register('numberOfQuestions')}
                                    errors={errors}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <TextField
                                    style={{ width: '100%' }}
                                    label='Duration'
                                    name='duration'
                                    type='number'
                                    {...register('duration')}
                                    errors={errors}
                                />
                            </div>
                        </div>

                        {showTopicForm && (
                            <TopicFormSection register={register} />
                        )}

                        {questionTypes.length > 0 &&
                            questionTypes.map((qt, idx) => (
                                <TopicQuestionType
                                    register={register}
                                    // questionType={qt}
                                    index={idx}
                                    key={idx}
                                />
                            ))}

                        {questionTypes.length < ActiveQuestionTypes.length && (
                            <Button
                                variant='contained'
                                type='button'
                                onClick={() =>
                                    setQuestionTypes([...questionTypes, {}])
                                }
                            >
                                Add Question Type
                            </Button>
                        )}

                        <div
                            style={{
                                width: '100%',
                                marginTop: '2rem',
                            }}
                        >
                            <Button
                                variant='contained'
                                startIcon={<DesignServices />}
                                type='submit'
                            >
                                Submit
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </>
    );
}
