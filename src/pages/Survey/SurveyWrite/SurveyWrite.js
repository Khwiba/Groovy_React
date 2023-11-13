import { Button, Divider, Grid, Stack, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import style from './survey_write.module.css'
import { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import axios from 'axios';
const SurveyContent = () => {
    return(
        <div className={`${style.writeSection}`}>
            <Grid container spacing={2} sx={{
                padding:1
            }}>
                <Grid item xs={2} className={`${style.center}`}>
                    제목 : 
                </Grid>
                <Grid item xs={10}>
                    <TextField id="outlined-basic" label="제목" variant="outlined" sx={{width:"80%"}}/>
                </Grid>
            </Grid>
            <Divider sx={{bgcolor:"black"}}/>
            <Grid container spacing={2} sx={{
                marginTop:1
            }}>
                <Grid item xs={12} className={`${style.center}`}>
                    <TextField
                        id="outlined-multiline-static"
                        label="내용을 작성하세요"
                        multiline
                        rows={17}
                        sx={{
                            width:"90%",
                            height:450
                        }}
                        />
                </Grid>
            </Grid>
            <Divider sx={{bgcolor:"black"}}/>
            
        </div>

    )
}

const ShortAnswer = ({seq}) => {
    const {result,setResult,shrtAns,setShrtAns,shortAnswers,setShortAnswers} = useContext(QuestionContext);
    
    const handleChange = (e, seq) => {
        const {name,value} = e.target;
        //const i = e.target.dataset.key;

        //console.log(seq);

        const tempList = [...shortAnswers];
        console.log(tempList.length);
        
        

        tempList[seq] = {...tempList[seq], type:"short",[name]:value};

        setShortAnswers(tempList);
        
    }
    
    const add = () => {
        if(shrtAns.short_answer != ""){
            setShortAnswers(prev=>[...prev,shrtAns]);
            //setResult(prev=>[...prev,shrtAns]);
        }    
    }


    return(
        <div className={`${style.border} ${style.center} ${style.marginT20}`}>
            단답형 질문 : <input type="text" data-key={`${seq}`} placeholder='단답형 질문을 입력하시오.' name="questions" onChange={(e)=> handleChange(e,seq)}/>
        </div>
        
    )
}

const LongAnswer = () => {
    return(
        <div>
            서술
        </div>
    )
}
const MultipleChoice = ({seq}) => {
    const [newQuestions, setNewQuestions] = useState(['']);
    
    const {result,setResult,formedAns, setFormedAns,multiAnswers,setMultiAnswers} = useContext(QuestionContext);

    const handleChange = (e, index) => {
        const { value } = e.target;
        setNewQuestions((prevQuestions) => {
            const newQuestionsArray = [...prevQuestions];
            newQuestionsArray[index] = value;
            return newQuestionsArray;
        });

    }

    const addQuestion = () => {
    if (newQuestions.length > 4) {
        alert("질문은 5개 이상 작성할 수 없습니다.");
    } else {
        setNewQuestions((prevQuestions) => [...prevQuestions, '']);
    }
    };

    const show = () => {
        const tempList = [...multiAnswers];

        tempList[seq] = {type: "multi", questions:newQuestions};

        setMultiAnswers(tempList);
    }

    return (
    <div>
        <div className={`${style.border} ${style.center} ${style.marginT20}`}>
        객관식 질문 <button onClick={addQuestion}>객관식 보기 추가</button>
        {newQuestions.map((question, index) => (
            <div key={index} className={`${style.padding10}`}>
            <input
                type="text"
                value={question}
                onChange={(e) => handleChange(e, index)}
                onBlur={show}
            />
            </div>
        ))}
        </div>
    </div>
    );
}



const SurveyQuestion = () => {
    const {shortAnswers,multiAnswers} = useContext(QuestionContext);
    const [questions, setQuestions] = useState([]);

    const shrtansshow = () => {
        console.log(shortAnswers);
        console.log(multiAnswers);
    }

    const addOpenEndedQuestion = () => {
        const newQuestion = <ShortAnswer key={questions.length} seq={questions.length} />;
        //shrtAns={shrtAns} setShrtAns={setShrtAns}
        //setShortAnswers(prev=>[...prev,shrtAns]);
        setQuestions([...questions, newQuestion]);
    };

    const addMultipleChoiceQuestion = () => {
        const newQuestion = <MultipleChoice key={questions.length} seq={questions.length} />;
        //formedAns={formedAns} setFormedAns={setFormedAns}
        setQuestions([...questions, newQuestion]);
    };

    return(
        <div className={`${style.writeSection}`}>
            <button onClick={addOpenEndedQuestion}>주관식 질문 추가</button>
            <button onClick={addMultipleChoiceQuestion}>객관식 질문 추가</button>
            {questions}
            <Divider sx={{bgcolor:"black"}}/>
        </div>
    )
}

const SurveySubmit = () => {
    return(
        <div className={`${style.padding15} ${style.center}`}>
            <Stack direction="row" spacing={5}>
                <Button variant="outlined" startIcon={<DeleteIcon />}>
                    취소
                </Button>
                <Button variant="contained" endIcon={<SendIcon />}>
                    생성
                </Button>
            </Stack>
        </div>
    )
}

const QuestionContext = createContext();

const SurveyWrite = () => {
    const [result,setResult] = useState([]);
    const [shrtAns,setShrtAns] = useState({type:"subjective",questions:""});
    const [formedAns, setFormedAns] = useState({ type: "multi", questions: [] });

    const [shortAnswers,setShortAnswers] = useState([]); //주관식 질문들을 담는 state
    const [multiAnswers,setMultiAnswers] = useState([]); //객관식 질문들을 담는 state
    
    
    const handleAllData = () => {
        
    }

    useEffect(()=>{
        setResult([]);
        setShortAnswers([]);
        setMultiAnswers([]);
    },[]);

    const resultshow = () => {
        setResult(prev=>[...prev,...shortAnswers.filter(Boolean),...multiAnswers.filter(Boolean)]);
        console.log(result);
        axios.post("/api/survey",result).then(res=>{

        });
    }

    const ts = () => {
        console.log(...shortAnswers);
        console.log(...multiAnswers);
        handleAllData();
        console.log(result);
    }
    return(
        <div className={`${style.padding40} ${style.contentDiv}`}>
            <QuestionContext.Provider value={{result,setResult,shrtAns,setShrtAns,formedAns, setFormedAns,shortAnswers,setShortAnswers,multiAnswers,setMultiAnswers}}>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <SurveyContent/>
                    </Grid>
                    <Grid item xs={12}>
                        <SurveyQuestion/>
                        <Stack direction="row" spacing={5}>
                            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={ts}>
                                취소
                            </Button>
                            <Button variant="contained" endIcon={<SendIcon />}  onClick={resultshow}>
                                생성
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </QuestionContext.Provider>
        </div>
    )
}
export default SurveyWrite;