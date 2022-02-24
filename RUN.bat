@echo off
cls
color 4
node sharding.js
node databases/backup.js
pause