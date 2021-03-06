//////////////////////////////////////////////////////////////////////
////////// Global vars
//////////////////////////////////////////////////////////////////////


var game, canvasWidth, easyButton, hardButton, exitButton, soundButton, timerEvent, mode, pieceSprite, level, levelEasy, levelHard, maxLevel, maxLevelEasy, maxLevelHard, isEasyDone, levelPreview, prevButton, nextButton, textChoose, textLevel, textCongrat, startButton, backOneButton, backTwoButton;

// mode - if 0 then Easy mode is chosen, 1 is for Hard mode.

canvasWidth = 550;
canvasHeight = 700;

// var volumeIndex = 0.3;

var piece = [];
var coordEasy = [];
var coordHard = [];
var pieceInfo = [];

var isPendingInterstitial = false;
var isAutoshowInterstitial = false;



/////////////////////////////////////////////
/////// When device is ready
/////////////////////////////////////////////
document.addEventListener("deviceready", onDeviceReady, false); 


// Device is ready
function onDeviceReady() {

    document.removeEventListener('deviceready', onDeviceReady, false);

    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(populateDB, errorCB, successCB);

    // // Set AdMobAds options:
    // admob.setOptions({
    //     publisherId:          "ca-app-pub-7640889923036942/3789305112",  // Required
    //     interstitialAdId:     "ca-app-pub-7640889923036942/4603400126",
    //     adSize:               admob.AD_SIZE.SMART_BANNER,
    //     bannerAtTop:          true,
    //     autoShowBanner:       true,
    //     overlap:              true,
    //     isTesting:            true
    // });
    // // For testing purposes - check if ads are working
    // // isTesting:            true

    // document.addEventListener(admob.events.onAdLoaded, onAdLoadedEvent);
    
    // admob.createBannerView();
    // prepareInterstitialAd();

    game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.CANVAS, null, {preload: preload, create: create, update: update}, true);

} 

// function prepareInterstitialAd() {
//     if (!isPendingInterstitial) { // We won't ask for another interstitial ad if we already have an available one
//         admob.requestInterstitialAd({
//             autoShowInterstitial: isAutoshowInterstitial
//         });
//     }
// }
// function onAdLoadedEvent(e) {
//     if (e.adType === admob.AD_TYPE.INTERSTITIAL && !isAutoshowInterstitial) {
//         isPendingInterstitial = true;
//     }
// }
// function showInterstitialAd() {
//     if (isPendingInterstitial) {
//         admob.showInterstitialAd(function () {
//                 isPendingInterstitial = false;
//                 isAutoshowInterstitial = false;
//                 prepareInterstitialAd();
//         });
//     } else {
//         // The interstitial is not prepared, so in this case, we want to show the interstitial as soon as possible
//         isAutoshowInterstitial = true;
//         admob.requestInterstitialAd({
//             autoShowInterstitial: isAutoshowInterstitial
//         });
//     }
// }

////////////////////////////////////////////////////////////////////////
////////////   DB Section
////////////////////////////////////////////////////////////////////////

// Populate the database 
function populateDB(tx) {
     // tx.executeSql('DROP TABLE IF EXISTS olyclick;');
     tx.executeSql('CREATE TABLE IF NOT EXISTS olyclick (id INT primary key, levelEasy REAL, levelHard REAL, isEasyDone REAL, volumeIndex REAL);');
     // tx.executeSql('INSERT INTO olyclick (id, level) VALUES (1, 0);');
}
function errorCB(err) {
    // alert("Error processing SQL: "+err.message);
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

    // Load graphics
    game.load.spritesheet('olylogo',        'img/olylogo.png', 308, 210);
    // game.load.spritesheet('playBtn',     'img/play12.png', 170, 88);
    game.load.spritesheet('easyBtn',        'img/easy12.png', 170, 88);
    game.load.spritesheet('hardBtn',        'img/hard12.png', 170, 88);
    game.load.spritesheet('exitBtn',        'img/exit12.png', 150, 80);
    game.load.spritesheet('soundBtn',       'img/soundBtn.png', 70, 70);
    game.load.spritesheet('levelsEasy',     'img/levels.png', 300, 300);
    game.load.spritesheet('levelsHard',     'img/levels.png', 300, 300);
    game.load.spritesheet('prevBtn',        'img/left12.png', 73, 76);
    game.load.spritesheet('nextBtn',        'img/right12.png', 73, 76);
    game.load.spritesheet('startBtn',       'img/start12.png', 150, 80);
    game.load.spritesheet('backOneBtn',     'img/back12.png', 150, 80);
    game.load.spritesheet('nextLevelBtn',   'img/next12.png', 150, 80);
    game.load.spritesheet('backTwoBtn',     'img/back12.png', 150, 80);
    game.load.spritesheet('pieceEasy',      'img/pieceEasy.png', 70, 70);
    game.load.spritesheet('pieceHard',      'img/pieceHard.png', 70, 70);

    // Load sounds
    game.load.audio('btnClick', 'audio/btnclick.mp3');
    game.load.audio('goFwd', 'audio/goFwd.mp3');
    game.load.audio('goBack', 'audio/goBack.mp3');
    game.load.audio('setLevel', 'audio/setLevel.mp3');
    game.load.audio('clickPiece', 'audio/clickPiece.mp3');
    game.load.audio('levelDone', 'audio/levelDone.mp3');
    game.load.audio('congratsEazy', 'audio/congratsEazy.mp3');
    game.load.audio('congratsHard', 'audio/congratsHard.mp3');

    game.load.bitmapFont('bomicsans', 'font/bomicSans.png', 'font/bomicSans.fnt');
    getLevel();
}
function create() {
    olylogo = game.add.sprite(game.world.width*0.5, game.world.height*0, 'olylogo');
    olylogo.anchor.set(0.5, 0);
     
    easyButton = game.add.button(game.world.width*0.5, game.world.height*0.57, 'easyBtn', playEasy, this, 0, 0, 1, 2);
    easyButton.anchor.set(0.5);
    hardButton = game.add.button(game.world.width*0.5, game.world.height*0.75, 'hardBtn', playHard, this, 0, 0, 1, 2);
    hardButton.anchor.set(0.5);
    unlockHardBtn();
    exitButton = game.add.button(game.world.width*0.5, game.world.height, 'exitBtn', exitGame, this, 0, 0, 1, 2);
    exitButton.anchor.set(0.5, 1);

    soundButton = game.add.button(game.world.width*0.8, game.world.height*0.99, 'soundBtn', changeVolume, this);
    soundButton.anchor.set(0.5, 1);

    // Defining audio objects
    goFwd = game.add.audio('goFwd');
    goBack = game.add.audio('goBack');
    setLevel = game.add.audio('setLevel');
    clickPiece = game.add.audio('clickPiece');
    levelDone = game.add.audio('levelDone');
    congratsEazy = game.add.audio('congratsEazy');
    congratsHard = game.add.audio('congratsHard');

}
// Audio functions
function goFwdSound(){
    goFwd.volume = 0.4 * volumeIndex;
    goFwd.play();    
}
function goBackSound(){
    goBack.volume = 0.4 * volumeIndex;
    goBack.play();    
}
function setLevelSound(){
    setLevel.volume = 0.25 * volumeIndex;
    setLevel.play();    
}
function clickPieceSound(){
    clickPiece.volume = 0.4 * volumeIndex;
    clickPiece.play();    
}
function levelDoneSound(){
    levelDone.volume = 0.5 * volumeIndex;
    levelDone.play();    
}
function congratsEazySound(){
    congratsEazy.volume = 1 * volumeIndex;
    congratsEazy.play();    
}
function congratsHardSound(){
    congratsHard.volume = 1 * volumeIndex;
    congratsHard.play();    
}

function update() {

    // if (!game.input.activePointer.isDown) {
    //     stopLevelDown();
    // }

}


//////////////////////////////////
///// DB operations
/////////////////////////////////

function getLevel(){
    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(queryDB);
}
function queryDB(tx){
    tx.executeSql('SELECT * FROM olyclick', [], querySuccess);
}

function querySuccess(tx, results) {
    var levEasy, levHard;

 // alert('results is empty: '+ results.rows.item(0).levelEasy);
 // alert('results.rows length '+ results.rows.length + 'object: ' + JSON.stringify(results));
 

    if (results.rows.length == 0){
        var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
        db.transaction(popul1DB);
        function popul1DB(tx){
            tx.executeSql('INSERT INTO olyclick (id, levelEasy, levelHard, isEasyDone, volumeIndex) VALUES (1, 0, 0, 0, 0.3);');
        }
        levEasy = 0;
        levHard = 0;
        isEasyDone = 0;
        volumeIndex = 0.3;
        maxLevelEasy = levEasy;
        levelEasy = maxLevelEasy;

        maxLevelHard = levHard;
        levelHard = maxLevelHard;
    } else {
        levEasy = results.rows.item(0).levelEasy;
        levHard = results.rows.item(0).levelHard;
        isEasyDone = results.rows.item(0).isEasyDone;
        volumeIndex = results.rows.item(0).volumeIndex;
/// to delete
volumeIndex = 0.3;

// //hardcode
// levEasy = 88;
// levHard = 0;
// isEasyDone = 1;

        maxLevelEasy = levEasy;
        maxLevelHard = levHard;

        // maxLevelEasy = 43;
        // maxLevelHard = 43;
        // isEasyDone = 0;

        levelEasy = maxLevelEasy;
        levelHard = maxLevelHard;

    }
}
// Set new maxLevel that player achieved
function setNewMaxLevel(){
    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(writeLevelDB, errorCB);
}
function writeLevelDB(tx){
    if (mode==0){
        tx.executeSql('UPDATE olyclick SET levelEasy = ' + maxLevel + ' WHERE id = 1;');
    } else {
        tx.executeSql('UPDATE olyclick SET levelHard = ' + maxLevel + ' WHERE id = 1;');
    }
}
// Sets isEasyDone var to 1 and writes it to DB for future logins 
function setEasyDone(){
    isEasyDone = 1; // Easy mode is done and Hard button is to be enabled
    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(writeEasyDoneDB, errorCB);
}
function writeEasyDoneDB(tx){
    tx.executeSql('UPDATE olyclick SET isEasyDone = ' + isEasyDone + ' WHERE id = 1;');
}

// Write volumeIndex to DB for future logins 
function saveVolumeIndex(){
    var db = window.openDatabase("olyclick", "1.0", "Olyclick db", 1000);
    db.transaction(writeVolumeIndexDB, errorCB);
}
function writeVolumeIndexDB(tx){
    tx.executeSql('UPDATE olyclick SET volumeIndex = ' + volumeIndex + ' WHERE id = 1;');
}


////////////////////////////////////////////////////
//////// Functions
////////////////////////////////////////////////////

// Is Hard button to be unlocked
function unlockHardBtn(){
    if ( isEasyDone == 1){
        hardButton.alpha = 1;
        hardButton.inputEnabled = true;
    } else {
        hardButton.alpha = 0.5;
        hardButton.inputEnabled = false;
    }
}
 
// Set Easy or Hard game mode
function playEasy(){
    goFwdSound(); // play sound
    mode = 0;
    pieceSprite = 'pieceEasy';
    level = levelEasy;
    maxLevel = maxLevelEasy;
    levelPreview = 'levelsEasy';
    saveVolumeIndex();
    playGame();
}
function playHard(){
    goFwdSound(); // play sound
    mode = 1;
    pieceSprite = 'pieceHard';
    level = levelHard;
    maxLevel = maxLevelHard;
    levelPreview = 'levelsHard';
    saveVolumeIndex();
    playGame();
}

function changeVolume() {
    if (volumeIndex == 0) {
        volumeIndex = 1;
    } else if (volumeIndex == 0.3) {
        volumeIndex = 0;
    } else {
        volumeIndex = 0.3;
    }
    goFwdSound();
    soundButton.frame++;
}

function playGame(){

// btnClick.play();

    if(typeof easyButton !== 'undefined') easyButton.kill();
    if(typeof hardButton !== 'undefined') hardButton.kill();
    if(typeof exitButton !== 'undefined') exitButton.kill();
    if(typeof soundButton !== 'undefined') soundButton.kill();
    
    if(typeof olylogo !== 'undefined') olylogo.kill();
    
    if(typeof backTwoButton !== 'undefined') backTwoButton.kill();
    if(typeof nextLevelButton !== 'undefined') nextLevelButton.kill();
 
    // Adding coordinates for pieces for selected mode
    getPieceInfo();

    levelImg = game.add.sprite(game.world.width*0.5, game.world.height*0.4, levelPreview);
    levelImg.anchor.set(0.5);
    levelImg.frame = level;
    
    prevButton = game.add.button(game.world.width*0.25, game.world.height-200, 'prevBtn', prevGame, this, 0, 0, 1, 2);
    prevButton.anchor.set(0.5);
    nextButton = game.add.button(game.world.width*0.75, game.world.height-200, 'nextBtn', nextGame, this, 0, 0, 1, 2);
    nextButton.anchor.set(0.5);



    // Text
    textChoose = game.add.bitmapText(game.world.width*0.5, game.world.height*0.1, 'bomicsans', 'Choose a Level', 35);
    textChoose.anchor.setTo(0.5);

    textLevel = game.add.bitmapText(game.world.width*0.5, game.world.height-197, 'bomicsans', (level+1) + "/100" , 38);
    // textLevel.setText(level+1);
    textLevel.anchor.setTo(0.5);

    startButton = game.add.button(3/5*(game.world.width-300)+150+75, game.world.height-40, 'startBtn', startGame, this, 0, 0, 1, 2);
    startButton.anchor.set(0.5);
    backOneButton = game.add.button(2/5*(game.world.width-300)+75, game.world.height-40, 'backOneBtn', backOne, this, 0, 0, 1, 2);
    backOneButton.anchor.set(0.5);

}

// Start setting level down. Timer waits for 200ms if holding it and then counting levels down
function levelDown(){
    game.time.events.add(200, loopLevelDown, this);
}

// 200ms to wait for timer to start, then looping level down every 100ms
function loopLevelDown(){
    timerEvent = game.time.events.loop(100, prevGame, this);
}
// Brake level down loop when releasing the button
function stopLevelDown(){
    game.time.events.remove(timerEvent);
}

function prevGame(){
    setLevelSound(); // play set level sound
    level--;
    if (level < 0) level = 0;
    levelImg.frame = level;
    textLevel.setText((level+1) + "/100");
}
function nextGame(){
    setLevelSound(); // play set level sound
    level++;
    if (level > maxLevel) level = maxLevel; 
    levelImg.frame = level;
    textLevel.setText((level+1) + "/100");
}
function startGame(){
    goFwdSound(); // play sound
    levelImg.kill();
    prevButton.kill();
    nextButton.kill();
    textChoose.kill();
    textLevel.kill();
    startButton.kill();
    backOneButton.kill();
    
    printPieces();
    showLevel();

    nextLevelButton = game.add.button(3/5*(game.world.width-300)+150+75, game.world.height-40, 'nextLevelBtn', nextLevel, this, 0, 0, 1, 2);
    nextLevelButton.anchor.set(0.5);
    toggleNextBtn();

    backTwoButton = game.add.button(2/5*(game.world.width-300)+75, game.world.height-40, 'backTwoBtn', gameMenu, this, 0, 0, 1, 2);
    backTwoButton.anchor.set(0.5);

backTwoButton.events.onInputDown.add(clickSound, this);


    showInterstitialAd();
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
    goBackSound(); // play goBack sound
    removePieces();
    showLvl.kill();
    playGame();
}
//function that shows pieces on page for that levels
function printPieces(){
    if(typeof pieceInfo[level] !== 'undefined') {
        if (mode == 0) {
            // in case of easy mode show easy intro messages
            if (level == 0) {
                textLevel11 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "Meet Oly. He is sad now.", 25);
                textLevel11.anchor.setTo(0.5);
                textLevel12 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "Make him happy - tap", 25);
                textLevel12.anchor.setTo(0.5);
                textLevel13 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "him and try to change", 25);
                textLevel13.anchor.setTo(0.5);
                textLevel14 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "his color to blue", 25);
                textLevel14.anchor.setTo(0.5);
            };
            if (level == 1){
                textLevel21 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "Now you have two Olys.", 25);
                textLevel21.anchor.setTo(0.5);
                textLevel22 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "Find out which one can", 25);
                textLevel22.anchor.setTo(0.5);
                textLevel23 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "change another one and", 25);
                textLevel23.anchor.setTo(0.5);
                textLevel24 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "make them both happy", 25);
                textLevel24.anchor.setTo(0.5);    
            };
            if (level == 2){
                textLevel31 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "Here are more Olys.", 25);
                textLevel31.anchor.setTo(0.5);
                textLevel32 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "Again, they are connected.", 25);
                textLevel32.anchor.setTo(0.5);
                textLevel33 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "You need to understand how", 25);
                textLevel33.anchor.setTo(0.5);
                textLevel34 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "and to make them all smile", 25);
                textLevel34.anchor.setTo(0.5);
            };
            if (level == 3){
                textLevel41 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "Olys are comming in", 25);
                textLevel41.anchor.setTo(0.5);
                textLevel42 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "more complex patterns.", 25);
                textLevel42.anchor.setTo(0.5);
                textLevel43 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "Find who changes whom", 25);
                textLevel43.anchor.setTo(0.5);
                textLevel44 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "and cheer them all up", 25);
                textLevel44.anchor.setTo(0.5);    
            };
            if (level == 4){
                textLevel51 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "From now on ", 25);
                textLevel51.anchor.setTo(0.5);
                textLevel52 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "you are on your own.", 25);
                textLevel52.anchor.setTo(0.5);
                textLevel53 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "Let's put smiles", 25);
                textLevel53.anchor.setTo(0.5);
                textLevel54 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "on those faces :)", 25);
                textLevel54.anchor.setTo(0.5);
            };
        } else {
            //in case of hard mode  
            if (level == 0) {
                textLevelHard11 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "Meet Oly again.", 25);
                textLevelHard11.anchor.setTo(0.5);
                textLevelHard12 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "He is the same old Oly", 25);
                textLevelHard12.anchor.setTo(0.5);
                textLevelHard13 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "but now he has more moods.", 25);
                textLevelHard13.anchor.setTo(0.5);
                textLevelHard14 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "Try to make him smile :)", 25);
                textLevelHard14.anchor.setTo(0.5);
            };              
            if (level == 1){
                textLevelHard21 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "Two Olys, three moods.", 25);
                textLevelHard21.anchor.setTo(0.5);
                textLevelHard22 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "They are bound again.", 25);
                textLevelHard22.anchor.setTo(0.5);
                textLevelHard23 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "Go ahead and find", 25);
                textLevelHard23.anchor.setTo(0.5);
                textLevelHard24 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "the solution.", 25);
                textLevelHard24.anchor.setTo(0.5);    
            };
            if (level == 2){
                textLevelHard31 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.2, 'bomicsans', "More and more Olys", 25);
                textLevelHard31.anchor.setTo(0.5);
                textLevelHard32 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.26, 'bomicsans', "are having mixed emotions.", 25);
                textLevelHard32.anchor.setTo(0.5);
                textLevelHard33 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.32, 'bomicsans', "Let's see if you can make", 25);
                textLevelHard33.anchor.setTo(0.5);
                textLevelHard34 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.38, 'bomicsans', "all of them happy :)", 25);
                textLevelHard34.anchor.setTo(0.5);
            };
        }

        levelPiecesNum = pieceInfo[level].length;
        // +80 because of shifting all levels down a little bit (easier than chaniging all coordinates)
        for (var i = 0; i < levelPiecesNum; i++){
            piece[i] = game.add.button(pieceInfo[level][i].left + (canvasWidth - 480)/2, pieceInfo[level][i].top+80, pieceSprite, pieceClick.bind(this, i), this); 
            piece[i].frame = pieceInfo[level][i].frame;
            piece[i].anchor.set(0.5);
        }
    } else {
        textCongrat1 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.3, 'bomicsans', "CONGRATULATIONS!", 30);
        textCongrat1.anchor.setTo(0.5);
        if (mode == 0){
            congratsEazySound(); // play congratsEazy sound
            if (isEasyDone == 0) {
                setEasyDone();
            }
            textCongrat2 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.45, 'bomicsans', "Now you are ready", 30);
            textCongrat2.anchor.setTo(0.5);
            textCongrat3 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.54, 'bomicsans', "for tougher challenges!", 30);
            textCongrat3.anchor.setTo(0.5);
        } else {
            congratsHardSound(); // play congratsHard sound
            textCongrat2 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.45, 'bomicsans', "Your brain works", 30);
            textCongrat2.anchor.setTo(0.5);
            textCongrat3 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.54, 'bomicsans', "like a Swiss watch!", 30);
            textCongrat3.anchor.setTo(0.5);
        }
        // textCongrat3 = game.add.bitmapText(game.world.width*0.5, game.world.height*0.7, 'bomicsans', "Your key: " + getCode(), 23);
        // textCongrat3.anchor.setTo(0.5);
    }
}
// show the current level
function showLevel(){
    showLvl = game.add.bitmapText(game.world.width*0.5, game.world.height*0.07, 'bomicsans', "Level " + (level+1), 35);
    showLvl.anchor.setTo(0.5);
}
function getCode(){
    return Math.round(Math.random()*900+99)*6907 + 7*7919;
}
function removePieces(){
    if(typeof pieceInfo[level] !== 'undefined') {
        levelPiecesNum = pieceInfo[level].length;
        for (var i = 0; i < levelPiecesNum; i++){
            piece[i].kill();
        }
        // For easy mode
        if (mode == 0){
            if (level == 0) {
                textLevel11.kill();
                textLevel12.kill();
                textLevel13.kill();
                textLevel14.kill();
            }
            if (level == 1) {
                textLevel21.kill();
                textLevel22.kill();
                textLevel23.kill();
                textLevel24.kill();
            }
            if (level == 2) {
                textLevel31.kill();
                textLevel32.kill();
                textLevel33.kill();
                textLevel34.kill();
            }
            if (level == 3) {
                textLevel41.kill();
                textLevel42.kill();
                textLevel43.kill();
                textLevel44.kill();
            }
            if (level == 4) {
                textLevel51.kill();
                textLevel52.kill();
                textLevel53.kill();
                textLevel54.kill();
            } 
        } else {
            if (level == 0) {
                textLevelHard11.kill();
                textLevelHard12.kill();
                textLevelHard13.kill();
                textLevelHard14.kill();
            }
            if (level == 1) {
                textLevelHard21.kill();
                textLevelHard22.kill();
                textLevelHard23.kill();
                textLevelHard24.kill();
            }
            if (level == 2) {
                textLevelHard31.kill();
                textLevelHard32.kill();
                textLevelHard33.kill();
                textLevelHard34.kill();
            }
        }
    } else {
        level--;                // because you can go to last screen only by clicking on next button which increases level by 1
        textCongrat1.kill();
        textCongrat2.kill();
        textCongrat3.kill();

    }
}
function backOne(){
    goBackSound(); // play goBack sound
    levelImg.kill();
    prevButton.kill();
    nextButton.kill();
    textChoose.kill();
    textLevel.kill();
    startButton.kill();
    backOneButton.kill();
    saveCurrentLevel();
    olylogo.revive();
    easyButton.revive();
    hardButton.revive();
    unlockHardBtn();
    exitButton.revive();
    soundButton.revive();
}
// function for saving current level in case we go back to main manu
function saveCurrentLevel() {
    if (mode == 0){
        levelEasy = level;
        maxLevelEasy = maxLevel;
    } else {
        levelHard = level;
        maxLevelHard = maxLevel;
    }
}

function pieceClick(pieceNum){
    clickPieceSound(); //playSound

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
        // console.log("Solved");
        levelDoneSound(); //play sound
                
        for (var i = 0; i < levelPiecesNum; i++) {
            piece[i].inputEnabled = false;
        }
        if( (typeof pieceInfo[level+1] !== 'undefined') && (level == maxLevel) ) {
            maxLevel = level + 1;
            setNewMaxLevel();
        }
        toggleNextBtn()
    } else {
        // console.log("NOT solved");
    }
}
function nextLevel(){
    goFwdSound(); // play sound
    removePieces(); 
    showLvl.kill();
    level++; 
    printPieces();
    if (level < 100) showLevel();
    toggleNextBtn();
}

function exitGame(){
    goBackSound();
    saveVolumeIndex();
    navigator.app.exitApp();
}
 

function getPieceInfo(){
    if (mode == 0){
        pieceInfo = coordEasy;
    } else {
        pieceInfo = coordHard;
    }
}


/////////////////////////////// Two colors //////////////////////////////////

coordEasy = [
    //////////////////////////////////  1  //////////////////////////////////
    [
        { "left" : 240, "top" : 370, "frame" : 1, "linked"  : [ 1 ]         }
    ],
    //////////////////////////////////  2  //////////////////////////////////
    [
        { "left" : 180, "top" : 370, "frame" : 0, "linked"  : [ 1 ]         },
        { "left" : 300, "top" : 370, "frame" : 1, "linked"  : [ 1, 2 ]      }
    ],
    //////////////////////////////////  3  //////////////////////////////////
    [
        { "left" : 120, "top" : 370, "frame" : 1, "linked"  : [ 1, 2 ]      },
        { "left" : 240, "top" : 370, "frame" : 0, "linked"  : [ 2 ]   },
        { "left" : 360, "top" : 370, "frame" : 1, "linked"  : [ 3, 2 ]      }
    ],
    //////////////////////////////////  4  //////////////////////////////////
    [
        { "left" : 240, "top" : 320, "frame" : 0, "linked"  : [ 1, 3 ]      },
        { "left" : 170, "top" : 440, "frame" : 1, "linked"  : [ 2, 1 ]      },
        { "left" : 310, "top" : 440, "frame" : 1, "linked"  : [ 3, 2 ]      }
    ],
    //////////////////////////////////  5  //////////////////////////////////
    [
        { "left" : 120, "top" : 350, "frame" : 1, "linked"  : [ 1, 2 ]      },
        { "left" : 240, "top" : 350, "frame" : 1, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 360, "top" : 350, "frame" : 1, "linked"  : [ 3, 2 ]      },
        { "left" : 240, "top" : 450, "frame" : 1, "linked"  : [ 4, 2 ]      }
    ],
    //////////////////////////////////  6  //////////////////////////////////
    [
        { "left" : 240, "top" : 190, "frame" : 0, "linked"  : [ 1, 2, 3 ]      },
        { "left" : 170, "top" : 280, "frame" : 0, "linked"  : [ 2, 1, 4 ]      },
        { "left" : 310, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 4 ]      },
        { "left" : 240, "top" : 370, "frame" : 1, "linked"  : [ 4, 2, 3 ]      }
    ],
    //////////////////////////////////  7  //////////////////////////////////
    [
        { "left" : 240, "top" : 180, "frame" : 1, "linked"  : [ 1, 3 ]              },
        { "left" : 120, "top" : 290, "frame" : 0, "linked"  : [ 2, 3 ]              },
        { "left" : 240, "top" : 290, "frame" : 0, "linked"  : [ 3, 1, 2, 4, 5 ]     },
        { "left" : 360, "top" : 290, "frame" : 0, "linked"  : [ 4, 3 ]              },
        { "left" : 240, "top" : 400, "frame" : 0, "linked"  : [ 5, 3 ]              }
    ],
    //////////////////////////////////  8  //////////////////////////////////
    [
        { "left" : 120, "top" : 250, "frame" : 1, "linked"  : [ 1, 4 ]         },
        { "left" : 235, "top" : 250, "frame" : 1, "linked"  : [ 2, 4, 5 ]      },
        { "left" : 350, "top" : 250, "frame" : 1, "linked"  : [ 3, 5 ]         },
        { "left" : 177, "top" : 370, "frame" : 0, "linked"  : [ 4, 1, 2 ]      },
        { "left" : 293, "top" : 370, "frame" : 0, "linked"  : [ 5, 2, 3 ]      }
    ],
//////////////////////////////////  9 NEW  //////////////////////////////////
    [
        { "left" :  420, "top" : 180, "frame" : 1, "linked"  : [ 1, 2 ]         },
        { "left" :  340, "top" : 260, "frame" : 0, "linked"  : [ 2, 1, 4 ]      },
        { "left" :  100, "top" : 340, "frame" : 1, "linked"  : [ 3, 5 ]         },
        { "left" :  260, "top" : 340, "frame" : 0, "linked"  : [ 4, 2, 5 ]      },
        { "left" :  180, "top" : 420, "frame" : 0, "linked"  : [ 5, 3, 4 ]      }
    ],
//////////////////////////////////  10 NEW //////////////////////////////////
    [
        { "left" : 235, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 177, "top" : 280, "frame" : 0, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 293, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 120, "top" : 390, "frame" : 1, "linked"  : [ 4, 2 ]      },
        { "left" : 350, "top" : 390, "frame" : 1, "linked"  : [ 5, 3 ]      }
    ],
//////////////////////////////////  11 NEW //////////////////////////////////
    [
        { "left" :  160, "top" : 180, "frame" : 0, "linked"  : [ 1, 3 ]             },
        { "left" :  320, "top" : 180, "frame" : 0, "linked"  : [ 2, 3 ]             },
        { "left" :  240, "top" : 260, "frame" : 1, "linked"  : [ 3, 1, 2, 4, 5 ]    },
        { "left" :  160, "top" : 340, "frame" : 0, "linked"  : [ 4, 3 ]             },
        { "left" :  320, "top" : 340, "frame" : 0, "linked"  : [ 5, 3 ]             }
    ],

//////////////////////////////////  12 NEW //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 0, "linked"  : [ 1, 2 ]          },
        { "left" : 300, "top" : 170, "frame" : 1, "linked"  : [ 2, 1 ]          },
        { "left" : 180, "top" : 280, "frame" : 1, "linked"  : [ 3, 1, 4, 5 ]    },
        { "left" : 300, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 3, 6 ]    },
        { "left" : 180, "top" : 390, "frame" : 1, "linked"  : [ 5, 6 ]          },
        { "left" : 300, "top" : 390, "frame" : 0, "linked"  : [ 6, 5 ]          }
    ],
    //////////////////////////////////  13 (9)  //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3 ]      },
        { "left" : 300, "top" : 170, "frame" : 1, "linked"  : [ 2, 1, 4 ]      },
        { "left" : 120, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 5 ]      },
        { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 6 ]      },
        { "left" : 180, "top" : 390, "frame" : 1, "linked"  : [ 5, 3, 6 ]      },
        { "left" : 300, "top" : 390, "frame" : 0, "linked"  : [ 6, 5, 4 ]      }
    ],
    //////////////////////////////////  14 (10) //////////////////////////////////
    [
        { "left" : 235, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 177, "top" : 280, "frame" : 0, "linked"  : [ 2, 3, 5 ]   },
        { "left" : 293, "top" : 280, "frame" : 0, "linked"  : [ 3, 2, 5 ]   },
        { "left" : 120, "top" : 390, "frame" : 1, "linked"  : [ 4, 2, 5 ]   },
        { "left" : 235, "top" : 390, "frame" : 0, "linked"  : [ 5, 2, 3 ]   },
        { "left" : 350, "top" : 390, "frame" : 1, "linked"  : [ 6, 3, 5 ]   }
    ],
    //////////////////////////////////  15 (11) //////////////////////////////////
    [
        { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 1, 3, 4]     },
        { "left" :  90, "top" : 300, "frame" : 1, "linked"  : [ 2, 3 ]       },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 3, 1, 2, 6 ] },
        { "left" : 290, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 5, 6 ] },
        { "left" : 390, "top" : 300, "frame" : 1, "linked"  : [ 5, 4 ]       },
        { "left" : 240, "top" : 400, "frame" : 1, "linked"  : [ 6, 3, 4 ]    }
    ],

//////////////////////////////////  16 NEW //////////////////////////////////
    [
        { "left" : 120, "top" : 170, "frame" : 1, "linked"  : [ 1, 3 ]          },
        { "left" : 360, "top" : 170, "frame" : 1, "linked"  : [ 2, 5 ]          },
        { "left" : 120, "top" : 280, "frame" : 1, "linked"  : [ 3, 1, 4 ]       },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 4, 3, 5, 6 ]    },
        { "left" : 360, "top" : 280, "frame" : 1, "linked"  : [ 5, 2, 4 ]       },
        { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 6, 4 ]          }
    ],
//////////////////////////////////  17 NEW //////////////////////////////////
    [
        { "left" : 100, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3 ]    },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 2, 1, 4 ]    },
        { "left" : 170, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 5 ]    },
        { "left" : 310, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 6 ]    },
        { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 5, 3, 6 ]    },
        { "left" : 380, "top" : 390, "frame" : 0, "linked"  : [ 6, 4, 5 ]    }
    ],
//////////////////////////////////  18 NEW  //////////////////////////////////
    [
        { "left" :  140, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" :   80, "top" : 240, "frame" : 0, "linked"  : [ 2, 1 ]      },
        { "left" :  200, "top" : 240, "frame" : 1, "linked"  : [ 3, 1, 4 ]   },
        { "left" :  260, "top" : 340, "frame" : 1, "linked"  : [ 4, 3, 6 ]   },
        { "left" :  380, "top" : 340, "frame" : 0, "linked"  : [ 5, 6 ]      },
        { "left" :  320, "top" : 440, "frame" : 1, "linked"  : [ 6, 4, 5 ]   }
    ],    
//////////////////////////////////  19 NEW //////////////////////////////////
    [
        { "left" :  160, "top" : 150, "frame" : 0, "linked"  : [ 1, 3 ]             },
        { "left" :  320, "top" : 150, "frame" : 0, "linked"  : [ 2, 3 ]             },
        { "left" :  240, "top" : 230, "frame" : 1, "linked"  : [ 3, 1, 2, 4 ]       },
        { "left" :  240, "top" : 330, "frame" : 1, "linked"  : [ 4, 3, 5, 6 ]       },
        { "left" :  160, "top" : 410, "frame" : 0, "linked"  : [ 5, 4 ]             },
        { "left" :  320, "top" : 410, "frame" : 0, "linked"  : [ 6, 4 ]             }
    ],
//////////////////////////////////  20 NEW  //////////////////////////////////
    [
        { "left" : 240, "top" : 140, "frame" : 0, "linked"  : [ 1, 2, 3 ]            },
        { "left" : 120, "top" : 230, "frame" : 0, "linked"  : [ 2, 1, 5 ]            },
        { "left" : 360, "top" : 230, "frame" : 0, "linked"  : [ 3, 1, 6 ]            },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 1, 2, 3, 5, 6 ]   },
        { "left" : 160, "top" : 380, "frame" : 0, "linked"  : [ 5, 2, 6 ]            },
        { "left" : 320, "top" : 380, "frame" : 0, "linked"  : [ 6, 3, 5 ]            }
    ],

    //////////////////////////////////  21 (12)  //////////////////////////////////
    [
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 1, 3]               },
        { "left" : 120, "top" : 280, "frame" : 0, "linked"  : [ 2, 3 ]              },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 2, 4, 6 ]     },
        { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 4, 3 ]              },
        { "left" : 120, "top" : 390, "frame" : 1, "linked"  : [ 5, 2, 6 ]           },
        { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 6, 3 ]              },
        { "left" : 360, "top" : 390, "frame" : 1, "linked"  : [ 7, 4, 6 ]           }
    ],
//////////////////////////////////  22 NEW //////////////////////////////////
    [
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [ 1, 3 ]          },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [ 2, 5 ]          },
        { "left" : 140, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 4, 6 ]    },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 3, 5 ]       },
        { "left" : 340, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 4, 7 ]    },
        { "left" : 140, "top" : 390, "frame" : 0, "linked"  : [ 6, 3 ]          },
        { "left" : 340, "top" : 390, "frame" : 0, "linked"  : [ 7, 5 ]          }
    ],
    //////////////////////////////////  23 (13 edit) //////////////////////////////////
    [
        { "left" : 140, "top" : 250, "frame" : 0, "linked"  : [ 1, 2, 4 ]   },
        { "left" : 240, "top" : 250, "frame" : 1, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 340, "top" : 250, "frame" : 0, "linked"  : [ 3, 2, 7 ]   },
        { "left" :  90, "top" : 350, "frame" : 0, "linked"  : [ 4, 1, 5 ]   },
        { "left" : 190, "top" : 350, "frame" : 1, "linked"  : [ 5, 4, 6 ]   },
        { "left" : 290, "top" : 350, "frame" : 1, "linked"  : [ 6, 5, 7 ]   },
        { "left" : 390, "top" : 350, "frame" : 0, "linked"  : [ 7, 3, 6 ]   }
    ],
    //////////////////////////////////  24 (14)  //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3 ]               },
        { "left" : 300, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 5 ]               },
        { "left" : 120, "top" : 280, "frame" : 1, "linked"  : [ 3, 1, 6 ]               },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 1, 2, 3, 5, 6, 7 ]   },
        { "left" : 360, "top" : 280, "frame" : 1, "linked"  : [ 5, 2, 7 ]               },
        { "left" : 180, "top" : 390, "frame" : 0, "linked"  : [ 6, 3, 7 ]               },
        { "left" : 300, "top" : 390, "frame" : 0, "linked"  : [ 7, 5, 6 ]               }
    ],
//////////////////////////////////  25 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3 ]       },
        { "left" : 150, "top" : 225, "frame" : 1, "linked"  : [ 2, 1, 4, 5 ]    },
        { "left" : 330, "top" : 225, "frame" : 1, "linked"  : [ 3, 1, 5, 6 ]    },
        { "left" :  60, "top" : 280, "frame" : 0, "linked"  : [ 4, 2 ]          },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 3, 7 ]    },
        { "left" : 420, "top" : 280, "frame" : 0, "linked"  : [ 6, 3 ]          },
        { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 7, 5 ]          }
    ],

    //////////////////////////////////  26 (16) //////////////////////////////////
    [
        { "left" : 235, "top" : 150, "frame" : 0, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 177, "top" : 240, "frame" : 1, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 293, "top" : 240, "frame" : 1, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 120, "top" : 330, "frame" : 0, "linked"  : [ 4, 2, 6 ]   },
        { "left" : 350, "top" : 330, "frame" : 0, "linked"  : [ 5, 3, 7 ]   },
        { "left" : 177, "top" : 420, "frame" : 0, "linked"  : [ 6, 4 ]      },
        { "left" : 293, "top" : 420, "frame" : 0, "linked"  : [ 7, 5 ]      }
    ],
//////////////////////////////////  27 NEW  //////////////////////////////////
    [
        { "left" :  60, "top" : 190, "frame" : 1, "linked"  : [ 1, 3 ]         },
        { "left" : 420, "top" : 190, "frame" : 1, "linked"  : [ 2, 5 ]         },
        { "left" : 120, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 6 ]      },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 3, 5 ]      },
        { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 7 ]      },
        { "left" : 180, "top" : 370, "frame" : 0, "linked"  : [ 6, 3, 7 ]      },
        { "left" : 300, "top" : 370, "frame" : 0, "linked"  : [ 7, 5, 6 ]      }
    ],
//////////////////////////////////  28 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 0, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 4 ]       },
        { "left" : 140, "top" : 300, "frame" : 0, "linked"  : [ 3, 4, 6 ]       },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 4, 2, 3, 5 ]    },
        { "left" : 340, "top" : 300, "frame" : 0, "linked"  : [ 5, 4, 7 ]       },
        { "left" : 140, "top" : 400, "frame" : 0, "linked"  : [ 6, 3 ]          },
        { "left" : 340, "top" : 400, "frame" : 0, "linked"  : [ 7, 5 ]          }
    ],
//////////////////////////////////  29 NEW //////////////////////////////////
    [
        { "left" : 140, "top" : 170, "frame" : 1, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 3, 4 ]    },
        { "left" : 340, "top" : 170, "frame" : 1, "linked"  : [ 3, 2 ]          },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 6 ]       },
        { "left" : 140, "top" : 390, "frame" : 1, "linked"  : [ 5, 6 ]          },
        { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 6, 4, 5, 7 ]    },
        { "left" : 340, "top" : 390, "frame" : 1, "linked"  : [ 7, 6 ]          }
    ],
//////////////////////////////////  30 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 1, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 3 ]       },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 3, 2, 4, 5 ]    },
        { "left" : 150, "top" : 360, "frame" : 0, "linked"  : [ 4, 3, 6 ]       },
        { "left" : 330, "top" : 360, "frame" : 0, "linked"  : [ 5, 3, 7 ]       },
        { "left" :  60, "top" : 420, "frame" : 1, "linked"  : [ 6, 4 ]          },
        { "left" : 410, "top" : 420, "frame" : 1, "linked"  : [ 7, 5 ]          }
    ],    
    //////////////////////////////////  31 (19)  //////////////////////////////////
    [
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 4 ]     },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 2, 1, 3 ]     },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [ 3, 2, 5 ]     },
        { "left" : 140, "top" : 280, "frame" : 1, "linked"  : [ 4, 1, 6 ]     },
        { "left" : 340, "top" : 280, "frame" : 1, "linked"  : [ 5, 3, 8 ]     },
        { "left" : 140, "top" : 390, "frame" : 0, "linked"  : [ 6, 4, 7 ]     },
        { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 7, 6, 8 ]     },
        { "left" : 340, "top" : 390, "frame" : 0, "linked"  : [ 8, 5, 7 ]     }
    ],
//////////////////////////////////  32 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  90, "frame" : 0, "linked"  : [ 1, 2 ]              },
        { "left" : 240, "top" : 180, "frame" : 1, "linked"  : [ 2, 1, 4 ]           },
        { "left" : 140, "top" : 270, "frame" : 1, "linked"  : [ 3, 4 ]              },
        { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 4, 2, 3, 5, 6 ]     },
        { "left" : 340, "top" : 270, "frame" : 1, "linked"  : [ 5, 4 ]              },
        { "left" : 240, "top" : 360, "frame" : 1, "linked"  : [ 6, 4, 7 ]           },
        { "left" : 240, "top" : 450, "frame" : 0, "linked"  : [ 7, 6 ]              }
    ],
//////////////////////////////////  33 NEW //////////////////////////////////
    [
        { "left" : 190, "top" : 100, "frame" : 1, "linked"  : [ 1, 3 ]              },
        { "left" :  90, "top" : 200, "frame" : 1, "linked"  : [ 2, 3 ]              },
        { "left" : 190, "top" : 200, "frame" : 0, "linked"  : [ 3, 1, 2, 4, 6 ]     },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 4, 3, 5 ]           },
        { "left" : 390, "top" : 200, "frame" : 1, "linked"  : [ 5, 4 ]              },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 6, 3, 7 ]           },
        { "left" : 190, "top" : 400, "frame" : 1, "linked"  : [ 7, 6 ]              }
    ],
//////////////////////////////////  34 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 190, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 140, "top" : 300, "frame" : 0, "linked"  : [ 4, 2, 6 ]   },
        { "left" : 340, "top" : 300, "frame" : 0, "linked"  : [ 5, 3, 7 ]   },
        { "left" :  90, "top" : 400, "frame" : 0, "linked"  : [ 6, 4 ]      },
        { "left" : 390, "top" : 400, "frame" : 0, "linked"  : [ 7, 5 ]      }
    ],
    //////////////////////////////////  35 (20)  //////////////////////////////////
    [
        { "left" : 120, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 4 ]       },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 2, 4, 5 ]       },
        { "left" : 360, "top" : 170, "frame" : 1, "linked"  : [ 3, 2, 5 ]       },
        { "left" : 180, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 7 ]       },
        { "left" : 300, "top" : 280, "frame" : 1, "linked"  : [ 5, 2, 7 ]       },
        { "left" : 120, "top" : 390, "frame" : 1, "linked"  : [ 6, 4, 7 ]       },
        { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 7, 4, 5 ]       },
        { "left" : 360, "top" : 390, "frame" : 1, "linked"  : [ 8, 5, 7 ]       }
    ],
//////////////////////////////////  36 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  90, "frame" : 0, "linked"  : [ 1, 2 ]        },
        { "left" : 190, "top" : 180, "frame" : 1, "linked"  : [ 2, 1, 3 ]     },
        { "left" : 140, "top" : 270, "frame" : 0, "linked"  : [ 3, 2, 4 ]     },
        { "left" : 240, "top" : 270, "frame" : 1, "linked"  : [ 4, 3, 5 ]     },
        { "left" : 340, "top" : 270, "frame" : 0, "linked"  : [ 5, 4, 6 ]     },
        { "left" : 290, "top" : 360, "frame" : 1, "linked"  : [ 6, 5, 7 ]     },
        { "left" : 240, "top" : 450, "frame" : 0, "linked"  : [ 7, 6 ]        }
    ],
    //////////////////////////////////  37 (17)  //////////////////////////////////
    [
        { "left" : 240, "top" : 140, "frame" : 0, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 2, 1, 4 ]           },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 4 ]           },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 3, 5, 6 ]     },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [ 5, 4, 7]            },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 6, 4, 7 ]           },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 7, 5, 6 ]           }
    ],
    //////////////////////////////////  38 (26) //////////////////////////////////
    [
        { "left" :  90, "top" : 250, "frame" : 0, "linked"  : [ 1, 2, 5 ]       },
        { "left" : 190, "top" : 250, "frame" : 1, "linked"  : [ 2, 1, 3 ]       },
        { "left" : 290, "top" : 250, "frame" : 1, "linked"  : [ 3, 2, 4 ]       },
        { "left" : 390, "top" : 250, "frame" : 0, "linked"  : [ 4, 3, 8 ]       },
        { "left" :  90, "top" : 350, "frame" : 0, "linked"  : [ 5, 1, 6 ]       },
        { "left" : 190, "top" : 350, "frame" : 1, "linked"  : [ 6, 5, 7 ]       },
        { "left" : 290, "top" : 350, "frame" : 1, "linked"  : [ 7, 6, 8 ]       },
        { "left" : 390, "top" : 350, "frame" : 0, "linked"  : [ 8, 4, 7 ]       }
    ],
    //////////////////////////////////  39 (27) //////////////////////////////////
    [
        { "left" :  200, "top" : 180, "frame" : 0, "linked"  : [ 1, 3, 4 ]          },
        { "left" :  360, "top" : 180, "frame" : 0, "linked"  : [ 2, 1, 4, 6 ]       },
        { "left" :  120, "top" : 260, "frame" : 0, "linked"  : [ 3, 1, 5 ]          },
        { "left" :  280, "top" : 260, "frame" : 1, "linked"  : [ 4, 1, 2, 5, 6 ]    },
        { "left" :  200, "top" : 340, "frame" : 1, "linked"  : [ 5, 3, 4, 7, 8 ]    },
        { "left" :  360, "top" : 340, "frame" : 0, "linked"  : [ 6, 4, 8 ]          },
        { "left" :  120, "top" : 420, "frame" : 0, "linked"  : [ 7, 3, 5, 8 ]       },
        { "left" :  280, "top" : 420, "frame" : 0, "linked"  : [ 8, 5, 6 ]          }
    ],
    //////////////////////////////////  40 (28) //////////////////////////////////
    [
        { "left" : 130, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 4 ]            },
        { "left" : 240, "top" : 200, "frame" : 1, "linked"  : [ 2, 1, 3 ]            },
        { "left" : 350, "top" : 200, "frame" : 0, "linked"  : [ 3, 2, 5 ]            },
        { "left" :  80, "top" : 300, "frame" : 1, "linked"  : [ 4, 1, 6 ]            },
        { "left" : 400, "top" : 300, "frame" : 1, "linked"  : [ 5, 3, 8 ]            },
        { "left" : 130, "top" : 400, "frame" : 0, "linked"  : [ 6, 4, 7 ]            },
        { "left" : 240, "top" : 400, "frame" : 1, "linked"  : [ 7, 6, 8 ]            },
        { "left" : 350, "top" : 400, "frame" : 0, "linked"  : [ 8, 5, 7 ]            }
    ],
    //////////////////////////////////  41 (29) //////////////////////////////////
    [
        { "left" : 140, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 4 ]       },
        { "left" : 240, "top" : 120, "frame" : 0, "linked"  : [ 2, 1, 3, 4]     },
        { "left" : 340, "top" : 120, "frame" : 0, "linked"  : [ 3, 2, 4]        },
        { "left" : 240, "top" : 220, "frame" : 1, "linked"  : [ 4, 2, 5 ]       },
        { "left" : 240, "top" : 320, "frame" : 1, "linked"  : [ 5, 4, 7 ]       },
        { "left" : 140, "top" : 420, "frame" : 0, "linked"  : [ 6, 5, 7 ]       },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 7, 5, 6, 8 ]    },
        { "left" : 340, "top" : 420, "frame" : 0, "linked"  : [ 8, 5, 7 ]       }
    ],
    //////////////////////////////////  42 (32) //////////////////////////////////
    [
        { "left" : 190, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 4, 5 ]            },
        { "left" : 290, "top" : 200, "frame" : 1, "linked"  : [ 2, 1, 3, 5, 6 ]         },
        { "left" : 390, "top" : 200, "frame" : 0, "linked"  : [ 3, 2, 6 ]               },
        { "left" : 140, "top" : 300, "frame" : 1, "linked"  : [ 4, 1, 5, 7, 8 ]         },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 2, 4, 6, 8, 9 ]   },
        { "left" : 340, "top" : 300, "frame" : 1, "linked"  : [ 6, 2, 3, 5, 9 ]         },
        { "left" :  90, "top" : 400, "frame" : 0, "linked"  : [ 7, 4, 8 ]               },
        { "left" : 190, "top" : 400, "frame" : 1, "linked"  : [ 8, 4, 5, 7, 9 ]         },
        { "left" : 290, "top" : 400, "frame" : 0, "linked"  : [ 9, 5, 6, 8 ]            }
    ],
    //////////////////////////////////  43 (31) //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3, 4 ]            },
        { "left" : 300, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]            },
        { "left" : 120, "top" : 260, "frame" : 1, "linked"  : [ 3, 1, 4, 6 ]            },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [ 4, 1, 2, 3, 5, 6, 7 ]   },
        { "left" : 360, "top" : 260, "frame" : 1, "linked"  : [ 5, 2, 4, 7 ]            },
        { "left" : 180, "top" : 350, "frame" : 1, "linked"  : [ 6, 3, 4, 7, 8 ]         },
        { "left" : 300, "top" : 350, "frame" : 1, "linked"  : [ 7, 4, 5, 6, 8 ]         },
        { "left" : 240, "top" : 440, "frame" : 1, "linked"  : [ 8, 6, 7]                }
    ],
    //////////////////////////////////  44 (30) //////////////////////////////////
    [
        { "left" : 240, "top" : 150, "frame" : 1, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 160, "top" : 210, "frame" : 1, "linked"  : [ 2, 1, 4]            },
        { "left" : 320, "top" : 210, "frame" : 1, "linked"  : [ 3, 1, 4]            },
        { "left" : 240, "top" : 270, "frame" : 1, "linked"  : [ 4, 2, 3, 5, 6 ]     },
        { "left" : 160, "top" : 330, "frame" : 1, "linked"  : [ 5, 4, 7]            },
        { "left" : 320, "top" : 330, "frame" : 1, "linked"  : [ 6, 4, 7]            },
        { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 7, 5, 6, 8, 9]      },
        { "left" : 160, "top" : 450, "frame" : 1, "linked"  : [ 8, 7]               },
        { "left" : 320, "top" : 450, "frame" : 1, "linked"  : [ 9, 7]               }
    ],
//////////////////////////////////  45 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 120, "frame" : 1, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 220, "frame" : 0, "linked"  : [ 2, 1, 4 ]       },
        { "left" :  60, "top" : 320, "frame" : 1, "linked"  : [ 3, 6 ]          },
        { "left" : 240, "top" : 320, "frame" : 0, "linked"  : [ 4, 2, 8 ]       },
        { "left" : 420, "top" : 320, "frame" : 1, "linked"  : [ 5, 7 ]          },
        { "left" : 150, "top" : 370, "frame" : 0, "linked"  : [ 6, 3, 4, 8 ]    },
        { "left" : 330, "top" : 370, "frame" : 0, "linked"  : [ 7, 5, 4, 8 ]    },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 8, 6, 7 ]       }
    ],
    //////////////////////////////////  46 (15) //////////////////////////////////
    [
        { "left" : 140, "top" : 200, "frame" : 1, "linked"  : [ 1, 3, 4]    },
        { "left" : 340, "top" : 200, "frame" : 1, "linked"  : [ 2, 5, 6]    },
        { "left" :  90, "top" : 300, "frame" : 0, "linked"  : [ 3, 1, 7 ]   },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 4, 3, 5 ]   },
        { "left" : 290, "top" : 300, "frame" : 0, "linked"  : [ 5, 4, 6]    },
        { "left" : 390, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 8 ]   },
        { "left" : 140, "top" : 400, "frame" : 1, "linked"  : [ 7, 3, 4 ]   },
        { "left" : 340, "top" : 400, "frame" : 1, "linked"  : [ 8, 5, 6 ]   }
    ],
    //////////////////////////////////  47 (18) //////////////////////////////////
    [
        { "left" : 120, "top" : 180, "frame" : 1, "linked"  : [ 1, 3 ]          },
        { "left" : 360, "top" : 180, "frame" : 0, "linked"  : [ 2, 4 ]          },
        { "left" : 190, "top" : 250, "frame" : 0, "linked"  : [ 3, 1, 4, 5 ]    },
        { "left" : 290, "top" : 250, "frame" : 0, "linked"  : [ 4, 2, 3, 6]     },
        { "left" : 190, "top" : 350, "frame" : 0, "linked"  : [ 5, 3, 6, 7 ]    },
        { "left" : 290, "top" : 350, "frame" : 0, "linked"  : [ 6, 4, 5, 8 ]    },
        { "left" : 120, "top" : 420, "frame" : 0, "linked"  : [ 7, 5 ]          },
        { "left" : 360, "top" : 420, "frame" : 1, "linked"  : [ 8, 6 ]          }
    ],
//////////////////////////////////  48 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 1, "linked"  : [ 1, 2, 3 ]    },
        { "left" : 150, "top" : 180, "frame" : 1, "linked"  : [ 2, 1, 4 ]    },
        { "left" : 330, "top" : 180, "frame" : 0, "linked"  : [ 3, 1, 5 ]    },
        { "left" :  60, "top" : 260, "frame" : 0, "linked"  : [ 4, 2, 6 ]    },
        { "left" : 420, "top" : 260, "frame" : 0, "linked"  : [ 5, 3, 7 ]    },
        { "left" : 150, "top" : 340, "frame" : 0, "linked"  : [ 6, 4, 8 ]    },
        { "left" : 330, "top" : 340, "frame" : 1, "linked"  : [ 7, 5, 8 ]    },
        { "left" : 240, "top" : 420, "frame" : 1, "linked"  : [ 8, 6, 7 ]    }
    ],
//////////////////////////////////  49 NEW //////////////////////////////////
    [
        { "left" :  90, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 5 ]   },
        { "left" : 190, "top" : 200, "frame" : 1, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 290, "top" : 200, "frame" : 1, "linked"  : [ 3, 2, 4 ]   },
        { "left" : 390, "top" : 200, "frame" : 0, "linked"  : [ 4, 3, 7 ]   },
        { "left" : 140, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 8 ]   },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 6, 2, 3, 5, 7, 8, 9 ]   },
        { "left" : 340, "top" : 300, "frame" : 0, "linked"  : [ 7, 4, 9 ]   },
        { "left" : 190, "top" : 400, "frame" : 0, "linked"  : [ 8, 5, 9 ]   },
        { "left" : 290, "top" : 400, "frame" : 0, "linked"  : [ 9, 7, 8]    }
    ],
//////////////////////////////////  50 NEW  //////////////////////////////////
    [
        { "left" : 240, "top" :  60, "frame" : 1, "linked"  : [  1, 2 ]                 },
        { "left" : 240, "top" : 160, "frame" : 0, "linked"  : [  2, 1, 7 ]              },
        { "left" :  40, "top" : 215, "frame" : 1, "linked"  : [  3, 5 ]                 },
        { "left" : 440, "top" : 215, "frame" : 1, "linked"  : [  4, 6 ]                 },
        { "left" : 140, "top" : 240, "frame" : 0, "linked"  : [  5, 3, 7 ]              },
        { "left" : 340, "top" : 240, "frame" : 0, "linked"  : [  6, 4, 7 ]              },
        { "left" : 240, "top" : 265, "frame" : 0, "linked"  : [  7, 2, 5, 6, 8, 9 ]     },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [  8, 7, 10 ]             },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [  9, 7, 11 ]             },
        { "left" : 100, "top" : 435, "frame" : 1, "linked"  : [ 10, 8 ]                 },
        { "left" : 380, "top" : 435, "frame" : 1, "linked"  : [ 11, 9 ]                 }
    ],
    //////////////////////////////////  51 (21)  //////////////////////////////////
    [
        { "left" : 120, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 4 ]   },
        { "left" : 240, "top" : 120, "frame" : 0, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 360, "top" : 120, "frame" : 1, "linked"  : [ 3, 2 ]      },
        { "left" : 180, "top" : 200, "frame" : 0, "linked"  : [ 4, 1, 5 ]   },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 5, 4, 6 ]   },
        { "left" : 300, "top" : 360, "frame" : 0, "linked"  : [ 6, 5, 9 ]   },
        { "left" : 120, "top" : 440, "frame" : 1, "linked"  : [ 7, 8 ]      },
        { "left" : 240, "top" : 440, "frame" : 0, "linked"  : [ 8, 7, 9 ]   },
        { "left" : 360, "top" : 440, "frame" : 0, "linked"  : [ 9, 6, 8 ]   }
    ],
//////////////////////////////////  52 NEW //////////////////////////////////
    [
        { "left" :  80, "top" : 150, "frame" : 0, "linked"  : [ 1, 3]            },
        { "left" : 240, "top" : 150, "frame" : 1, "linked"  : [ 2, 3]            },
        { "left" : 160, "top" : 220, "frame" : 1, "linked"  : [ 3, 1, 2, 4, 5 ]  },
        { "left" :  80, "top" : 290, "frame" : 1, "linked"  : [ 4, 3 ]           },
        { "left" : 240, "top" : 290, "frame" : 1, "linked"  : [ 5, 3, 7]         },
        { "left" : 400, "top" : 290, "frame" : 1, "linked"  : [ 6, 7]            },
        { "left" : 320, "top" : 360, "frame" : 1, "linked"  : [ 7, 5, 6, 8, 9]   },
        { "left" : 240, "top" : 430, "frame" : 1, "linked"  : [ 8, 7]            },
        { "left" : 400, "top" : 430, "frame" : 0, "linked"  : [ 9, 7]            }
    ],
    //////////////////////////////////  53 (23)  //////////////////////////////////
    [
        { "left" : 130, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 3 ]       },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 2, 3, 4 ]       },
        { "left" : 130, "top" : 220, "frame" : 0, "linked"  : [ 3, 2, 5 ]       },
        { "left" : 350, "top" : 220, "frame" : 1, "linked"  : [ 4, 2, 5 ]       },
        { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 5, 2, 8 ]       },
        { "left" : 130, "top" : 320, "frame" : 0, "linked"  : [ 6, 5, 8 ]       },
        { "left" : 350, "top" : 320, "frame" : 1, "linked"  : [ 7, 5, 8 ]       },
        { "left" : 240, "top" : 370, "frame" : 1, "linked"  : [ 8, 6, 7 ]       },
        { "left" : 130, "top" : 420, "frame" : 1, "linked"  : [ 9, 6, 8 ]       }
    ],
    ////////////////////////////////// 54 (25) //////////////////////////////////
    [
        { "left" : 240, "top" : 150, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 190, "top" : 240, "frame" : 0, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 290, "top" : 240, "frame" : 0, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 140, "top" : 330, "frame" : 0, "linked"  : [ 4, 2, 6 ]   },
        { "left" : 340, "top" : 330, "frame" : 0, "linked"  : [ 5, 3, 9 ]   },
        { "left" :  90, "top" : 420, "frame" : 0, "linked"  : [ 6, 4, 7 ]   },
        { "left" : 190, "top" : 420, "frame" : 1, "linked"  : [ 7, 6, 8 ]   },
        { "left" : 290, "top" : 420, "frame" : 1, "linked"  : [ 8, 7, 9 ]   },
        { "left" : 390, "top" : 420, "frame" : 0, "linked"  : [ 9, 5, 8 ]   }
    ],
    //////////////////////////////////  55 (22) //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [ 1, 3 ]              },
        { "left" : 380, "top" : 140, "frame" : 1, "linked"  : [ 2, 4 ]              },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 5 ]           },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 4, 2, 5 ]           },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 5, 3, 4, 6, 7 ]     },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [ 6, 5, 8 ]           },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 7, 5, 9 ]           },
        { "left" : 100, "top" : 420, "frame" : 1, "linked"  : [ 8, 6 ]              },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 9, 7 ]              }
    ],
//////////////////////////////////  56 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 200, "frame" : 1, "linked"  : [ 1, 4 ]              },
        { "left" : 330, "top" : 200, "frame" : 1, "linked"  : [ 2, 6 ]              },
        { "left" :  60, "top" : 300, "frame" : 0, "linked"  : [ 3, 4 ]              },
        { "left" : 150, "top" : 300, "frame" : 1, "linked"  : [ 4, 1, 3, 5, 8 ]     },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 5, 4, 6 ]           },
        { "left" : 330, "top" : 300, "frame" : 1, "linked"  : [ 6, 2, 5, 7, 9 ]     },
        { "left" : 420, "top" : 300, "frame" : 0, "linked"  : [ 7, 6 ]              },
        { "left" : 150, "top" : 400, "frame" : 1, "linked"  : [ 8, 4 ]              },
        { "left" : 330, "top" : 400, "frame" : 1, "linked"  : [ 9, 6 ]              }
    ],
    //////////////////////////////////  57 (38) //////////////////////////////////
    [
        { "left" : 190, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3, 5 ]        },
        { "left" : 290, "top" : 170, "frame" : 1, "linked"  : [ 2, 1, 4, 5 ]        },
        { "left" : 110, "top" : 250, "frame" : 1, "linked"  : [ 3, 1, 5, 6 ]        },
        { "left" : 370, "top" : 250, "frame" : 0, "linked"  : [ 4, 2, 5, 7 ]        },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 4, 6, 9 ]     },
        { "left" : 110, "top" : 350, "frame" : 0, "linked"  : [ 6, 3, 5, 8 ]        },
        { "left" : 370, "top" : 350, "frame" : 1, "linked"  : [ 7, 4, 5, 9 ]        },
        { "left" : 190, "top" : 430, "frame" : 1, "linked"  : [ 8, 5, 6, 9 ]        },
        { "left" : 290, "top" : 430, "frame" : 0, "linked"  : [ 9, 5, 7, 8 ]        }
    ],
    //////////////////////////////////  58 (24)  //////////////////////////////////
    [
        { "left" : 240, "top" : 140, "frame" : 0, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 2, 5 ]              },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 3, 5 ]              },
        { "left" : 100, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 7 ]           },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 5, 1, 4, 6, 9 ]     },
        { "left" : 380, "top" : 280, "frame" : 1, "linked"  : [ 6, 3, 8]            },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [ 7, 5 ]              },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 8, 5 ]              },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 9, 7, 8 ]           }
    ],
//////////////////////////////////  59 NEW //////////////////////////////////
    [
        { "left" : 140, "top" :  80, "frame" : 0, "linked"  : [  1, 2, 4 ]      },
        { "left" : 240, "top" :  80, "frame" : 0, "linked"  : [  2, 1, 3 ]      },
        { "left" : 340, "top" :  80, "frame" : 1, "linked"  : [  3, 2 ]         },
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [  4, 1, 5 ]      },
        { "left" : 140, "top" : 260, "frame" : 0, "linked"  : [  5, 4, 6 ]      },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [  6, 5, 7 ]      },
        { "left" : 340, "top" : 260, "frame" : 0, "linked"  : [  7, 6, 8 ]      },
        { "left" : 340, "top" : 350, "frame" : 0, "linked"  : [  8, 7, 11 ]     },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [  9, 10 ]        },
        { "left" : 240, "top" : 440, "frame" : 0, "linked"  : [ 10, 9, 11 ]     },
        { "left" : 340, "top" : 440, "frame" : 0, "linked"  : [ 11, 8, 10 ]     }
    ],
////////////////////////////////// 60 NEW //////////////////////////////////
    [
        { "left" :  90, "top" : 150, "frame" : 1, "linked"  : [  1, 2 ]             },
        { "left" :  90, "top" : 240, "frame" : 0, "linked"  : [  2, 1, 3, 4 ]       },
        { "left" : 190, "top" : 240, "frame" : 0, "linked"  : [  3, 2, 5 ]          },
        { "left" :  90, "top" : 330, "frame" : 0, "linked"  : [  4, 2, 5, 7 ]       },
        { "left" : 190, "top" : 330, "frame" : 0, "linked"  : [  5, 3, 4, 6, 8 ]    },
        { "left" : 290, "top" : 330, "frame" : 0, "linked"  : [  6, 5, 9 ]          },
        { "left" :  90, "top" : 420, "frame" : 0, "linked"  : [  7, 4, 8 ]          },
        { "left" : 190, "top" : 420, "frame" : 0, "linked"  : [  8, 5, 7, 9 ]       },
        { "left" : 290, "top" : 420, "frame" : 0, "linked"  : [  9, 6, 8, 10 ]      },
        { "left" : 390, "top" : 420, "frame" : 1, "linked"  : [ 10, 9 ]             }
    ],
////////////////////////////////// 61 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 1, "linked"  : [  1, 3, 4 ]          },
        { "left" :  80, "top" : 200, "frame" : 1, "linked"  : [  2, 3, 6 ]          },
        { "left" : 195, "top" : 200, "frame" : 1, "linked"  : [  3, 1, 2, 4, 6 ]    },
        { "left" : 285, "top" : 200, "frame" : 1, "linked"  : [  4, 1, 3, 5, 7 ]    },
        { "left" : 400, "top" : 200, "frame" : 1, "linked"  : [  5, 4, 7 ]          },
        { "left" : 160, "top" : 280, "frame" : 1, "linked"  : [  6, 2, 3, 8, 9 ]    },
        { "left" : 320, "top" : 280, "frame" : 1, "linked"  : [  7, 4, 5, 8, 10 ]   },
        { "left" : 240, "top" : 330, "frame" : 1, "linked"  : [  8, 6, 7, 9, 10 ]   },
        { "left" : 130, "top" : 390, "frame" : 1, "linked"  : [  9, 6, 8 ]          },
        { "left" : 350, "top" : 390, "frame" : 1, "linked"  : [ 10, 7, 8 ]          }
    ],
    //////////////////////////////////  62 (33) //////////////////////////////////
    [
        { "left" : 140, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 4, 5 ]            },
        { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 3, 5, 6 ]         },
        { "left" : 340, "top" : 200, "frame" : 0, "linked"  : [ 3, 2, 6, 7 ]            },
        { "left" :  90, "top" : 300, "frame" : 1, "linked"  : [ 4, 1, 5, 8 ]            },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 2, 4, 6, 8, 9 ]   },
        { "left" : 290, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 3, 5, 7, 9, 10 ]  },
        { "left" : 390, "top" : 300, "frame" : 1, "linked"  : [ 7, 3, 6, 10 ]           },
        { "left" : 140, "top" : 400, "frame" : 0, "linked"  : [ 8, 4, 5, 9 ]            },
        { "left" : 240, "top" : 400, "frame" : 0, "linked"  : [ 9, 5, 6, 8, 10 ]        },
        { "left" : 340, "top" : 400, "frame" : 0, "linked"  : [ 10, 6, 7, 9 ]           }
    ],
//////////////////////////////////  63 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  80, "frame" : 1, "linked"  : [  1, 3 ]             },
        { "left" : 140, "top" : 170, "frame" : 1, "linked"  : [  2, 3 ]             },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [  3, 1, 2, 4, 5 ]    },
        { "left" : 340, "top" : 170, "frame" : 1, "linked"  : [  4, 3 ]             },
        { "left" : 240, "top" : 260, "frame" : 0, "linked"  : [  5, 3, 7 ]          },
        { "left" : 140, "top" : 350, "frame" : 1, "linked"  : [  6, 7 ]             },
        { "left" : 240, "top" : 350, "frame" : 0, "linked"  : [  7, 5, 6, 8, 9 ]    },
        { "left" : 340, "top" : 350, "frame" : 1, "linked"  : [  8, 7 ]             },
        { "left" : 240, "top" : 440, "frame" : 1, "linked"  : [  9, 7 ]             }
    ],
    //////////////////////////////////  64 (35) //////////////////////////////////
    [
        { "left" : 240, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 3 ]               },
        { "left" : 190, "top" : 220, "frame" : 0, "linked"  : [ 2, 1, 3, 4, 5 ]         },
        { "left" : 290, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 2, 5, 6 ]         },
        { "left" : 140, "top" : 320, "frame" : 0, "linked"  : [ 4, 2, 5, 7, 8 ]         },
        { "left" : 240, "top" : 320, "frame" : 1, "linked"  : [ 5, 2, 3, 4, 6, 8, 9 ]   },
        { "left" : 340, "top" : 320, "frame" : 0, "linked"  : [ 6, 3, 5, 9, 10 ]        },
        { "left" :  90, "top" : 420, "frame" : 0, "linked"  : [ 7, 4, 8 ]               },
        { "left" : 190, "top" : 420, "frame" : 0, "linked"  : [ 8, 4, 5, 7, 9 ]         },
        { "left" : 290, "top" : 420, "frame" : 0, "linked"  : [ 9, 5, 6, 8, 10 ]        },
        { "left" : 390, "top" : 420, "frame" : 0, "linked"  : [ 10, 6, 9 ]              }
    ],
//////////////////////////////////  65 NEW //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 0, "linked"  : [  1, 3 ]             },
        { "left" : 380, "top" : 140, "frame" : 0, "linked"  : [  2, 4 ]             },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [  3, 1, 5, 6 ]       },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [  4, 2, 6, 7 ]       },
        { "left" : 100, "top" : 280, "frame" : 0, "linked"  : [  5, 3, 8 ]          },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [  6, 3, 4, 8, 9 ]    },
        { "left" : 380, "top" : 280, "frame" : 0, "linked"  : [  7, 4, 9 ]          },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [  8, 5, 6, 10 ]      },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [  9, 6, 7, 11 ]      },
        { "left" : 100, "top" : 420, "frame" : 0, "linked"  : [ 10, 8 ]             },
        { "left" : 380, "top" : 420, "frame" : 0, "linked"  : [ 11, 9 ]             }
    ],
//////////////////////////////////  66 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 120, "frame" : 0, "linked"  : [  1, 3, 4 ]              },
        { "left" : 330, "top" : 120, "frame" : 0, "linked"  : [  2, 3, 5]               },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [  3, 1, 2, 4, 5]         },
        { "left" : 150, "top" : 220, "frame" : 1, "linked"  : [  4, 1, 3, 6, 8 ]        },
        { "left" : 330, "top" : 220, "frame" : 1, "linked"  : [  5, 2, 3, 7, 9 ]        },
        { "left" :  60, "top" : 270, "frame" : 0, "linked"  : [  6, 4, 8 ]              },
        { "left" : 420, "top" : 270, "frame" : 0, "linked"  : [  7, 5, 9 ]              },
        { "left" : 150, "top" : 320, "frame" : 1, "linked"  : [  8, 4, 6, 10, 11 ]      },
        { "left" : 330, "top" : 320, "frame" : 1, "linked"  : [  9, 5, 7, 10, 12 ]      },
        { "left" : 240, "top" : 370, "frame" : 1, "linked"  : [ 10, 8, 9, 11, 12 ]      },
        { "left" : 150, "top" : 420, "frame" : 0, "linked"  : [ 11, 8, 10 ]             },
        { "left" : 330, "top" : 420, "frame" : 0, "linked"  : [ 12, 9, 10 ]             }
    ],
////////////////////////////////// 67 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 1, "linked"  : [  1, 2, 3 ]      },
        { "left" : 150, "top" : 165, "frame" : 0, "linked"  : [  2, 1, 4 ]      },
        { "left" : 330, "top" : 165, "frame" : 0, "linked"  : [  3, 1, 5 ]      },
        { "left" :  60, "top" : 230, "frame" : 0, "linked"  : [  4, 2, 6 ]      },
        { "left" : 420, "top" : 230, "frame" : 0, "linked"  : [  5, 3, 7 ]      },
        { "left" : 100, "top" : 325, "frame" : 0, "linked"  : [  6, 4, 8 ]      },
        { "left" : 380, "top" : 325, "frame" : 0, "linked"  : [  7, 5, 10 ]     },
        { "left" : 140, "top" : 420, "frame" : 0, "linked"  : [  8, 6, 9 ]      },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [  9, 8, 10 ]     },
        { "left" : 340, "top" : 420, "frame" : 0, "linked"  : [ 10, 7, 9 ]      }
    ],
//////////////////////////////////  68 NEW //////////////////////////////////
    [
        { "left" : 140, "top" :  80, "frame" : 0, "linked"  : [  1, 2 ]             },
        { "left" : 240, "top" :  80, "frame" : 0, "linked"  : [  2, 1, 3, 4 ]       },
        { "left" : 340, "top" :  80, "frame" : 0, "linked"  : [  3, 2 ]             },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [  4, 2, 6 ]          },
        { "left" : 140, "top" : 260, "frame" : 0, "linked"  : [  5, 6 ]             },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [  6, 4, 5, 7, 8 ]    },
        { "left" : 340, "top" : 260, "frame" : 0, "linked"  : [  7, 6 ]             },
        { "left" : 240, "top" : 350, "frame" : 0, "linked"  : [  8, 6, 10 ]         },
        { "left" : 140, "top" : 440, "frame" : 0, "linked"  : [  9, 10 ]            },
        { "left" : 240, "top" : 440, "frame" : 0, "linked"  : [ 10, 8, 9, 11 ]      },
        { "left" : 340, "top" : 440, "frame" : 0, "linked"  : [ 11, 10 ]            }
    ],
//////////////////////////////////  69 NEW //////////////////////////////////
    [
        { "left" : 340, "top" :  80, "frame" : 1, "linked"  : [   1, 3 ]                },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [   2, 3, 6 ]             },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [   3, 1, 2, 4, 7 ]       },
        { "left" : 440, "top" : 170, "frame" : 1, "linked"  : [   4, 3 ]                },
        { "left" : 140, "top" : 260, "frame" : 1, "linked"  : [   5, 6, 9 ]             },
        { "left" : 240, "top" : 260, "frame" : 0, "linked"  : [   6, 2, 5, 7, 10 ]      },
        { "left" : 340, "top" : 260, "frame" : 1, "linked"  : [   7, 3, 6 ]             },
        { "left" :  40, "top" : 350, "frame" : 1, "linked"  : [   8, 9 ]                },
        { "left" : 140, "top" : 350, "frame" : 0, "linked"  : [   9, 5, 8, 10, 11 ]     },
        { "left" : 240, "top" : 350, "frame" : 1, "linked"  : [  10, 6, 9 ]             },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [  11, 9 ]                }
    ],
    //////////////////////////////////  70 (41)  //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 0, "linked"  : [ 1, 2, 4 ]           },
        { "left" : 240, "top" : 140, "frame" : 1, "linked"  : [ 2, 1, 3, 4, 5 ]     },
        { "left" : 380, "top" : 140, "frame" : 0, "linked"  : [ 3, 2, 5 ]           },
        { "left" : 170, "top" : 210, "frame" : 1, "linked"  : [ 4, 1, 2, 6 ]        },
        { "left" : 310, "top" : 210, "frame" : 1, "linked"  : [ 5, 2, 3, 6 ]        },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 6, 4, 5, 7, 8 ]     },
        { "left" : 170, "top" : 350, "frame" : 1, "linked"  : [ 7, 6, 9, 10 ]       },
        { "left" : 310, "top" : 350, "frame" : 1, "linked"  : [ 8, 6, 10, 11 ]      },
        { "left" : 100, "top" : 420, "frame" : 0, "linked"  : [ 9, 7, 10 ]          },
        { "left" : 240, "top" : 420, "frame" : 1, "linked"  : [ 10, 7, 8, 9, 11]    },
        { "left" : 380, "top" : 420, "frame" : 0, "linked"  : [ 11, 8, 10]          }
    ],
//////////////////////////////////  71 NEW //////////////////////////////////
    [
        { "left" : 190, "top" :  80, "frame" : 1, "linked"  : [  1, 2, 3 ]      },
        { "left" : 290, "top" :  80, "frame" : 1, "linked"  : [  2, 1, 4 ]      },
        { "left" : 140, "top" : 170, "frame" : 1, "linked"  : [  3, 1, 5 ]      },
        { "left" : 340, "top" : 170, "frame" : 1, "linked"  : [  4, 2, 6 ]      },
        { "left" : 190, "top" : 260, "frame" : 0, "linked"  : [  5, 3, 6, 7 ]   },
        { "left" : 290, "top" : 260, "frame" : 0, "linked"  : [  6, 4, 5, 8 ]   },
        { "left" : 140, "top" : 350, "frame" : 1, "linked"  : [  7, 5, 9 ]      },
        { "left" : 340, "top" : 350, "frame" : 1, "linked"  : [  8, 6, 10 ]     },
        { "left" : 190, "top" : 440, "frame" : 1, "linked"  : [  9, 7, 10 ]     },
        { "left" : 290, "top" : 440, "frame" : 1, "linked"  : [ 10, 8, 9 ]      }
    ],
//////////////////////////////////  72 NEW  //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 3, 5 ]        },
        { "left" : 240, "top" : 140, "frame" : 0, "linked"  : [ 2, 3, 4 ]           },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 2, 5, 6 ]     },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 4, 2, 6, 7 ]        },
        { "left" : 100, "top" : 280, "frame" : 0, "linked"  : [ 5, 3, 8 ]           },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 6, 3, 4, 8, 9 ]     },
        { "left" : 380, "top" : 280, "frame" : 0, "linked"  : [ 7, 4, 9 ]           },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [ 8, 5, 6, 10 ]       },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 9, 6, 7, 10, 11 ]   },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 10, 8, 9 ]          },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 11, 7, 9, 10 ]      }
    ],
//////////////////////////////////  73 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 0, "linked"  : [ 1, 3 ]                      },
        { "left" : 330, "top" : 140, "frame" : 0, "linked"  : [ 2, 4 ]                      },
        { "left" : 195, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 4, 6, 7 ]             },
        { "left" : 285, "top" : 220, "frame" : 0, "linked"  : [ 4, 2, 3, 7, 8 ]             },
        { "left" :  60, "top" : 300, "frame" : 0, "linked"  : [ 5, 6 ]                      },
        { "left" : 150, "top" : 300, "frame" : 1, "linked"  : [ 6, 3, 5, 7, 10 ]            },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 7, 3, 4, 6, 8, 10, 11 ]     },
        { "left" : 330, "top" : 300, "frame" : 1, "linked"  : [ 8, 4, 7, 9, 11 ]            },
        { "left" : 420, "top" : 300, "frame" : 0, "linked"  : [ 9, 8 ]                      },
        { "left" : 195, "top" : 380, "frame" : 0, "linked"  : [ 10, 6, 7, 11, 12 ]          },
        { "left" : 285, "top" : 380, "frame" : 0, "linked"  : [ 11, 7, 8, 10, 13 ]          },
        { "left" : 150, "top" : 460, "frame" : 0, "linked"  : [ 12, 10 ]                    },
        { "left" : 330, "top" : 460, "frame" : 0, "linked"  : [ 13, 11 ]                    }
    ],
//////////////////////////////////  74 (37) //////////////////////////////////
    [
        { "left" : 170, "top" : 140, "frame" : 0, "linked"  : [ 1, 3, 4 ]           },
        { "left" : 310, "top" : 140, "frame" : 0, "linked"  : [ 2, 4, 5]            },
        { "left" : 100, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 6 ]           },
        { "left" : 240, "top" : 210, "frame" : 1, "linked"  : [ 4, 1, 2, 6, 7 ]     },
        { "left" : 380, "top" : 210, "frame" : 0, "linked"  : [ 5, 2, 7 ]           },
        { "left" : 170, "top" : 280, "frame" : 1, "linked"  : [ 6, 3, 4, 8, 9]      },
        { "left" : 310, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 5, 9, 10 ]    },
        { "left" : 100, "top" : 350, "frame" : 0, "linked"  : [ 8, 6, 11 ]          },
        { "left" : 240, "top" : 350, "frame" : 1, "linked"  : [ 9, 6, 7, 11, 12 ]   },
        { "left" : 380, "top" : 350, "frame" : 0, "linked"  : [ 10, 7, 12 ]         },
        { "left" : 170, "top" : 420, "frame" : 0, "linked"  : [ 11, 8, 9]           },
        { "left" : 310, "top" : 420, "frame" : 0, "linked"  : [ 12, 9, 10]          }
    ],
//////////////////////////////////  75 NEW //////////////////////////////////
    [
        { "left" :  60, "top" : 200, "frame" : 1, "linked"  : [ 1, 4 ]              },
        { "left" : 240, "top" : 200, "frame" : 1, "linked"  : [ 2, 6 ]              },
        { "left" : 420, "top" : 200, "frame" : 1, "linked"  : [ 3, 8 ]              },
        { "left" :  60, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 5, 9 ]        },
        { "left" : 150, "top" : 300, "frame" : 1, "linked"  : [ 5, 4, 6 ]           },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 5, 7, 10 ]    },
        { "left" : 330, "top" : 300, "frame" : 1, "linked"  : [ 7, 6, 8 ]           },
        { "left" : 420, "top" : 300, "frame" : 0, "linked"  : [ 8, 3, 7, 11 ]       },
        { "left" :  60, "top" : 400, "frame" : 1, "linked"  : [ 9, 4 ]              },
        { "left" : 240, "top" : 400, "frame" : 0, "linked"  : [ 10, 6 ]             },
        { "left" : 420, "top" : 400, "frame" : 1, "linked"  : [ 11, 8 ]             }
    ],
////////////////////////////////// 76 NEW //////////////////////////////////
    [
        { "left" :  90, "top" :  80, "frame" : 1, "linked"  : [ 1, 2, 5 ]   },
        { "left" : 190, "top" :  80, "frame" : 1, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 290, "top" :  80, "frame" : 1, "linked"  : [ 3, 2, 4 ]   },
        { "left" : 390, "top" :  80, "frame" : 1, "linked"  : [ 4, 3, 6 ]   },
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [ 5, 1, 7 ]   },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [ 6, 4, 8 ]   },
        { "left" : 190, "top" : 260, "frame" : 0, "linked"  : [ 7, 5, 9 ]   },
        { "left" : 290, "top" : 260, "frame" : 0, "linked"  : [ 8, 6, 9 ]   },
        { "left" : 240, "top" : 350, "frame" : 1, "linked"  : [ 9, 7, 8, 10, 11 ]   },
        { "left" : 190, "top" : 440, "frame" : 0, "linked"  : [ 10, 9 ]   },
        { "left" : 290, "top" : 440, "frame" : 0, "linked"  : [ 11, 9 ]   }
    ],
//////////////////////////////////  77 (34) //////////////////////////////////
    [
        { "left" : 190, "top" : 150, "frame" : 1, "linked"  : [ 1, 2, 4 ]           },
        { "left" : 290, "top" : 150, "frame" : 1, "linked"  : [ 2, 1, 5 ]           },
        { "left" :  90, "top" : 250, "frame" : 1, "linked"  : [ 3, 4, 7 ]           },
        { "left" : 190, "top" : 250, "frame" : 0, "linked"  : [ 4, 1, 3, 5, 8 ]     },
        { "left" : 290, "top" : 250, "frame" : 0, "linked"  : [ 5, 2, 4, 6, 9 ]     },
        { "left" : 390, "top" : 250, "frame" : 1, "linked"  : [ 6, 5, 10 ]          },
        { "left" :  90, "top" : 350, "frame" : 1, "linked"  : [ 7, 3, 8 ]           },
        { "left" : 190, "top" : 350, "frame" : 0, "linked"  : [ 8, 4, 7, 9, 11 ]    },
        { "left" : 290, "top" : 350, "frame" : 0, "linked"  : [ 9, 5, 8, 10, 12 ]   },
        { "left" : 390, "top" : 350, "frame" : 1, "linked"  : [ 10, 6, 9 ]          },
        { "left" : 190, "top" : 450, "frame" : 1, "linked"  : [ 11, 8, 12 ]         },
        { "left" : 290, "top" : 450, "frame" : 1, "linked"  : [ 12, 9, 11 ]         }
    ],
////////////////////////////////// 78 (39) //////////////////////////////////
    [
        { "left" : 105, "top" : 220, "frame" : 0, "linked"  : [ 1, 2, 5, 6 ]                },
        { "left" : 195, "top" : 220, "frame" : 0, "linked"  : [ 2, 1, 3, 6, 7 ]             },
        { "left" : 285, "top" : 220, "frame" : 0, "linked"  : [ 3, 2, 4, 7, 8 ]             },
        { "left" : 375, "top" : 220, "frame" : 0, "linked"  : [ 4, 3, 8, 9 ]                },
        { "left" :  60, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 6, 10 ]               },
        { "left" : 150, "top" : 300, "frame" : 1, "linked"  : [ 6, 1, 2, 5, 7, 10, 11 ]     },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 7, 2, 3, 6, 8, 11, 12 ]     },
        { "left" : 330, "top" : 300, "frame" : 1, "linked"  : [ 8, 3, 4, 7, 9, 12, 13 ]     },
        { "left" : 420, "top" : 300, "frame" : 0, "linked"  : [ 9, 4, 8, 13 ]               },
        { "left" : 105, "top" : 380, "frame" : 0, "linked"  : [ 10, 5, 6, 11 ]              },
        { "left" : 195, "top" : 380, "frame" : 0, "linked"  : [ 11, 6, 7, 10, 12 ]          },
        { "left" : 285, "top" : 380, "frame" : 0, "linked"  : [ 12, 7, 8, 11, 13]           },
        { "left" : 375, "top" : 380, "frame" : 0, "linked"  : [ 13, 8, 9, 12]               }
    ],
//////////////////////////////////  79 NEW //////////////////////////////////
    [
        { "left" : 140, "top" :  80, "frame" : 1, "linked"  : [  1, 3 ]             },
        { "left" : 340, "top" :  80, "frame" : 1, "linked"  : [  2, 4 ]             },
        { "left" : 190, "top" : 170, "frame" : 0, "linked"  : [  3, 1, 4, 5 ]       },
        { "left" : 290, "top" : 170, "frame" : 0, "linked"  : [  4, 2, 3, 6 ]       },
        { "left" : 140, "top" : 260, "frame" : 0, "linked"  : [  5, 3, 7 ]          },
        { "left" : 340, "top" : 260, "frame" : 0, "linked"  : [  6, 4, 8 ]          },
        { "left" : 190, "top" : 350, "frame" : 0, "linked"  : [  7, 5, 8, 9 ]       },
        { "left" : 290, "top" : 350, "frame" : 0, "linked"  : [  8, 6, 7, 10 ]      },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [  9, 7 ]             },
        { "left" : 340, "top" : 440, "frame" : 1, "linked"  : [ 10, 8 ]             }
    ],
//////////////////////////////////  80 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  80, "frame" : 1, "linked"  : [  1, 2, 3 ]      },
        { "left" : 170, "top" : 150, "frame" : 0, "linked"  : [  2, 1, 4 ]      },
        { "left" : 310, "top" : 150, "frame" : 0, "linked"  : [  3, 1, 5 ]      },
        { "left" : 100, "top" : 220, "frame" : 0, "linked"  : [  4, 2, 6 ]      },
        { "left" : 380, "top" : 220, "frame" : 0, "linked"  : [  5, 3, 7 ]      },
        { "left" :  30, "top" : 290, "frame" : 0, "linked"  : [  6, 4, 8 ]      },
        { "left" : 450, "top" : 290, "frame" : 0, "linked"  : [  7, 5, 9 ]      },
        { "left" : 100, "top" : 360, "frame" : 1, "linked"  : [  8, 6, 10 ]     },
        { "left" : 380, "top" : 360, "frame" : 1, "linked"  : [  9, 7, 11 ]     },
        { "left" : 170, "top" : 430, "frame" : 0, "linked"  : [ 10, 8, 12 ]     },
        { "left" : 310, "top" : 430, "frame" : 0, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 240, "top" : 500, "frame" : 0, "linked"  : [ 12, 10, 11 ]    }
    ],
//////////////////////////////////  81 NEW  //////////////////////////////////
    [
        { "left" : 240, "top" :  90, "frame" : 0, "linked"  : [ 1, 2, 3]            },
        { "left" : 170, "top" : 160, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]        },
        { "left" : 310, "top" : 160, "frame" : 0, "linked"  : [ 3, 1, 5, 6 ]        },
        { "left" : 100, "top" : 230, "frame" : 1, "linked"  : [ 4, 2 ]              },
        { "left" : 240, "top" : 230, "frame" : 0, "linked"  : [ 5, 2, 3, 7 ]        },
        { "left" : 380, "top" : 230, "frame" : 1, "linked"  : [ 6, 3 ]              },
        { "left" : 240, "top" : 310, "frame" : 0, "linked"  : [ 7, 5, 8, 9 ]        },
        { "left" : 170, "top" : 380, "frame" : 0, "linked"  : [ 8, 7, 10, 11 ]      },
        { "left" : 310, "top" : 380, "frame" : 0, "linked"  : [ 9, 7, 11, 12 ]      },
        { "left" : 100, "top" : 450, "frame" : 1, "linked"  : [ 10, 8 ]             },
        { "left" : 240, "top" : 450, "frame" : 1, "linked"  : [ 11, 8, 9 ]          },
        { "left" : 380, "top" : 450, "frame" : 1, "linked"  : [ 12, 9]              }
    ],
//////////////////////////////////  82 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 1, "linked"  : [ 1, 4 ]              },
        { "left" : 330, "top" : 140, "frame" : 1, "linked"  : [ 2, 6 ]              },
        { "left" :  60, "top" : 240, "frame" : 1, "linked"  : [ 3, 4 ]              },
        { "left" : 150, "top" : 240, "frame" : 0, "linked"  : [ 4, 1, 3, 5, 7 ]     },
        { "left" : 240, "top" : 240, "frame" : 0, "linked"  : [ 5, 4, 6, 8 ]        },
        { "left" : 330, "top" : 240, "frame" : 0, "linked"  : [ 6, 2, 5, 9 ]        },
        { "left" : 150, "top" : 340, "frame" : 0, "linked"  : [ 7, 4, 8, 11 ]       },
        { "left" : 240, "top" : 340, "frame" : 0, "linked"  : [ 8, 5, 7, 9 ]        },
        { "left" : 330, "top" : 340, "frame" : 0, "linked"  : [ 9, 6, 8, 10, 12 ]   },
        { "left" : 420, "top" : 340, "frame" : 1, "linked"  : [ 10, 9 ]             },
        { "left" : 150, "top" : 440, "frame" : 1, "linked"  : [ 11, 7 ]             },
        { "left" : 330, "top" : 440, "frame" : 1, "linked"  : [ 12, 9 ]             }
    ],
//////////////////////////////////  83 NEW //////////////////////////////////
    [
        { "left" :  40, "top" : 220, "frame" : 0, "linked"  : [ 1, 2, 5 ]               },
        { "left" : 140, "top" : 220, "frame" : 1, "linked"  : [ 2, 1, 5, 6 ]            },
        { "left" : 340, "top" : 220, "frame" : 1, "linked"  : [ 3, 4, 7, 8 ]            },
        { "left" : 440, "top" : 220, "frame" : 0, "linked"  : [ 4, 3, 8 ]               },
        { "left" :  90, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 2, 6, 9 ]         },
        { "left" : 190, "top" : 300, "frame" : 1, "linked"  : [ 6, 2, 5, 7, 9, 10 ]     },
        { "left" : 290, "top" : 300, "frame" : 1, "linked"  : [ 7, 3, 6, 8, 10, 11 ]    },
        { "left" : 390, "top" : 300, "frame" : 0, "linked"  : [ 8, 3, 4, 7, 11 ]        },
        { "left" : 140, "top" : 380, "frame" : 0, "linked"  : [ 9, 5, 6, 10 ]           },
        { "left" : 240, "top" : 380, "frame" : 1, "linked"  : [ 10, 6, 7, 9, 11 ]       },
        { "left" : 340, "top" : 380, "frame" : 0, "linked"  : [ 11, 7, 8, 10 ]          }
    ],
//////////////////////////////////  84 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  70, "frame" : 0, "linked"  : [  1, 2, 3 ]      },
        { "left" : 170, "top" : 140, "frame" : 0, "linked"  : [  2, 1, 4 ]      },
        { "left" : 310, "top" : 140, "frame" : 0, "linked"  : [  3, 1, 5 ]      },
        { "left" : 100, "top" : 210, "frame" : 0, "linked"  : [  4, 2, 6 ]      },
        { "left" : 380, "top" : 210, "frame" : 0, "linked"  : [  5, 3, 7 ]      },
        { "left" : 170, "top" : 280, "frame" : 1, "linked"  : [  6, 4, 8 ]      },
        { "left" : 310, "top" : 280, "frame" : 1, "linked"  : [  7, 5, 9 ]      },
        { "left" : 100, "top" : 350, "frame" : 0, "linked"  : [  8, 6, 10 ]     },
        { "left" : 380, "top" : 350, "frame" : 0, "linked"  : [  9, 7, 11 ]     },
        { "left" : 170, "top" : 420, "frame" : 0, "linked"  : [ 10, 8, 12 ]     },
        { "left" : 310, "top" : 420, "frame" : 0, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 240, "top" : 490, "frame" : 0, "linked"  : [ 12, 10, 11 ]    }
    ],
//////////////////////////////////  85 NEW //////////////////////////////////
    [
        { "left" :  40, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 4 ]       },
        { "left" : 140, "top" : 120, "frame" : 0, "linked"  : [ 2, 1, 3 ]       },
        { "left" : 240, "top" : 120, "frame" : 1, "linked"  : [ 3, 2, 5 ]       },
        { "left" :  90, "top" : 200, "frame" : 0, "linked"  : [ 4, 1, 6 ]       },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 5, 3, 8 ]       },
        { "left" : 140, "top" : 280, "frame" : 0, "linked"  : [ 6, 4, 7, 9 ]    },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 7, 6, 8 ]       },
        { "left" : 340, "top" : 280, "frame" : 0, "linked"  : [ 8, 5, 7, 10 ]   },
        { "left" : 190, "top" : 360, "frame" : 0, "linked"  : [ 9, 6, 11 ]      },
        { "left" : 390, "top" : 360, "frame" : 0, "linked"  : [ 10, 8, 13 ]     },
        { "left" : 240, "top" : 440, "frame" : 1, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 340, "top" : 440, "frame" : 0, "linked"  : [ 12, 11, 13 ]    },
        { "left" : 440, "top" : 440, "frame" : 1, "linked"  : [ 13, 10, 12 ]    }
    ],
//////////////////////////////////  86 NEW //////////////////////////////////
    [
        { "left" :  90, "top" :  90, "frame" : 1, "linked"  : [ 1, 2 ]              },
        { "left" : 190, "top" :  90, "frame" : 0, "linked"  : [ 2, 1, 3, 5 ]        },
        { "left" : 290, "top" :  90, "frame" : 0, "linked"  : [ 3, 2, 4, 6 ]        },
        { "left" : 390, "top" :  90, "frame" : 1, "linked"  : [ 4, 3 ]              },
        { "left" : 190, "top" : 170, "frame" : 1, "linked"  : [ 5, 2, 6, 7 ]        },
        { "left" : 290, "top" : 170, "frame" : 1, "linked"  : [ 6, 3, 5, 8 ]        },
        { "left" : 190, "top" : 260, "frame" : 0, "linked"  : [ 7, 5, 8, 9 ]        },
        { "left" : 290, "top" : 260, "frame" : 0, "linked"  : [ 8, 6, 7, 10 ]       },
        { "left" : 190, "top" : 350, "frame" : 1, "linked"  : [ 9, 7, 10, 12 ]      },
        { "left" : 290, "top" : 350, "frame" : 1, "linked"  : [ 10, 8, 9, 13 ]      },
        { "left" :  90, "top" : 440, "frame" : 1, "linked"  : [ 11, 12 ]            },
        { "left" : 190, "top" : 440, "frame" : 0, "linked"  : [ 12, 9, 11, 13 ]     },
        { "left" : 290, "top" : 440, "frame" : 0, "linked"  : [ 13, 10, 12, 14 ]    },
        { "left" : 390, "top" : 440, "frame" : 1, "linked"  : [ 14, 13 ]            }
    ],
//////////////////////////////////  87 NEW //////////////////////////////////
    [
        { "left" : 170, "top" :  90, "frame" : 1, "linked"  : [  1, 3, 4 ]      },
        { "left" : 310, "top" :  90, "frame" : 1, "linked"  : [  2, 4, 5 ]      },
        { "left" : 100, "top" : 160, "frame" : 1, "linked"  : [  3, 1, 6 ]      },
        { "left" : 240, "top" : 160, "frame" : 1, "linked"  : [  4, 1, 2 ]      },
        { "left" : 380, "top" : 160, "frame" : 1, "linked"  : [  5, 2, 7 ]      },
        { "left" :  30, "top" : 230, "frame" : 1, "linked"  : [  6, 3, 8 ]      },
        { "left" : 450, "top" : 230, "frame" : 1, "linked"  : [  7, 5, 9 ]      },
        { "left" : 100, "top" : 300, "frame" : 1, "linked"  : [  8, 6, 10 ]     },
        { "left" : 380, "top" : 300, "frame" : 1, "linked"  : [  9, 7, 11 ]     },
        { "left" : 170, "top" : 370, "frame" : 1, "linked"  : [ 10, 8, 12 ]     },
        { "left" : 310, "top" : 370, "frame" : 1, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 240, "top" : 440, "frame" : 1, "linked"  : [ 12, 10, 11 ]    }
    ],
//////////////////////////////////  88 Rajkic //////////////////////////////////
    [
        { "left" : 240, "top" :  65, "frame" : 0, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 160, "top" : 100, "frame" : 0, "linked"  : [ 2, 1, 4 ]           },
        { "left" : 320, "top" : 100, "frame" : 0, "linked"  : [ 3, 1, 5 ]           },
        { "left" : 160, "top" : 190, "frame" : 0, "linked"  : [ 4, 2, 6, 7 ]        },
        { "left" : 320, "top" : 190, "frame" : 0, "linked"  : [ 5, 3, 6 ]           },
        { "left" : 240, "top" : 235, "frame" : 0, "linked"  : [ 6, 4, 5, 7, 8 ]     },
        { "left" : 160, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 6, 8, 9 ]     },
        { "left" : 240, "top" : 325, "frame" : 0, "linked"  : [ 8, 6, 7, 9, 10 ]    },
        { "left" : 160, "top" : 370, "frame" : 0, "linked"  : [ 9, 7, 8, 11 ]       },
        { "left" : 320, "top" : 370, "frame" : 0, "linked"  : [ 10, 8, 12 ]         },
        { "left" : 160, "top" : 460, "frame" : 0, "linked"  : [ 11, 9 ]             },
        { "left" : 320, "top" : 460, "frame" : 0, "linked"  : [ 12, 10 ]            }

    ],
//////////////////////////////////  89 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 1, "linked"  : [ 1, 3 ]              },
        { "left" : 330, "top" : 140, "frame" : 1, "linked"  : [ 2, 4 ]              },
        { "left" : 105, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 5, 6 ]        },
        { "left" : 375, "top" : 220, "frame" : 0, "linked"  : [ 4, 2, 8, 9 ]        },
        { "left" :  60, "top" : 300, "frame" : 1, "linked"  : [ 5, 3, 6, 10 ]       },
        { "left" : 150, "top" : 300, "frame" : 0, "linked"  : [ 6, 3, 5, 7, 10 ]    },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 7, 6, 8 ]           },
        { "left" : 330, "top" : 300, "frame" : 0, "linked"  : [ 8, 4, 7, 9, 11 ]    },
        { "left" : 420, "top" : 300, "frame" : 1, "linked"  : [ 9, 4, 8, 11 ]       },
        { "left" : 105, "top" : 380, "frame" : 0, "linked"  : [ 10, 5, 6, 12 ]      },
        { "left" : 375, "top" : 380, "frame" : 0, "linked"  : [ 11, 8, 9, 13 ]      },
        { "left" : 150, "top" : 460, "frame" : 1, "linked"  : [ 12, 10 ]            },
        { "left" : 330, "top" : 460, "frame" : 1, "linked"  : [ 13, 11 ]            }
    ],
//////////////////////////////////  90 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  80, "frame" : 0, "linked"  : [  1, 2, 3 ]              },
        { "left" : 170, "top" : 150, "frame" : 0, "linked"  : [  2, 1, 4, 5 ]           },
        { "left" : 310, "top" : 150, "frame" : 0, "linked"  : [  3, 1, 5, 6 ]           },
        { "left" : 100, "top" : 220, "frame" : 0, "linked"  : [  4, 2, 7 ]              },
        { "left" : 240, "top" : 220, "frame" : 1, "linked"  : [  5, 2, 3, 7, 8 ]        },
        { "left" : 380, "top" : 220, "frame" : 0, "linked"  : [  6, 3, 8 ]              },
        { "left" : 170, "top" : 290, "frame" : 1, "linked"  : [  7, 4, 5, 9, 10 ]       },
        { "left" : 310, "top" : 290, "frame" : 1, "linked"  : [  8, 5, 6, 10, 11 ]      },
        { "left" : 100, "top" : 360, "frame" : 0, "linked"  : [  9, 7, 12 ]             },
        { "left" : 240, "top" : 360, "frame" : 1, "linked"  : [ 10, 7, 8, 12, 13 ]      },
        { "left" : 380, "top" : 360, "frame" : 0, "linked"  : [ 11, 8, 13 ]             },
        { "left" : 170, "top" : 430, "frame" : 0, "linked"  : [ 12, 9, 10, 14 ]         },
        { "left" : 310, "top" : 430, "frame" : 0, "linked"  : [ 13, 10, 11, 14 ]        },
        { "left" : 240, "top" : 500, "frame" : 0, "linked"  : [ 14, 12, 13 ]            }
    ],
//////////////////////////////////  91 NEW //////////////////////////////////
    [
        { "left" : 150, "top" :  70, "frame" : 1, "linked"  : [ 1, 4 ]                  },
        { "left" : 330, "top" :  70, "frame" : 1, "linked"  : [ 2, 6 ]                  },
        { "left" :  60, "top" : 170, "frame" : 0, "linked"  : [ 3, 4 ]                  },
        { "left" : 150, "top" : 170, "frame" : 1, "linked"  : [ 4, 1, 3, 5, 8 ]         },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 5, 4, 6, 9 ]            },
        { "left" : 330, "top" : 170, "frame" : 1, "linked"  : [ 6, 2, 5, 7, 10 ]        },
        { "left" : 420, "top" : 170, "frame" : 0, "linked"  : [ 7, 6 ]                  },
        { "left" : 150, "top" : 270, "frame" : 1, "linked"  : [ 8, 4, 9, 12 ]           },
        { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 9, 5, 8, 10, 13 ]       },
        { "left" : 330, "top" : 270, "frame" : 1, "linked"  : [ 10, 6, 9, 14 ]          },
        { "left" :  60, "top" : 370, "frame" : 0, "linked"  : [ 11, 12 ]                },
        { "left" : 150, "top" : 370, "frame" : 1, "linked"  : [ 12, 8, 11, 13, 16 ]     },
        { "left" : 240, "top" : 370, "frame" : 0, "linked"  : [ 13, 9, 12, 14 ]         },
        { "left" : 330, "top" : 370, "frame" : 1, "linked"  : [ 14, 10, 13, 15, 17 ]    },
        { "left" : 420, "top" : 370, "frame" : 0, "linked"  : [ 15, 14 ]                },
        { "left" : 150, "top" : 470, "frame" : 1, "linked"  : [ 16, 12 ]                },
        { "left" : 330, "top" : 470, "frame" : 1, "linked"  : [ 17, 14 ]                }
    ],
    //////////////////////////////////  92 (40) //////////////////////////////////
    [
        { "left" : 190, "top" : 140, "frame" : 0, "linked"  : [ 1, 2, 3, 4 ]                },
        { "left" : 290, "top" : 140, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]                },
        { "left" : 140, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 4, 6, 7 ]             },
        { "left" : 240, "top" : 220, "frame" : 1, "linked"  : [ 4, 1, 2, 3, 5, 7, 8 ]       },
        { "left" : 340, "top" : 220, "frame" : 0, "linked"  : [ 5, 2, 4, 8, 9 ]             },
        { "left" :  90, "top" : 300, "frame" : 0, "linked"  : [ 6, 3, 7, 10 ]               },
        { "left" : 190, "top" : 300, "frame" : 1, "linked"  : [ 7, 3, 4, 6, 8, 10, 11 ]     },
        { "left" : 290, "top" : 300, "frame" : 1, "linked"  : [ 8, 4, 5, 7, 9, 11, 12]      },
        { "left" : 390, "top" : 300, "frame" : 0, "linked"  : [ 9, 5, 8, 12 ]               },
        { "left" : 140, "top" : 380, "frame" : 0, "linked"  : [ 10, 6, 7, 11, 13 ]          },
        { "left" : 240, "top" : 380, "frame" : 1, "linked"  : [ 11, 7, 8, 10, 12, 13, 14 ]  },
        { "left" : 340, "top" : 380, "frame" : 0, "linked"  : [ 12, 8, 9, 11, 14 ]          },
        { "left" : 190, "top" : 460, "frame" : 0, "linked"  : [ 13, 10, 11, 14 ]            },
        { "left" : 290, "top" : 460, "frame" : 0, "linked"  : [ 14, 11, 12, 13 ]            }
    ],
    //////////////////////////////////  93 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  50, "frame" : 1, "linked"  : [ 1, 2, 3]                },
        { "left" : 170, "top" : 120, "frame" : 1, "linked"  : [ 2, 1, 4, 5 ]            },
        { "left" : 310, "top" : 120, "frame" : 1, "linked"  : [ 3, 1, 5, 6 ]            },
        { "left" : 100, "top" : 190, "frame" : 1, "linked"  : [ 4, 2, 7 ]               },
        { "left" : 240, "top" : 190, "frame" : 0, "linked"  : [ 5, 2, 3, 7, 8 ]         },
        { "left" : 380, "top" : 190, "frame" : 1, "linked"  : [ 6, 3, 8 ]               },
        { "left" : 170, "top" : 260, "frame" : 0, "linked"  : [ 7, 4, 5, 9, 10 ]        },
        { "left" : 310, "top" : 260, "frame" : 0, "linked"  : [ 8, 5, 6, 10, 11 ]       },
        { "left" : 100, "top" : 330, "frame" : 0, "linked"  : [ 9, 7, 12 ]              },
        { "left" : 240, "top" : 330, "frame" : 1, "linked"  : [ 10, 7, 8, 12, 13 ]      },
        { "left" : 380, "top" : 330, "frame" : 0, "linked"  : [ 11, 8, 13 ]             },
        { "left" : 170, "top" : 400, "frame" : 1, "linked"  : [ 12, 9, 10, 14 ]         },
        { "left" : 310, "top" : 400, "frame" : 1, "linked"  : [ 13, 10, 11, 15 ]        },
        { "left" : 100, "top" : 470, "frame" : 1, "linked"  : [ 14, 12 ]                },
        { "left" : 380, "top" : 470, "frame" : 1, "linked"  : [ 15, 13 ]                }
    ],
//////////////////////////////////  94 NEW //////////////////////////////////
    [
        { "left" : 150, "top" :  60, "frame" : 1, "linked"  : [ 1, 2 ]              },
        { "left" : 240, "top" :  60, "frame" : 1, "linked"  : [ 2, 1, 3, 5]         },
        { "left" : 330, "top" :  60, "frame" : 1, "linked"  : [ 3, 2 ]              },
        { "left" :  60, "top" : 160, "frame" : 0, "linked"  : [ 4, 7 ]              },
        { "left" : 240, "top" : 160, "frame" : 0, "linked"  : [ 5, 2, 9 ]           },
        { "left" : 420, "top" : 160, "frame" : 0, "linked"  : [ 6, 11 ]             },
        { "left" :  60, "top" : 260, "frame" : 1, "linked"  : [ 7, 4, 8, 12 ]       },
        { "left" : 150, "top" : 260, "frame" : 0, "linked"  : [ 8, 7, 9 ]           },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [ 9, 5, 8, 10, 13 ]   },
        { "left" : 330, "top" : 260, "frame" : 0, "linked"  : [ 10, 9, 11 ]         },
        { "left" : 420, "top" : 260, "frame" : 1, "linked"  : [ 11, 6, 10, 14 ]     },
        { "left" :  60, "top" : 360, "frame" : 0, "linked"  : [ 12, 7 ]             },
        { "left" : 240, "top" : 360, "frame" : 0, "linked"  : [ 13, 9, 16 ]         },
        { "left" : 420, "top" : 360, "frame" : 0, "linked"  : [ 14, 11 ]            },
        { "left" : 150, "top" : 460, "frame" : 1, "linked"  : [ 15, 16 ]            },
        { "left" : 240, "top" : 460, "frame" : 1, "linked"  : [ 16, 13, 15, 17 ]    },
        { "left" : 330, "top" : 460, "frame" : 1, "linked"  : [ 17, 16 ]            }
    ],
//////////////////////////////////  95 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  70, "frame" : 1, "linked"  : [ 1, 2, 3 ]               },
        { "left" : 170, "top" : 140, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]            },
        { "left" : 310, "top" : 140, "frame" : 0, "linked"  : [ 3, 1, 5, 6 ]            },
        { "left" : 100, "top" : 210, "frame" : 0, "linked"  : [ 4, 2, 7, 8 ]            },
        { "left" : 240, "top" : 210, "frame" : 1, "linked"  : [ 5, 2, 3, 8, 9 ]         },
        { "left" : 380, "top" : 210, "frame" : 0, "linked"  : [ 6, 3, 9, 10 ]           },
        { "left" :  30, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 11 ]              },
        { "left" : 170, "top" : 280, "frame" : 1, "linked"  : [ 8, 4, 5, 11, 12 ]       },
        { "left" : 310, "top" : 280, "frame" : 1, "linked"  : [ 9, 5, 6, 12, 13 ]       },
        { "left" : 450, "top" : 280, "frame" : 1, "linked"  : [ 10, 6, 13 ]             },
        { "left" : 100, "top" : 350, "frame" : 0, "linked"  : [ 11, 7, 8, 14 ]          },
        { "left" : 240, "top" : 350, "frame" : 1, "linked"  : [ 12, 8, 9, 14, 15 ]      },
        { "left" : 380, "top" : 350, "frame" : 0, "linked"  : [ 13, 9, 10, 15 ]         },
        { "left" : 170, "top" : 420, "frame" : 0, "linked"  : [ 14, 11, 12, 16 ]        },
        { "left" : 310, "top" : 420, "frame" : 0, "linked"  : [ 15, 12, 13, 16 ]        },
        { "left" : 240, "top" : 490, "frame" : 1, "linked"  : [ 16, 14, 15 ]            }
    ],
//////////////////////////////////  96 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 4, 5 ]                    },
        { "left" : 340, "top" : 120, "frame" : 1, "linked"  : [ 2, 1, 3, 5, 6 ]                 },
        { "left" : 440, "top" : 120, "frame" : 1, "linked"  : [ 3, 2, 6 ]                       },
        { "left" : 190, "top" : 200, "frame" : 1, "linked"  : [ 4, 1, 5, 7, 8 ]                 },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 5, 1, 2, 4, 6, 8, 9 ]           },
        { "left" : 390, "top" : 200, "frame" : 0, "linked"  : [ 6, 2, 3, 5, 9 ]                 },
        { "left" : 140, "top" : 280, "frame" : 0, "linked"  : [ 7, 4, 8, 10, 11 ]               },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 8, 4, 5, 7, 9, 11, 12 ]         },
        { "left" : 340, "top" : 280, "frame" : 0, "linked"  : [ 9, 5, 6, 8, 12 ]                },
        { "left" :  90, "top" : 360, "frame" : 0, "linked"  : [ 10, 7, 11, 13, 14 ]             },
        { "left" : 190, "top" : 360, "frame" : 0, "linked"  : [ 11, 7, 8, 10, 12, 14, 15 ]      },
        { "left" : 290, "top" : 360, "frame" : 1, "linked"  : [ 12, 8, 9, 11, 15 ]              },
        { "left" :  40, "top" : 440, "frame" : 1, "linked"  : [ 13, 10, 14 ]                    },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [ 14, 10, 11, 13, 15 ]            },
        { "left" : 240, "top" : 440, "frame" : 1, "linked"  : [ 15, 11, 12, 14 ]                }
    ],
    //////////////////////////////////  97 (43)  //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 1, "linked"  : [ 1, 3, 4 ]                   },
        { "left" : 330, "top" : 140, "frame" : 1, "linked"  : [ 2, 5, 6 ]                   },
        { "left" : 105, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 4, 7, 8 ]             },
        { "left" : 195, "top" : 220, "frame" : 0, "linked"  : [ 4, 1, 3, 5, 8, 9 ]          },
        { "left" : 285, "top" : 220, "frame" : 0, "linked"  : [ 5, 2, 4, 6, 9, 10 ]         },
        { "left" : 375, "top" : 220, "frame" : 0, "linked"  : [ 6, 2, 5, 10, 11 ]           },
        { "left" :  60, "top" : 300, "frame" : 1, "linked"  : [ 7, 3, 8, 12 ]               },
        { "left" : 150, "top" : 300, "frame" : 0, "linked"  : [ 8, 3, 4, 7, 9, 12, 13 ]     },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 9, 4, 5, 8, 10, 13, 14 ]    },
        { "left" : 330, "top" : 300, "frame" : 0, "linked"  : [ 10, 5, 6, 9, 11, 14, 15 ]   },
        { "left" : 420, "top" : 300, "frame" : 1, "linked"  : [ 11, 6, 10, 15 ]             },
        { "left" : 105, "top" : 380, "frame" : 0, "linked"  : [ 12, 7, 8, 13, 16 ]          },
        { "left" : 195, "top" : 380, "frame" : 0, "linked"  : [ 13, 8, 9, 12, 14, 16 ]      },
        { "left" : 285, "top" : 380, "frame" : 0, "linked"  : [ 14, 9, 10, 13, 15, 17 ]     },
        { "left" : 375, "top" : 380, "frame" : 0, "linked"  : [ 15, 10, 11, 14, 17 ]        },
        { "left" : 150, "top" : 460, "frame" : 1, "linked"  : [ 16, 12, 13 ]                },
        { "left" : 330, "top" : 460, "frame" : 1, "linked"  : [ 17, 14, 15 ]                }
    ],
    ////////////////////////////////// 98 (42)  //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 4, 6]             },
        { "left" : 240, "top" : 140, "frame" : 1, "linked"  : [ 2, 1, 3, 4, 5]          },
        { "left" : 380, "top" : 140, "frame" : 1, "linked"  : [ 3, 2, 5, 8 ]            },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 4, 1, 2, 6, 7 ]         },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 5, 2, 3, 7, 8 ]         },
        { "left" : 100, "top" : 280, "frame" : 1, "linked"  : [ 6, 1, 4, 9, 11 ]        },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 5, 9, 10 ]        },
        { "left" : 380, "top" : 280, "frame" : 1, "linked"  : [ 8, 3, 5, 10, 13]        },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [ 9, 6, 7, 11, 12 ]       },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 10, 7, 8, 12, 13 ]      },
        { "left" : 100, "top" : 420, "frame" : 1, "linked"  : [ 11, 6, 9, 12 ]          },
        { "left" : 240, "top" : 420, "frame" : 1, "linked"  : [ 12, 9, 10, 11, 13]      },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 13, 8, 10, 12]          }
    ],
////////////////////////////////// 99 NEW //////////////////////////////////
    [
        { "left" :  90, "top" :  50, "frame" : 1, "linked"  : [ 1, 2, 5 ]                       },
        { "left" : 190, "top" :  50, "frame" : 1, "linked"  : [ 2, 1, 3, 5, 6 ]                 },
        { "left" : 290, "top" :  50, "frame" : 1, "linked"  : [ 3, 2, 4, 6, 7 ]                 },
        { "left" : 390, "top" :  50, "frame" : 1, "linked"  : [ 4, 3, 7 ]                       },
        { "left" : 140, "top" : 120, "frame" : 0, "linked"  : [ 5, 1, 2, 6, 8 ]                 },
        { "left" : 240, "top" : 120, "frame" : 0, "linked"  : [ 6, 2, 3, 5, 7, 8, 9 ]           },
        { "left" : 340, "top" : 120, "frame" : 0, "linked"  : [ 7, 3, 4, 6, 9 ]                 },
        { "left" : 190, "top" : 190, "frame" : 0, "linked"  : [ 8, 5, 6, 9, 10 ]                },
        { "left" : 290, "top" : 190, "frame" : 0, "linked"  : [ 9, 6, 7, 8, 10 ]                },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [ 10, 8, 9, 11, 12 ]              },
        { "left" : 190, "top" : 330, "frame" : 0, "linked"  : [ 11, 10, 12, 13, 14 ]            },
        { "left" : 290, "top" : 330, "frame" : 0, "linked"  : [ 12, 10, 11, 14, 15 ]            },
        { "left" : 140, "top" : 400, "frame" : 0, "linked"  : [ 13, 11, 14, 16, 17 ]            },
        { "left" : 240, "top" : 400, "frame" : 0, "linked"  : [ 14, 11, 12, 13, 15, 17, 18 ]    },
        { "left" : 340, "top" : 400, "frame" : 0, "linked"  : [ 15, 12, 14, 18, 19 ]            },
        { "left" :  90, "top" : 470, "frame" : 1, "linked"  : [ 16, 13, 17 ]                    },
        { "left" : 190, "top" : 470, "frame" : 1, "linked"  : [ 17, 13, 14, 16, 18 ]            },
        { "left" : 290, "top" : 470, "frame" : 1, "linked"  : [ 18, 14, 15, 17, 19 ]            },
        { "left" : 390, "top" : 470, "frame" : 1, "linked"  : [ 19, 15, 18 ]                    }
    ],
    /////////////////////////////////////////////  100 (44)  /////////////////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 4, 5 ]                    },
        { "left" : 240, "top" : 140, "frame" : 0, "linked"  : [ 2, 1, 3, 5, 6 ]                 },
        { "left" : 330, "top" : 140, "frame" : 1, "linked"  : [ 3, 2, 6, 7 ]                    },
        { "left" : 105, "top" : 220, "frame" : 1, "linked"  : [ 4, 1, 5, 8, 9 ]                 },
        { "left" : 195, "top" : 220, "frame" : 0, "linked"  : [ 5, 1, 2, 4, 6, 9, 10 ]          },
        { "left" : 285, "top" : 220, "frame" : 0, "linked"  : [ 6, 2, 3, 5, 7, 10, 11 ]         },
        { "left" : 375, "top" : 220, "frame" : 1, "linked"  : [ 7, 3, 6, 11, 12 ]               },
        { "left" :  60, "top" : 300, "frame" : 1, "linked"  : [ 8, 4, 9, 13 ]                   },
        { "left" : 150, "top" : 300, "frame" : 0, "linked"  : [ 9, 4, 5, 8, 10, 13, 14 ]        },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 10, 5, 6, 9, 11, 14, 15 ]       },
        { "left" : 330, "top" : 300, "frame" : 0, "linked"  : [ 11, 6, 7, 10, 12, 15, 16 ]      },
        { "left" : 420, "top" : 300, "frame" : 1, "linked"  : [ 12, 7, 11, 16 ]                 },
        { "left" : 105, "top" : 380, "frame" : 1, "linked"  : [ 13, 8, 9, 14, 17 ]              },
        { "left" : 195, "top" : 380, "frame" : 0, "linked"  : [ 14, 9, 10, 13, 15, 17, 18 ]     },
        { "left" : 285, "top" : 380, "frame" : 0, "linked"  : [ 15, 10, 11, 14, 16, 18, 19 ]    },
        { "left" : 375, "top" : 380, "frame" : 1, "linked"  : [ 16, 11, 12, 15, 19 ]            },
        { "left" : 150, "top" : 460, "frame" : 1, "linked"  : [ 17, 13, 14, 18 ]                },
        { "left" : 240, "top" : 460, "frame" : 0, "linked"  : [ 18, 14, 15, 17, 19 ]            },
        { "left" : 330, "top" : 460, "frame" : 1, "linked"  : [ 19, 15, 16, 18 ]                }
    ]
];
 

///////////////////////////// Three colors //////////////////////////////////

coordHard = [
    //////////////////////////////////  1  //////////////////////////////////
    [
        { "left" : 240, "top" : 370, "frame" : 1, "linked"  : [ 1 ]         }
    ],
    //////////////////////////////////  2  //////////////////////////////////
    [
        { "left" : 180, "top" : 370, "frame" : 2, "linked"  : [ 1 ]         },
        { "left" : 300, "top" : 370, "frame" : 1, "linked"  : [ 1, 2 ]      }
    ],
    //////////////////////////////////  3  //////////////////////////////////
    [
        { "left" : 120, "top" : 370, "frame" : 1, "linked"  : [ 1, 2 ]      },
        { "left" : 240, "top" : 370, "frame" : 2, "linked"  : [ 2 ]   },
        { "left" : 360, "top" : 370, "frame" : 1, "linked"  : [ 3, 2 ]      }
    ],
    //////////////////////////////////  4  //////////////////////////////////
    [
        { "left" : 240, "top" : 290, "frame" : 2, "linked"  : [ 1, 3 ]      },
        { "left" : 170, "top" : 410, "frame" : 1, "linked"  : [ 2, 1 ]      },
        { "left" : 310, "top" : 410, "frame" : 1, "linked"  : [ 3, 2 ]      }
    ],
    //////////////////////////////////  5  //////////////////////////////////
    [
        { "left" : 120, "top" : 310, "frame" : 1, "linked"  : [ 1, 2 ]      },
        { "left" : 240, "top" : 310, "frame" : 0, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 360, "top" : 310, "frame" : 1, "linked"  : [ 3, 2 ]      },
        { "left" : 240, "top" : 410, "frame" : 1, "linked"  : [ 4, 2 ]      }
    ],
    //////////////////////////////////  6  //////////////////////////////////
    [
        { "left" : 240, "top" : 190, "frame" : 1, "linked"  : [ 1, 2, 3 ]      },
        { "left" : 170, "top" : 280, "frame" : 0, "linked"  : [ 2, 1, 4 ]      },
        { "left" : 310, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 4 ]      },
        { "left" : 240, "top" : 370, "frame" : 2, "linked"  : [ 4, 2, 3 ]      }
    ],
    //////////////////////////////////  7  //////////////////////////////////
    [
        { "left" : 240, "top" : 180, "frame" : 2, "linked"  : [ 1, 3 ]              },
        { "left" : 120, "top" : 290, "frame" : 2, "linked"  : [ 2, 3 ]              },
        { "left" : 240, "top" : 290, "frame" : 1, "linked"  : [ 3, 1, 2, 4, 5 ]     },
        { "left" : 360, "top" : 290, "frame" : 2, "linked"  : [ 4, 3 ]              },
        { "left" : 240, "top" : 400, "frame" : 1, "linked"  : [ 5, 3 ]              }
    ],
    //////////////////////////////////  8  //////////////////////////////////
    [
        { "left" : 120, "top" : 250, "frame" : 1, "linked"  : [ 1, 4 ]         },
        { "left" : 235, "top" : 250, "frame" : 2, "linked"  : [ 2, 4, 5 ]      },
        { "left" : 350, "top" : 250, "frame" : 1, "linked"  : [ 3, 5 ]         },
        { "left" : 177, "top" : 370, "frame" : 0, "linked"  : [ 4, 1, 2 ]      },
        { "left" : 293, "top" : 370, "frame" : 0, "linked"  : [ 5, 2, 3 ]      }
    ],
//////////////////////////////////  9 NEW  //////////////////////////////////
    [
        { "left" :  420, "top" : 180, "frame" : 2, "linked"  : [ 1, 2 ]         },
        { "left" :  340, "top" : 260, "frame" : 1, "linked"  : [ 2, 1, 4 ]      },
        { "left" :  100, "top" : 340, "frame" : 2, "linked"  : [ 3, 5 ]         },
        { "left" :  260, "top" : 340, "frame" : 1, "linked"  : [ 4, 2, 5 ]      },
        { "left" :  180, "top" : 420, "frame" : 1, "linked"  : [ 5, 3, 4 ]      }
    ],
//////////////////////////////////  10 NEW //////////////////////////////////
    [
        { "left" : 235, "top" : 170, "frame" : 2, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 177, "top" : 280, "frame" : 1, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 293, "top" : 280, "frame" : 1, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 120, "top" : 390, "frame" : 0, "linked"  : [ 4, 2 ]      },
        { "left" : 350, "top" : 390, "frame" : 0, "linked"  : [ 5, 3 ]      }
    ],
//////////////////////////////////  11 NEW //////////////////////////////////
    [
        { "left" :  160, "top" : 180, "frame" : 1, "linked"  : [ 1, 3 ]             },
        { "left" :  320, "top" : 180, "frame" : 1, "linked"  : [ 2, 3 ]             },
        { "left" :  240, "top" : 260, "frame" : 0, "linked"  : [ 3, 1, 2, 4, 5 ]    },
        { "left" :  160, "top" : 340, "frame" : 2, "linked"  : [ 4, 3 ]             },
        { "left" :  320, "top" : 340, "frame" : 2, "linked"  : [ 5, 3 ]             }
    ],

//////////////////////////////////  12 NEW //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 0, "linked"  : [ 1, 2 ]          },
        { "left" : 300, "top" : 170, "frame" : 0, "linked"  : [ 2, 1 ]          },
        { "left" : 180, "top" : 280, "frame" : 1, "linked"  : [ 3, 1, 4, 5 ]    },
        { "left" : 300, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 3, 6 ]    },
        { "left" : 180, "top" : 390, "frame" : 2, "linked"  : [ 5, 6 ]          },
        { "left" : 300, "top" : 390, "frame" : 2, "linked"  : [ 6, 5 ]          }
    ],
    //////////////////////////////////  13 (9)  //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3 ]      },
        { "left" : 300, "top" : 170, "frame" : 2, "linked"  : [ 2, 1, 4 ]      },
        { "left" : 120, "top" : 280, "frame" : 2, "linked"  : [ 3, 1, 5 ]      },
        { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 6 ]      },
        { "left" : 180, "top" : 390, "frame" : 0, "linked"  : [ 5, 3, 6 ]      },
        { "left" : 300, "top" : 390, "frame" : 2, "linked"  : [ 6, 5, 4 ]      }
    ],
    //////////////////////////////////  14 (10) //////////////////////////////////
    [
        { "left" : 235, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 177, "top" : 280, "frame" : 1, "linked"  : [ 2, 3, 5 ]   },
        { "left" : 293, "top" : 280, "frame" : 1, "linked"  : [ 3, 2, 5 ]   },
        { "left" : 120, "top" : 390, "frame" : 1, "linked"  : [ 4, 2, 5 ]   },
        { "left" : 235, "top" : 390, "frame" : 1, "linked"  : [ 5, 2, 3 ]   },
        { "left" : 350, "top" : 390, "frame" : 1, "linked"  : [ 6, 3, 5 ]   }
    ],
    //////////////////////////////////  15 (11) //////////////////////////////////
    [
        { "left" : 240, "top" : 200, "frame" : 2, "linked"  : [ 1, 3, 4]     },
        { "left" :  90, "top" : 300, "frame" : 1, "linked"  : [ 2, 3 ]       },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 3, 1, 2, 6 ] },
        { "left" : 290, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 5, 6 ] },
        { "left" : 390, "top" : 300, "frame" : 1, "linked"  : [ 5, 4 ]       },
        { "left" : 240, "top" : 400, "frame" : 0, "linked"  : [ 6, 3, 4 ]    }
    ],

//////////////////////////////////  16 NEW //////////////////////////////////
    [
        { "left" : 120, "top" : 170, "frame" : 1, "linked"  : [ 1, 3 ]          },
        { "left" : 360, "top" : 170, "frame" : 1, "linked"  : [ 2, 5 ]          },
        { "left" : 120, "top" : 280, "frame" : 2, "linked"  : [ 3, 1, 4 ]       },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 4, 3, 5, 6 ]    },
        { "left" : 360, "top" : 280, "frame" : 2, "linked"  : [ 5, 2, 4 ]       },
        { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 6, 4 ]          }
    ],
//////////////////////////////////  17 NEW //////////////////////////////////
    [
        { "left" : 100, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 3 ]    },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 4 ]    },
        { "left" : 170, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 5 ]    },
        { "left" : 310, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 6 ]    },
        { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 5, 3, 6 ]    },
        { "left" : 380, "top" : 390, "frame" : 2, "linked"  : [ 6, 4, 5 ]    }
    ],
//////////////////////////////////  18 NEW  //////////////////////////////////
    [
        { "left" :  140, "top" : 140, "frame" : 0, "linked"  : [ 1, 2, 3 ]   },
        { "left" :   80, "top" : 240, "frame" : 1, "linked"  : [ 2, 1 ]      },
        { "left" :  200, "top" : 240, "frame" : 2, "linked"  : [ 3, 1, 4 ]   },
        { "left" :  260, "top" : 340, "frame" : 2, "linked"  : [ 4, 3, 6 ]   },
        { "left" :  380, "top" : 340, "frame" : 1, "linked"  : [ 5, 6 ]      },
        { "left" :  320, "top" : 440, "frame" : 0, "linked"  : [ 6, 4, 5 ]   }
    ],    
//////////////////////////////////  19 NEW //////////////////////////////////
    [
        { "left" :  160, "top" : 150, "frame" : 2, "linked"  : [ 1, 3 ]             },
        { "left" :  320, "top" : 150, "frame" : 2, "linked"  : [ 2, 3 ]             },
        { "left" :  240, "top" : 230, "frame" : 0, "linked"  : [ 3, 1, 2, 4 ]       },
        { "left" :  240, "top" : 330, "frame" : 0, "linked"  : [ 4, 3, 5, 6 ]       },
        { "left" :  160, "top" : 410, "frame" : 1, "linked"  : [ 5, 4 ]             },
        { "left" :  320, "top" : 410, "frame" : 1, "linked"  : [ 6, 4 ]             }
    ],
//////////////////////////////////  20 NEW  //////////////////////////////////
    [
        { "left" : 240, "top" : 140, "frame" : 2, "linked"  : [ 1, 2, 3 ]            },
        { "left" : 120, "top" : 230, "frame" : 0, "linked"  : [ 2, 1, 5 ]            },
        { "left" : 360, "top" : 230, "frame" : 0, "linked"  : [ 3, 1, 6 ]            },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 1, 2, 3, 5, 6 ]   },
        { "left" : 160, "top" : 380, "frame" : 0, "linked"  : [ 5, 2, 6 ]            },
        { "left" : 320, "top" : 380, "frame" : 0, "linked"  : [ 6, 3, 5 ]            }
    ],
    //////////////////////////////////  21 (12)  //////////////////////////////////
    [
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 1, 3]               },
        { "left" : 120, "top" : 280, "frame" : 0, "linked"  : [ 2, 3 ]              },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 2, 4, 6 ]     },
        { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 4, 3 ]              },
        { "left" : 120, "top" : 390, "frame" : 1, "linked"  : [ 5, 2, 6 ]           },
        { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 6, 3 ]              },
        { "left" : 360, "top" : 390, "frame" : 1, "linked"  : [ 7, 4, 6 ]           }
    ],
//////////////////////////////////  22 NEW //////////////////////////////////
    [
        { "left" : 140, "top" : 170, "frame" : 2, "linked"  : [ 1, 3 ]          },
        { "left" : 340, "top" : 170, "frame" : 2, "linked"  : [ 2, 5 ]          },
        { "left" : 140, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 4, 6 ]    },
        { "left" : 240, "top" : 280, "frame" : 2, "linked"  : [ 4, 3, 5 ]       },
        { "left" : 340, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 4, 7 ]    },
        { "left" : 140, "top" : 390, "frame" : 2, "linked"  : [ 6, 3 ]          },
        { "left" : 340, "top" : 390, "frame" : 2, "linked"  : [ 7, 5 ]          }
    ],
    //////////////////////////////////  23 (13 edit) //////////////////////////////////
    [
        { "left" : 140, "top" : 250, "frame" : 1, "linked"  : [ 1, 2, 4 ]   },
        { "left" : 240, "top" : 250, "frame" : 0, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 340, "top" : 250, "frame" : 1, "linked"  : [ 3, 2, 7 ]   },
        { "left" :  90, "top" : 350, "frame" : 0, "linked"  : [ 4, 1, 5 ]   },
        { "left" : 190, "top" : 350, "frame" : 2, "linked"  : [ 5, 4, 6 ]   },
        { "left" : 290, "top" : 350, "frame" : 2, "linked"  : [ 6, 5, 7 ]   },
        { "left" : 390, "top" : 350, "frame" : 0, "linked"  : [ 7, 3, 6 ]   }
    ],
    //////////////////////////////////  24 (14)  //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 2, "linked"  : [ 1, 2, 3 ]               },
        { "left" : 300, "top" : 170, "frame" : 2, "linked"  : [ 2, 1, 5 ]               },
        { "left" : 120, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 6 ]               },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 1, 2, 3, 5, 6, 7 ]   },
        { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 7 ]               },
        { "left" : 180, "top" : 390, "frame" : 1, "linked"  : [ 6, 3, 7 ]               },
        { "left" : 300, "top" : 390, "frame" : 1, "linked"  : [ 7, 5, 6 ]               }
    ],
//////////////////////////////////  25 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3 ]       },
        { "left" : 150, "top" : 225, "frame" : 2, "linked"  : [ 2, 1, 4, 5 ]    },
        { "left" : 330, "top" : 225, "frame" : 2, "linked"  : [ 3, 1, 5, 6 ]    },
        { "left" :  60, "top" : 280, "frame" : 0, "linked"  : [ 4, 2 ]          },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 3, 7 ]    },
        { "left" : 420, "top" : 280, "frame" : 0, "linked"  : [ 6, 3 ]          },
        { "left" : 240, "top" : 390, "frame" : 1, "linked"  : [ 7, 5 ]          }
    ],

    //////////////////////////////////  26 (16) //////////////////////////////////
    [
        { "left" : 235, "top" : 150, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 177, "top" : 240, "frame" : 2, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 293, "top" : 240, "frame" : 2, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 120, "top" : 330, "frame" : 0, "linked"  : [ 4, 2, 6 ]   },
        { "left" : 350, "top" : 330, "frame" : 0, "linked"  : [ 5, 3, 7 ]   },
        { "left" : 177, "top" : 420, "frame" : 0, "linked"  : [ 6, 4 ]      },
        { "left" : 293, "top" : 420, "frame" : 0, "linked"  : [ 7, 5 ]      }
    ],
//////////////////////////////////  27 NEW  //////////////////////////////////
    [
        { "left" :  60, "top" : 190, "frame" : 1, "linked"  : [ 1, 3 ]         },
        { "left" : 420, "top" : 190, "frame" : 1, "linked"  : [ 2, 5 ]         },
        { "left" : 120, "top" : 280, "frame" : 0, "linked"  : [ 3, 1, 6 ]      },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 3, 5 ]      },
        { "left" : 360, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 7 ]      },
        { "left" : 180, "top" : 370, "frame" : 0, "linked"  : [ 6, 3, 7 ]      },
        { "left" : 300, "top" : 370, "frame" : 0, "linked"  : [ 7, 5, 6 ]      }
    ],
//////////////////////////////////  28 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 0, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 4 ]       },
        { "left" : 140, "top" : 300, "frame" : 0, "linked"  : [ 3, 4, 6 ]       },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 4, 2, 3, 5 ]    },
        { "left" : 340, "top" : 300, "frame" : 0, "linked"  : [ 5, 4, 7 ]       },
        { "left" : 140, "top" : 400, "frame" : 0, "linked"  : [ 6, 3 ]          },
        { "left" : 340, "top" : 400, "frame" : 0, "linked"  : [ 7, 5 ]          }
    ],
//////////////////////////////////  29 NEW //////////////////////////////////
    [
        { "left" : 140, "top" : 170, "frame" : 1, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 3, 4 ]    },
        { "left" : 340, "top" : 170, "frame" : 1, "linked"  : [ 3, 2 ]          },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 6 ]       },
        { "left" : 140, "top" : 390, "frame" : 1, "linked"  : [ 5, 6 ]          },
        { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 6, 4, 5, 7 ]    },
        { "left" : 340, "top" : 390, "frame" : 1, "linked"  : [ 7, 6 ]          }
    ],
//////////////////////////////////  30 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 2, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 3 ]       },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 3, 2, 4, 5 ]    },
        { "left" : 150, "top" : 360, "frame" : 0, "linked"  : [ 4, 3, 6 ]       },
        { "left" : 330, "top" : 360, "frame" : 0, "linked"  : [ 5, 3, 7 ]       },
        { "left" :  60, "top" : 420, "frame" : 2, "linked"  : [ 6, 4 ]          },
        { "left" : 410, "top" : 420, "frame" : 2, "linked"  : [ 7, 5 ]          }
    ],    
    //////////////////////////////////  31 (19)  //////////////////////////////////
    [
        { "left" : 140, "top" : 170, "frame" : 2, "linked"  : [ 1, 2, 4 ]     },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 3 ]     },
        { "left" : 340, "top" : 170, "frame" : 2, "linked"  : [ 3, 2, 5 ]     },
        { "left" : 140, "top" : 280, "frame" : 0, "linked"  : [ 4, 1, 6 ]     },
        { "left" : 340, "top" : 280, "frame" : 0, "linked"  : [ 5, 3, 8 ]     },
        { "left" : 140, "top" : 390, "frame" : 0, "linked"  : [ 6, 4, 7 ]     },
        { "left" : 240, "top" : 390, "frame" : 2, "linked"  : [ 7, 6, 8 ]     },
        { "left" : 340, "top" : 390, "frame" : 0, "linked"  : [ 8, 5, 7 ]     }
    ],
//////////////////////////////////  32 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  90, "frame" : 2, "linked"  : [ 1, 2 ]              },
        { "left" : 240, "top" : 180, "frame" : 1, "linked"  : [ 2, 1, 4 ]           },
        { "left" : 140, "top" : 270, "frame" : 1, "linked"  : [ 3, 4 ]              },
        { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 4, 2, 3, 5, 6 ]     },
        { "left" : 340, "top" : 270, "frame" : 1, "linked"  : [ 5, 4 ]              },
        { "left" : 240, "top" : 360, "frame" : 1, "linked"  : [ 6, 4, 7 ]           },
        { "left" : 240, "top" : 450, "frame" : 2, "linked"  : [ 7, 6 ]              }
    ],
//////////////////////////////////  33 NEW //////////////////////////////////
    [
        { "left" : 190, "top" : 100, "frame" : 2, "linked"  : [ 1, 3 ]              },
        { "left" :  90, "top" : 200, "frame" : 2, "linked"  : [ 2, 3 ]              },
        { "left" : 190, "top" : 200, "frame" : 0, "linked"  : [ 3, 1, 2, 4, 6 ]     },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 4, 3, 5 ]           },
        { "left" : 390, "top" : 200, "frame" : 1, "linked"  : [ 5, 4 ]              },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 6, 3, 7 ]           },
        { "left" : 190, "top" : 400, "frame" : 1, "linked"  : [ 7, 6 ]              }
    ],
//////////////////////////////////  34 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 1, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 190, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 140, "top" : 300, "frame" : 0, "linked"  : [ 4, 2, 6 ]   },
        { "left" : 340, "top" : 300, "frame" : 0, "linked"  : [ 5, 3, 7 ]   },
        { "left" :  90, "top" : 400, "frame" : 0, "linked"  : [ 6, 4 ]      },
        { "left" : 390, "top" : 400, "frame" : 0, "linked"  : [ 7, 5 ]      }
    ],
    //////////////////////////////////  35 (20)  //////////////////////////////////
    [
        { "left" : 120, "top" : 170, "frame" : 1, "linked"  : [ 1, 2, 4 ]       },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [ 2, 4, 5 ]       },
        { "left" : 360, "top" : 170, "frame" : 1, "linked"  : [ 3, 2, 5 ]       },
        { "left" : 180, "top" : 280, "frame" : 0, "linked"  : [ 4, 2, 7 ]       },
        { "left" : 300, "top" : 280, "frame" : 0, "linked"  : [ 5, 2, 7 ]       },
        { "left" : 120, "top" : 390, "frame" : 2, "linked"  : [ 6, 4, 7 ]       },
        { "left" : 240, "top" : 390, "frame" : 2, "linked"  : [ 7, 4, 5 ]       },
        { "left" : 360, "top" : 390, "frame" : 2, "linked"  : [ 8, 5, 7 ]       }
    ],
//////////////////////////////////  36 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  90, "frame" : 2, "linked"  : [ 1, 2 ]        },
        { "left" : 190, "top" : 180, "frame" : 0, "linked"  : [ 2, 1, 3 ]     },
        { "left" : 140, "top" : 270, "frame" : 2, "linked"  : [ 3, 2, 4 ]     },
        { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 4, 3, 5 ]     },
        { "left" : 340, "top" : 270, "frame" : 2, "linked"  : [ 5, 4, 6 ]     },
        { "left" : 290, "top" : 360, "frame" : 0, "linked"  : [ 6, 5, 7 ]     },
        { "left" : 240, "top" : 450, "frame" : 2, "linked"  : [ 7, 6 ]        }
    ],
    //////////////////////////////////  37 (17)  //////////////////////////////////
    [
        { "left" : 240, "top" : 140, "frame" : 0, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 2, 1, 4 ]           },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 4 ]           },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 3, 5, 6 ]     },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [ 5, 4, 7]            },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 6, 4, 7 ]           },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 7, 5, 6 ]           }
    ],
    //////////////////////////////////  38 (26) //////////////////////////////////
    [
        { "left" :  90, "top" : 250, "frame" : 0, "linked"  : [ 1, 2, 5 ]       },
        { "left" : 190, "top" : 250, "frame" : 2, "linked"  : [ 2, 1, 3 ]       },
        { "left" : 290, "top" : 250, "frame" : 2, "linked"  : [ 3, 2, 4 ]       },
        { "left" : 390, "top" : 250, "frame" : 0, "linked"  : [ 4, 3, 8 ]       },
        { "left" :  90, "top" : 350, "frame" : 1, "linked"  : [ 5, 1, 6 ]       },
        { "left" : 190, "top" : 350, "frame" : 0, "linked"  : [ 6, 5, 7 ]       },
        { "left" : 290, "top" : 350, "frame" : 0, "linked"  : [ 7, 6, 8 ]       },
        { "left" : 390, "top" : 350, "frame" : 1, "linked"  : [ 8, 4, 7 ]       }
    ],
    //////////////////////////////////  39 (27) //////////////////////////////////
    [
        { "left" :  200, "top" : 180, "frame" : 0, "linked"  : [ 1, 3, 4 ]          },
        { "left" :  360, "top" : 180, "frame" : 2, "linked"  : [ 2, 1, 4, 6 ]       },
        { "left" :  120, "top" : 260, "frame" : 0, "linked"  : [ 3, 1, 5 ]          },
        { "left" :  280, "top" : 260, "frame" : 1, "linked"  : [ 4, 1, 2, 5, 6 ]    },
        { "left" :  200, "top" : 340, "frame" : 1, "linked"  : [ 5, 3, 4, 7, 8 ]    },
        { "left" :  360, "top" : 340, "frame" : 0, "linked"  : [ 6, 4, 8 ]          },
        { "left" :  120, "top" : 420, "frame" : 2, "linked"  : [ 7, 3, 5, 8 ]       },
        { "left" :  280, "top" : 420, "frame" : 0, "linked"  : [ 8, 5, 6 ]          }
    ],
    //////////////////////////////////  40 (28) //////////////////////////////////
    [
        { "left" : 130, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 4 ]            },
        { "left" : 240, "top" : 200, "frame" : 2, "linked"  : [ 2, 1, 3 ]            },
        { "left" : 350, "top" : 200, "frame" : 0, "linked"  : [ 3, 2, 5 ]            },
        { "left" :  80, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 6 ]            },
        { "left" : 400, "top" : 300, "frame" : 0, "linked"  : [ 5, 3, 8 ]            },
        { "left" : 130, "top" : 400, "frame" : 0, "linked"  : [ 6, 4, 7 ]            },
        { "left" : 240, "top" : 400, "frame" : 1, "linked"  : [ 7, 6, 8 ]            },
        { "left" : 350, "top" : 400, "frame" : 0, "linked"  : [ 8, 5, 7 ]            }
    ],
    //////////////////////////////////  41 (29) //////////////////////////////////
    [
        { "left" : 140, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 4 ]       },
        { "left" : 240, "top" : 120, "frame" : 0, "linked"  : [ 2, 1, 3, 4]     },
        { "left" : 340, "top" : 120, "frame" : 0, "linked"  : [ 3, 2, 4]        },
        { "left" : 240, "top" : 220, "frame" : 1, "linked"  : [ 4, 2, 5 ]       },
        { "left" : 240, "top" : 320, "frame" : 1, "linked"  : [ 5, 4, 7 ]       },
        { "left" : 140, "top" : 420, "frame" : 0, "linked"  : [ 6, 5, 7 ]       },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 7, 5, 6, 8 ]    },
        { "left" : 340, "top" : 420, "frame" : 0, "linked"  : [ 8, 5, 7 ]       }
    ],
    //////////////////////////////////  42 (32) //////////////////////////////////
    [
        { "left" : 190, "top" : 200, "frame" : 2, "linked"  : [ 1, 2, 4, 5 ]            },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 3, 5, 6 ]         },
        { "left" : 390, "top" : 200, "frame" : 0, "linked"  : [ 3, 2, 6 ]               },
        { "left" : 140, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 5, 7, 8 ]         },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 5, 1, 2, 4, 6, 8, 9 ]   },
        { "left" : 340, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 3, 5, 9 ]         },
        { "left" :  90, "top" : 400, "frame" : 0, "linked"  : [ 7, 4, 8 ]               },
        { "left" : 190, "top" : 400, "frame" : 0, "linked"  : [ 8, 4, 5, 7, 9 ]         },
        { "left" : 290, "top" : 400, "frame" : 2, "linked"  : [ 9, 5, 6, 8 ]            }
    ],
    //////////////////////////////////  43 (31) //////////////////////////////////
    [
        { "left" : 180, "top" : 170, "frame" : 0, "linked"  : [ 1, 2, 3, 4 ]            },
        { "left" : 300, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]            },
        { "left" : 120, "top" : 260, "frame" : 0, "linked"  : [ 3, 1, 4, 6 ]            },
        { "left" : 240, "top" : 260, "frame" : 0, "linked"  : [ 4, 1, 2, 3, 5, 6, 7 ]   },
        { "left" : 360, "top" : 260, "frame" : 0, "linked"  : [ 5, 2, 4, 7 ]            },
        { "left" : 180, "top" : 350, "frame" : 2, "linked"  : [ 6, 3, 4, 7, 8 ]         },
        { "left" : 300, "top" : 350, "frame" : 2, "linked"  : [ 7, 4, 5, 6, 8 ]         },
        { "left" : 240, "top" : 440, "frame" : 1, "linked"  : [ 8, 6, 7]                }
    ],
    //////////////////////////////////  44 (30) //////////////////////////////////
    [
        { "left" : 240, "top" : 150, "frame" : 0, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 160, "top" : 210, "frame" : 1, "linked"  : [ 2, 1, 4]            },
        { "left" : 320, "top" : 210, "frame" : 1, "linked"  : [ 3, 1, 4]            },
        { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 4, 2, 3, 5, 6 ]     },
        { "left" : 160, "top" : 330, "frame" : 0, "linked"  : [ 5, 4, 7]            },
        { "left" : 320, "top" : 330, "frame" : 0, "linked"  : [ 6, 4, 7]            },
        { "left" : 240, "top" : 390, "frame" : 0, "linked"  : [ 7, 5, 6, 8, 9]      },
        { "left" : 160, "top" : 450, "frame" : 2, "linked"  : [ 8, 7]               },
        { "left" : 320, "top" : 450, "frame" : 2, "linked"  : [ 9, 7]               }
    ],
//////////////////////////////////  45 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 120, "frame" : 2, "linked"  : [ 1, 2 ]          },
        { "left" : 240, "top" : 220, "frame" : 0, "linked"  : [ 2, 1, 4 ]       },
        { "left" :  60, "top" : 320, "frame" : 2, "linked"  : [ 3, 6 ]          },
        { "left" : 240, "top" : 320, "frame" : 1, "linked"  : [ 4, 2, 8 ]       },
        { "left" : 420, "top" : 320, "frame" : 2, "linked"  : [ 5, 7 ]          },
        { "left" : 150, "top" : 370, "frame" : 0, "linked"  : [ 6, 3, 4, 8 ]    },
        { "left" : 330, "top" : 370, "frame" : 0, "linked"  : [ 7, 5, 4, 8 ]    },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 8, 6, 7 ]       }
    ],
    //////////////////////////////////  46 (15) //////////////////////////////////
    [
        { "left" : 140, "top" : 200, "frame" : 0, "linked"  : [ 1, 3, 4]    },
        { "left" : 340, "top" : 200, "frame" : 0, "linked"  : [ 2, 5, 6]    },
        { "left" :  90, "top" : 300, "frame" : 1, "linked"  : [ 3, 1, 7 ]   },
        { "left" : 190, "top" : 300, "frame" : 2, "linked"  : [ 4, 3, 5 ]   },
        { "left" : 290, "top" : 300, "frame" : 2, "linked"  : [ 5, 4, 6]    },
        { "left" : 390, "top" : 300, "frame" : 1, "linked"  : [ 6, 2, 8 ]   },
        { "left" : 140, "top" : 400, "frame" : 0, "linked"  : [ 7, 3, 4 ]   },
        { "left" : 340, "top" : 400, "frame" : 0, "linked"  : [ 8, 5, 6 ]   }
    ],
    //////////////////////////////////  47 (18) //////////////////////////////////
    [
        { "left" : 120, "top" : 180, "frame" : 0, "linked"  : [ 1, 3 ]          },
        { "left" : 360, "top" : 180, "frame" : 1, "linked"  : [ 2, 4 ]          },
        { "left" : 190, "top" : 250, "frame" : 2, "linked"  : [ 3, 1, 4, 5 ]    },
        { "left" : 290, "top" : 250, "frame" : 0, "linked"  : [ 4, 2, 3, 6]     },
        { "left" : 190, "top" : 350, "frame" : 0, "linked"  : [ 5, 3, 6, 7 ]    },
        { "left" : 290, "top" : 350, "frame" : 2, "linked"  : [ 6, 4, 5, 8 ]    },
        { "left" : 120, "top" : 420, "frame" : 1, "linked"  : [ 7, 5 ]          },
        { "left" : 360, "top" : 420, "frame" : 0, "linked"  : [ 8, 6 ]          }
    ],
//////////////////////////////////  48 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 2, "linked"  : [ 1, 2, 3 ]    },
        { "left" : 150, "top" : 180, "frame" : 0, "linked"  : [ 2, 1, 4 ]    },
        { "left" : 330, "top" : 180, "frame" : 0, "linked"  : [ 3, 1, 5 ]    },
        { "left" :  60, "top" : 260, "frame" : 1, "linked"  : [ 4, 2, 6 ]    },
        { "left" : 420, "top" : 260, "frame" : 1, "linked"  : [ 5, 3, 7 ]    },
        { "left" : 150, "top" : 340, "frame" : 0, "linked"  : [ 6, 4, 8 ]    },
        { "left" : 330, "top" : 340, "frame" : 0, "linked"  : [ 7, 5, 8 ]    },
        { "left" : 240, "top" : 420, "frame" : 2, "linked"  : [ 8, 6, 7 ]    }
    ],
//////////////////////////////////  49 NEW //////////////////////////////////
    [
        { "left" :  90, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 5 ]   },
        { "left" : 190, "top" : 200, "frame" : 2, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 290, "top" : 200, "frame" : 2, "linked"  : [ 3, 2, 4 ]   },
        { "left" : 390, "top" : 200, "frame" : 0, "linked"  : [ 4, 3, 7 ]   },
        { "left" : 140, "top" : 300, "frame" : 1, "linked"  : [ 5, 1, 8 ]   },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 3, 5, 7, 8, 9 ]   },
        { "left" : 340, "top" : 300, "frame" : 1, "linked"  : [ 7, 4, 9 ]   },
        { "left" : 190, "top" : 400, "frame" : 0, "linked"  : [ 8, 5, 9 ]   },
        { "left" : 290, "top" : 400, "frame" : 0, "linked"  : [ 9, 7, 8]    }
    ],
//////////////////////////////////  50 NEW  //////////////////////////////////
    [
        { "left" : 240, "top" :  60, "frame" : 1, "linked"  : [  1, 2 ]                 },
        { "left" : 240, "top" : 160, "frame" : 0, "linked"  : [  2, 1, 7 ]              },
        { "left" :  40, "top" : 215, "frame" : 1, "linked"  : [  3, 5 ]                 },
        { "left" : 440, "top" : 215, "frame" : 1, "linked"  : [  4, 6 ]                 },
        { "left" : 140, "top" : 240, "frame" : 0, "linked"  : [  5, 3, 7 ]              },
        { "left" : 340, "top" : 240, "frame" : 0, "linked"  : [  6, 4, 7 ]              },
        { "left" : 240, "top" : 265, "frame" : 2, "linked"  : [  7, 2, 5, 6, 8, 9 ]     },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [  8, 7, 10 ]             },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [  9, 7, 11 ]             },
        { "left" : 100, "top" : 435, "frame" : 1, "linked"  : [ 10, 8 ]                 },
        { "left" : 380, "top" : 435, "frame" : 1, "linked"  : [ 11, 9 ]                 }
    ],
    //////////////////////////////////  51 (21)  //////////////////////////////////
    [
        { "left" : 120, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 4 ]   },
        { "left" : 240, "top" : 120, "frame" : 2, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 360, "top" : 120, "frame" : 0, "linked"  : [ 3, 2 ]      },
        { "left" : 180, "top" : 200, "frame" : 0, "linked"  : [ 4, 1, 5 ]   },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [ 5, 4, 6 ]   },
        { "left" : 300, "top" : 360, "frame" : 0, "linked"  : [ 6, 5, 9 ]   },
        { "left" : 120, "top" : 440, "frame" : 0, "linked"  : [ 7, 8 ]      },
        { "left" : 240, "top" : 440, "frame" : 2, "linked"  : [ 8, 7, 9 ]   },
        { "left" : 360, "top" : 440, "frame" : 0, "linked"  : [ 9, 6, 8 ]   }
    ],
//////////////////////////////////  52 NEW //////////////////////////////////
    [
        { "left" :  80, "top" : 150, "frame" : 2, "linked"  : [ 1, 3]            },
        { "left" : 240, "top" : 150, "frame" : 2, "linked"  : [ 2, 3]            },
        { "left" : 160, "top" : 220, "frame" : 1, "linked"  : [ 3, 1, 2, 4, 5 ]  },
        { "left" :  80, "top" : 290, "frame" : 2, "linked"  : [ 4, 3 ]           },
        { "left" : 240, "top" : 290, "frame" : 2, "linked"  : [ 5, 3, 7]         },
        { "left" : 400, "top" : 290, "frame" : 2, "linked"  : [ 6, 7]            },
        { "left" : 320, "top" : 360, "frame" : 1, "linked"  : [ 7, 5, 6, 8, 9]   },
        { "left" : 240, "top" : 430, "frame" : 2, "linked"  : [ 8, 7]            },
        { "left" : 400, "top" : 430, "frame" : 2, "linked"  : [ 9, 7]            }
    ],
    //////////////////////////////////  53 (23)  //////////////////////////////////
    [
        { "left" : 130, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 3 ]       },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 2, 3, 4 ]       },
        { "left" : 130, "top" : 220, "frame" : 1, "linked"  : [ 3, 2, 5 ]       },
        { "left" : 350, "top" : 220, "frame" : 2, "linked"  : [ 4, 2, 5 ]       },
        { "left" : 240, "top" : 270, "frame" : 0, "linked"  : [ 5, 2, 8 ]       },
        { "left" : 130, "top" : 320, "frame" : 1, "linked"  : [ 6, 5, 8 ]       },
        { "left" : 350, "top" : 320, "frame" : 2, "linked"  : [ 7, 5, 8 ]       },
        { "left" : 240, "top" : 370, "frame" : 0, "linked"  : [ 8, 6, 7 ]       },
        { "left" : 130, "top" : 420, "frame" : 0, "linked"  : [ 9, 6, 8 ]       }
    ],
    ////////////////////////////////// 54 (25) //////////////////////////////////
    [
        { "left" : 240, "top" : 150, "frame" : 0, "linked"  : [ 1, 2, 3 ]   },
        { "left" : 190, "top" : 240, "frame" : 2, "linked"  : [ 2, 1, 4 ]   },
        { "left" : 290, "top" : 240, "frame" : 2, "linked"  : [ 3, 1, 5 ]   },
        { "left" : 140, "top" : 330, "frame" : 0, "linked"  : [ 4, 2, 6 ]   },
        { "left" : 340, "top" : 330, "frame" : 0, "linked"  : [ 5, 3, 9 ]   },
        { "left" :  90, "top" : 420, "frame" : 1, "linked"  : [ 6, 4, 7 ]   },
        { "left" : 190, "top" : 420, "frame" : 0, "linked"  : [ 7, 6, 8 ]   },
        { "left" : 290, "top" : 420, "frame" : 0, "linked"  : [ 8, 7, 9 ]   },
        { "left" : 390, "top" : 420, "frame" : 1, "linked"  : [ 9, 5, 8 ]   }
    ],
    //////////////////////////////////  55 (22) //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [ 1, 3 ]              },
        { "left" : 380, "top" : 140, "frame" : 1, "linked"  : [ 2, 4 ]              },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 5 ]           },
        { "left" : 310, "top" : 210, "frame" : 0, "linked"  : [ 4, 2, 5 ]           },
        { "left" : 240, "top" : 280, "frame" : 2, "linked"  : [ 5, 3, 4, 6, 7 ]     },
        { "left" : 170, "top" : 350, "frame" : 0, "linked"  : [ 6, 5, 8 ]           },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 7, 5, 9 ]           },
        { "left" : 100, "top" : 420, "frame" : 1, "linked"  : [ 8, 6 ]              },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 9, 7 ]              }
    ],
//////////////////////////////////  56 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 200, "frame" : 1, "linked"  : [ 1, 4 ]              },
        { "left" : 330, "top" : 200, "frame" : 1, "linked"  : [ 2, 6 ]              },
        { "left" :  60, "top" : 300, "frame" : 2, "linked"  : [ 3, 4 ]              },
        { "left" : 150, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 3, 5, 8 ]     },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 5, 4, 6 ]           },
        { "left" : 330, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 5, 7, 9 ]     },
        { "left" : 420, "top" : 300, "frame" : 2, "linked"  : [ 7, 6 ]              },
        { "left" : 150, "top" : 400, "frame" : 1, "linked"  : [ 8, 4 ]              },
        { "left" : 330, "top" : 400, "frame" : 1, "linked"  : [ 9, 6 ]              }
    ],
    //////////////////////////////////  57 (38) //////////////////////////////////
    [
        { "left" : 190, "top" : 170, "frame" : 2, "linked"  : [ 1, 2, 3, 5 ]        },
        { "left" : 290, "top" : 170, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]        },
        { "left" : 110, "top" : 250, "frame" : 0, "linked"  : [ 3, 1, 5, 6 ]        },
        { "left" : 370, "top" : 250, "frame" : 1, "linked"  : [ 4, 2, 5, 7 ]        },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 4, 6, 9 ]     },
        { "left" : 110, "top" : 350, "frame" : 1, "linked"  : [ 6, 3, 5, 8 ]        },
        { "left" : 370, "top" : 350, "frame" : 0, "linked"  : [ 7, 4, 5, 9 ]        },
        { "left" : 190, "top" : 430, "frame" : 0, "linked"  : [ 8, 5, 6, 9 ]        },
        { "left" : 290, "top" : 430, "frame" : 2, "linked"  : [ 9, 5, 7, 8 ]        }
    ],
    //////////////////////////////////  58 (24)  //////////////////////////////////
    [
        { "left" : 240, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 170, "top" : 210, "frame" : 1, "linked"  : [ 2, 5 ]              },
        { "left" : 310, "top" : 210, "frame" : 1, "linked"  : [ 3, 5 ]              },
        { "left" : 100, "top" : 280, "frame" : 1, "linked"  : [ 4, 2, 7 ]           },
        { "left" : 240, "top" : 280, "frame" : 2, "linked"  : [ 5, 1, 4, 6, 9 ]     },
        { "left" : 380, "top" : 280, "frame" : 1, "linked"  : [ 6, 3, 8]            },
        { "left" : 170, "top" : 350, "frame" : 1, "linked"  : [ 7, 5 ]              },
        { "left" : 310, "top" : 350, "frame" : 1, "linked"  : [ 8, 5 ]              },
        { "left" : 240, "top" : 420, "frame" : 1, "linked"  : [ 9, 7, 8 ]           }
    ],
//////////////////////////////////  59 NEW //////////////////////////////////
    [
        { "left" : 140, "top" :  80, "frame" : 0, "linked"  : [  1, 2, 4 ]      },
        { "left" : 240, "top" :  80, "frame" : 0, "linked"  : [  2, 1, 3 ]      },
        { "left" : 340, "top" :  80, "frame" : 1, "linked"  : [  3, 2 ]         },
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [  4, 1, 5 ]      },
        { "left" : 140, "top" : 260, "frame" : 0, "linked"  : [  5, 4, 6 ]      },
        { "left" : 240, "top" : 260, "frame" : 2, "linked"  : [  6, 5, 7 ]      },
        { "left" : 340, "top" : 260, "frame" : 0, "linked"  : [  7, 6, 8 ]      },
        { "left" : 340, "top" : 350, "frame" : 0, "linked"  : [  8, 7, 11 ]     },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [  9, 10 ]        },
        { "left" : 240, "top" : 440, "frame" : 0, "linked"  : [ 10, 9, 11 ]     },
        { "left" : 340, "top" : 440, "frame" : 0, "linked"  : [ 11, 8, 10 ]     }
    ],
////////////////////////////////// 60 NEW //////////////////////////////////
    [
        { "left" :  90, "top" : 150, "frame" : 1, "linked"  : [  1, 2 ]             },
        { "left" :  90, "top" : 240, "frame" : 0, "linked"  : [  2, 1, 3, 4 ]       },
        { "left" : 190, "top" : 240, "frame" : 2, "linked"  : [  3, 2, 5 ]          },
        { "left" :  90, "top" : 330, "frame" : 0, "linked"  : [  4, 2, 5, 7 ]       },
        { "left" : 190, "top" : 330, "frame" : 2, "linked"  : [  5, 3, 4, 6, 8 ]    },
        { "left" : 290, "top" : 330, "frame" : 2, "linked"  : [  6, 5, 9 ]          },
        { "left" :  90, "top" : 420, "frame" : 0, "linked"  : [  7, 4, 8 ]          },
        { "left" : 190, "top" : 420, "frame" : 0, "linked"  : [  8, 5, 7, 9 ]       },
        { "left" : 290, "top" : 420, "frame" : 0, "linked"  : [  9, 6, 8, 10 ]      },
        { "left" : 390, "top" : 420, "frame" : 1, "linked"  : [ 10, 9 ]             }
    ],
////////////////////////////////// 61 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 1, "linked"  : [  1, 3, 4 ]          },
        { "left" :  80, "top" : 200, "frame" : 2, "linked"  : [  2, 3, 6 ]          },
        { "left" : 195, "top" : 200, "frame" : 0, "linked"  : [  3, 1, 2, 4, 6 ]    },
        { "left" : 285, "top" : 200, "frame" : 0, "linked"  : [  4, 1, 3, 5, 7 ]    },
        { "left" : 400, "top" : 200, "frame" : 2, "linked"  : [  5, 4, 7 ]          },
        { "left" : 160, "top" : 280, "frame" : 0, "linked"  : [  6, 2, 3, 8, 9 ]    },
        { "left" : 320, "top" : 280, "frame" : 0, "linked"  : [  7, 4, 5, 8, 10 ]   },
        { "left" : 240, "top" : 330, "frame" : 1, "linked"  : [  8, 6, 7, 9, 10 ]   },
        { "left" : 130, "top" : 390, "frame" : 2, "linked"  : [  9, 6, 8 ]          },
        { "left" : 350, "top" : 390, "frame" : 2, "linked"  : [ 10, 7, 8 ]          }
    ],
    //////////////////////////////////  62 (33) //////////////////////////////////
    [
        { "left" : 140, "top" : 200, "frame" : 0, "linked"  : [ 1, 2, 4, 5 ]            },
        { "left" : 240, "top" : 200, "frame" : 0, "linked"  : [ 2, 1, 3, 5, 6 ]         },
        { "left" : 340, "top" : 200, "frame" : 0, "linked"  : [ 3, 2, 6, 7 ]            },
        { "left" :  90, "top" : 300, "frame" : 2, "linked"  : [ 4, 1, 5, 8 ]            },
        { "left" : 190, "top" : 300, "frame" : 1, "linked"  : [ 5, 1, 2, 4, 6, 8, 9 ]   },
        { "left" : 290, "top" : 300, "frame" : 1, "linked"  : [ 6, 2, 3, 5, 7, 9, 10 ]  },
        { "left" : 390, "top" : 300, "frame" : 2, "linked"  : [ 7, 3, 6, 10 ]           },
        { "left" : 140, "top" : 400, "frame" : 0, "linked"  : [ 8, 4, 5, 9 ]            },
        { "left" : 240, "top" : 400, "frame" : 0, "linked"  : [ 9, 5, 6, 8, 10 ]        },
        { "left" : 340, "top" : 400, "frame" : 0, "linked"  : [ 10, 6, 7, 9 ]           }
    ],
//////////////////////////////////  63 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  80, "frame" : 0, "linked"  : [  1, 3 ]             },
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [  2, 3 ]             },
        { "left" : 240, "top" : 170, "frame" : 2, "linked"  : [  3, 1, 2, 4, 5 ]    },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [  4, 3 ]             },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [  5, 3, 7 ]          },
        { "left" : 140, "top" : 350, "frame" : 0, "linked"  : [  6, 7 ]             },
        { "left" : 240, "top" : 350, "frame" : 2, "linked"  : [  7, 5, 6, 8, 9 ]    },
        { "left" : 340, "top" : 350, "frame" : 0, "linked"  : [  8, 7 ]             },
        { "left" : 240, "top" : 440, "frame" : 0, "linked"  : [  9, 7 ]             }
    ],
    //////////////////////////////////  64 (35) //////////////////////////////////
    [
        { "left" : 240, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 3 ]               },
        { "left" : 190, "top" : 220, "frame" : 0, "linked"  : [ 2, 1, 3, 4, 5 ]         },
        { "left" : 290, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 2, 5, 6 ]         },
        { "left" : 140, "top" : 320, "frame" : 0, "linked"  : [ 4, 2, 5, 7, 8 ]         },
        { "left" : 240, "top" : 320, "frame" : 0, "linked"  : [ 5, 2, 3, 4, 6, 8, 9 ]   },
        { "left" : 340, "top" : 320, "frame" : 0, "linked"  : [ 6, 3, 5, 9, 10 ]        },
        { "left" :  90, "top" : 420, "frame" : 2, "linked"  : [ 7, 4, 8 ]               },
        { "left" : 190, "top" : 420, "frame" : 0, "linked"  : [ 8, 4, 5, 7, 9 ]         },
        { "left" : 290, "top" : 420, "frame" : 0, "linked"  : [ 9, 5, 6, 8, 10 ]        },
        { "left" : 390, "top" : 420, "frame" : 2, "linked"  : [ 10, 6, 9 ]              }
    ],
//////////////////////////////////  65 NEW //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [  1, 3 ]             },
        { "left" : 380, "top" : 140, "frame" : 1, "linked"  : [  2, 4 ]             },
        { "left" : 170, "top" : 210, "frame" : 1, "linked"  : [  3, 1, 5, 6 ]       },
        { "left" : 310, "top" : 210, "frame" : 1, "linked"  : [  4, 2, 6, 7 ]       },
        { "left" : 100, "top" : 280, "frame" : 2, "linked"  : [  5, 3, 8 ]          },
        { "left" : 240, "top" : 280, "frame" : 1, "linked"  : [  6, 3, 4, 8, 9 ]    },
        { "left" : 380, "top" : 280, "frame" : 2, "linked"  : [  7, 4, 9 ]          },
        { "left" : 170, "top" : 350, "frame" : 1, "linked"  : [  8, 5, 6, 10 ]      },
        { "left" : 310, "top" : 350, "frame" : 1, "linked"  : [  9, 6, 7, 11 ]      },
        { "left" : 100, "top" : 420, "frame" : 1, "linked"  : [ 10, 8 ]             },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 11, 9 ]             }
    ],
//////////////////////////////////  66 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 120, "frame" : 0, "linked"  : [  1, 3, 4 ]              },
        { "left" : 330, "top" : 120, "frame" : 0, "linked"  : [  2, 3, 5]               },
        { "left" : 240, "top" : 170, "frame" : 1, "linked"  : [  3, 1, 2, 4, 5]         },
        { "left" : 150, "top" : 220, "frame" : 0, "linked"  : [  4, 1, 3, 6, 8 ]        },
        { "left" : 330, "top" : 220, "frame" : 0, "linked"  : [  5, 2, 3, 7, 9 ]        },
        { "left" :  60, "top" : 270, "frame" : 2, "linked"  : [  6, 4, 8 ]              },
        { "left" : 420, "top" : 270, "frame" : 2, "linked"  : [  7, 5, 9 ]              },
        { "left" : 150, "top" : 320, "frame" : 0, "linked"  : [  8, 4, 6, 10, 11 ]      },
        { "left" : 330, "top" : 320, "frame" : 0, "linked"  : [  9, 5, 7, 10, 12 ]      },
        { "left" : 240, "top" : 370, "frame" : 1, "linked"  : [ 10, 8, 9, 11, 12 ]      },
        { "left" : 150, "top" : 420, "frame" : 0, "linked"  : [ 11, 8, 10 ]             },
        { "left" : 330, "top" : 420, "frame" : 0, "linked"  : [ 12, 9, 10 ]             }
    ],
////////////////////////////////// 67 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 100, "frame" : 2, "linked"  : [  1, 2, 3 ]      },
        { "left" : 150, "top" : 165, "frame" : 0, "linked"  : [  2, 1, 4 ]      },
        { "left" : 330, "top" : 165, "frame" : 0, "linked"  : [  3, 1, 5 ]      },
        { "left" :  60, "top" : 230, "frame" : 1, "linked"  : [  4, 2, 6 ]      },
        { "left" : 420, "top" : 230, "frame" : 1, "linked"  : [  5, 3, 7 ]      },
        { "left" : 100, "top" : 325, "frame" : 0, "linked"  : [  6, 4, 8 ]      },
        { "left" : 380, "top" : 325, "frame" : 0, "linked"  : [  7, 5, 10 ]     },
        { "left" : 140, "top" : 420, "frame" : 1, "linked"  : [  8, 6, 9 ]      },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [  9, 8, 10 ]     },
        { "left" : 340, "top" : 420, "frame" : 1, "linked"  : [ 10, 7, 9 ]      }
    ],
//////////////////////////////////  68 NEW //////////////////////////////////
    [
        { "left" : 140, "top" :  80, "frame" : 2, "linked"  : [  1, 2 ]             },
        { "left" : 240, "top" :  80, "frame" : 0, "linked"  : [  2, 1, 3, 4 ]       },
        { "left" : 340, "top" :  80, "frame" : 2, "linked"  : [  3, 2 ]             },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [  4, 2, 6 ]          },
        { "left" : 140, "top" : 260, "frame" : 0, "linked"  : [  5, 6 ]             },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [  6, 4, 5, 7, 8 ]    },
        { "left" : 340, "top" : 260, "frame" : 0, "linked"  : [  7, 6 ]             },
        { "left" : 240, "top" : 350, "frame" : 0, "linked"  : [  8, 6, 10 ]         },
        { "left" : 140, "top" : 440, "frame" : 2, "linked"  : [  9, 10 ]            },
        { "left" : 240, "top" : 440, "frame" : 0, "linked"  : [ 10, 8, 9, 11 ]      },
        { "left" : 340, "top" : 440, "frame" : 2, "linked"  : [ 11, 10 ]            }
    ],
//////////////////////////////////  69 NEW //////////////////////////////////
    [
        { "left" : 340, "top" :  80, "frame" : 1, "linked"  : [   1, 3 ]                },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [   2, 3, 6 ]             },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [   3, 1, 2, 4, 7 ]       },
        { "left" : 440, "top" : 170, "frame" : 0, "linked"  : [   4, 3 ]                },
        { "left" : 140, "top" : 260, "frame" : 1, "linked"  : [   5, 6, 9 ]             },
        { "left" : 240, "top" : 260, "frame" : 2, "linked"  : [   6, 2, 5, 7, 10 ]      },
        { "left" : 340, "top" : 260, "frame" : 1, "linked"  : [   7, 3, 6 ]             },
        { "left" :  40, "top" : 350, "frame" : 0, "linked"  : [   8, 9 ]                },
        { "left" : 140, "top" : 350, "frame" : 0, "linked"  : [   9, 5, 8, 10, 11 ]     },
        { "left" : 240, "top" : 350, "frame" : 0, "linked"  : [  10, 6, 9 ]             },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [  11, 9 ]                }
    ],
    //////////////////////////////////  70 (41)  //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 4 ]           },
        { "left" : 240, "top" : 140, "frame" : 1, "linked"  : [ 2, 1, 3, 4, 5 ]     },
        { "left" : 380, "top" : 140, "frame" : 1, "linked"  : [ 3, 2, 5 ]           },
        { "left" : 170, "top" : 210, "frame" : 2, "linked"  : [ 4, 1, 2, 6 ]        },
        { "left" : 310, "top" : 210, "frame" : 2, "linked"  : [ 5, 2, 3, 6 ]        },
        { "left" : 240, "top" : 280, "frame" : 2, "linked"  : [ 6, 4, 5, 7, 8 ]     },
        { "left" : 170, "top" : 350, "frame" : 2, "linked"  : [ 7, 6, 9, 10 ]       },
        { "left" : 310, "top" : 350, "frame" : 2, "linked"  : [ 8, 6, 10, 11 ]      },
        { "left" : 100, "top" : 420, "frame" : 1, "linked"  : [ 9, 7, 10 ]          },
        { "left" : 240, "top" : 420, "frame" : 1, "linked"  : [ 10, 7, 8, 9, 11]    },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 11, 8, 10]          }
    ],
//////////////////////////////////  71 NEW //////////////////////////////////
    [
        { "left" : 190, "top" :  80, "frame" : 2, "linked"  : [  1, 2, 3 ]      },
        { "left" : 290, "top" :  80, "frame" : 2, "linked"  : [  2, 1, 4 ]      },
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [  3, 1, 5 ]      },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [  4, 2, 6 ]      },
        { "left" : 190, "top" : 260, "frame" : 1, "linked"  : [  5, 3, 6, 7 ]   },
        { "left" : 290, "top" : 260, "frame" : 1, "linked"  : [  6, 4, 5, 8 ]   },
        { "left" : 140, "top" : 350, "frame" : 0, "linked"  : [  7, 5, 9 ]      },
        { "left" : 340, "top" : 350, "frame" : 0, "linked"  : [  8, 6, 10 ]     },
        { "left" : 190, "top" : 440, "frame" : 2, "linked"  : [  9, 7, 10 ]     },
        { "left" : 290, "top" : 440, "frame" : 2, "linked"  : [ 10, 8, 9 ]      }
    ],
//////////////////////////////////  72 NEW  //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 3, 5 ]        },
        { "left" : 240, "top" : 140, "frame" : 0, "linked"  : [ 2, 3, 4 ]           },
        { "left" : 170, "top" : 210, "frame" : 0, "linked"  : [ 3, 1, 2, 5, 6 ]     },
        { "left" : 310, "top" : 210, "frame" : 2, "linked"  : [ 4, 2, 6, 7 ]        },
        { "left" : 100, "top" : 280, "frame" : 0, "linked"  : [ 5, 3, 8 ]           },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 6, 3, 4, 8, 9 ]     },
        { "left" : 380, "top" : 280, "frame" : 0, "linked"  : [ 7, 4, 9 ]           },
        { "left" : 170, "top" : 350, "frame" : 2, "linked"  : [ 8, 5, 6, 10 ]       },
        { "left" : 310, "top" : 350, "frame" : 0, "linked"  : [ 9, 6, 7, 10, 11 ]   },
        { "left" : 240, "top" : 420, "frame" : 0, "linked"  : [ 10, 8, 9 ]          },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 11, 7, 9, 10 ]      }
    ],
//////////////////////////////////  73 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 0, "linked"  : [ 1, 3 ]                      },
        { "left" : 330, "top" : 140, "frame" : 0, "linked"  : [ 2, 4 ]                      },
        { "left" : 195, "top" : 220, "frame" : 1, "linked"  : [ 3, 1, 4, 6, 7 ]             },
        { "left" : 285, "top" : 220, "frame" : 1, "linked"  : [ 4, 2, 3, 7, 8 ]             },
        { "left" :  60, "top" : 300, "frame" : 0, "linked"  : [ 5, 6 ]                      },
        { "left" : 150, "top" : 300, "frame" : 1, "linked"  : [ 6, 3, 5, 7, 10 ]            },
        { "left" : 240, "top" : 300, "frame" : 2, "linked"  : [ 7, 3, 4, 6, 8, 10, 11 ]     },
        { "left" : 330, "top" : 300, "frame" : 1, "linked"  : [ 8, 4, 7, 9, 11 ]            },
        { "left" : 420, "top" : 300, "frame" : 0, "linked"  : [ 9, 8 ]                      },
        { "left" : 195, "top" : 380, "frame" : 1, "linked"  : [ 10, 6, 7, 11, 12 ]          },
        { "left" : 285, "top" : 380, "frame" : 1, "linked"  : [ 11, 7, 8, 10, 13 ]          },
        { "left" : 150, "top" : 460, "frame" : 0, "linked"  : [ 12, 10 ]                    },
        { "left" : 330, "top" : 460, "frame" : 0, "linked"  : [ 13, 11 ]                    }
    ],
//////////////////////////////////  74 (37) //////////////////////////////////
    [
        { "left" : 170, "top" : 140, "frame" : 0, "linked"  : [ 1, 3, 4 ]           },
        { "left" : 310, "top" : 140, "frame" : 0, "linked"  : [ 2, 4, 5]            },
        { "left" : 100, "top" : 210, "frame" : 2, "linked"  : [ 3, 1, 6 ]           },
        { "left" : 240, "top" : 210, "frame" : 0, "linked"  : [ 4, 1, 2, 6, 7 ]     },
        { "left" : 380, "top" : 210, "frame" : 2, "linked"  : [ 5, 2, 7 ]           },
        { "left" : 170, "top" : 280, "frame" : 1, "linked"  : [ 6, 3, 4, 8, 9]      },
        { "left" : 310, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 5, 9, 10 ]    },
        { "left" : 100, "top" : 350, "frame" : 2, "linked"  : [ 8, 6, 11 ]          },
        { "left" : 240, "top" : 350, "frame" : 0, "linked"  : [ 9, 6, 7, 11, 12 ]   },
        { "left" : 380, "top" : 350, "frame" : 2, "linked"  : [ 10, 7, 12 ]         },
        { "left" : 170, "top" : 420, "frame" : 0, "linked"  : [ 11, 8, 9]           },
        { "left" : 310, "top" : 420, "frame" : 0, "linked"  : [ 12, 9, 10]          }
    ],
//////////////////////////////////  75 NEW //////////////////////////////////
    [
        { "left" :  60, "top" : 200, "frame" : 0, "linked"  : [ 1, 4 ]              },
        { "left" : 240, "top" : 200, "frame" : 1, "linked"  : [ 2, 6 ]              },
        { "left" : 420, "top" : 200, "frame" : 0, "linked"  : [ 3, 8 ]              },
        { "left" :  60, "top" : 300, "frame" : 0, "linked"  : [ 4, 1, 5, 9 ]        },
        { "left" : 150, "top" : 300, "frame" : 0, "linked"  : [ 5, 4, 6 ]           },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 5, 7, 10 ]    },
        { "left" : 330, "top" : 300, "frame" : 0, "linked"  : [ 7, 6, 8 ]           },
        { "left" : 420, "top" : 300, "frame" : 0, "linked"  : [ 8, 3, 7, 11 ]       },
        { "left" :  60, "top" : 400, "frame" : 2, "linked"  : [ 9, 4 ]              },
        { "left" : 240, "top" : 400, "frame" : 1, "linked"  : [ 10, 6 ]             },
        { "left" : 420, "top" : 400, "frame" : 2, "linked"  : [ 11, 8 ]             }
    ],
////////////////////////////////// 76 NEW //////////////////////////////////
    [
        { "left" :  90, "top" :  80, "frame" : 1, "linked"  : [ 1, 2, 5 ]   },
        { "left" : 190, "top" :  80, "frame" : 0, "linked"  : [ 2, 1, 3 ]   },
        { "left" : 290, "top" :  80, "frame" : 0, "linked"  : [ 3, 2, 4 ]   },
        { "left" : 390, "top" :  80, "frame" : 1, "linked"  : [ 4, 3, 6 ]   },
        { "left" : 140, "top" : 170, "frame" : 0, "linked"  : [ 5, 1, 7 ]   },
        { "left" : 340, "top" : 170, "frame" : 0, "linked"  : [ 6, 4, 8 ]   },
        { "left" : 190, "top" : 260, "frame" : 0, "linked"  : [ 7, 5, 9 ]   },
        { "left" : 290, "top" : 260, "frame" : 0, "linked"  : [ 8, 6, 9 ]   },
        { "left" : 240, "top" : 350, "frame" : 2, "linked"  : [ 9, 7, 8, 10, 11 ]   },
        { "left" : 190, "top" : 440, "frame" : 1, "linked"  : [ 10, 9 ]   },
        { "left" : 290, "top" : 440, "frame" : 1, "linked"  : [ 11, 9 ]   }
    ],
//////////////////////////////////  77 (34) //////////////////////////////////
    [
        { "left" : 190, "top" : 150, "frame" : 1, "linked"  : [ 1, 2, 4 ]           },
        { "left" : 290, "top" : 150, "frame" : 1, "linked"  : [ 2, 1, 5 ]           },
        { "left" :  90, "top" : 250, "frame" : 1, "linked"  : [ 3, 4, 7 ]           },
        { "left" : 190, "top" : 250, "frame" : 2, "linked"  : [ 4, 1, 3, 5, 8 ]     },
        { "left" : 290, "top" : 250, "frame" : 2, "linked"  : [ 5, 2, 4, 6, 9 ]     },
        { "left" : 390, "top" : 250, "frame" : 1, "linked"  : [ 6, 5, 10 ]          },
        { "left" :  90, "top" : 350, "frame" : 1, "linked"  : [ 7, 3, 8 ]           },
        { "left" : 190, "top" : 350, "frame" : 2, "linked"  : [ 8, 4, 7, 9, 11 ]    },
        { "left" : 290, "top" : 350, "frame" : 2, "linked"  : [ 9, 5, 8, 10, 12 ]   },
        { "left" : 390, "top" : 350, "frame" : 1, "linked"  : [ 10, 6, 9 ]          },
        { "left" : 190, "top" : 450, "frame" : 1, "linked"  : [ 11, 8, 12 ]         },
        { "left" : 290, "top" : 450, "frame" : 1, "linked"  : [ 12, 9, 11 ]         }
    ],
////////////////////////////////// 78 (39) //////////////////////////////////
    [
        { "left" : 105, "top" : 220, "frame" : 0, "linked"  : [ 1, 2, 5, 6 ]                },
        { "left" : 195, "top" : 220, "frame" : 0, "linked"  : [ 2, 1, 3, 6, 7 ]             },
        { "left" : 285, "top" : 220, "frame" : 1, "linked"  : [ 3, 2, 4, 7, 8 ]             },
        { "left" : 375, "top" : 220, "frame" : 0, "linked"  : [ 4, 3, 8, 9 ]                },
        { "left" :  60, "top" : 300, "frame" : 2, "linked"  : [ 5, 1, 6, 10 ]               },
        { "left" : 150, "top" : 300, "frame" : 0, "linked"  : [ 6, 1, 2, 5, 7, 10, 11 ]     },
        { "left" : 240, "top" : 300, "frame" : 2, "linked"  : [ 7, 2, 3, 6, 8, 11, 12 ]     },
        { "left" : 330, "top" : 300, "frame" : 0, "linked"  : [ 8, 3, 4, 7, 9, 12, 13 ]     },
        { "left" : 420, "top" : 300, "frame" : 2, "linked"  : [ 9, 4, 8, 13 ]               },
        { "left" : 105, "top" : 380, "frame" : 0, "linked"  : [ 10, 5, 6, 11 ]              },
        { "left" : 195, "top" : 380, "frame" : 1, "linked"  : [ 11, 6, 7, 10, 12 ]          },
        { "left" : 285, "top" : 380, "frame" : 0, "linked"  : [ 12, 7, 8, 11, 13]           },
        { "left" : 375, "top" : 380, "frame" : 0, "linked"  : [ 13, 8, 9, 12]               }
    ],
//////////////////////////////////  79 NEW //////////////////////////////////
    [
        { "left" : 140, "top" :  80, "frame" : 1, "linked"  : [  1, 3 ]             },
        { "left" : 340, "top" :  80, "frame" : 1, "linked"  : [  2, 4 ]             },
        { "left" : 190, "top" : 170, "frame" : 0, "linked"  : [  3, 1, 4, 5 ]       },
        { "left" : 290, "top" : 170, "frame" : 2, "linked"  : [  4, 2, 3, 6 ]       },
        { "left" : 140, "top" : 260, "frame" : 2, "linked"  : [  5, 3, 7 ]          },
        { "left" : 340, "top" : 260, "frame" : 2, "linked"  : [  6, 4, 8 ]          },
        { "left" : 190, "top" : 350, "frame" : 2, "linked"  : [  7, 5, 8, 9 ]       },
        { "left" : 290, "top" : 350, "frame" : 0, "linked"  : [  8, 6, 7, 10 ]      },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [  9, 7 ]             },
        { "left" : 340, "top" : 440, "frame" : 1, "linked"  : [ 10, 8 ]             }
    ],
//////////////////////////////////  80 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  80, "frame" : 1, "linked"  : [  1, 2, 3 ]      },
        { "left" : 170, "top" : 150, "frame" : 2, "linked"  : [  2, 1, 4 ]      },
        { "left" : 310, "top" : 150, "frame" : 2, "linked"  : [  3, 1, 5 ]      },
        { "left" : 100, "top" : 220, "frame" : 1, "linked"  : [  4, 2, 6 ]      },
        { "left" : 380, "top" : 220, "frame" : 1, "linked"  : [  5, 3, 7 ]      },
        { "left" :  30, "top" : 290, "frame" : 2, "linked"  : [  6, 4, 8 ]      },
        { "left" : 450, "top" : 290, "frame" : 2, "linked"  : [  7, 5, 9 ]      },
        { "left" : 100, "top" : 360, "frame" : 1, "linked"  : [  8, 6, 10 ]     },
        { "left" : 380, "top" : 360, "frame" : 1, "linked"  : [  9, 7, 11 ]     },
        { "left" : 170, "top" : 430, "frame" : 2, "linked"  : [ 10, 8, 12 ]     },
        { "left" : 310, "top" : 430, "frame" : 2, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 240, "top" : 500, "frame" : 1, "linked"  : [ 12, 10, 11 ]    }
    ],
//////////////////////////////////  81 NEW  //////////////////////////////////
    [
        { "left" : 240, "top" :  90, "frame" : 2, "linked"  : [ 1, 2, 3]            },
        { "left" : 170, "top" : 160, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]        },
        { "left" : 310, "top" : 160, "frame" : 0, "linked"  : [ 3, 1, 5, 6 ]        },
        { "left" : 100, "top" : 230, "frame" : 0, "linked"  : [ 4, 2 ]              },
        { "left" : 240, "top" : 230, "frame" : 0, "linked"  : [ 5, 2, 3, 7 ]        },
        { "left" : 380, "top" : 230, "frame" : 0, "linked"  : [ 6, 3 ]              },
        { "left" : 240, "top" : 310, "frame" : 0, "linked"  : [ 7, 5, 8, 9 ]        },
        { "left" : 170, "top" : 380, "frame" : 0, "linked"  : [ 8, 7, 10, 11 ]      },
        { "left" : 310, "top" : 380, "frame" : 0, "linked"  : [ 9, 7, 11, 12 ]      },
        { "left" : 100, "top" : 450, "frame" : 0, "linked"  : [ 10, 8 ]             },
        { "left" : 240, "top" : 450, "frame" : 1, "linked"  : [ 11, 8, 9 ]          },
        { "left" : 380, "top" : 450, "frame" : 0, "linked"  : [ 12, 9]              }
    ],
//////////////////////////////////  82 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 1, "linked"  : [ 1, 4 ]              },
        { "left" : 330, "top" : 140, "frame" : 0, "linked"  : [ 2, 6 ]              },
        { "left" :  60, "top" : 240, "frame" : 2, "linked"  : [ 3, 4 ]              },
        { "left" : 150, "top" : 240, "frame" : 2, "linked"  : [ 4, 1, 3, 5, 7 ]     },
        { "left" : 240, "top" : 240, "frame" : 0, "linked"  : [ 5, 4, 6, 8 ]        },
        { "left" : 330, "top" : 240, "frame" : 0, "linked"  : [ 6, 2, 5, 9 ]        },
        { "left" : 150, "top" : 340, "frame" : 0, "linked"  : [ 7, 4, 8, 11 ]       },
        { "left" : 240, "top" : 340, "frame" : 0, "linked"  : [ 8, 5, 7, 9 ]        },
        { "left" : 330, "top" : 340, "frame" : 2, "linked"  : [ 9, 6, 8, 10, 12 ]   },
        { "left" : 420, "top" : 340, "frame" : 1, "linked"  : [ 10, 9 ]             },
        { "left" : 150, "top" : 440, "frame" : 0, "linked"  : [ 11, 7 ]             },
        { "left" : 330, "top" : 440, "frame" : 2, "linked"  : [ 12, 9 ]             }
    ],
//////////////////////////////////  83 NEW //////////////////////////////////
    [
        { "left" :  40, "top" : 220, "frame" : 1, "linked"  : [ 1, 2, 5 ]               },
        { "left" : 140, "top" : 220, "frame" : 0, "linked"  : [ 2, 1, 5, 6 ]            },
        { "left" : 340, "top" : 220, "frame" : 0, "linked"  : [ 3, 4, 7, 8 ]            },
        { "left" : 440, "top" : 220, "frame" : 1, "linked"  : [ 4, 3, 8 ]               },
        { "left" :  90, "top" : 300, "frame" : 0, "linked"  : [ 5, 1, 2, 6, 9 ]         },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 6, 2, 5, 7, 9, 10 ]     },
        { "left" : 290, "top" : 300, "frame" : 0, "linked"  : [ 7, 3, 6, 8, 10, 11 ]    },
        { "left" : 390, "top" : 300, "frame" : 0, "linked"  : [ 8, 3, 4, 7, 11 ]        },
        { "left" : 140, "top" : 380, "frame" : 2, "linked"  : [ 9, 5, 6, 10 ]           },
        { "left" : 240, "top" : 380, "frame" : 2, "linked"  : [ 10, 6, 7, 9, 11 ]       },
        { "left" : 340, "top" : 380, "frame" : 2, "linked"  : [ 11, 7, 8, 10 ]          }
    ],
//////////////////////////////////  84 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  70, "frame" : 1, "linked"  : [  1, 2, 3 ]      },
        { "left" : 170, "top" : 140, "frame" : 0, "linked"  : [  2, 1, 4 ]      },
        { "left" : 310, "top" : 140, "frame" : 0, "linked"  : [  3, 1, 5 ]      },
        { "left" : 100, "top" : 210, "frame" : 2, "linked"  : [  4, 2, 6 ]      },
        { "left" : 380, "top" : 210, "frame" : 2, "linked"  : [  5, 3, 7 ]      },
        { "left" : 170, "top" : 280, "frame" : 1, "linked"  : [  6, 4, 8 ]      },
        { "left" : 310, "top" : 280, "frame" : 1, "linked"  : [  7, 5, 9 ]      },
        { "left" : 100, "top" : 350, "frame" : 2, "linked"  : [  8, 6, 10 ]     },
        { "left" : 380, "top" : 350, "frame" : 2, "linked"  : [  9, 7, 11 ]     },
        { "left" : 170, "top" : 420, "frame" : 0, "linked"  : [ 10, 8, 12 ]     },
        { "left" : 310, "top" : 420, "frame" : 0, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 240, "top" : 490, "frame" : 1, "linked"  : [ 12, 10, 11 ]    }
    ],
//////////////////////////////////  85 NEW //////////////////////////////////
    [
        { "left" :  40, "top" : 120, "frame" : 0, "linked"  : [ 1, 2, 4 ]       },
        { "left" : 140, "top" : 120, "frame" : 1, "linked"  : [ 2, 1, 3 ]       },
        { "left" : 240, "top" : 120, "frame" : 0, "linked"  : [ 3, 2, 5 ]       },
        { "left" :  90, "top" : 200, "frame" : 0, "linked"  : [ 4, 1, 6 ]       },
        { "left" : 290, "top" : 200, "frame" : 0, "linked"  : [ 5, 3, 8 ]       },
        { "left" : 140, "top" : 280, "frame" : 2, "linked"  : [ 6, 4, 7, 9 ]    },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 7, 6, 8 ]       },
        { "left" : 340, "top" : 280, "frame" : 2, "linked"  : [ 8, 5, 7, 10 ]   },
        { "left" : 190, "top" : 360, "frame" : 0, "linked"  : [ 9, 6, 11 ]      },
        { "left" : 390, "top" : 360, "frame" : 0, "linked"  : [ 10, 8, 13 ]     },
        { "left" : 240, "top" : 440, "frame" : 0, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 340, "top" : 440, "frame" : 1, "linked"  : [ 12, 11, 13 ]    },
        { "left" : 440, "top" : 440, "frame" : 0, "linked"  : [ 13, 10, 12 ]    }
    ],
//////////////////////////////////  86 NEW //////////////////////////////////
    [
        { "left" :  90, "top" :  90, "frame" : 2, "linked"  : [ 1, 2 ]              },
        { "left" : 190, "top" :  90, "frame" : 0, "linked"  : [ 2, 1, 3, 5 ]        },
        { "left" : 290, "top" :  90, "frame" : 0, "linked"  : [ 3, 2, 4, 6 ]        },
        { "left" : 390, "top" :  90, "frame" : 2, "linked"  : [ 4, 3 ]              },
        { "left" : 190, "top" : 170, "frame" : 0, "linked"  : [ 5, 2, 6, 7 ]        },
        { "left" : 290, "top" : 170, "frame" : 0, "linked"  : [ 6, 3, 5, 8 ]        },
        { "left" : 190, "top" : 260, "frame" : 1, "linked"  : [ 7, 5, 8, 9 ]        },
        { "left" : 290, "top" : 260, "frame" : 1, "linked"  : [ 8, 6, 7, 10 ]       },
        { "left" : 190, "top" : 350, "frame" : 0, "linked"  : [ 9, 7, 10, 12 ]      },
        { "left" : 290, "top" : 350, "frame" : 0, "linked"  : [ 10, 8, 9, 13 ]      },
        { "left" :  90, "top" : 440, "frame" : 2, "linked"  : [ 11, 12 ]            },
        { "left" : 190, "top" : 440, "frame" : 0, "linked"  : [ 12, 9, 11, 13 ]     },
        { "left" : 290, "top" : 440, "frame" : 0, "linked"  : [ 13, 10, 12, 14 ]    },
        { "left" : 390, "top" : 440, "frame" : 2, "linked"  : [ 14, 13 ]            }
    ],
//////////////////////////////////  87 NEW //////////////////////////////////
    [
        { "left" : 170, "top" :  90, "frame" : 2, "linked"  : [  1, 3, 4 ]      },
        { "left" : 310, "top" :  90, "frame" : 2, "linked"  : [  2, 4, 5 ]      },
        { "left" : 100, "top" : 160, "frame" : 0, "linked"  : [  3, 1, 6 ]      },
        { "left" : 240, "top" : 160, "frame" : 0, "linked"  : [  4, 1, 2 ]      },
        { "left" : 380, "top" : 160, "frame" : 0, "linked"  : [  5, 2, 7 ]      },
        { "left" :  30, "top" : 230, "frame" : 1, "linked"  : [  6, 3, 8 ]      },
        { "left" : 450, "top" : 230, "frame" : 1, "linked"  : [  7, 5, 9 ]      },
        { "left" : 100, "top" : 300, "frame" : 2, "linked"  : [  8, 6, 10 ]     },
        { "left" : 380, "top" : 300, "frame" : 2, "linked"  : [  9, 7, 11 ]     },
        { "left" : 170, "top" : 370, "frame" : 0, "linked"  : [ 10, 8, 12 ]     },
        { "left" : 310, "top" : 370, "frame" : 0, "linked"  : [ 11, 9, 12 ]     },
        { "left" : 240, "top" : 440, "frame" : 2, "linked"  : [ 12, 10, 11 ]    }
    ],
//////////////////////////////////  88 Rajkic //////////////////////////////////
    [
        { "left" : 240, "top" :  65, "frame" : 2, "linked"  : [ 1, 2, 3 ]           },
        { "left" : 160, "top" : 100, "frame" : 2, "linked"  : [ 2, 1, 4 ]           },
        { "left" : 320, "top" : 100, "frame" : 2, "linked"  : [ 3, 1, 5 ]           },
        { "left" : 160, "top" : 190, "frame" : 0, "linked"  : [ 4, 2, 6, 7 ]        },
        { "left" : 320, "top" : 190, "frame" : 0, "linked"  : [ 5, 3, 6 ]           },
        { "left" : 240, "top" : 235, "frame" : 0, "linked"  : [ 6, 4, 5, 7, 8 ]     },
        { "left" : 160, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 6, 8, 9 ]     },
        { "left" : 240, "top" : 325, "frame" : 0, "linked"  : [ 8, 6, 7, 9, 10 ]    },
        { "left" : 160, "top" : 370, "frame" : 2, "linked"  : [ 9, 7, 8, 11 ]       },
        { "left" : 320, "top" : 370, "frame" : 2, "linked"  : [ 10, 8, 12 ]         },
        { "left" : 160, "top" : 460, "frame" : 2, "linked"  : [ 11, 9 ]             },
        { "left" : 320, "top" : 460, "frame" : 2, "linked"  : [ 12, 10 ]            }

    ],
//////////////////////////////////  89 NEW //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 2, "linked"  : [ 1, 3 ]              },
        { "left" : 330, "top" : 140, "frame" : 2, "linked"  : [ 2, 4 ]              },
        { "left" : 105, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 5, 6 ]        },
        { "left" : 375, "top" : 220, "frame" : 0, "linked"  : [ 4, 2, 8, 9 ]        },
        { "left" :  60, "top" : 300, "frame" : 1, "linked"  : [ 5, 3, 6, 10 ]       },
        { "left" : 150, "top" : 300, "frame" : 0, "linked"  : [ 6, 3, 5, 7, 10 ]    },
        { "left" : 240, "top" : 300, "frame" : 2, "linked"  : [ 7, 6, 8 ]           },
        { "left" : 330, "top" : 300, "frame" : 0, "linked"  : [ 8, 4, 7, 9, 11 ]    },
        { "left" : 420, "top" : 300, "frame" : 1, "linked"  : [ 9, 4, 8, 11 ]       },
        { "left" : 105, "top" : 380, "frame" : 0, "linked"  : [ 10, 5, 6, 12 ]      },
        { "left" : 375, "top" : 380, "frame" : 0, "linked"  : [ 11, 8, 9, 13 ]      },
        { "left" : 150, "top" : 460, "frame" : 2, "linked"  : [ 12, 10 ]            },
        { "left" : 330, "top" : 460, "frame" : 2, "linked"  : [ 13, 11 ]            }
    ],
//////////////////////////////////  90 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  80, "frame" : 0, "linked"  : [  1, 2, 3 ]              },
        { "left" : 170, "top" : 150, "frame" : 1, "linked"  : [  2, 1, 4, 5 ]           },
        { "left" : 310, "top" : 150, "frame" : 1, "linked"  : [  3, 1, 5, 6 ]           },
        { "left" : 100, "top" : 220, "frame" : 0, "linked"  : [  4, 2, 7 ]              },
        { "left" : 240, "top" : 220, "frame" : 2, "linked"  : [  5, 2, 3, 7, 8 ]        },
        { "left" : 380, "top" : 220, "frame" : 0, "linked"  : [  6, 3, 8 ]              },
        { "left" : 170, "top" : 290, "frame" : 1, "linked"  : [  7, 4, 5, 9, 10 ]       },
        { "left" : 310, "top" : 290, "frame" : 1, "linked"  : [  8, 5, 6, 10, 11 ]      },
        { "left" : 100, "top" : 360, "frame" : 0, "linked"  : [  9, 7, 12 ]             },
        { "left" : 240, "top" : 360, "frame" : 2, "linked"  : [ 10, 7, 8, 12, 13 ]      },
        { "left" : 380, "top" : 360, "frame" : 0, "linked"  : [ 11, 8, 13 ]             },
        { "left" : 170, "top" : 430, "frame" : 1, "linked"  : [ 12, 9, 10, 14 ]         },
        { "left" : 310, "top" : 430, "frame" : 1, "linked"  : [ 13, 10, 11, 14 ]        },
        { "left" : 240, "top" : 500, "frame" : 0, "linked"  : [ 14, 12, 13 ]            }
    ],
//////////////////////////////////  91 NEW //////////////////////////////////
    [
        { "left" : 150, "top" :  70, "frame" : 0, "linked"  : [ 1, 4 ]                  },
        { "left" : 330, "top" :  70, "frame" : 0, "linked"  : [ 2, 6 ]                  },
        { "left" :  60, "top" : 170, "frame" : 0, "linked"  : [ 3, 4 ]                  },
        { "left" : 150, "top" : 170, "frame" : 1, "linked"  : [ 4, 1, 3, 5, 8 ]         },
        { "left" : 240, "top" : 170, "frame" : 0, "linked"  : [ 5, 4, 6, 9 ]            },
        { "left" : 330, "top" : 170, "frame" : 1, "linked"  : [ 6, 2, 5, 7, 10 ]        },
        { "left" : 420, "top" : 170, "frame" : 0, "linked"  : [ 7, 6 ]                  },
        { "left" : 150, "top" : 270, "frame" : 0, "linked"  : [ 8, 4, 9, 12 ]           },
        { "left" : 240, "top" : 270, "frame" : 2, "linked"  : [ 9, 5, 8, 10, 13 ]       },
        { "left" : 330, "top" : 270, "frame" : 0, "linked"  : [ 10, 6, 9, 14 ]          },
        { "left" :  60, "top" : 370, "frame" : 0, "linked"  : [ 11, 12 ]                },
        { "left" : 150, "top" : 370, "frame" : 1, "linked"  : [ 12, 8, 11, 13, 16 ]     },
        { "left" : 240, "top" : 370, "frame" : 0, "linked"  : [ 13, 9, 12, 14 ]         },
        { "left" : 330, "top" : 370, "frame" : 1, "linked"  : [ 14, 10, 13, 15, 17 ]    },
        { "left" : 420, "top" : 370, "frame" : 0, "linked"  : [ 15, 14 ]                },
        { "left" : 150, "top" : 470, "frame" : 0, "linked"  : [ 16, 12 ]                },
        { "left" : 330, "top" : 470, "frame" : 0, "linked"  : [ 17, 14 ]                }
    ],
    //////////////////////////////////  92 (40) //////////////////////////////////
    [
        { "left" : 190, "top" : 140, "frame" : 2, "linked"  : [ 1, 2, 3, 4 ]                },
        { "left" : 290, "top" : 140, "frame" : 2, "linked"  : [ 2, 1, 4, 5 ]                },
        { "left" : 140, "top" : 220, "frame" : 0, "linked"  : [ 3, 1, 4, 6, 7 ]             },
        { "left" : 240, "top" : 220, "frame" : 0, "linked"  : [ 4, 1, 2, 3, 5, 7, 8 ]       },
        { "left" : 340, "top" : 220, "frame" : 0, "linked"  : [ 5, 2, 4, 8, 9 ]             },
        { "left" :  90, "top" : 300, "frame" : 1, "linked"  : [ 6, 3, 7, 10 ]               },
        { "left" : 190, "top" : 300, "frame" : 0, "linked"  : [ 7, 3, 4, 6, 8, 10, 11 ]     },
        { "left" : 290, "top" : 300, "frame" : 0, "linked"  : [ 8, 4, 5, 7, 9, 11, 12]      },
        { "left" : 390, "top" : 300, "frame" : 1, "linked"  : [ 9, 5, 8, 12 ]               },
        { "left" : 140, "top" : 380, "frame" : 0, "linked"  : [ 10, 6, 7, 11, 13 ]          },
        { "left" : 240, "top" : 380, "frame" : 0, "linked"  : [ 11, 7, 8, 10, 12, 13, 14 ]  },
        { "left" : 340, "top" : 380, "frame" : 0, "linked"  : [ 12, 8, 9, 11, 14 ]          },
        { "left" : 190, "top" : 460, "frame" : 2, "linked"  : [ 13, 10, 11, 14 ]            },
        { "left" : 290, "top" : 460, "frame" : 2, "linked"  : [ 14, 11, 12, 13 ]            }
    ],
    //////////////////////////////////  93 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  50, "frame" : 0, "linked"  : [ 1, 2, 3]                },
        { "left" : 170, "top" : 120, "frame" : 0, "linked"  : [ 2, 1, 4, 5 ]            },
        { "left" : 310, "top" : 120, "frame" : 0, "linked"  : [ 3, 1, 5, 6 ]            },
        { "left" : 100, "top" : 190, "frame" : 0, "linked"  : [ 4, 2, 7 ]               },
        { "left" : 240, "top" : 190, "frame" : 1, "linked"  : [ 5, 2, 3, 7, 8 ]         },
        { "left" : 380, "top" : 190, "frame" : 0, "linked"  : [ 6, 3, 8 ]               },
        { "left" : 170, "top" : 260, "frame" : 0, "linked"  : [ 7, 4, 5, 9, 10 ]        },
        { "left" : 310, "top" : 260, "frame" : 0, "linked"  : [ 8, 5, 6, 10, 11 ]       },
        { "left" : 100, "top" : 330, "frame" : 2, "linked"  : [ 9, 7, 12 ]              },
        { "left" : 240, "top" : 330, "frame" : 0, "linked"  : [ 10, 7, 8, 12, 13 ]      },
        { "left" : 380, "top" : 330, "frame" : 2, "linked"  : [ 11, 8, 13 ]             },
        { "left" : 170, "top" : 400, "frame" : 0, "linked"  : [ 12, 9, 10, 14 ]         },
        { "left" : 310, "top" : 400, "frame" : 0, "linked"  : [ 13, 10, 11, 15 ]        },
        { "left" : 100, "top" : 470, "frame" : 1, "linked"  : [ 14, 12 ]                },
        { "left" : 380, "top" : 470, "frame" : 1, "linked"  : [ 15, 13 ]                }
    ],
//////////////////////////////////  94 NEW //////////////////////////////////
    [
        { "left" : 150, "top" :  60, "frame" : 2, "linked"  : [ 1, 2 ]              },
        { "left" : 240, "top" :  60, "frame" : 0, "linked"  : [ 2, 1, 3, 5]         },
        { "left" : 330, "top" :  60, "frame" : 2, "linked"  : [ 3, 2 ]              },
        { "left" :  60, "top" : 160, "frame" : 0, "linked"  : [ 4, 7 ]              },
        { "left" : 240, "top" : 160, "frame" : 0, "linked"  : [ 5, 2, 9 ]           },
        { "left" : 420, "top" : 160, "frame" : 0, "linked"  : [ 6, 11 ]             },
        { "left" :  60, "top" : 260, "frame" : 1, "linked"  : [ 7, 4, 8, 12 ]       },
        { "left" : 150, "top" : 260, "frame" : 0, "linked"  : [ 8, 7, 9 ]           },
        { "left" : 240, "top" : 260, "frame" : 1, "linked"  : [ 9, 5, 8, 10, 13 ]   },
        { "left" : 330, "top" : 260, "frame" : 0, "linked"  : [ 10, 9, 11 ]         },
        { "left" : 420, "top" : 260, "frame" : 1, "linked"  : [ 11, 6, 10, 14 ]     },
        { "left" :  60, "top" : 360, "frame" : 0, "linked"  : [ 12, 7 ]             },
        { "left" : 240, "top" : 360, "frame" : 0, "linked"  : [ 13, 9, 16 ]         },
        { "left" : 420, "top" : 360, "frame" : 0, "linked"  : [ 14, 11 ]            },
        { "left" : 150, "top" : 460, "frame" : 2, "linked"  : [ 15, 16 ]            },
        { "left" : 240, "top" : 460, "frame" : 0, "linked"  : [ 16, 13, 15, 17 ]    },
        { "left" : 330, "top" : 460, "frame" : 2, "linked"  : [ 17, 16 ]            }
    ],
//////////////////////////////////  95 NEW //////////////////////////////////
    [
        { "left" : 240, "top" :  70, "frame" : 1, "linked"  : [ 1, 2, 3 ]               },
        { "left" : 170, "top" : 140, "frame" : 2, "linked"  : [ 2, 1, 4, 5 ]            },
        { "left" : 310, "top" : 140, "frame" : 2, "linked"  : [ 3, 1, 5, 6 ]            },
        { "left" : 100, "top" : 210, "frame" : 2, "linked"  : [ 4, 2, 7, 8 ]            },
        { "left" : 240, "top" : 210, "frame" : 0, "linked"  : [ 5, 2, 3, 8, 9 ]         },
        { "left" : 380, "top" : 210, "frame" : 2, "linked"  : [ 6, 3, 9, 10 ]           },
        { "left" :  30, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 11 ]              },
        { "left" : 170, "top" : 280, "frame" : 0, "linked"  : [ 8, 4, 5, 11, 12 ]       },
        { "left" : 310, "top" : 280, "frame" : 0, "linked"  : [ 9, 5, 6, 12, 13 ]       },
        { "left" : 450, "top" : 280, "frame" : 1, "linked"  : [ 10, 6, 13 ]             },
        { "left" : 100, "top" : 350, "frame" : 2, "linked"  : [ 11, 7, 8, 14 ]          },
        { "left" : 240, "top" : 350, "frame" : 0, "linked"  : [ 12, 8, 9, 14, 15 ]      },
        { "left" : 380, "top" : 350, "frame" : 2, "linked"  : [ 13, 9, 10, 15 ]         },
        { "left" : 170, "top" : 420, "frame" : 2, "linked"  : [ 14, 11, 12, 16 ]        },
        { "left" : 310, "top" : 420, "frame" : 2, "linked"  : [ 15, 12, 13, 16 ]        },
        { "left" : 240, "top" : 490, "frame" : 1, "linked"  : [ 16, 14, 15 ]            }
    ],
//////////////////////////////////  96 NEW //////////////////////////////////
    [
        { "left" : 240, "top" : 120, "frame" : 1, "linked"  : [ 1, 2, 4, 5 ]                    },
        { "left" : 340, "top" : 120, "frame" : 1, "linked"  : [ 2, 1, 3, 5, 6 ]                 },
        { "left" : 440, "top" : 120, "frame" : 1, "linked"  : [ 3, 2, 6 ]                       },
        { "left" : 190, "top" : 200, "frame" : 2, "linked"  : [ 4, 1, 5, 7, 8 ]                 },
        { "left" : 290, "top" : 200, "frame" : 1, "linked"  : [ 5, 1, 2, 4, 6, 8, 9 ]           },
        { "left" : 390, "top" : 200, "frame" : 1, "linked"  : [ 6, 2, 3, 5, 9 ]                 },
        { "left" : 140, "top" : 280, "frame" : 1, "linked"  : [ 7, 4, 8, 10, 11 ]               },
        { "left" : 240, "top" : 280, "frame" : 0, "linked"  : [ 8, 4, 5, 7, 9, 11, 12 ]         },
        { "left" : 340, "top" : 280, "frame" : 1, "linked"  : [ 9, 5, 6, 8, 12 ]                },
        { "left" :  90, "top" : 360, "frame" : 1, "linked"  : [ 10, 7, 11, 13, 14 ]             },
        { "left" : 190, "top" : 360, "frame" : 1, "linked"  : [ 11, 7, 8, 10, 12, 14, 15 ]      },
        { "left" : 290, "top" : 360, "frame" : 2, "linked"  : [ 12, 8, 9, 11, 15 ]              },
        { "left" :  40, "top" : 440, "frame" : 1, "linked"  : [ 13, 10, 14 ]                    },
        { "left" : 140, "top" : 440, "frame" : 1, "linked"  : [ 14, 10, 11, 13, 15 ]            },
        { "left" : 240, "top" : 440, "frame" : 1, "linked"  : [ 15, 11, 12, 14 ]                }
    ],
    //////////////////////////////////  97 (43)  //////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 2, "linked"  : [ 1, 3, 4 ]                   },
        { "left" : 330, "top" : 140, "frame" : 2, "linked"  : [ 2, 5, 6 ]                   },
        { "left" : 105, "top" : 220, "frame" : 2, "linked"  : [ 3, 1, 4, 7, 8 ]             },
        { "left" : 195, "top" : 220, "frame" : 1, "linked"  : [ 4, 1, 3, 5, 8, 9 ]          },
        { "left" : 285, "top" : 220, "frame" : 1, "linked"  : [ 5, 2, 4, 6, 9, 10 ]         },
        { "left" : 375, "top" : 220, "frame" : 2, "linked"  : [ 6, 2, 5, 10, 11 ]           },
        { "left" :  60, "top" : 300, "frame" : 2, "linked"  : [ 7, 3, 8, 12 ]               },
        { "left" : 150, "top" : 300, "frame" : 1, "linked"  : [ 8, 3, 4, 7, 9, 12, 13 ]     },
        { "left" : 240, "top" : 300, "frame" : 0, "linked"  : [ 9, 4, 5, 8, 10, 13, 14 ]    },
        { "left" : 330, "top" : 300, "frame" : 1, "linked"  : [ 10, 5, 6, 9, 11, 14, 15 ]   },
        { "left" : 420, "top" : 300, "frame" : 2, "linked"  : [ 11, 6, 10, 15 ]             },
        { "left" : 105, "top" : 380, "frame" : 2, "linked"  : [ 12, 7, 8, 13, 16 ]          },
        { "left" : 195, "top" : 380, "frame" : 1, "linked"  : [ 13, 8, 9, 12, 14, 16 ]      },
        { "left" : 285, "top" : 380, "frame" : 1, "linked"  : [ 14, 9, 10, 13, 15, 17 ]     },
        { "left" : 375, "top" : 380, "frame" : 2, "linked"  : [ 15, 10, 11, 14, 17 ]        },
        { "left" : 150, "top" : 460, "frame" : 2, "linked"  : [ 16, 12, 13 ]                },
        { "left" : 330, "top" : 460, "frame" : 2, "linked"  : [ 17, 14, 15 ]                }
    ],
    ////////////////////////////////// 98 (42)  //////////////////////////////////
    [
        { "left" : 100, "top" : 140, "frame" : 1, "linked"  : [ 1, 2, 4, 6]             },
        { "left" : 240, "top" : 140, "frame" : 2, "linked"  : [ 2, 1, 3, 4, 5]          },
        { "left" : 380, "top" : 140, "frame" : 1, "linked"  : [ 3, 2, 5, 8 ]            },
        { "left" : 170, "top" : 210, "frame" : 2, "linked"  : [ 4, 1, 2, 6, 7 ]         },
        { "left" : 310, "top" : 210, "frame" : 2, "linked"  : [ 5, 2, 3, 7, 8 ]         },
        { "left" : 100, "top" : 280, "frame" : 2, "linked"  : [ 6, 1, 4, 9, 11 ]        },
        { "left" : 240, "top" : 280, "frame" : 2, "linked"  : [ 7, 4, 5, 9, 10 ]        },
        { "left" : 380, "top" : 280, "frame" : 2, "linked"  : [ 8, 3, 5, 10, 13]        },
        { "left" : 170, "top" : 350, "frame" : 2, "linked"  : [ 9, 6, 7, 11, 12 ]       },
        { "left" : 310, "top" : 350, "frame" : 2, "linked"  : [ 10, 7, 8, 12, 13 ]      },
        { "left" : 100, "top" : 420, "frame" : 1, "linked"  : [ 11, 6, 9, 12 ]          },
        { "left" : 240, "top" : 420, "frame" : 2, "linked"  : [ 12, 9, 10, 11, 13]      },
        { "left" : 380, "top" : 420, "frame" : 1, "linked"  : [ 13, 8, 10, 12]          }
    ],
////////////////////////////////// 99 NEW //////////////////////////////////
    [
        { "left" :  90, "top" :  50, "frame" : 2, "linked"  : [ 1, 2, 5 ]                       },
        { "left" : 190, "top" :  50, "frame" : 2, "linked"  : [ 2, 1, 3, 5, 6 ]                 },
        { "left" : 290, "top" :  50, "frame" : 2, "linked"  : [ 3, 2, 4, 6, 7 ]                 },
        { "left" : 390, "top" :  50, "frame" : 2, "linked"  : [ 4, 3, 7 ]                       },
        { "left" : 140, "top" : 120, "frame" : 1, "linked"  : [ 5, 1, 2, 6, 8 ]                 },
        { "left" : 240, "top" : 120, "frame" : 1, "linked"  : [ 6, 2, 3, 5, 7, 8, 9 ]           },
        { "left" : 340, "top" : 120, "frame" : 1, "linked"  : [ 7, 3, 4, 6, 9 ]                 },
        { "left" : 190, "top" : 190, "frame" : 1, "linked"  : [ 8, 5, 6, 9, 10 ]                },
        { "left" : 290, "top" : 190, "frame" : 1, "linked"  : [ 9, 6, 7, 8, 10 ]                },
        { "left" : 240, "top" : 260, "frame" : 2, "linked"  : [ 10, 8, 9, 11, 12 ]              },
        { "left" : 190, "top" : 330, "frame" : 1, "linked"  : [ 11, 10, 12, 13, 14 ]            },
        { "left" : 290, "top" : 330, "frame" : 1, "linked"  : [ 12, 10, 11, 14, 15 ]            },
        { "left" : 140, "top" : 400, "frame" : 1, "linked"  : [ 13, 11, 14, 16, 17 ]            },
        { "left" : 240, "top" : 400, "frame" : 1, "linked"  : [ 14, 11, 12, 13, 15, 17, 18 ]    },
        { "left" : 340, "top" : 400, "frame" : 1, "linked"  : [ 15, 12, 14, 18, 19 ]            },
        { "left" :  90, "top" : 470, "frame" : 2, "linked"  : [ 16, 13, 17 ]                    },
        { "left" : 190, "top" : 470, "frame" : 2, "linked"  : [ 17, 13, 14, 16, 18 ]            },
        { "left" : 290, "top" : 470, "frame" : 2, "linked"  : [ 18, 14, 15, 17, 19 ]            },
        { "left" : 390, "top" : 470, "frame" : 2, "linked"  : [ 19, 15, 18 ]                    }
    ],
    /////////////////////////////////////////////  100 (44)  /////////////////////////////////////////////
    [
        { "left" : 150, "top" : 140, "frame" : 2, "linked"  : [ 1, 2, 4, 5 ]                    },
        { "left" : 240, "top" : 140, "frame" : 2, "linked"  : [ 2, 1, 3, 5, 6 ]                 },
        { "left" : 330, "top" : 140, "frame" : 2, "linked"  : [ 3, 2, 6, 7 ]                    },
        { "left" : 105, "top" : 220, "frame" : 2, "linked"  : [ 4, 1, 5, 8, 9 ]                 },
        { "left" : 195, "top" : 220, "frame" : 2, "linked"  : [ 5, 1, 2, 4, 6, 9, 10 ]          },
        { "left" : 285, "top" : 220, "frame" : 2, "linked"  : [ 6, 2, 3, 5, 7, 10, 11 ]         },
        { "left" : 375, "top" : 220, "frame" : 2, "linked"  : [ 7, 3, 6, 11, 12 ]               },
        { "left" :  60, "top" : 300, "frame" : 2, "linked"  : [ 8, 4, 9, 13 ]                   },
        { "left" : 150, "top" : 300, "frame" : 2, "linked"  : [ 9, 4, 5, 8, 10, 13, 14 ]        },
        { "left" : 240, "top" : 300, "frame" : 1, "linked"  : [ 10, 5, 6, 9, 11, 14, 15 ]       },
        { "left" : 330, "top" : 300, "frame" : 2, "linked"  : [ 11, 6, 7, 10, 12, 15, 16 ]      },
        { "left" : 420, "top" : 300, "frame" : 2, "linked"  : [ 12, 7, 11, 16 ]                 },
        { "left" : 105, "top" : 380, "frame" : 2, "linked"  : [ 13, 8, 9, 14, 17 ]              },
        { "left" : 195, "top" : 380, "frame" : 2, "linked"  : [ 14, 9, 10, 13, 15, 17, 18 ]     },
        { "left" : 285, "top" : 380, "frame" : 2, "linked"  : [ 15, 10, 11, 14, 16, 18, 19 ]    },
        { "left" : 375, "top" : 380, "frame" : 2, "linked"  : [ 16, 11, 12, 15, 19 ]            },
        { "left" : 150, "top" : 460, "frame" : 2, "linked"  : [ 17, 13, 14, 18 ]                },
        { "left" : 240, "top" : 460, "frame" : 2, "linked"  : [ 18, 14, 15, 17, 19 ]            },
        { "left" : 330, "top" : 460, "frame" : 2, "linked"  : [ 19, 15, 16, 18 ]                }
    ]

    
];

