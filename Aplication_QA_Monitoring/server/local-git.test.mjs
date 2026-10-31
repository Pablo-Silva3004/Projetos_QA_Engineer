import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createLocalPublisher} from './local-git.mjs';
const exec=promisify(execFile);

test('publicação Git local isola arquivos e reutiliza o envio sem duplicar commit',async()=>{
  const workspace=await mkdtemp(path.join(tmpdir(),'qa-path-git-'));
  const root=path.join(workspace,'repo'),remote=path.join(workspace,'remote.git');await mkdir(root);
  const git=async(args,cwd=root)=>(await exec('git',args,{cwd,windowsHide:true})).stdout.trim();
  try{
    await git(['init','--bare',remote],workspace);await git(['init','-b','main']);await git(['config','user.name','QA Path Test']);await git(['config','user.email','qa-path-test@example.invalid']);
    await writeFile(path.join(root,'README.md'),'Initial\n');await git(['add','.']);await git(['commit','-m','Initial']);
    await git(['remote','add','origin','https://github.com/learner/studies.git']);await git(['push',remote,'main']);
    await writeFile(path.join(root,'unrelated.txt'),'Keep my staged file\n');await git(['add','unrelated.txt']);
    await writeFile(path.join(root,'README.md'),'Keep my unstaged edit\n');
    const env={GITHUB_REPOSITORY:'learner/studies',GITHUB_BRANCH:'main',GITHUB_COURSE_FOLDERS_JSON:JSON.stringify({'owned-cypress':'Cypress'})};
    const execute=async(file,args,options)=>{
      const copy=args.slice();if(copy.includes('push')||copy.includes('fetch')){const index=copy.indexOf('origin');if(index>=0)copy[index]=remote;}
      return exec(file,copy,options);
    };
    const publisher=createLocalPublisher(root,{env,execute});assert.equal((await publisher.status()).githubConfigured,true);
    const upload={courseId:'owned-cypress',submissionId:'12345678-1234-1234-1234-123456789abc',message:'Entrega Cypress',files:[{path:'tests/login.cy.ts',content:Buffer.from('test code').toString('base64')}]};
    const result=await publisher.publish(upload,env);
    assert.match(result.url,/https:\/\/github.com\/learner\/studies\/commit\/[a-f0-9]{40}$/);
    assert.equal(await git(['diff','--cached','--name-only']),'unrelated.txt');
    assert.equal(await readFile(path.join(root,'README.md'),'utf8'),'Keep my unstaged edit\n');
    const committed=await git(['show','--format=','--name-only','HEAD']);assert.ok(committed.includes('Cypress/'));assert.ok(!committed.includes('unrelated'));assert.ok(!committed.includes('README.md'));
    assert.equal(await git(['rev-parse','HEAD']),await git(['rev-parse','refs/heads/main'],remote));
    const count=await git(['rev-list','--count','HEAD']);await publisher.publish(upload,env);assert.equal(await git(['rev-list','--count','HEAD']),count);
    await assert.rejects(()=>publisher.publish({...upload,files:[{path:'tests/login.cy.ts',content:Buffer.from('changed').toString('base64')}]},env),{status:409});
    await assert.rejects(()=>publisher.publish({...upload,courseId:'unmapped'},env),{status:400});
  }finally{await rm(workspace,{recursive:true,force:true});}
});
