import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user_route.js';
import companyRoute from './routes/company_route.js';
import jobRoute from './routes/job_route.js';
import applicationRoute from './routes/application_route.js';

dotenv.config();
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

const corsOptions = {
    // allow any local dev origin (Vite may pick 5173, 5174, 5175 etc.)
    origin: (origin, callback) => {
        // allow requests with no origin (e.g., curl, server-side)
        if (!origin) return callback(null, true);
        // allow any localhost origin
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        // otherwise block
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`\n📨 ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Backend is running', success: true });
});

const PORT = 8001;

//apis
app.use('/api/users', userRoute);
app.use('/api/job', jobRoute);
app.use('/api/company', companyRoute);
app.use('/api/application', applicationRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(` Server running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
