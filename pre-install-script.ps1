taskkill /im node.exe /F;
cd C:\deployment;
Remove-Item c:\deployment\* -Recurse -Force
exit;

