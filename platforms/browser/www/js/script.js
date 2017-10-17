// in create: place create instead of printPieces 
var game = new Phaser.Game(480, 640, Phaser.CANVAS, null, {preload: preload, create: printPieces, update: update});

var playButton, exitButton, levels, prevButton, nextButton, textChoose, textLevel, startButton, backButton, level, maxLevel;

piece = [];
maxLevel = 5;
level = maxLevel;

function preload() {

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.spritesheet('playBtn', 'img/play12.png', 150, 50);
    game.load.spritesheet('exitBtn', 'img/exit12.png', 150, 50);
    game.load.spritesheet('levels', 'img/levels.png', 200, 200);
    game.load.spritesheet('prevBtn', 'img/prev.png', 70, 50);
    game.load.spritesheet('nextBtn', 'img/next.png', 70, 50);
    game.load.spritesheet('startBtn', 'img/start12.png', 150, 50);
    game.load.spritesheet('backBtn', 'img/back12.png', 150, 50);
    game.load.spritesheet('piece', 'img/piece.png', 50, 50);
}
function create() {
    playButton = game.add.button(game.world.width*0.5, game.world.height*0.3, 'playBtn', playGame, this, 0, 0, 1, 2);
    playButton.anchor.set(0.5);
    exitButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'exitBtn', exitGame, this, 0, 0, 1, 2);
    exitButton.anchor.set(0.5);

}
function update() {}

function playGame(){
    playButton.kill();
    exitButton.kill();

    levelImg = game.add.sprite(game.world.width*0.5, game.world.height*0.4, 'levels');
    levelImg.anchor.set(0.5);
    levelImg.frame = maxLevel-1;
	
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

    textLevel = game.add.text(game.world.width*0.5, game.world.height*0.65, level, {
        font: "25px Arial",
        fill: "#ff0044",
        align: "center"
    });
    textLevel.anchor.setTo(0.5);

    startButton = game.add.button(game.world.width*0.5, game.world.height*0.8, 'startBtn', startGame, this, 0, 0, 1, 2);
    startButton.anchor.set(0.5);
    backButton = game.add.button(game.world.width*0.5, game.world.height*0.90, 'backBtn', backGame, this, 0, 0, 1, 2);
    backButton.anchor.set(0.5);
}
function prevGame(){
    level--;
    if (level < 1) level = 1;
    levelImg.frame = level-1;
    textLevel.setText(level);
}
function nextGame(){
    level++;
    if (level > maxLevel) level = maxLevel; 
    levelImg.frame = level-1;
    textLevel.setText(level);
}
function startGame(){
    levelImg.kill();
    prevButton.kill();
    nextButton.kill();
    textChoose.kill();
    textLevel.kill();
    startButton.kill();
    backButton.kill();
    
    printPieces();
}
//function that shows pieces on page for that level
function printPieces(){

pieceInfo = [
    [
        { "left" : 150, "top" : 250, "frame" : 1, "linked"  : [ 0 ]         },
        { "left" : 250, "top" : 250, "frame" : 2, "linked"  : [ 0, 1 ]      }
    ]
]
level = 0;
levelPiecesNum = pieceInfo[level].length;

    for (var i = 0; i < levelPiecesNum; i++){
        piece[i] = game.add.button(pieceInfo[level][i].left, pieceInfo[level][i].top, 'piece', pieceClick.bind(this, i), this); 
        piece[i].frame = pieceInfo[level][i].frame;
        piece[i].anchor.set(0.5);
    }
}

function backGame(){
    levelImg.kill();
    prevButton.kill();
    nextButton.kill();
    textChoose.kill();
    textLevel.kill();
    startButton.kill();
    backButton.kill();
    playButton.revive();
    exitButton.revive();
}

function pieceClick(pieceNum){
    for (var i = 0; i < pieceInfo[level][pieceNum].linked.length; i++) {
        tempPieceNum = pieceInfo[level][pieceNum].linked[i];
        piece[tempPieceNum].frame = piece[tempPieceNum].frame + 1;
    };
    isSolved();
}
function isSolved(){
    var solved = 1;
    for (var i = 0; i < levelPiecesNum; i++) {
        if(piece[i].frame != 0) solved = 0;
    };
    if (solved == 1){
        console.log("Solved");
    } else {
        console.log("NOT solved");
    }

}

function exitGame(){}
