require('dotenv').config()
const express = require('express')
const { initDB } = require('./database');
const Task = require('./database/models/todo.model')
const PORT = process.env.PORT
const cors = require('cors')
const http = require("http");
const User = require('./database/models/user.model')
const Token = require('./database/models/token.model')
const jwt = require('jsonwebtoken');
const Auth = require('./database/auth/auth')



const app = express()

app.use(cors())
app.use(express.json())

http.createServer(app).listen(PORT, () => {
    console.log('Server is working on port '+ PORT)
})

initDB();

app.use('/todos', Auth)
app.get("/todos", async (req, res) => {
    try {
        const todos = await Task.findAll({where: {userId: req.userId}});
        res.json({
            todos
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});


app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Task.findByPk(req.params.id);
        if (todo.userId === req.userId) {
            res.json({
                todo
            })
        } else {
            res.status(404).json({message: 'Ошибка. Не ваш userId'})
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
});


app.post("/todos", async (req, res) => {
    try {
        const todo = await Task.create({
            title : req.body.title,
            description : req.body.description,
            userId: req.userId
        })
        res.json({
            todo
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch("/todos/:id", async (req, res) => {
    try {
        const todo = await Task.findByPk(req.params.id);
        if (todo.userId === req.userId) {
            await Task.update({
                    title : req.body.title,
                    description : req.body.description},
                {where : {id: req.params.id}});
            res.json({
                todo
            })
        } else {
            res.status(404).json({message: 'Ошибка. Не ваш userId'})
        }
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete("/todos", async (req, res) => {
    try {
        await Task.destroy({where: {userId: req.userId}});
        const todos = await Task.findAll({where: {userId: req.userId}})
        res.json({
            todos
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/todos/:id", async (req, res) => {
    try {
        const todo = await Task.findByPk(req.params.id);
        if (todo.userId === req.userId) {
            await todo.destroy();
            res.json({
                todo
            })
        } else {
            res.status(404).json({message: 'Ошибка. Не ваш userId'})
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

app.post('/registration', async (req, res) => {
    try {
        const checkEmail = await User.findOne({where : {email: req.body.email}})
        if (checkEmail) {
            res.status(400).json({message: 'Ошибка. Такой пользователь уже есть'})
        }
        else {
            const user = await User.create({
                firstName: req.body.name,
                lastName: req.body.lastName,
                email: req.body.email.toLowerCase(),
                password: req.body.password
            })
            res.json(user)
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/auth', async (req, res) => {
    try {
        const user = await User.findOne({where : {email: req.body.email, password: req.body.password}})
        if (user) {
            const accessToken = jwt.sign({
            id: user.id
            },
                process.env.TOKEN_KEY,
                {expiresIn: '24h'})
            await Token.create({})
            res.json({accessToken})

        } else {
            res.status(400).json({message: 'Некорретные данные'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
app.get('/logout', Auth, (req, res) => {
    try {
        res.json({message: 'Вы успешно вышли'})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

