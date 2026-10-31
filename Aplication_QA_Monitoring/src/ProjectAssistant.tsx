import {useEffect,useState} from 'react';
import {Bot,Send,Upload,FolderGit2,CheckCircle2} from 'lucide-react';
import type {Data,Entry} from './domain';
import {projectConfiguration} from './projectConfig';
import './project-assistant.css';

type Status={chatConfigured:boolean;githubConfigured:boolean;repository:string;branch:string;courseFolders:Record<string,string>;chatProvider?:string;chatModel?:string;githubMode?:string};
type Message={role:'user'|'assistant'|'system';content:string};
type FileContent={path:string;content:string};
const pending:Status={chatConfigured:false,githubConfigured:false,repository:projectConfiguration.repository,branch:projectConfiguration.branch,courseFolders:projectConfiguration.courseFolders};
async function api<T>(path:string,payload?:unknown):Promise<T>{
  const result=await fetch(path,{method:payload?'POST':'GET',headers:payload?{'Content-Type':'application/json'}:undefined,body:payload?JSON.stringify(payload):undefined});
  const type=result.headers.get('content-type')||'';
  if(!type.includes('application/json'))throw new Error('O serviço de IA e GitHub ainda não está disponível nesta publicação.');
  const json=await result.json();if(!result.ok)throw new Error(json.error||'A operação não foi concluída.');return json as T;
}
function base64(buffer:ArrayBuffer){const bytes=new Uint8Array(buffer);let value='';for(let start=0;start<bytes.length;start+=8192)value+=String.fromCharCode(...bytes.subarray(start,start+8192));return btoa(value);}

export function ProjectAssistant({data,onPublished}:{data:Data;onPublished:(entry:Entry)=>void}){
  const [status,setStatus]=useState<Status>(pending),[statusError,setStatusError]=useState(''),[messages,setMessages]=useState<Message[]>([]),[text,setText]=useState(''),[busy,setBusy]=useState<'chat'|'upload'|null>(null),[error,setError]=useState(''),[courseId,setCourseId]=useState(data.courses[0]?.id||''),[files,setFiles]=useState<FileContent[]>([]),[submissionId,setSubmissionId]=useState(crypto.randomUUID()),[commitMessage,setCommitMessage]=useState(''),[result,setResult]=useState<{url:string;sha:string;folder:string}|null>(null);
  const course=data.courses.find(c=>c.id===courseId);
  useEffect(()=>{let active=true;api<Status>('/api/integration/status').then(value=>{if(active){setStatus(value);setStatusError('');}}).catch(()=>{if(active)setStatusError('Aguardando ativação das conexões de IA e GitHub.');});return ()=>{active=false;};},[]);
  async function chooseFiles(selected:FileList|null){
    if(!selected)return;setError('');setResult(null);
    const entries=Array.from(selected);
    if(entries.length>100||entries.reduce((sum,file)=>sum+file.size,0)>5*1024*1024){setError('Selecione até 100 arquivos, com no máximo 5 MB no total.');return;}
    const next=await Promise.all(entries.map(async file=>({path:file.webkitRelativePath||file.name,content:base64(await file.arrayBuffer())})));
    setFiles(next);setSubmissionId(crypto.randomUUID());
  }
  async function sendChat(event:React.FormEvent){
    event.preventDefault();if(!text.trim()||busy||!status.chatConfigured)return;
    const outgoing=[...messages.filter(m=>m.role!=='system'),{role:'user' as const,content:text.trim()}].slice(-20);
    setMessages(previous=>[...previous,{role:'user',content:text.trim()}]);setText('');setBusy('chat');setError('');
    try{
      const week=data.weeks.find(w=>w.id===course?.weekId);
      const context=JSON.stringify({plan:data.plan.name,weeklyHours:data.plan.weeklyHours,course:course?{title:course.title,technology:course.technology,status:course.status}:null,week:week?{title:week.title,objective:week.objective,delivery:week.delivery}:null,selectedFiles:files.map(file=>file.path),lastPublication:result});
      const reply=await api<{message:string}>('/api/assistant/chat',{messages:outgoing,context});
      setMessages(previous=>[...previous,{role:'assistant',content:reply.message}]);
    }catch(err){setError(String(err instanceof Error?err.message:err));}finally{setBusy(null);}
  }
  async function publish(event:React.FormEvent){
    event.preventDefault();if(!course||!files.length||busy)return;setBusy('upload');setError('');setResult(null);
    try{
      const publication=await api<{url:string;sha:string;folder:string;branch:string}>('/api/github/publish',{courseId,submissionId,message:commitMessage.trim(),files});
      setResult(publication);
      onPublished({id:`github-${submissionId}`,title:commitMessage.trim(),weekId:course.weekId,status:'Publicada',type:'Commit GitHub',url:publication.url,description:`Curso: ${course.title}\nPasta: ${publication.folder}\nBranch: ${publication.branch}\nCommit: ${publication.sha}`,createdAt:new Date().toISOString(),courseId});
      setMessages(previous=>[...previous,{role:'system',content:`Entrega publicada em ${publication.folder}. Commit: ${publication.sha}.`}]);setFiles([]);setSubmissionId(crypto.randomUUID());
    }catch(err){setError(String(err instanceof Error?err.message:err));}finally{setBusy(null);}
  }
  return <section className="project-assistant panel" aria-labelledby="project-assistant-title">
    <div className="assistant-heading"><span className="assistant-avatar"><Bot size={24}/></span><div><span className="eyebrow">SEU MENTOR DE QA</span><h2 id="project-assistant-title">Chat e publicação de projetos</h2></div></div>
    <div className="integration-status" role="status"><span>{status.chatConfigured?(status.chatProvider==='openai'?'IA OpenAI configurada':'IA local pronta'):'IA pendente de configuração'}</span><span>{status.githubConfigured?`${status.repository} · ${status.branch}`:'GitHub pendente de configuração'}</span></div>
    <p className="assistant-caption">Repositório: <a href={`https://github.com/${status.repository}`} target="_blank" rel="noopener noreferrer">{status.repository}</a> · branch {status.branch}</p>{statusError&&<p className="assistant-pending">O mentor local e a publicação com seu Git funcionam na versão do computador. <a href="http://127.0.0.1:8787" target="_blank" rel="noopener noreferrer">Abrir QA Path local</a>. Inicie pelo arquivo Iniciar_QA_Path.cmd se necessário.</p>}
    <div className="assistant-grid"><div className="assistant-conversation"><div className="chat-messages" role="log" aria-label="Conversa com o mentor" aria-live="polite">{!messages.length&&<div className="chat-empty"><Bot size={30}/><h3>Construa seu portfólio com acompanhamento.</h3><p>Converse sobre o curso, planeje a entrega e envie os arquivos do projeto. Quando as conexões estiverem ativas, a publicação criará o commit e atualizará a branch automaticamente.</p></div>}{messages.map((message,index)=><article className={`chat-message ${message.role}`} key={index}><strong>{message.role==='user'?'Você':message.role==='assistant'?'Mentor QA':'Publicação'}</strong><p>{message.content}</p></article>)}{busy==='chat'&&<p role="status">Preparando resposta…</p>}</div><form className="chat-composer" onSubmit={sendChat}><label className="field">Mensagem para o mentor<textarea rows={3} maxLength={8000} value={text} onChange={event=>setText(event.target.value)} placeholder={status.chatConfigured?'Como posso melhorar os testes desta entrega?':'Abra o Ollama e a versão local do QA Path para conversar.'}/></label><button className="primary" disabled={!status.chatConfigured||!!busy||!text.trim()}><Send size={16}/> Enviar mensagem</button></form><p className="assistant-caption">No modo local, suas mensagens e o contexto da semana são processados no computador pelo Ollama, sem usar a API paga da OpenAI. O conteúdo dos arquivos é enviado ao GitHub ao publicar.</p></div>
    <form className="project-upload" onSubmit={publish}><h3><FolderGit2 size={19}/> Enviar uma entrega</h3><label className="field">Curso do projeto<select aria-label="Curso do projeto" value={courseId} onChange={event=>{setCourseId(event.target.value);setResult(null);}} required><option value="">Selecione um curso</option>{data.courses.map(item=><option value={item.id} key={item.id}>{item.title}</option>)}</select></label><p className="upload-destination">{status.courseFolders[courseId]?`Destino: ${status.courseFolders[courseId]}/identificador-da-entrega/`:'A pasta deste curso ainda precisa ser vinculada ao repositório.'}</p><label className="field">Mensagem do commit<input required maxLength={200} value={commitMessage} onChange={event=>setCommitMessage(event.target.value)} placeholder="Adiciona testes E2E de autenticação"/></label><label className="file-picker">Selecionar arquivos<input type="file" multiple disabled={!!busy} onChange={event=>{void chooseFiles(event.target.files).catch(()=>setError('Não foi possível ler os arquivos.'));event.target.value='';}}/></label><label className="file-picker">Ou selecionar a pasta do projeto<input type="file" multiple disabled={!!busy} ref={node=>{node?.setAttribute('webkitdirectory','');}} onChange={event=>{void chooseFiles(event.target.files).catch(()=>setError('Não foi possível ler a pasta.'));event.target.value='';}}/></label><p className="assistant-caption">Até 100 arquivos e 5 MB. Selecione o código e as evidências, sem dependências, build ou credenciais.</p>{!!files.length&&<ul className="upload-file-list" aria-label="Arquivos selecionados">{files.map(file=><li key={file.path}>{file.path}</li>)}</ul>}<button className="primary" disabled={!status.githubConfigured||!status.courseFolders[courseId]||!files.length||!!busy}><Upload size={16}/>{busy==='upload'?'Publicando entrega…':'Enviar e publicar no GitHub'}</button><p className="assistant-caption">Os arquivos vão para uma nova subpasta do curso em um único commit. As entregas existentes permanecem preservadas.</p>{result&&<div className="publish-success" role="status"><CheckCircle2 size={18}/><a href={result.url} target="_blank" rel="noopener noreferrer">Publicação concluída · ver commit {result.sha.slice(0,7)}</a></div>}</form></div>
    {error&&<p className="error" role="alert">{error}</p>}
  </section>;
}
