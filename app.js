import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import userRouter from './router/user.js';
import blogRouter from './router/blog.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan('tiny'));

app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(8080);
