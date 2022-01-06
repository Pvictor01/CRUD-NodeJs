const express = require('express');

const route = express.Router();

const {v4: uuidv4 } = require('uuid');

const database = require('../database/index');

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const user = database.filter(user => user.cpf === cpf);

  if(user == false) {
    return response.status(401).json({error: 'User not found'})
  };

  request.user = user;

  return next();
};

route.post('/user', (request, response) => {
  const { name, cpf, email, date } = request.body;

  const user = {
    id: uuidv4(),
    name,
    cpf,
    email,
    date,
    created_at: new Date(),
    updated_at: new Date()
  };

  database.push(user);

  return response.status(201).json(database);
});

route.get('/user', verifyIfExistsAccountCPF, (request, response) => {
  const { user } = request;

  return response.status(200).json(user);
});

route.put('/user/:id', (request, response) => {
  const { id } = request.params;
  const { name, email, date } = request.body;

  const userID = database.find(user => user.id === id);

  if(!userID) {
    return response.status(401).json({error: 'User not found'})
  }

  userID.name = name;
  userID.email = email;
  userID.date = date;

  return response.status(201).json(userID);
});

route.delete('/user/', verifyIfExistsAccountCPF, (request, response) => {
  const { user } = request;
  
  database.splice(user, 1);

  return response.status(201).json({message: 'User deleted!'});
});

module.exports = route;