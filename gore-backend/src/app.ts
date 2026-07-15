import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());

app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.get("/", (_, res) => {

    res.json({

        proyecto: "Sistema GORE",

        version: "1.0.0",

        estado: "Activo"

    });

});

export default app;