import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user_route.js';
dotenv.config({});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


const PORT = process.env.PORT;

//apis
app.use('/api/users', userRoute);
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});