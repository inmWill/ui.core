# core UI
Angular Client Framework 

Deployment Process for UI

make sure serviceURIBase is pointing to azure in constants.js

Clear deployment directory (F:\Projects\daedalus\deployments\ui_deploy) of everything except .git 

Switch build path in gulp.config.js
line 27 and 28 switch comments. so build deploy path is active

run serve-build gulp command.

open index.html in build deploy directory and copy out the number following the app.js file 
eg <script src="js/app-4231122695.js"></script>
copy 4231122695

open git
go to build deploy directory
type the folllwing
git add .
git commit -a -m "Version number UID:4231122695" the UID is the number from the app script in index.html
git push


Deployment should start automatically and be active in a few minutes.



