import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import api from './routes';
import morgan from 'morgan';
// import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
    console.log('Connected to mongodb');
});
mongoose.connect('mongodb+srv://sang:1234@cluster0-cuyi2.mongodb.net/minidiary?retryWrites=true&w=majority');

app.use(morgan('dev')); //요청에 대해 로그를 사용하겠다! 함수 인자에 따라 로그가 다르게 나옴
// app.use(bodyParser.json()); //req.body의 데이터 접근 위함 -> 최신 express에 body-parser 내장됨
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
//extended: true 값일 시 따로 설치가 필요한 npm queryString 라이브러리를 사용

app.use(session({
    secret: 'wwdifficultaa',
    resave: false,
    saveUninitialized: true
}));

app.use('/', express.static(path.join(__dirname, './../public')));
app.get('/hello', (req, res) => {
    res.send('Hello');
});
app.use('/api', api);
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
})

//handle error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(port, () => {
    console.log("Express is listening on port ", port);
});