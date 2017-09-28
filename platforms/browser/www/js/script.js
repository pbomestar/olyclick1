var game = new Phaser.Game(480, 640, Phaser.CANVAS, null, {preload: preload, create: create, update: update});

var startButton, exitButton, prevButton, nextButton;


function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.spritesheet('startBtn', 'img/start12.png', 100, 35);
    game.load.spritesheet('exitBtn', 'img/exit12.png', 150, 50);
    game.load.spritesheet('prevnextBtn', 'img/prevnext.png', 70, 50);
}
function create() {
    startButton = game.add.button(game.world.width*0.5, game.world.height*0.3, 'startBtn', startGame, this, 0, 0, 1, 2);
    startButton.anchor.set(0.5);
    exitButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'exitBtn', exitGame, this, 0, 0, 1, 2);
    exitButton.anchor.set(0.5);
	prevButton = game.add.button(game.world.width*0.3, game.world.height*0.7, 'prevnextBtn', prevGame, this, 0, 0, 1, 2);
    prevButton.anchor.set(0.5);
	nextButton = game.add.button(game.world.width*0.7, game.world.height*0.7, 'prevnextBtn', nextGame, this, 0, 0, 2, 1);
    nextButton.anchor.set(0.5);
}
function update() {}

function startGame(){
	startButton.kill();
	exitButton.kill();
	prevButton.kill();
	nextButton.kill();
}
function exitGame(){}
function prevGame(){}
function nextGame(){}