import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'https';
import { ServerService } from './server/ServerService';
import  { readFileSync }  from "fs";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer({
    key: readFileSync(process.env.KEY_PEM ?? ''),
    cert: readFileSync(process.env.CERT_PEM ?? '')
});

ServerService.getInstance().init(httpServer);


app.get('/', async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
        message: 'Hello World!',
    });
});

try {
    httpServer.listen(PORT, (): void => {
        console.log(`Connected successfully on port ${PORT}`);
    });
} catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
}

