import React, {useEffect, useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import './App.css'
import axios from "axios";
import { Button, Modal} from 'react-bootstrap'



function App() {
    const [todos, setTodos] = useState([]);
    //edit
    const [ViewEdit, SetEditShow] = useState(false)
    const [ViewRegistration, SetRegistrationShow] = useState(false)
    const [ViewAuth, SetAuthShow] = useState(false)
    const handleAuthShow = () => {
        SetAuthShow(true)
    }
    const handleAuthClose = () => {
        SetAuthShow(false)
    }
    const handleEditShow = () => {
        SetEditShow(true)
        console.log('1')
    }
    const handleEditClose = () => {
        SetEditShow(false)
    }
    const handleRegistrationShow = () => {
        SetRegistrationShow(true)
    }
    const handleRegistrationClose = () => {
        SetRegistrationShow(false)
    }
    const [RowData, SetRowData] = useState([])
    const [id, setId] = useState("");
    const [isAuthorized, setAuthorizedStatus] = useState(!!localStorage.getItem('token'));


    const handleEdit = async () => {
        try {
            console.log('1')
            const Credentials = {title, description}
            await axios.patch(`http://localhost:3100/todos/${id}`, Credentials, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            await fetchData()
        } catch (e) {
            console.log(e)
        }
    }
    const handleAuthorization = async () => {
        try {
            const AuthData = {email, password}
            console.log(AuthData)
            const res = await axios.post('http://localhost:3100/auth', AuthData)
            console.log(res.data.accessToken)
            handleAuthClose()
            localStorage.setItem('token', res.data.accessToken);
            setAuthorizedStatus(true)
            fetchData()


        } catch(e) {
            console.log(e)
            alert(e.response.data.message)
        }
    }
    const handleLogout = async () => {
        try {
            localStorage.removeItem('token')
            setAuthorizedStatus(false)
        } catch (e) {
            console.log(e)
        }
    }
    const handleRegistration = async () => {
        try {
            const RegData = {name, lastName, email, password}
            await axios.post('http://localhost:3100/registration', RegData)
            await fetchData()
            alert('Успешно.')
            handleRegistrationClose()

        } catch (e) {
            console.log(e)
            if (e.response.data.message === 'Ошибка. Такой пользователь уже есть') {
                alert(e.response.data.message);
            } else {
                alert(e.response.data.message)
            }
        }
    }

    async function fetchData() {
        try {
            const res = await axios.get('http://localhost:3100/todos/', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            setTodos(res.data.todos)
            console.log(localStorage.getItem('token'))
            console.log('good!')
        } catch (e) {
            console.log(e)
        }

    }

    useEffect(() => {
        fetchData();
    }, [])

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastname] = useState('')
    const postData = async () => {
        try {
            await axios.post(`http://localhost:3100/todos/`, {
                title: title,
                description: description
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            await fetchData()
        } catch (e) {
            console.log(e)
        }
    }
    const deleteAll = async () => {
        try {
            await axios.delete(`http://localhost:3100/todos`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            await fetchData()

        } catch (e) {
            console.log(e)
        }

    }
    const deletePost = async (id) => {
        try {
            await axios.delete('http://localhost:3100/todos/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            await fetchData()
        } catch (e) {
            console.log(e)
        }
    }

    if (isAuthorized) {
        return (
            <div>
                <div>
                    <h1>TODO-LIST app</h1>
                    <div className="input-container">
                        <input type="text" id="input-field" placeholder="Write ur todo title here"
                               onChange={(e) => setTitle(e.target.value)}></input>
                        <input type="text" id="input-field" placeholder="Write ur todo description here"
                               onChange={(e) => setDescription(e.target.value)}></input>
                        <button type="button" id="submit-btn" onClick={postData}>Add</button>

                        <button type="button" id='danger-btn' onClick={deleteAll}>Delete All</button>
                        <button type="button" id='logout-btn' onClick={handleLogout}>Logout</button>
                    </div>
                    <div className='model-box-view'>
                        <Modal
                            show={ViewEdit}
                            onHide={handleEditClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Edit ToDo</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                    <div className='form-group'>
                                        <label>Title</label>
                                        <input type="text" className='form-control'
                                               onChange={(e) => setTitle(e.target.value)} placeholder="Please enter title"
                                               defaultValue={RowData.title}/>
                                    </div>
                                    <div className='form-group mt-3'>
                                        <label>Description</label>
                                        <input type="email" className='form-control'
                                               onChange={(e) => setDescription(e.target.value)}
                                               placeholder="Please enter description" defaultValue={RowData.description}/>
                                    </div>
                                    <Button type='submit' className='btn btn-warning mt-4'
                                            onClick={handleEdit}>Confirm</Button>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant='secondary' onClick={handleEditClose}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>


                    {
                        todos.map((post) => (
                            <div key={post.id} className="card">
                                <h2>{post.title}</h2>
                                <a>{post.description}</a>
                                <div className="button-container">
                                    <a className="btn btn-primary" onClick={() => {
                                        handleEditShow(SetRowData(post), setId(post.id))
                                    }}>Edit</a>
                                    <a className="btn btn-danger" onClick={() => {
                                        deletePost(post.id)
                                    }}>Delete</a>
                                </div>
                            </div>))}

                </div>

            </div>

        )


    }

    if (!isAuthorized) {
        return( <div>
                <h1>TODO-LIST app</h1>
                <p>
                    <Alert variant="success">
                        <Alert.Heading>Hey, nice to see you</Alert.Heading>
                        <p>
                            Hello, wanderer. Who are you by color? Come on, show me who you are.
                            Click to log in or register if you are at the house for the first time
                        </p>
                        <hr />
                        <p className="mb-0">
                            TODO-LIST app by BBSO-01-21 Chernikov D.A.
                        </p>
                    </Alert>
                    <p><center><Button variant="primary" on onClick={handleRegistrationShow}>Registration</Button>
                        <Button variant="primary" onClick={handleAuthShow}>Authorization</Button></center></p>
                </p>
                <div className='model-box-view'>
                    <Modal
                        show={ViewRegistration}
                        onHide={handleRegistrationClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Registration</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>

                                <div className='form-group'>
                                    <label>Name</label>
                                    <input type="text" className='form-control'
                                           onChange={(e) => setName(e.target.value)} placeholder="Please enter name"
                                           />
                                </div>
                                <div className='form-group mt-3'>
                                    <label>Last name</label>
                                    <input type="email" className='form-control'
                                           onChange={(e) => setLastname(e.target.value)}
                                           placeholder="Please enter last name"/>
                                </div>
                                <div className='form-group mt-3'>
                                    <label>E-mail</label>
                                    <input type="text" className='form-control'
                                           onChange={(e) => setEmail(e.target.value)} placeholder="Please enter e-mail"
                                    />
                                </div>
                                <div className='form-group mt-3'>
                                    <label>Password</label>
                                    <input type="email" className='form-control'
                                           onChange={(e) => setPassword(e.target.value)}
                                           placeholder="Please enter password"/>
                                </div>
                                <Button type='submit' className='btn btn-warning mt-4'
                                        onClick={handleRegistration}>Register me already!!!!!!!</Button>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleRegistrationClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className='model-box-view'>
                    <Modal
                        show={ViewAuth}
                        onHide={handleAuthClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Authorization</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div className='form-group mt-3'>
                                    <label>E-mail</label>
                                    <input type="text" className='form-control'
                                           onChange={(e) => setEmail(e.target.value)} placeholder="Please enter e-mail"
                                    />
                                </div>
                                <div className='form-group mt-3'>
                                    <label>Password</label>
                                    <input type="email" className='form-control'
                                           onChange={(e) => setPassword(e.target.value)}
                                           placeholder="Please enter password"/>
                                </div>
                                <Button type='submit' className='btn btn-warning mt-4'
                                        onClick={handleAuthorization}>Auth me already!!!!!!!</Button>
                            </div>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant='secondary' onClick={handleAuthClose}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>

            </div>


        )
    }
}

export default App;