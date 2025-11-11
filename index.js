import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';
import authRoute from './routes/authRouter.js';
import userRouter from "./routes/userRouter.js";
import incidentRoutes from './routes/incidentRoutes.js';
import reportRoute from './routes/reportRouters.js'
import requestRouter from './routes/reportRouters.js'
import notifyRoute from "./routes/notificationRoutes.js";
const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',  // Allow your frontend origin
  credentials: true,  // Allow cookies (if you need them for auth)
}));
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);


app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRouter);
app.use('/api/incident', incidentRoutes);
app.use('/api/report', reportRoute);
app.use('/api/request', requestRouter);
app.use('/api/notification', notifyRoute);


// Serve React static files
//app.use(express.static(path.join(__dirname, '../front-copy/dist')));



app.listen(process.env.PORT, "localhost", ()=> {
  console.log("server connected");
});