const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.get('/api/schools', (req, res, next) => {
  db.readSchool()
    .then(response => res.send(response))
    .catch(next);
});

app.get('/api/students', (req, res, next) => {
  db.readStudent()
    .then(response => res.send(response))
    .catch(next);
});

app.post('/api/schools', async (req, res, next) => {
  try {
    console.log(req.body);
    const school = await db.createSchool(req.body);
    res.send(school);
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/students', async (req, res, next) => {
  try {
    console.log(req.body);
    const student = await db.createStudent(req.body);
    res.send(student);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/students/:id', async (req, res, next) => {
  try {
    await db.deleteStudent(req.params.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/schools/:id', async (req, res, next) => {
  try {
    await db.deleteSchool(req.params.id);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/schools/:id', (req, res, next) => {
  db.updateSchool(req.body)
    .then(school => res.send(school))
    .catch(next);
});

app.put('/api/students/:id', (req, res, next) => {
  console.log(req.body);
  db.updateStudent(req.body)
    .then(user => res.send(user))
    .catch(next);
});

db.sync()
  .then(() => app.listen(port, () => console.log(`Listening on Port ${port}`)))
  .catch(ex => console.log(ex));
