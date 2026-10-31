@echo off
powershell.exe -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://127.0.0.1:8787/api/local/stop' -Method Post -Headers @{Origin='http://127.0.0.1:8787'} -TimeoutSec 5 | Select-Object -ExpandProperty message } catch { Write-Output 'O QA Path local ja esta encerrado ou nao esta disponivel.' }"
pause
