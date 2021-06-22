import React from 'react';
import {useState, useRef} from 'react';
import "./login.css";
import {Map, SentimentVeryDissatisfied, Close} from '@material-ui/icons'
import axios from "axios";


export default function Login({setShowLogin, myStorage, setCurrentUser}) {
    const [error, setError] = useState(false)
    const nameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("user", res.data.username);
            setCurrentUser (res.data.username);
            setShowLogin (false);
            setError(false);
        }catch(err){
            setError(true);
        }

    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <Map/>
                <pre> MyMap</pre>
            </div>


            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Имя пользователя" ref={nameRef}/>
                <input type="text" placeholder="Пароль" ref={passwordRef}/>
                <button className="loginBtn">Войти</button>
                 {error &&
            <span className="failure">Упс, ошибочка... Что-то пошло не так <pre> </pre> <SentimentVeryDissatisfied></SentimentVeryDissatisfied></span>
            }
            </form>
            <Close className="loginClose" onClick={() => setShowLogin(false)}/>
        </div>
    )
}


