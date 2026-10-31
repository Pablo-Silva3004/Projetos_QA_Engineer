import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {handleIntegration} from './integration.ts';
import {createLocalPublisher} from './local-git.mjs';

const root=path.resolve('dist');
const publisher=process.env.GITHUB_MODE==='api'?undefined:createLocalPublisher(path.resolve(import.meta.dirname,'../..'),{env:process.env});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
  const port=Number(process.env.PORT||8787);
  if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host)){res.writeHead(403);res.end('Host inválido.');return;}
  const pathname=new URL(req.url,'http://127.0.0.1').pathname;
  if(pathname==='/api/local/stop'&&req.method==='POST'){
    if(req.headers.origin!==`http://${req.headers.host}`){res.writeHead(403);res.end();return;}
    res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify({message:'QA Path encerrado.'}));server.close();return;
  }
  if(pathname.startsWith('/api/')){
    try{
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>8*1024*1024){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Envio grande demais.'}));return;}chunks.push(chunk);}
      const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,...(req.method!=='GET'&&req.method!=='HEAD'?{body:Buffer.concat(chunks)}:{})});
      const result=await handleIntegration(request,process.env,fetch,publisher);
      res.writeHead(result.status,Object.fromEntries(result.headers));res.end(await result.text());
    }catch{res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Falha no serviço de integração.'}));}
    return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  try{
    const file=path.resolve(root,'.'+decodeURIComponent(pathname));
    if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const target=pathname==='/'?path.join(root,'index.html'):file;
    const body=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:body);
  }catch{res.writeHead(404);res.end('Arquivo não encontrado. Execute npm run build antes de iniciar.');}
});
server.listen(Number(process.env.PORT||8787),'127.0.0.1',()=>console.log(`QA Path: http://127.0.0.1:${process.env.PORT||8787}`));
