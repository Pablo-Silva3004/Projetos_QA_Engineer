@echo off
setlocal
set AI_PROVIDER=ollama
set GITHUB_MODE=local-git
cd /d "%~dp0Aplication_QA_Monitoring"
where node >nul 2>nul
if errorlevel 1 goto missing_node
if not exist node_modules\vite\bin\vite.js goto missing_dependencies
echo Preparando QA Path local...
node node_modules\typescript\bin\tsc -b
if errorlevel 1 goto failed
node node_modules\vite\bin\vite.js build
if errorlevel 1 goto failed
echo.
echo Abra http://127.0.0.1:8787 no navegador.
echo Mantenha o Ollama aberto para usar o mentor local.
echo Feche esta janela ou use Ctrl+C para encerrar o servidor.
node --env-file-if-exists=.env server/run.mjs
goto end
:missing_node
echo Instale Node.js 22.18 ou superior para iniciar a aplicacao.
goto end
:missing_dependencies
echo Execute npm install dentro de Aplication_QA_Monitoring primeiro.
goto end
:failed
echo Nao foi possivel preparar a aplicacao. Confira a mensagem acima.
:end
pause
