import express, { response, request } from 'express';
import mongoose from 'mongoose';
import userRouter from './Routes/userRoutes';


// import apiRouter from './Routers/apiRoutes';

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const port: number = 3000;    


app.get('/', (req: express.Request, res: express.Response)=>{
    res.status(200).json({
        message: 'Hello World'
    })
})

app.use('/user',userRouter);






app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});

const uri = 'mongodb://localhost:27017/stackles';



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




