const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config({path: '.env'});
const uuidv4 = require('uuid/v4');

const models = require('./models');
const routes = require('./routes');


app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  };
  next();
});


app.get('/session', (req, res) => {
  return res.send(req.context.models.users[req.context.me.id]);
});

app.get('/users', (req, res) => {
  return res.send(Object.values(req.context.models.users));
});

app.get('/users/:userId', (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

app.get('/messages', (req, res) => {
  return res.send(Object.values(req.context.models.messages));
});

app.get('/messages/:messageId', (req, res) => {
  return res.send(req.context.models.messages[req.params.messageId]);
});

app.post('/messages', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id,
  };
  req.context.models.messages[id] = message;
  return res.send(message);
});

app.delete('/messages/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = req.context.models.messages;
  req.context.models.messages = otherMessages;
  return res.send(message);
});



app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});