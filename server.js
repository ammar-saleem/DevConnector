const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

const port = process.env.PORT || 5000;

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API is running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(port, () => console.log(`App is running on port ${port}`));
