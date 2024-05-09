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

    useEffect(() => {
        getTopics();
    }, []);

    const onSubmit = async (values) => {
        const loaderId = toast.loading('saving..');

        console.log(values);

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

        const response = await axios
            .patch(`http://localhost:4000/api/interactive-quizs/${quizId}`, {
                questionList: res.data.ids,
            })
            .catch((err) => {
                toast.update(loaderId, {
                    render: 'an error occurred',
                    type: 'error',
                    isLoading: false,
                });
                return;
            });

        // console.log(response, response.data);

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

                        <fieldset>
                            <legend style={{ fontSize: 'medium' }}>
                                Questions Type
                            </legend>
                            <div className={styles.flexRow}>
                                <div style={{ width: '30%' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='MCQ Questions'
                                        name='mcqPercentage'
                                        type='number'
                                        {...register('mcqPercentage')}
                                        errors={errors}
                                    />
                                </div>
                                <div style={{ width: '30%' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='Fill The Blank Questions'
                                        name='fillTheBlankPercentage'
                                        type='number'
                                        {...register('fillTheBlankPercentage')}
                                        errors={errors}
                                    />
                                </div>
                                <div style={{ width: '30%' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='True-False Questions'
                                        name='trueFalsePercentage'
                                        type='number'
                                        {...register('trueFalsePercentage')}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend style={{ fontSize: 'medium' }}>
                                Questions Complexity
                            </legend>
                            <div className={styles.flexRow}>
                                <div style={{ width: '30%' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='Easy Questions'
                                        name='easyPercentage'
                                        type='number'
                                        {...register('easyPercentage')}
                                        errors={errors}
                                    />
                                </div>
                                <div style={{ width: '30%' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='Medium Questions'
                                        name='mediumPercentage'
                                        type='number'
                                        {...register('mediumPercentage')}
                                        errors={errors}
                                    />
                                </div>
                                <div style={{ width: '30%' }}>
                                    <TextField
                                        style={{ width: '100%' }}
                                        label='Hard Questions'
                                        name='hardPercentage'
                                        type='number'
                                        {...register('hardPercentage')}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <div className={styles.actions}>
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
