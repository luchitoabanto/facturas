const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express()

const router = require('./routes/index')

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 5000;
app.set('port', PORT);
app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')}`);
});
