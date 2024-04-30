export default function QuizExamQuestion({ question }) {

    if(!question) return null;

    console.log(question)

    return (
        <>
            {question.type === 'MCQ' && (
                <>
                    <h3 className='question-text'>
                        {question.parameters.question}
                    </h3>

                    <ul>
                        {question.parameters.answers.map((option, index) => (
                            <>
                                <li key={index}>
                                    <label>
                                        <input
                                            type='radio'
                                            name='option'
                                            value={option.id}
                                            data-is-correct={option.correct}
                                        />
                                        <span>{option.text}</span>
                                    </label>
                                </li>
                            </>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}
