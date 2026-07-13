
import fs from 'fs';
import path from 'path';


const logsDir = path.join(process.cwd(), 'logs');

fs.mkdirSync(logsDir, { recursive: true });

const logFile = path.join(logsDir, 'app.log');

const date = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const log = (level, message) => {

    const ligne = `${date()} [${level}] ${message}\n`;
    console.log(ligne.trim());

    fs.appendFileSync(logFile, ligne, 'utf8');
};


export const logger = {
    info: (message) => log('INFO', message),
    warning: (message) => log('WARNING', message),
    error: (message) => log('ERROR', message)
}