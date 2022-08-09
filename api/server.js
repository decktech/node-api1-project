// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')
const server = express()

server.use(express.json())

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting users',
                err: err.message,
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            }
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting users id',
                err: err.message,
            })
        })
})

server.post('/api/users', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({
            message: "Please provide name and bio for the user"
        })
    } else {
        User.insert(req.body)
            .then(result => {
                res.status(201).json(result)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'error creating user',
                    err: err.message,
                })
        })
    }
})

server.delete('/api/users/:id', async (req, res) => {
    // User.remove(req.params.id)
    //     .then(user => {
    //         if (user == null) {
    //             res.status(404).json({
    //                 message: "The user with the specified ID does not exist"
    //             })
    //         }
    //         res.json(user)
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             message: 'error getting users id',
    //             err: err.message,
    //         })
    //     })
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        const deletedUser = await User.remove(possibleUser.id)
        res.status(200).json(deletedUser)
    }
}) 

server.put('/api/users/:id', (req, res) => {
    User.update(req.params.id, req.body)
        .then(result => {
            if (result == null) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                })
            } else if (!req.body.name || !req.body.bio) {
                res.status(400).json({
                    message: "Please provide name and bio for the user"
                })
            } else {
                res.json(result)
            }
        })
        .catch(() => {
            res.status(500).json({ message: "The user information could not be modified"})
        })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
