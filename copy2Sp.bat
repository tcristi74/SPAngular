rem xcopy "Public" "c:\Temp\Public" /d /e /h /i /q /r /s /y
robocopy Public\ Y:\TradingJs\Public\ /MIR /COPY:DAT /DCOPY:T
REM Robocopy Public\ c:\Temp\Public1\ /e /b /COPY:DAT /DCOPY:T
ECHO Done
pause

