import React, {useEffect} from 'react';
import {useState} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Map, Room, StarRate} from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import {format} from 'timeago.js';
import Register from "./Components/Register";
import Login from "./Components/Login"


function App() {
    const myStorage = window.localStorage;
    const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [rating, setRating] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        latitude: 46,
        longitude: 10,
        zoom: 3
    });
    console.log(myStorage)
    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/pins");
                setPins(res.data)
                console.log(res.data)
            } catch (err) {
                console.log(err)
            }
        };
        getPins()
    }, [])

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({...viewport, latitude: lat, longitude: long})
    };

    const handleAddClick = (e) => {
        // console.log(e)
        const [long, lat] = e.lngLat
        setNewPlace({
            lat,
            long
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPin = {
            username: currentUser,
            title,
            desc,
            rating,
            lat: newPlace.lat,
            long: newPlace.long,
        };
        try {
            const res = await axios.post("/pins", newPin)
            setPins([...pins, res.data]);
            setNewPlace(null)
        } catch (err) {
            console.log(err)
        }
    };

    const handleLogout = () => {
        myStorage.removeItem("user");
        setCurrentUser(null);
    }


    return (
                <div className="App">
            {currentUser ? (
            <ReactMapGL
                {...viewport}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                mapStyle="mapbox://styles/viktorovich85/ckq0x434z059g18s985l67czv"
                onDblClick={handleAddClick}
                transitionDuration="100"
            >
                {pins.map((p) => (
                    <>
                        <Marker
                            longitude={p.long}
                            latitude={p.lat}
                            offsetLeft={-viewport.zoom * 3}
                            offsetTop={-viewport.zoom * 6}
                        >
                            <Room style={{
                                fontSize: viewport.zoom * 6,
                                color: p.username === currentUser ? "red" : "blue",
                                cursor: "pointer"
                            }}
                                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}/>
                        </Marker>
                        {p._id === currentPlaceId && (
                            <Popup
                                key={p._id}
                                latitude={p.lat}
                                longitude={p.long}
                                closeButton={true}
                                closeOnClick={false}
                                anchor="left"
                                onClose={() => setCurrentPlaceId(null)}
                            >
                                <div className="card">
                                    <label>Место</label>
                                    <h4 className="place">{p.title}</h4>
                                    <label>Описание</label>
                                    <p className="desc">{p.desc}</p>
                                    <label>Рейтинг</label>
                                    <div className="stars">
                                        {Array(p.rating).fill(<StarRate className="star"/>)}
                                    </div>
                                    <label>Информация</label>
                                    <span className="username">Добавлено <b>{p.username}</b> </span>
                                    <span className="date">{format(p.createdAt)}</span>
                                </div>
                            </Popup>
                        )}
                    </>
                ))}


                {newPlace && (
                    <Popup
                        latitude={newPlace.lat}
                        longitude={newPlace.long}
                        closeButton={true}
                        closeOnClick={false}
                        anchor="left"
                        onClose={() => setNewPlace(null)}
                    >
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label>Место</label>
                                <input
                                    placeholder="Добавьте название"
                                    onChange={(e) => setTitle(e.target.value)}/>
                                <label>Описание</label>
                                <textarea
                                    placeholder="Расскажите об этом месте"
                                    onChange={(e) => setDesc(e.target.value)}/>
                                <label>Рейтинг</label>
                                <select onChange={(e) => setRating(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>

                                </select>
                                <button className="submitButton" type="submit">Добавить на карту</button>
                            </form>

                        </div>

                    </Popup>
                )}
                {currentUser ? (
                    <button className="button logout" onClick={handleLogout}>Выйти</button>
                ) : (
                    <div className="buttons">
                        <button className="button login" onClick={() => setShowLogin(true)}>Войти</button>
                        <button className="button register" onClick={() => setShowRegister(true)}>Зарегистироваться
                        </button>
                    </div>
                )}
                {showRegister && <Register setShowRegister={setShowRegister}/>}
                {showLogin && <Login
                    setShowLogin={setShowLogin}
                    myStorage={myStorage}
                    setCurrentUser={setCurrentUser}/>}

            </ReactMapGL>) : (
                <div>
                    <div className="firstpage">
                        <div className="firstloginContainer">
                            <div className="firstlogo">
                                <Map/>
                                <pre> MyMap</pre>
                            </div>
                            <div className="firstbuttons">
                                <button className="button login first" onClick={() => setShowLogin(true)}>Войти</button>
                                <button className="button register first" onClick={() => setShowRegister(true)}>Зарегистироваться
                                </button>
                            </div>
                        </div>

                                {showRegister && <Register setShowRegister={setShowRegister}/>}
                    {showLogin && <Login
                        setShowLogin={setShowLogin}
                        myStorage={myStorage}
                        setCurrentUser={setCurrentUser}/>}
                </div>
                </div>
            )}
        </div>
    );
}

export default App;
