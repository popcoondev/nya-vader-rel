enchant(); //enchant.jsの有効化

window.onload = function() {
	console.log('hello world.');

	var core = new Core(320, 320);

	var gameOverScene = new Scene();
	gameOverScene.backgroundColor = 'black';

	var gameOverLabel = new Label();
	gameOverLabel.x = 0;
	gameOverLabel.y = 0;
	gameOverLabel.font = '14px "Arial"';
	gameOverLabel.color = 'white';
	gameOverLabel.text = 'Game Over';
	gameOverScene.addChild(gameOverLabel);

	core.preload('chara1.png');
	core.onload = function() {
		var bear = new Sprite(32, 32);
		bear.image = core.assets['chara1.png'];
		bear.x = 0;
		bear.y = 0;
		bear.backgroundColor = 'red';
		core.rootScene.addChild(bear);


		bear.on('enterframe', function() {
			if(this.age % 5 != 0) return;
			if(core.input.left) this.x -= 5;
			if(core.input.right) this.x += 5;
			if(core.input.up) this.y -= 5;
			if(core.input.down) this.y += 5;

			// if(this.intersect(enemy)) {
			// 	label.text = 'hit!';
			// }

			if(this.within(enemy, 10)) {
				label.text = 'hit!';
				core.pushScene(gameOverScene);
				core.stop();
			}

		});

		bear.on('touchstart', function() {
			core.rootScene.removeChild(thid);
		});

		core.rootScene.on('touchstart', function(e){
			bear.x = e.x;
			bear.y = e.y;
		});

		var label = new Label();
		label.x = 280;
		label.y = 5;
		label.font = '14px "Arial"';
		label.text = '0';
		label.on('enterframe', function(){
			//label.text = (core.frame / core.fps).toFixed(2);
			label.text = 0;
		});
		core.rootScene.addChild(label);

		var enemy = new Sprite(32, 32);
		enemy.image = core.assets['chara1.png'];
		enemy.x = 100;
		enemy.y = 100;
		enemy.backgroundColor = 'blue';
		core.rootScene.addChild(enemy);



		// var bear2 = new Sprite(32, 32);
		// bear2.image = core.assets['chara1.png'];
		// bear2.x = 0;
		// bear2.y = 0;
		// core.rootScene.addChild(bear2);
		//
		// bear2.on('enterframe', function() {
		// 	this.x -= 10;
		// 	this.rotate(-2);
		// 	this.scale(1.01, 1.01);
		// 	if(this.x < 0) this.x = 320;
		// });


	};
	core.start();
};
