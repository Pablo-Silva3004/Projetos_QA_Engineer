import {seed,validateBackup,type Data} from './domain';
import {ensureCourseCatalog} from './courseCatalog';
const KEY='qa-path-v1';
export const repository={load():Data {const raw=localStorage.getItem(KEY);if(!raw)return seed();const d:unknown=JSON.parse(raw);if(!validateBackup(d))throw new Error('O backup local não pôde ser lido. Seus dados foram preservados.');return ensureCourseCatalog(d);},save(data:Data){localStorage.setItem(KEY,JSON.stringify(data));}};
