import fs from 'fs';
import { editorCss } from './ENV';

export function canWrite(): boolean {
    try {
        fs.accessSync(editorCss, fs.constants.W_OK);
        return true;
    } catch (error) {
        return false;
    }
}