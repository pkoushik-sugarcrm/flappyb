import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
var hole;

var highScore = localStorage.getItem('highscore');
if (highScore  === null) {
    localStorage.setItem('highscore', 0);
    highScore = 0;
}

var normalState = {
    preload: function() {
        this.game.load.image('bg', './assets/background.png');

        this.game.load.image('cube', './assets/logo.svg');

        this.game.load.image('pipe', './assets/pipe.png');

        this.game.load.image('restartButton', './assets/button.png', 193, 71);

        this.game.load.audio('jumpsound', './assets/jump.mp3');

        this.game.load.audio('crashsound', './assets/crash.mp3');
    },

    create: function() {
        game.stage.backgroundColor = getRandomColor;

        this.bg = game.add.image(game.world.centerX, game.world.centerY, 'bg').anchor.set(0.5);

        this.jumpSound = game.add.audio('jumpsound');

        this.crashSound = game.add.audio('crashsound');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cube = game.add.sprite(100, (Math.floor(Math.random() * 400)), 'cube');
        
        this.cube.scale.setTo(0.5,0.5);

        game.physics.arcade.enable(this.cube);

        this.cube.body.gravity.y = 1000;

        this.controlkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.controlkey.onDown.add(this.jump, this);

        this.pipes = game.add.group();

        this.timer = game.time.events.loop(3000, this.addFullPipe, this);

        this.score = -100;

        var style = { font: "30px Arial", fill: "#FFFFFF", align: "center" };

        this.textInfo = game.add.group();

        this.scoreLabel = game.add.text(20, 20,'0', style);

        this.scoreLabel.fill = '#000000';  

        this.gameOverScore = game.add.text(250, 200, '0', style);

        this.textInfo.add(this.gameOverScore);

        this.gameOverHighScore = game.add.text(250, 250, '0', style);

        this.textInfo.add(this.gameOverHighScore);

        this.gameOverLabel = game.add.text(250, 300, 'Game Over', style);

        this.textInfo.add(this.gameOverLabel);

        this.restartButton = game.add.button(
            310, 350, 'restartButton', this.actionOnClick, this, null, null, null, this.actionOnClick
        );

        this.restartButton.scale.setTo(0.1, 0.1);

        this.textInfo.add(this.restartButton);

        this.textInfo.visible = false;
    },

    update: function() {
        if (this.cube.y < -100 || this.cube.y > 600) {
            this.restartGame();
        }
        game.physics.arcade.overlap(this.cube, this.pipes, this.restartGame, null, this);
    },

    jump: function() {
        this.jumpSound.play();
        this.cube.body.velocity.y = -350;
    },

    stop: function() {
        this.cube.body.gravity.y = 100000;
    },

    addPipeImage: function(x, y) {
        var p = game.add.sprite(x, y, 'pipe');
        this.pipes.add(p);
        game.physics.arcade.enable(p);
        p.body.velocity.x = -200;
    },

    addFullPipe: function() {
        hole = Math.floor(Math.random() * 5);
        for (var i = 0; i < 6; i++) {
            if (i != hole && i+1 != hole) {
                this.addPipeImage(700, (i * 100 + 10));
            }
        }
        this.score += 100;
        this.scoreLabel.text = this.score;
        game.stage.backgroundColor = getRandomColor();
    },

    restartGame: function() { 
        var bmd = game.add.bitmapData(1, 1);
        bmd.fill(0, 0, 0);
        var semiTransparentOverlay = game.add.sprite(0, 0, bmd);
        semiTransparentOverlay.scale.setTo(game.width, game.height);
        semiTransparentOverlay.alpha = 0;
        game.add.tween(semiTransparentOverlay).to({alpha:0.3}, 500, Phaser.Easing.Quadratic.In, true);
        semiTransparentOverlay.moveDown();
        this.textInfo.visible = true;
        game.world.bringToTop(this.textInfo);
        if (this.score >= highScore) {
            localStorage.setItem('highscore', this.score);
            highScore = this.score;
        }
        this.gameOverLabel.visible = true;
        this.restartButton.visible = true;
        if (this.score === -100) {
            this.score = 0;
        }
        game.stage.backgroundColor = '#8999b2';
        this.gameOverScore.text = 'Score: ' + this.score;
        this.gameOverScore.visible = true;
        this.gameOverHighScore.text = 'High Score: ' + highScore;
        this.gameOverHighScore.visible = true;
        game.time.events.remove(this.timer);
        this.controlkey.onDown.add(this.stop, this);
    },

    actionOnClick: function() {
        game.state.start('index');
    }
};

const gameConfig = {
    width: 700,
    height: 600,
};

var game = new Phaser.Game(gameConfig);
game.state.add('index', normalState);
game.state.start('index');

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

