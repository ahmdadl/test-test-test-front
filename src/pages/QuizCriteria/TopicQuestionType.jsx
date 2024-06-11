import { ActiveQuestionTypes } from '../../config';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from 'zustand';

import styles from './quizCriteria.module.scss';
import {
    Button,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { Clear, DesignServices } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TopicFormSection from './TopicFormSection';

export default function TopicQuestionType({ register, index }) {
    const [selectedQuestionType, setSelectedQuestionType] = useState(null);

    return (
        <div
            style={{
                border: '1px solid #ced4da',
                borderRadius: '10px',
                padding: '1rem 1.2rem',
                margin: '1rem 0',
            }}
        >
            <fieldset>
                <legend style={{ fontSize: 'medium' }}>
                    Questions Type {index + 1}
                </legend>
                <div className={styles.flexRow}>
                    <div style={{ width: '100%' }}>
                        <InputLabel id='select-questionType'>
                            Select Question Type
                        </InputLabel>
                        <Select
                            label='questionType'
                            name='questionTypeId'
                            placeholder='Select Domain'
                            style={{ width: '100%' }}
                            {...register(`questionTypes[${index}.type]`)}
                        >
                            {ActiveQuestionTypes?.map((q, idx) => (
                                <MenuItem key={q.value} value={q.value}>
                                    {q.label}
                                </MenuItem>
                            ))}
                        </Select>
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
                            {...register(`questionTypes[${index}.easy]`)}
                        />
                    </div>
                    <div style={{ width: '30%' }}>
                        <TextField
                            style={{ width: '100%' }}
                            label='Medium Questions'
                            name='mediumPercentage'
                            type='number'
                            {...register(`questionTypes[${index}.medium]`)}
                        />
                    </div>
                    <div style={{ width: '30%' }}>
                        <TextField
                            style={{ width: '100%' }}
                            label='Hard Questions'
                            name='hardPercentage'
                            type='number'
                            {...register(`questionTypes[${index}.hard]`)}
                        />
                    </div>
                </div>
            </fieldset>
        </div>
    );
}
