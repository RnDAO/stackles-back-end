import express, { response, request } from 'express';
import mongoose from 'mongoose';
import userRouter from './Routes/userRoutes';
import orgRouter from './Routes/orgRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import collRouter from './Routes/collRoutes';
import fileUpload from 'express-fileupload';
import { linkRouter } from './Routes/linkRoutes';
// import apiRouter from './Routers/apiRoutes';

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://stackels.vercel.app'); // Replace with the origin of your frontend application
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, headers) to be sent with requests
  next();
});
app.use(cors(
  {
    origin: 'https://stackels.vercel.app',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: ['Content-Type, Authorization'],
    // header: 'Content-Type, Authorization',
    credentials: true // Allow credentials (cookies, headers) to be sent with requests
  }
));
// cookie
app.use(fileUpload(
    {
        useTempFiles: true,
    }
));
app.use(cookieParser());
const port: number = 3001;    


app.get('/', (req: express.Request, res: express.Response)=>{
    res.status(200).json({
        message: 'Hello World'
    })
})

app.use('/user',userRouter);
app.use ('/org', orgRouter);
app.use('/coll',collRouter);
app.use('/link', linkRouter);





app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});

const uri = 'mongodb+srv://divanshuprajapat2002:divanshu123@cluster0.k20yesv.mongodb.net/';



mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Add any additional options here
} as any)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err: Error) => {
    console.error('Error connecting to MongoDB:', err.message);
  });




