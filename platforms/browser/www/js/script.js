var game = new Phaser.Game(480, 640, Phaser.CANVAS, null, {preload: preload, create: create, update: update});

var startButton;


function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#eee';
    game.load.spritesheet('startBtn', 'img/start12.png', 200, 35);
}
function create() {
    startButton = game.add.button(game.world.width*0.5, game.world.height*0.3, 'startBtn', startGame, this, 0, 0, 1, 2);
    startButton.anchor.set(0.5);
}
function update() {}

function startGame(){
	startButton.kill();
}