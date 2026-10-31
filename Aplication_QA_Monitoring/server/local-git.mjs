import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdir,writeFile,realpath,lstat,readFile} from 'node:fs/promises';
import {IntegrationError,resolveIntegrationEnv,validateUpload} from './integration.ts';

const execute=promisify(execFile);
const markerFile='.qa-path-delivery.json';
export function createLocalPublisher(repositoryRoot,options={}){
  const root=path.resolve(repositoryRoot);let busy=false;
  const executor=options.execute||execute;
  const run=async(args)=>{
    try{const result=await executor('git',['-c',`safe.directory=${root}`,...args],{cwd:root,timeout:60000,maxBuffer:1024*1024,windowsHide:true,env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'}});return result.stdout.trim();}
    catch{throw new IntegrationError('O Git não concluiu a operação. Verifique a autenticação, a conexão e o estado da branch.',502);}
  };
  async function verify(env){
    const config=resolveIntegrationEnv(env);
    const actual=await run(['rev-parse','--show-toplevel']);
    if((await realpath(actual)).toLowerCase()!==(await realpath(root)).toLowerCase())throw new IntegrationError('O repositório local não corresponde à pasta configurada.',409);
    const branch=await run(['branch','--show-current']);
    if(branch!==config.GITHUB_BRANCH)throw new IntegrationError('Selecione a branch de destino configurada antes de publicar.',409);
    const remote=await run(['remote','get-url','origin']);
    const normalized=remote.replace(/^https:\/\/github\.com\//,'').replace(/^git@github\.com:/,'').replace(/\.git$/,'').replace(/\/$/,'');
    if(normalized.toLowerCase()!==config.GITHUB_REPOSITORY.toLowerCase())throw new IntegrationError('O origin local não corresponde ao repositório escolhido.',409);
    return config;
  }
  return {
    async status(){try{await verify(options.env||{});return {githubConfigured:true,githubMode:'local-git'};}catch(error){return {githubConfigured:false,githubMode:'local-git',githubError:error.message};}},
    async publish(value,env){
      if(busy)throw new IntegrationError('Há outra publicação em andamento. Aguarde a conclusão.',409);
      busy=true;
      try{
        const config=await verify(env);const upload=validateUpload(value,config);
        const folder=JSON.parse(config.GITHUB_COURSE_FOLDERS_JSON)[upload.courseId];
        const directory=`${folder}/${upload.submissionId}`;
        const destination=path.resolve(root,directory);
        if(!destination.startsWith(root+path.sep))throw new IntegrationError('Pasta de entrega inválida.');
        // Reject junctions and symlinks along each destination path before writing.
        async function ensureDirectory(target){
          const relative=path.relative(root,target);let current=root;
          for(const part of relative.split(path.sep).filter(Boolean)){
            current=path.join(current,part);await mkdir(current,{recursive:true});
            const stat=await lstat(current);if(stat.isSymbolicLink()||!stat.isDirectory())throw new IntegrationError('O envio não aceita links simbólicos nas pastas.',400);
            if(!(await realpath(current)).toLowerCase().startsWith((await realpath(root)).toLowerCase()+path.sep))throw new IntegrationError('A pasta resolvida está fora do repositório.',400);
          }
        }
        if(upload.files.some(file=>file.path===markerFile))throw new IntegrationError('Nome de arquivo reservado para o registro da entrega.');
        const fingerprint=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify({courseId:upload.courseId,files:upload.files.slice().sort((a,b)=>a.path.localeCompare(b.path))})))).toString('hex');
        const manifest=path.join(destination,markerFile);
        let previous;
        try{previous=JSON.parse(await readFile(manifest,'utf8'));}catch(error){if(error.code!=='ENOENT')throw new IntegrationError('A pasta já possui um registro de envio inválido.',409);}
        if(previous&&previous.fingerprint!==fingerprint)throw new IntegrationError('Este envio já tem conteúdo diferente. Selecione os arquivos novamente.',409);
        const commitMarker=`[qa-path:${upload.submissionId}]`;
        const message=await run(['log','-1','--format=%B']);
        if(previous&&message.includes(commitMarker)){
          await run(['push','origin',config.GITHUB_BRANCH]);
          const sha=await run(['rev-parse','HEAD']);return {sha,url:`https://github.com/${config.GITHUB_REPOSITORY}/commit/${sha}`,folder:directory,branch:config.GITHUB_BRANCH};
        }
        if(previous)throw new IntegrationError('O envio anterior precisa ser conferido no histórico antes de publicar novamente.',409);
        const localHead=await run(['rev-parse','HEAD']);
        await run(['fetch','origin',config.GITHUB_BRANCH]);
        if(localHead!==await run(['rev-parse','FETCH_HEAD']))throw new IntegrationError('A branch local não está sincronizada com o GitHub. Faça a sincronização antes de enviar a entrega.',409);
        await ensureDirectory(destination);
        for(const file of upload.files){const target=path.resolve(destination,...file.path.split('/'));if(!target.startsWith(destination+path.sep))throw new IntegrationError('Caminho inválido.');await ensureDirectory(path.dirname(target));await writeFile(target,Buffer.from(file.content,'base64'),{flag:'wx'});}
        await writeFile(manifest,JSON.stringify({submissionId:upload.submissionId,courseId:upload.courseId,fingerprint},null,2)+'\n',{flag:'wx'});
        await run(['add','--',directory]);
        const expected=upload.files.length+1;const staged=await run(['ls-files','--',directory]);
        if(staged.split('\n').filter(Boolean).length!==expected)throw new IntegrationError('Algum arquivo foi ignorado pelo Git. Confira a entrega antes de reenviar.',409);
        await run(['commit','--only','-m',`${upload.message.trim()}\n\n${commitMarker}`,'--',directory]);
        const sha=await run(['rev-parse','HEAD']);
        await run(['push','origin',`${sha}:refs/heads/${config.GITHUB_BRANCH}`]);
        return {sha,url:`https://github.com/${config.GITHUB_REPOSITORY}/commit/${sha}`,folder:directory,branch:config.GITHUB_BRANCH};
      }finally{busy=false;}
    },
  };
}
