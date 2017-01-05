var DBG = false;
var MOBILE = true;
enchant(); //enchant.jsの有効化

window.onload = function() {
	log('window.onload() - start');
	var missiles = [];
	var enemys = [];
	var enemys2 = [];
	var enemys3 = [];

	//プレイヤークラス定義
	var Player = enchant.Class.create(enchant.Sprite, {
	    initialize: function(x, y, width, height){
			enchant.Sprite.call(this, 32, 32);
			this.attack_sleep = 0;
			this.x = x;
			this.y = y;
			this.scale(1.5,1.5);
			this.frame = 1;
			this.image = core.assets['res/sprite.png'];
			// this.backgroundColor = 'yellow';
			this.on('enterframe', function() {
				if(this.age % 30 == 0) {
					//var sound = core.assets['res/bgm1.wav'].clone();
					//sound.volume = 0.1;
					//sound.play();
				}
				if(this.age % 2 != 0) return;
				this.attack_sleep++;

				if(core.input.left && this.x > 10) this.x -= 6;
				if(core.input.right && this.x < 260) this.x += 6;
				// if(core.input.up) this.y -= 6;
				// if(core.input.down) this.y += 6;
				if(core.input.space) {
					if(this.attack_sleep > 10) {
						this.attack();
						this.attack_sleep = 0;
					}
				}
			});
	    },
		move: function(e) {
			this.x = e.localX - 32;
		},
		attack: function(){
			log('attack()');
			missiles.push(new Missile(this.x, this.y-32, 32, 32));
			core.rootScene.addChild(missiles[missiles.length-1]);
		}
	});

	//敵クラス定義
	var Enemy = enchant.Class.create(enchant.Sprite, {
	    initialize: function(x, y, width, height,delay,enemyType){
			enchant.Sprite.call(this, 32, 32);
			this.arrow = true; //goRight=true, goLeft=false;
			this.move = 0;
			this.x = x;
			this.y = y;
			this.delay = delay;
			this.image = core.assets['res/sprite.png'];

			//enemyType to frameNo
			if(enemyType == 0) { //usagi
				this.frame = 3;
			}
			else if(enemyType == 1) { //pisuke
				this.frame = 4;
			}
			else if(enemyType == 2) { //uchujin
				this.frame = 2;
				this.scale(1.4,1.4);
			}

			// this.backgroundColor = 'red';
			this.on('enterframe', function() {
				if(this.age % (30+this.delay) != 0) return;
				var mvDistance = 4;
				if(this.move < mvDistance) {
					if(this.arrow) {
						this.x += 8;
					}
					else {
						this.x -= 8;
					}

					this.move++;
					//log('enemy is moving:' + this.move + '/' + this.arrow);
				}
				else if(mvDistance <= this.move && this.move < mvDistance-this.delay) {
					this.move++;
					//log('enemy is stop ' + this.move);
				}
				else if((mvDistance-this.delay) <= this.move) {
					this.arrow = !this.arrow;
					this.move = 0;
					//log('enemy is stopping:' + this.move + '/' + this.arrow);
				}
			});
	    },
		test: function(){
			this.frame += 1;
		}
	});

	//ミサイルクラス定義
	var Missile = enchant.Class.create(enchant.Sprite, {
	    initialize: function(x, y, width, height){
			enchant.Sprite.call(this, 32, 32);
			this.isHit = false;
			this.x = x;
			this.y = y;
			this.frame = 0;
			this.image = core.assets['res/sprite.png'];
			var sound = core.assets['res/neevoice.wav'].clone();
			sound.play();

			// this.backgroundColor = 'yellow';
			this.on('enterframe', function() {
				if(this.age % 3 != 0) return;
				log('missile is ' + missiles.length)

				//画面外に出たら削除
				if(this.y < 0) this.delete();

				//当たり判定
				for(var i=0; i<enemys.length; i++) {
					if(this.within(enemys[i], 30)) {
						this.hit();
						break;
					}
				}
				for(var i=0; i<enemys2.length; i++) {
					if(this.within(enemys2[i], 30)) {
						this.hit();
						break;
					}
				}
				for(var i=0; i<enemys3.length; i++) {
					if(this.within(enemys3[i], 30)) {
						this.hit();
						break;
					}
				}

				//当たるまではまっすぐ飛ぶ
				if(!this.isHit) this.y -= 5;
			});
	    },
		//攻撃ヒット時の処理
		hit: function(){
			this.isHit = true;

			//当たったら左下に落ちていくアニメーション
			this.tl
			.rotateBy(-135, 30).and()
			.moveBy(-20, 30, 30).and()
			.scaleTo(0.8, 0.8, 30).and()
			.fadeOut(30)
			.removeFromScene();  //シーンから削除

			//先頭のミサイルを消去
			missiles.shift();
		},
		delete: function(){
			log('remove this missile');
			this.tl.removeFromScene();
		    missiles.shift();
		}
	});

	//プレイグラウンド初期化
	var core = new Core(320, 420);
	//core.scale = 2;
	core.preload('res/sprite.png');
	core.preload('res/tokutenLabel.png');
	core.preload('res/neevoice.wav');
	core.preload('res/bgm1.wav');
	core.keybind( 32, 'space' );	//スペースキーを使えるようにする
	core.rootScene.backgroundColor = '#000080';

	//previewCenter(core);
	core.onload = function() {

		//プレイヤーキャラの初期化
		var player = new Player(30,320,32,32);
		core.rootScene.addChild(player);

		//敵キャラの初期化
		//uchujin
		for(var i=0; i<6; i++) {
			enemys[i] = new Enemy((32*i*1.3+10)+(2*i),24,32,32,2,2);
			core.rootScene.addChild(enemys[i]);
		}
		//pisuke
		for(var i=0; i<8; i++) {
			enemys2[i] = new Enemy((32*i)+(2*i)+3,30*2,32,32,1,1);
			core.rootScene.addChild(enemys2[i]);
		}
		//usagi
		for(var i=0; i<8; i++) {
			enemys3[i] = new Enemy((32*i)+(2*i)+3,30*3-6,32,32,0,0);
			core.rootScene.addChild(enemys3[i]);
		}

		//点数ラベルの初期化
		var label = new Sprite(140,20);
		label.x = -10;
		label.y = 5;
		label.image = core.assets['res/tokutenLabel.png'];
		label.scale(0.8,0.8);
		// label.color = '#F0F0F0';
		// label.font = '14px "Arial"';
		// label.text = '0000000点ねー';
		label.on('enterframe', function(){
		});
		core.rootScene.addChild(label);

		//Playerタッチ操作
		var attackFlag = false;
		var touchSTime = null;
		core.rootScene.addEventListener('touchstart', function(e) {
			touchSTime = new Date();
//			player.move(e);
		});
		core.rootScene.addEventListener('touchmove', function(e) {
			player.move(e);
		});
		core.rootScene.addEventListener('touchend', function(e) {
			var now = new Date();
			if(now.getSeconds() - touchSTime.getSeconds() < 1) {
				player.attack();
			}
//			player.move(e);
		});

	};

	core.start();	//ゲーム開始

	log('window.onload() - end');
};

//ログ出力用
function log(message){
	if(DBG) console.log(message);
}

//プレイ画面位置設定
function previewCenter ( game ){
    if(MOBILE) return;
    var left = 180;//( window.innerWidth - ( game.width * game.scale )) /2;
    var top= 90;//( window.innerHeight - ( game.height * game.scale )) /2;
    $('#enchant-stage').css({
      "position":"absolute",
      "left":left+"px",
      "top":top+"px",
    });
    game._pageX = left;
    game._pageY = top;
}
