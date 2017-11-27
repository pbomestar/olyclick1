//////////////////////////////////////////////////////////////////////
////////// Global vars
//////////////////////////////////////////////////////////////////////


var game, playButton, exitButton, levelPrev, level, prevButton, nextButton, textChoose, textLevel, textCongrat, startButton, backOneButton, level, maxLevel;
var piece = [];
var pieceInfo = [];

getPieceInfo();

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
    game.load.spritesheet('exitBtn', 'img/exit12.png', 150, 80);
    game.load.spritesheet('levelPrev', 'img/levels.png', 300, 300);
    game.load.spritesheet('prevBtn', 'img/left12.png', 73, 76);
    game.load.spritesheet('nextBtn', 'img/right12.png', 73, 76);
    game.load.spritesheet('startBtn', 'img/start12.png', 150, 80);
    game.load.spritesheet('backOneBtn', 'img/back12.png', 150, 80);
    game.load.spritesheet('nextLevelBtn', 'img/next12.png', 150, 80);
    game.load.spritesheet('backTwoBtn', 'img/back12.png', 150, 80);
    game.load.spritesheet('piece', 'img/pieces.png', 70, 70);

    game.load.bitmapFont('bomicsans', 'font/bomicSans.png', 'font/bomicSans.fnt');
    getLevel1();
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
    
    prevButton = game.add.button(game.world.width*0.3, game.world.height-200, 'prevBtn', prevGame, this, 0, 0, 1, 2);
    prevButton.anchor.set(0.5);
    nextButton = game.add.button(game.world.width*0.7, game.world.height-200, 'nextBtn', nextGame, this, 0, 0, 1, 2);
    nextButton.anchor.set(0.5);

    // Text
    textChoose = game.add.bitmapText(game.world.width*0.5, game.world.height*0.1, 'bomicsans', 'Choose a Level', 35);
    textChoose.anchor.setTo(0.5);

    textLevel = game.add.bitmapText(game.world.width*0.5, game.world.height-200, 'bomicsans', level+1, 40);
    // textLevel.setText(level+1);
    textLevel.anchor.setTo(0.5);

    startButton = game.add.button(3/5*(game.world.width-300)+150+75, game.world.height-40, 'startBtn', startGame, this, 0, 0, 1, 2);
    startButton.anchor.set(0.5);
    backOneButton = game.add.button(2/5*(game.world.width-300)+75, game.world.height-40, 'backOneBtn', backOne, this, 0, 0, 1, 2);
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

    nextLevelButton = game.add.button(3/5*(game.world.width-300)+150+75, game.world.height-40, 'nextLevelBtn', nextLevel, this, 0, 0, 1, 2);
    nextLevelButton.anchor.set(0.5);
    toggleNextBtn();

    backTwoButton = game.add.button(2/5*(game.world.width-300)+75, game.world.height-40, 'backTwoBtn', gameMenu, this, 0, 0, 1, 2);
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
    var pieceTemp = piece[pieceNum];
    var tweenDown = game.add.tween(pieceTemp).to( { y: '+7' }, 15, Phaser.Easing.Linear.None, true);

    tweenDown.onComplete.add( function(){
        game.add.tween(pieceTemp).to( { y: '-7' }, 20, Phaser.Easing.Linear.None, true);
    });


    for (var i = 0; i < pieceInfo[level][pieceNum].linked.length; i++) {
        tempPieceNum = pieceInfo[level][pieceNum].linked[i];
        piece[tempPieceNum-1].frame = piece[tempPieceNum-1].frame + 1;
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
        if( (typeof pieceInfo[level+1] !== 'undefined') && (level == maxLevel
            ) ) {
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


function getPieceInfo(){
    pieceInfo = [
        //////////////////////////////////  1  //////////////////////////////////
        [
            { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 1 ]         },
        ],
        //////////////////////////////////  2  //////////////////////////////////
        [
            { "left" : 180, "top" : 300, "frame" : 1, "linked"  : [ 1 ]         },
            { "left" : 300, "top" : 300, "frame" : 2, "linked"  : [ 1, 2 ]      }
        ],
        //////////////////////////////////  3a  //////////////////////////////////
        [
            { "left" : 120, "top" : 280, "frame" : 1, "linked"  : [ 1, 2 ]      },
            { "left" : 240, "top" : 280, "frame" : 2, "linked"  : [ 2 ]   },
            { "left" : 360, "top" : 280, "frame" : 1, "linked"  : [ 3, 2 ]      }
        ],
        //////////////////////////////////  3  //////////////////////////////////
        [
            { "left" : 240, "top" : 240, "frame" : 0, "linked"  : [ 1, 3 ]      },
            { "left" : 170, "top" : 360, "frame" : 1, "linked"  : [ 2, 1 ]      },
            { "left" : 310, "top" : 360, "frame" : 2, "linked"  : [ 3, 2 ]      }
        ],
        //////////////////////////////////  4a  //////////////////////////////////
        [
            { "left" : 120, "top" : 250, "frame" : 2, "linked"  : [ 1, 2 ]      },
            { "left" : 240, "top" : 250, "frame" : 1, "linked"  : [ 2, 1, 3 ]   },
            { "left" : 360, "top" : 250, "frame" : 0, "linked"  : [ 3, 2 ]      },
            { "left" : 240, "top" : 360, "frame" : 1, "linked"  : [ 4, 2 ]      }
        ],
        //////////////////////////////////  4  //////////////////////////////////
        [
            { "left" : 240, "top" : 190, "frame" : 1, "linked"  : [ 1, 2, 3 ]      },
            { "left" : 170, "top" : 280, "frame" : 2, "linked"  : [ 2, 1, 4 ]      },
            { "left" : 310, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 4 ]      },
            { "left" : 240, "top" : 370, "frame" : 0, "linked"  : [ 4, 2, 3 ]      }
        ],
        //////////////////////////////////  5a  //////////////////////////////////
        [
            { "left" : 240, "top" : 180, "frame" : 1, "linked"  : [ 1, 3 ]              },
            { "left" : 120, "top" : 290, "frame" : 2, "linked"  : [ 2, 3 ]              },
            { "left" : 240, "top" : 290, "frame" : 1, "linked"  : [ 3, 1, 2, 4, 5 ]     },
            { "left" : 360, "top" : 290, "frame" : 0, "linked"  : [ 4, 3 ]              },
            { "left" : 240, "top" : 400, "frame" : 1, "linked"  : [ 5, 3 ]              }
        ],
        //////////////////////////////////  5  //////////////////////////////////
        [
            { "left" : 120, "top" : 250, "frame" : 1, "linked"  : [ 1, 4 ]         },
            { "left" : 235, "top" : 250, "frame" : 0, "linked"  : [ 2, 4, 5 ]      },
            { "left" : 350, "top" : 250, "frame" : 2, "linked"  : [ 3, 5 ]         },
            { "left" : 177, "top" : 370, "frame" : 0, "linked"  : [ 4, 1, 2 ]      },
            { "left" : 293, "top" : 370, "frame" : 1, "linked"  : [ 5, 2, 3 ]      }
        ],
        //////////////////////////////////  6  //////////////////////////////////
        [
            { "left" : 180, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 3 ]      },
            { "left" : 300, "top" : 170, "frame" : 2, "linked"  : [ 2, 1, 4 ]      },
            { "left" : 120, "top" : 280, "frame" : 2, "linked"  : [ 3, 1, 5 ]      },
            { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 6 ]      },
            { "left" : 180, "top" : 390, "frame" : 0, "linked"  : [ 5, 3, 6 ]      },
            { "left" : 300, "top" : 390, "frame" : 1, "linked"  : [ 6, 5, 4 ]      }
        ],
        //////////////////////////////////  6b //////////////////////////////////
        [
            { "left" : 235, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
            { "left" : 177, "top" : 280, "frame" : 2, "linked"  : [ 2, 3, 5 ]   },
            { "left" : 293, "top" : 280, "frame" : 1, "linked"  : [ 3, 2, 5 ]   },
            { "left" : 120, "top" : 390, "frame" : 0, "linked"  : [ 4, 2, 5 ]   },
            { "left" : 235, "top" : 390, "frame" : 0, "linked"  : [ 5, 2, 3 ]   },
            { "left" : 350, "top" : 390, "frame" : 2, "linked"  : [ 6, 3, 5 ]   }
        ],
        //////////////////////////////////  6c //////////////////////////////////
        [
            { "left" : 240, "top" : 200, "frame" : 2, "linked"  : [ 1, 3, 4]     },
            { "left" :  90, "top" : 300, "frame" : 1, "linked"  : [ 2, 3 ]       },
            { "left" : 190, "top" : 300, "frame" : 2, "linked"  : [ 3, 1, 2, 6 ] },
            { "left" : 290, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 5, 6 ] },
            { "left" : 390, "top" : 300, "frame" : 2, "linked"  : [ 5, 4 ]       },
            { "left" : 240, "top" : 400, "frame" : 0, "linked"  : [ 6, 3, 4 ]    }
        ],
        //////////////////////////////////  7a  //////////////////////////////////
        [
            { "left" : 240, "top" : 170, "frame" : 2, "linked"  : [ 1, 3]               },
            { "left" : 120, "top" : 280, "frame" : 2, "linked"  : [ 2, 3 ]              },
            { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 3, 1, 2, 4, 6 ]     },
            { "left" : 360, "top" : 280, "frame" : 2, "linked"  : [ 4, 3 ]              },
            { "left" : 120, "top" : 390, "frame" : 1, "linked"  : [ 5, 2, 6 ]           },
            { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 6, 3 ]              },
            { "left" : 360, "top" : 390, "frame" : 0, "linked"  : [ 7, 4, 6 ]           }
        ],
        //////////////////////////////////  7y //////////////////////////////////
        [
            { "left" :  90, "top" : 250, "frame" : 1, "linked"  : [ 1, 5 ]      },
            { "left" : 190, "top" : 250, "frame" : 2, "linked"  : [ 2, 5, 6 ]   },
            { "left" : 290, "top" : 250, "frame" : 0, "linked"  : [ 3, 6, 7 ]   },
            { "left" : 390, "top" : 250, "frame" : 1, "linked"  : [ 4, 7 ]      },
            { "left" : 140, "top" : 350, "frame" : 2, "linked"  : [ 5, 1, 2 ]   },
            { "left" : 240, "top" : 350, "frame" : 1, "linked"  : [ 6, 2, 3 ]   },
            { "left" : 340, "top" : 350, "frame" : 2, "linked"  : [ 7, 3, 4 ]   }
        ],
        //////////////////////////////////  7  //////////////////////////////////
        [
            { "left" : 180, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 3 ]               },
            { "left" : 300, "top" : 170, "frame" : 2, "linked"  : [ 2, 1, 5 ]               },
            { "left" : 120, "top" : 280, "frame" : 2, "linked"  : [ 3, 1, 6 ]               },
            { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 1, 2, 3, 5, 6, 7 ]   },
            { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 7 ]               },
            { "left" : 180, "top" : 390, "frame" : 0, "linked"  : [ 6, 3, 7 ]               },
            { "left" : 300, "top" : 390, "frame" : 1, "linked"  : [ 7, 5, 6 ]               }
        ],
        //////////////////////////////////  7d //////////////////////////////////
        [
            { "left" : 140, "top" : 200, "frame" : 0, "linked"  : [ 1, 3, 4]    },
            { "left" : 340, "top" : 200, "frame" : 2, "linked"  : [ 2, 5, 6]    },
            { "left" :  90, "top" : 300, "frame" : 0, "linked"  : [ 3, 1, 7 ]   },
            { "left" : 190, "top" : 300, "frame" : 2, "linked"  : [ 4, 3, 5 ]   },
            { "left" : 290, "top" : 300, "frame" : 1, "linked"  : [ 5, 4, 6]    },
            { "left" : 390, "top" : 300, "frame" : 1, "linked"  : [ 6, 2, 8 ]   },
            { "left" : 140, "top" : 400, "frame" : 1, "linked"  : [ 7, 3, 4 ]   },
            { "left" : 340, "top" : 400, "frame" : 2, "linked"  : [ 8, 5, 6 ]   }
        ],
        //////////////////////////////////  7b //////////////////////////////////
        [
            { "left" : 235, "top" : 150, "frame" : 2, "linked"  : [ 1, 2, 3 ]   },
            { "left" : 177, "top" : 240, "frame" : 0, "linked"  : [ 2, 1, 4 ]   },
            { "left" : 293, "top" : 240, "frame" : 1, "linked"  : [ 3, 1, 5 ]   },
            { "left" : 120, "top" : 330, "frame" : 1, "linked"  : [ 4, 2, 6 ]   },
            { "left" : 350, "top" : 330, "frame" : 1, "linked"  : [ 5, 3, 7 ]   },
            { "left" : 177, "top" : 420, "frame" : 0, "linked"  : [ 6, 4 ]      },
            { "left" : 293, "top" : 420, "frame" : 2, "linked"  : [ 7, 5 ]      }
        ],
        //////////////////////////////////  7x  //////////////////////////////////
        [
            { "left" : 240, "top" : 140, "frame" : 2, "linked"  : [ 1, 2, 3 ]           },
            { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 2, 1, 4 ]           },
            { "left" : 310, "top" : 210, "frame" : 1, "linked"  : [ 3, 1, 4 ]           },
            { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 3, 5, 6 ]     },
            { "left" : 170, "top" : 350, "frame" : 2, "linked"  : [ 5, 4, 7]            },
            { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 6, 4, 7 ]           },
            { "left" : 240, "top" : 420, "frame" : 2, "linked"  : [ 7, 5, 6 ]           }
        ],
        //////////////////////////////////  8a  //////////////////////////////////
        [
            { "left" : 140, "top" : 170, "frame" : 2, "linked"  : [ 1, 2, 4 ]     },
            { "left" : 240, "top" : 170, "frame" : 2, "linked"  : [ 2, 1, 3 ]     },
            { "left" : 340, "top" : 170, "frame" : 1, "linked"  : [ 3, 2, 5 ]     },
            { "left" : 140, "top" : 280, "frame" : 0, "linked"  : [ 4, 1, 6 ]     },
            { "left" : 340, "top" : 280, "frame" : 2, "linked"  : [ 5, 3, 8 ]     },
            { "left" : 140, "top" : 390, "frame" : 2, "linked"  : [ 6, 4, 7 ]     },
            { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 7, 6, 8 ]     },
            { "left" : 340, "top" : 390, "frame" : 0, "linked"  : [ 8, 5, 7 ]     }
        ],
        //////////////////////////////////  8  //////////////////////////////////
        [
            { "left" : 120, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 4 ]       },
            { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 2, 4, 5 ]       },
            { "left" : 360, "top" : 170, "frame" : 0, "linked"  : [ 3, 2, 5 ]       },
            { "left" : 180, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 7 ]       },
            { "left" : 300, "top" : 280, "frame" : 2, "linked"  : [ 5, 2, 7 ]       },
            { "left" : 120, "top" : 390, "frame" : 2, "linked"  : [ 6, 4, 7 ]       },
            { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 7, 4, 5 ]       },
            { "left" : 360, "top" : 390, "frame" : 0, "linked"  : [ 8, 5, 7 ]       }
        ],
        //////////////////////////////////  9a  //////////////////////////////////
        [
            { "left" : 120, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 4 ]   },
            { "left" : 240, "top" : 120, "frame" : 2, "linked"  : [ 2, 1, 3 ]   },
            { "left" : 360, "top" : 120, "frame" : 0, "linked"  : [ 3, 2 ]      },
            { "left" : 180, "top" : 200, "frame" : 2, "linked"  : [ 4, 1, 5 ]   },
            { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 5, 4, 6 ]   },
            { "left" : 300, "top" : 360, "frame" : 2, "linked"  : [ 6, 5, 9 ]   },
            { "left" : 120, "top" : 440, "frame" : 1, "linked"  : [ 7, 8 ]      },
            { "left" : 240, "top" : 440, "frame" : 2, "linked"  : [ 8, 7, 9 ]   },
            { "left" : 360, "top" : 440, "frame" : 1, "linked"  : [ 9, 6, 8 ]   }
        ],
        //////////////////////////////////  9a1 //////////////////////////////////
        [
            { "left" : 100, "top" : 140, "frame" : 0, "linked"  : [ 1, 3 ]              },
            { "left" : 380, "top" : 140, "frame" : 2, "linked"  : [ 2, 4 ]              },
            { "left" : 170, "top" : 210, "frame" : 1, "linked"  : [ 3, 1, 5 ]           },
            { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 4, 2, 5 ]           },
            { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 5, 3, 4, 6, 7 ]     },
            { "left" : 170, "top" : 350, "frame" : 2, "linked"  : [ 6, 5, 8 ]           },
            { "left" : 310, "top" : 350, "frame" : 1, "linked"  : [ 7, 5, 9 ]           },
            { "left" : 100, "top" : 420, "frame" : 1, "linked"  : [ 8, 6 ]              },
            { "left" : 380, "top" : 420, "frame" : 0, "linked"  : [ 9, 7 ]              }

        ],
        //////////////////////////////////  9a2  //////////////////////////////////
        [
            { "left" : 130, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 3 ]       },
            { "left" : 240, "top" : 170, "frame" : 2, "linked"  : [ 2, 3, 4 ]       },
            { "left" : 130, "top" : 220, "frame" : 0, "linked"  : [ 3, 2, 5 ]       },
            { "left" : 350, "top" : 220, "frame" : 2, "linked"  : [ 4, 2, 5 ]       },
            { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 5, 2, 8 ]       },
            { "left" : 130, "top" : 320, "frame" : 2, "linked"  : [ 6, 5, 8 ]       },
            { "left" : 350, "top" : 320, "frame" : 0, "linked"  : [ 7, 5, 8 ]       },
            { "left" : 240, "top" : 370, "frame" : 1, "linked"  : [ 8, 6, 7 ]       },
            { "left" : 130, "top" : 420, "frame" : 1, "linked"  : [ 9, 6, 8 ]       }
        ],
        //////////////////////////////////  9  //////////////////////////////////
        [
            { "left" : 240, "top" : 140, "frame" : 2, "linked"  : [ 1, 2, 3 ]           },
            { "left" : 170, "top" : 210, "frame" : 1, "linked"  : [ 2, 5 ]              },
            { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 3, 5 ]              },
            { "left" : 100, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 7 ]           },
            { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 5, 1, 4, 6, 9 ]     },
            { "left" : 380, "top" : 280, "frame" : 0, "linked"  : [ 6, 3, 8]            },
            { "left" : 170, "top" : 350, "frame" : 2, "linked"  : [ 7, 5 ]               },
            { "left" : 310, "top" : 350, "frame" : 1, "linked"  : [ 8, 5 ]              },
            { "left" : 240, "top" : 420, "frame" : 1, "linked"  : [ 9, 7, 8 ]           }
        ],
        //////////////////////////////////  20 //////////////////////////////////
        [
            { "left" : 240, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 3 ]       },
            { "left" : 190, "top" : 220, "frame" : 2, "linked"  : [ 2, 1, 4, 5 ]    },
            { "left" : 290, "top" : 220, "frame" : 1, "linked"  : [ 3, 1, 5, 6 ]    },
            { "left" : 140, "top" : 320, "frame" : 0, "linked"  : [ 4, 7, 8 ]       },
            { "left" : 240, "top" : 320, "frame" : 1, "linked"  : [ 5, 8, 9 ]       },
            { "left" : 340, "top" : 320, "frame" : 0, "linked"  : [ 6, 9, 10 ]      },
            { "left" :  90, "top" : 420, "frame" : 1, "linked"  : [ 7, 4, 8 ]       },
            { "left" : 190, "top" : 420, "frame" : 1, "linked"  : [ 8, 4, 5 ]       },
            { "left" : 290, "top" : 420, "frame" : 2, "linked"  : [ 9, 5, 6 ]       },
            { "left" : 390, "top" : 420, "frame" : 1, "linked"  : [ 10, 6, 9 ]      }
        ],
        //////////////////////////////////  21 //////////////////////////////////
        [
            { "left" :  90, "top" : 250, "frame" : 1, "linked"  : [ 1, 2, 5 ]       },
            { "left" : 190, "top" : 250, "frame" : 0, "linked"  : [ 2, 1, 3 ]       },
            { "left" : 290, "top" : 250, "frame" : 1, "linked"  : [ 3, 2, 4 ]       },
            { "left" : 390, "top" : 250, "frame" : 1, "linked"  : [ 4, 3, 8 ]       },
            { "left" :  90, "top" : 350, "frame" : 1, "linked"  : [ 5, 1, 6 ]       },
            { "left" : 190, "top" : 350, "frame" : 2, "linked"  : [ 6, 5, 7 ]       },
            { "left" : 290, "top" : 350, "frame" : 2, "linked"  : [ 7, 6, 8 ]       },
            { "left" : 390, "top" : 350, "frame" : 1, "linked"  : [ 8, 4, 7 ]       }
        ],
        //////////////////////////////////  26 //////////////////////////////////
        [
            { "left" :  200, "top" : 180, "frame" : 0, "linked"  : [ 1, 3, 4 ]          },
            { "left" :  360, "top" : 180, "frame" : 2, "linked"  : [ 2, 1, 4, 6 ]       },
            { "left" :  120, "top" : 260, "frame" : 2, "linked"  : [ 3, 1, 5 ]          },
            { "left" :  280, "top" : 260, "frame" : 2, "linked"  : [ 4, 1, 2, 5, 6 ]    },
            { "left" :  200, "top" : 340, "frame" : 1, "linked"  : [ 5, 3, 4, 7, 8 ]    },
            { "left" :  360, "top" : 340, "frame" : 1, "linked"  : [ 6, 4, 8 ]          },
            { "left" :  120, "top" : 420, "frame" : 1, "linked"  : [ 7, 3, 5, 8 ]       },
            { "left" :  280, "top" : 420, "frame" : 0, "linked"  : [ 8, 5, 6 ]          }
        ],
        //////////////////////////////////  27 //////////////////////////////////
        [
            { "left" : 130, "top" : 200, "frame" : 1, "linked"  : [ 1, 2, 4 ]            },
            { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 3 ]            },
            { "left" : 350, "top" : 200, "frame" : 2, "linked"  : [ 3, 2, 5 ]            },
            { "left" :  80, "top" : 300, "frame" : 2, "linked"  : [ 4, 1, 6 ]            },
            { "left" : 400, "top" : 300, "frame" : 1, "linked"  : [ 5, 3, 8 ]            },
            { "left" : 130, "top" : 400, "frame" : 0, "linked"  : [ 6, 4, 7 ]            },
            { "left" : 240, "top" : 400, "frame" : 2, "linked"  : [ 7, 6, 8 ]            },
            { "left" : 350, "top" : 400, "frame" : 1, "linked"  : [ 8, 5, 7 ]            }
        ],
        //////////////////////////////////  28 //////////////////////////////////
        [
            { "left" : 140, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 4 ]       },
            { "left" : 240, "top" : 120, "frame" : 2, "linked"  : [ 2, 1, 3, 4]     },
            { "left" : 340, "top" : 120, "frame" : 0, "linked"  : [ 3, 2, 4]        },
            { "left" : 240, "top" : 220, "frame" : 2, "linked"  : [ 4, 2, 5 ]       },
            { "left" : 240, "top" : 320, "frame" : 0, "linked"  : [ 5, 4, 7 ]       },
            { "left" : 140, "top" : 420, "frame" : 1, "linked"  : [ 6, 5, 7 ]       },
            { "left" : 240, "top" : 420, "frame" : 1, "linked"  : [ 7, 5, 6, 8 ]    },
            { "left" : 340, "top" : 420, "frame" : 2, "linked"  : [ 8, 5, 7 ]       }
        ],
        //////////////////////////////////  29 //////////////////////////////////
        [
            { "left" : 240, "top" : 150, "frame" : 0, "linked"  : [ 1, 2, 3 ]           },
            { "left" : 160, "top" : 210, "frame" : 2, "linked"  : [ 2, 1, 4]            },
            { "left" : 320, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 4]            },
            { "left" : 240, "top" : 270, "frame" : 1, "linked"  : [ 4, 2, 3, 5, 6 ]     },
            { "left" : 160, "top" : 330, "frame" : 0, "linked"  : [ 5, 4, 7]            },
            { "left" : 320, "top" : 330, "frame" : 2, "linked"  : [ 6, 4, 7]            },
            { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 7, 5, 6, 8, 9]      },
            { "left" : 160, "top" : 450, "frame" : 2, "linked"  : [ 8, 7]               },
            { "left" : 320, "top" : 450, "frame" : 1, "linked"  : [ 9, 7]               }
        ]

    ]
}

function getLevel1(){
    maxLevel = 28;
    level = maxLevel;
}

        // [
        //     { "left" : 177, "top" : 130, "frame" : 1, "linked"  : [ 4, 1, 2 ]      },
        //     { "left" : 293, "top" : 130, "frame" : 1, "linked"  : [ 4, 1, 2 ]      },
            
        //     { "left" : 80,  "top" : 250, "frame" : 1, "linked"  : [ 0, 3 ]         },
        //     { "left" : 160, "top" : 250, "frame" : 0, "linked"  : [ 1, 3, 4 ]      },
        //     { "left" : 240, "top" : 250, "frame" : 2, "linked"  : [ 2, 4 ]         },
        //     { "left" : 320, "top" : 250, "frame" : 0, "linked"  : [ 3, 0, 1 ]      },
        //     { "left" : 400, "top" : 250, "frame" : 1, "linked"  : [ 4, 1, 2 ]      },
            
        //     { "left" : 177, "top" : 370, "frame" : 1, "linked"  : [ 4, 1, 2 ]      },
        //     { "left" : 293, "top" : 370, "frame" : 1, "linked"  : [ 4, 1, 2 ]      }
        // ]

        //         ],
        // //////////////////////////////////  30++ //////////////////////////////////
        // [
        //     { "left" : 190, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 4, 5 ]            },
        //     { "left" : 290, "top" : 200, "frame" : 1, "linked"  : [ 2, 1, 3, 5, 6 ]         },
        //     { "left" : 390, "top" : 200, "frame" : 0, "linked"  : [ 3, 2, 6 ]               },
        //     { "left" : 140, "top" : 300, "frame" : 2, "linked"  : [ 4, 1, 5, 7, 8 ]         },
        //     { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 2, 4, 6, 8, 9 ]   },
        //     { "left" : 340, "top" : 300, "frame" : 2, "linked"  : [ 6, 2, 3, 5, 9 ]         },
        //     { "left" :  90, "top" : 400, "frame" : 1, "linked"  : [ 7, 4, 8 ]               },
        //     { "left" : 190, "top" : 400, "frame" : 0, "linked"  : [ 8, 4, 5, 7, 9 ]         },
        //     { "left" : 290, "top" : 400, "frame" : 2, "linked"  : [ 9, 5, 6, 8 ]            }
        // ],

        //         //////////////////////////////////  29++ //////////////////////////////////
        // [
        //     { "left" : 160, "top" : 120, "frame" : 1, "linked"  : [ 1, 3, 4 ]           },
        //     { "left" : 320, "top" : 120, "frame" : 0, "linked"  : [ 2, 4, 5]            },
        //     { "left" :  80, "top" : 200, "frame" : 0, "linked"  : [ 3, 1, 6 ]           },
        //     { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 4, 1, 2, 6, 7 ]     },
        //     { "left" : 400, "top" : 200, "frame" : 2, "linked"  : [ 5, 2, 7 ]           },
        //     { "left" : 160, "top" : 280, "frame" : 2, "linked"  : [ 6, 3, 4, 8, 9]      },
        //     { "left" : 320, "top" : 280, "frame" : 0, "linked"  : [ 7, 4, 5, 9, 10 ]    },
        //     { "left" :  80, "top" : 360, "frame" : 1, "linked"  : [ 8, 6, 11 ]          },
        //     { "left" : 240, "top" : 360, "frame" : 1, "linked"  : [ 9, 6, 7, 11, 12 ]   },
        //     { "left" : 400, "top" : 360, "frame" : 0, "linked"  : [ 10, 7, 12 ]         },
        //     { "left" : 160, "top" : 440, "frame" : 0, "linked"  : [ 11, 8, 9]           },
        //     { "left" : 320, "top" : 440, "frame" : 2, "linked"  : [ 12, 9, 10]          }
        // ]