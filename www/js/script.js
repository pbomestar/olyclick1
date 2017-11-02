//////////////////////////////////////////////////////////////////////
////////// Global vars
//////////////////////////////////////////////////////////////////////

var game, playButton, exitButton, levelPrev, level, prevButton, nextButton, textChoose, textLevel, textCongrat, startButton, backOneButton, level, maxLevel;
piece = [];

pieceInfo = [
    [
        { "left" : 100, "top" : 250, "frame" : 1, "linked"  : [ 0 ]         },
    ],
    [
        { "left" : 150, "top" : 250, "frame" : 1, "linked"  : [ 0 ]         },
        { "left" : 250, "top" : 250, "frame" : 2, "linked"  : [ 0, 1 ]      }
    ],
    [
        { "left" : 150, "top" : 250, "frame" : 1, "linked"  : [ 0 ]         },
        { "left" : 270, "top" : 350, "frame" : 0, "linked"  : [ 0, 2 ]      },
        { "left" : 320, "top" : 250, "frame" : 2, "linked"  : [ 1, 2 ]      }
    ]
]

/////////////////////////////////////////////
/////// When device is ready
/////////////////////////////////////////////
document.addEventListener("deviceready", onDeviceReady, false);


// Device is ready
function onDeviceReady() {
    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(populateDB, errorCB, successCB);
    game = new Phaser.Game(480, 640, Phaser.CANVAS, null, {preload: preload, create: create, update: update}, true);
} 

////////////////////////////////////////////////////////////////////////
////////////   DB Section
////////////////////////////////////////////////////////////////////////

// Populate the database 
function populateDB(tx) {
     // tx.executeSql('DROP TABLE IF EXISTS olyclick');
     tx.executeSql('CREATE TABLE IF NOT EXISTS olyclick (id unique DEFAULT 1, level DEFAULT 0)');
}
function errorCB(err) {
    alert("Error processing SQL: "+err.message);
}
function successCB() {}


/////////////////////////////////////////////////////
///////////// Phaser functions
/////////////////////////////////////////////////////

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.spritesheet('playBtn', 'img/play12.png', 170, 88);
    game.load.spritesheet('exitBtn', 'img/exit14.png', 170, 88);
    game.load.spritesheet('levelPrev', 'img/levels.png', 200, 200);
    game.load.spritesheet('prevBtn', 'img/prev.png', 70, 50);
    game.load.spritesheet('nextBtn', 'img/next.png', 70, 50);
    game.load.spritesheet('startBtn', 'img/start12.png', 170, 88);
    game.load.spritesheet('backOneBtn', 'img/back12.png', 170, 88);
    game.load.spritesheet('nextLevelBtn', 'img/nextlevel12.png', 150, 50);
    game.load.spritesheet('backTwoBtn', 'img/back12.png', 170, 88);
    game.load.spritesheet('piece', 'img/piece.png', 50, 50);
    getLevel();
}
function create() {
    playButton = game.add.button(game.world.width*0.5, game.world.height*0.6, 'playBtn', playGame, this, 0, 0, 1, 2);
    playButton.anchor.set(0.5);
    exitButton = game.add.button(game.world.width*0.5, game.world.height*0.8, 'exitBtn', exitGame, this, 0, 0, 1, 2);
    exitButton.anchor.set(0.5);
}
function update() {}


//////////////////////////////////
///// DB operations
/////////////////////////////////

function getLevel(){
    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(queryDB, errorCB);
}
function queryDB(tx){
    tx.executeSql('SELECT * FROM olyclick', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var lev = results.rows.item(0).level;
    maxLevel = lev;
    level = maxLevel;
}
// Set new maxlevel that player achieved
function setNewMaxLevel(){
    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(writeDB, errorCB);
}
function writeDB(tx){
     tx.executeSql('UPDATE olyclick SET level = ' + maxLevel + ' WHERE id = 1;');
}

////////////////////////////////////////////////////
//////// Functions
////////////////////////////////////////////////////

function playGame(){

    if(typeof playButton !== 'undefined') playButton.kill();
    if(typeof exitButton !== 'undefined') exitButton.kill();
    if(typeof backTwoButton !== 'undefined') backTwoButton.kill();
    if(typeof nextLevelButton !== 'undefined') nextLevelButton.kill();
 
    levelImg = game.add.sprite(game.world.width*0.5, game.world.height*0.4, 'levelPrev');
    levelImg.anchor.set(0.5);
    levelImg.frame = level;
    
    prevButton = game.add.button(game.world.width*0.3, game.world.height*0.65, 'prevBtn', prevGame, this, 0, 0, 1, 2);
    prevButton.anchor.set(0.5);
    nextButton = game.add.button(game.world.width*0.7, game.world.height*0.65, 'nextBtn', nextGame, this, 0, 0, 1, 2);
    nextButton.anchor.set(0.5);
    textChoose = game.add.text(game.world.width*0.5, game.world.height*0.2, "Choose a game level:", {
        font: "25px Arial",
        fill: "#ff0044",
        align: "center"
    });
    textChoose.anchor.setTo(0.5);

    textLevel = game.add.text(game.world.width*0.5, game.world.height*0.65, level+1, {
        font: "25px Arial",
        fill: "#ff0044",
        align: "center"
    });
    textLevel.anchor.setTo(0.5);

    startButton = game.add.button(game.world.width*0.5, game.world.height*0.75, 'startBtn', startGame, this, 0, 0, 1, 2);
    startButton.anchor.set(0.5);
    backOneButton = game.add.button(game.world.width*0.5, game.world.height*0.9, 'backOneBtn', backOne, this, 0, 0, 1, 2);
    backOneButton.anchor.set(0.5);
}
function prevGame(){
    level--;
    if (level < 0) level = 0;
    levelImg.frame = level;
    textLevel.setText(level+1);
}
function nextGame(){
    level++;
    if (level > maxLevel) level = maxLevel; 
    levelImg.frame = level;
    textLevel.setText(level+1);
}
function startGame(){
    levelImg.kill();
    prevButton.kill();
    nextButton.kill();
    textChoose.kill();
    textLevel.kill();
    startButton.kill();
    backOneButton.kill();
    
    printPieces();

    nextLevelButton = game.add.button(game.world.width*0.5, game.world.height*0.8, 'nextLevelBtn', nextLevel, this, 0, 0, 1, 2);
    nextLevelButton.anchor.set(0.5);
    toggleNextBtn();

    backTwoButton = game.add.button(game.world.width*0.5, game.world.height*0.9, 'backTwoBtn', gameMenu, this, 0, 0, 1, 2);
    backTwoButton.anchor.set(0.5);
}

function toggleNextBtn(){
    if (nextLevelButton.alpha != 1) {
        nextLevelButton.alpha = 1;
        nextLevelButton.inputEnabled = true;
    } else {
        nextLevelButton.alpha = 0.4;
        nextLevelButton.inputEnabled = false;
    }
}
function gameMenu(){
    removePieces();
    playGame();
}
//function that shows pieces on page for that levels
function printPieces(){
    if(typeof pieceInfo[level] !== 'undefined') {
        levelPiecesNum = pieceInfo[level].length;
        for (var i = 0; i < levelPiecesNum; i++){
            piece[i] = game.add.button(pieceInfo[level][i].left, pieceInfo[level][i].top, 'piece', pieceClick.bind(this, i), this); 
            piece[i].frame = pieceInfo[level][i].frame;
            piece[i].anchor.set(0.5);
        }
    } else {
        textCongrat = game.add.text(game.world.width*0.5, game.world.height*0.5, "Wow, good job, you've done it all!\nYour brain deserves some rest now.", {
            font: "25px Arial",
            fill: "#ff0044",
            align: "center"
        });
        textCongrat.anchor.setTo(0.5);        
        nextLevelButton.kill();
    }
}
function removePieces(){
    if(typeof pieceInfo[level] !== 'undefined') {
        levelPiecesNum = pieceInfo[level].length;
        for (var i = 0; i < levelPiecesNum; i++){
            piece[i].kill();
        }
    } else {
        level--;
        textCongrat.kill();
    }
}
function backOne(){
    levelImg.kill();
    prevButton.kill();
    nextButton.kill();
    textChoose.kill();
    textLevel.kill();
    startButton.kill();
    backOneButton.kill();
    playButton.revive();
    exitButton.revive();
}

function pieceClick(pieceNum){
    for (var i = 0; i < pieceInfo[level][pieceNum].linked.length; i++) {
        tempPieceNum = pieceInfo[level][pieceNum].linked[i];
        piece[tempPieceNum].frame = piece[tempPieceNum].frame + 1;
    };
    isSolved(pieceNum);
}
function isSolved(pieceNum){
    var solved = 1;
    for (var i = 0; i < levelPiecesNum; i++) {
        if(piece[i].frame != 0) solved = 0;
    }
    if (solved == 1){
        console.log("Solved");
                
        for (var i = 0; i < levelPiecesNum; i++) {
            piece[i].inputEnabled = false;
        }
        if(typeof pieceInfo[level+1] !== 'undefined') {
            maxLevel = level + 1;
            setNewMaxLevel();
        }
        toggleNextBtn()
    } else {
        console.log("NOT solved");
    }
}
function nextLevel(){
    removePieces(); 
    level++; 
    printPieces();
    toggleNextBtn();
}

function exitGame(){
    navigator.app.exitApp();
}
