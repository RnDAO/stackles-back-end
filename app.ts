import express, { response, request } from 'express';
import mongoose from 'mongoose';
import userRouter from './Routes/userRoutes';
import orgRouter from './Routes/orgRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import collRouter from './Routes/collRoutes';

// import apiRouter from './Routers/apiRoutes';

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
// cookie
app.use(cookieParser());
const port: number = 3000;    


app.get('/', (req: express.Request, res: express.Response)=>{
    res.status(200).json({
        message: 'Hello World'
    })
})

app.use('/user',userRouter);
app.use ('/org', orgRouter);
app.use('/coll',collRouter);






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




