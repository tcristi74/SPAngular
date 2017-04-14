rem xcopy "Public" "\\pwxuat\davwwwroot\teamsites\trading\Deals\SiteAssets\TradingJs\Public" /d /e /h /i /q /r /s /y
rem xcopy "Public" "c:\Temp\Public" /d /e /h /i /q /r /s /y
robocopy Public\ X:\TradingJs\Public\ /MIR /COPY:DAT /DCOPY:T

ECHO Done
pause

