import React from 'react';
import {useState, useRef} from 'react';
import "./register.css";
import {Map, SentimentVeryDissatisfied, Close, TouchApp} from '@material-ui/icons'
import axios from "axios";



export default function Register({setShowRegister}) {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            await axios.post("/users/register", newUser)
            setSuccess(true);
            setError(false);
        } catch (err) {
            setError(true);
        }

    }

    const close = () => {
        setShowRegister(false);
    };



    function clReg() {
        if (success === true)
        {setTimeout (close, 3000)}
    };


    return (
        <div className="registerContainer">
            <div className="logo">
                <Map/>
                <pre> MyMap</pre>
            </div>

            <form onSubmit={handleSubmit}>
                {success && clReg()}
                <input type="text" placeholder="Имя пользователя" ref={nameRef}/>
                <input type="text" placeholder="Email" ref={emailRef}/>
                <input type="text" placeholder="Пароль" ref={passwordRef}/>
                <button className="registerBtn" onClick={() => clReg()}>Зарегистрироваться</button>
                {success &&
                <span className="success">Успешно. Вы можете зайти на сайт <TouchApp/></span>}


                     {error &&
                <span
                    className="failure">Упс, ошибочка... Что-то пошло не так <pre> </pre> <SentimentVeryDissatisfied/></span>
                }
            </form>
            <Close className="registerClose" onClick={() => setShowRegister(false)}/>

        </div>

    )
};



