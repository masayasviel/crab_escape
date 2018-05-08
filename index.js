// phina.js をグローバル領域に展開
phina.globalize();

var ASSETS = {
  image: {
      crab:'http://jsrun.it/assets/Q/Z/P/t/QZPtg.png',
      Footprint:'http://jsrun.it/assets/m/l/f/o/mlfom.png',
      st:"http://jsrun.it/assets/q/l/G/2/qlG2S",
      ed:"http://jsrun.it/assets/A/J/B/y/AJByG"
  }
};

// 定数
var SCREEN_WIDTH  = 640; // 画面横サイズ
var SCREEN_HEIGHT = 960; // 画面縦サイズ
var timeC = 0;

// タイトルシーン
phina.define('TitleScene', {
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    this.superInit();
    // 背景追加
    Sprite('st').addChildTo(this)
                  .setPosition(this.gridX.center(),550)
    // タイトル
    Label({
      text:'crab escape !',
      fontSize:64,
      fill:'#FFFFFF',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(4));

    Label({
      text:"TOUCH START",
      fontSize:32,
      fill:'#FFFFFF',
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(14))
      .tweener.fadeOut(1000).fadeIn(500).setLoop(true).play();
    // 画面タッチ時
    this.on('pointend', function() {
      // 次のシーンへ
      this.exit();
    });
  },
});

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
      
      var escape = Sprite('crab').addChildTo(this); 
        escape.x = Random.randint(80, 560);
        escape.y = Random.randint(80, 880);
        escape.width = 150;
        escape.height = 150;
        escape.physical.force(Math.randint(-30, 30), Math.randint(-30, 30));
        // 更新イベント
        escape.update = function(app) {
          // 画面端との判定
         if (escape.left < 0) {
             escape.left = 0;
             escape.physical.velocity.x *= -1;
         }else if (escape.right > SCREEN_WIDTH) {
             escape.right = SCREEN_WIDTH;
             escape.physical.velocity.x *= -1;
         }
         if (escape.top < 0) {
             escape.top = 0;
             escape.physical.velocity.y *= -1;
         }else if (escape.bottom > SCREEN_HEIGHT) {
             escape.bottom = SCREEN_HEIGHT;
             escape.physical.velocity.y *= -1;
         }
          timeC += app.deltaTime;
       };
      
      var self = this;
      var capture = Sprite('Footprint').addChildTo(this);
      capture.x = this.gridX.center();
      capture.y = this.gridY.center();
      capture.width = 100;
      capture.height = 100;
      capture.setInteractive(true);
      // タッチ開始時
      this.onpointstart = function(e) {
          // スプライトをタッチ位置に
          capture.x = e.pointer.x;
          capture.y = e.pointer.y;
          if (capture.hitTestElement(escape)) {
              escape.vx = 0;
              escape.vy = 0;
              self.exit();
          }
      }
  },
});

//resultScene クラスを定義
phina.define("ResultScene", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    // 背景追加
    Sprite('ed').addChildTo(this)
                  .setPosition(this.gridX.center(),550)
    
    Label({
      text: 'TIME：' + Math.floor(timeC / 10),
      fontSize: 60,
      fill: 'white',
    }).addChildTo(this).setPosition(320, 290);
  },
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({ 
    assets: ASSETS,
    backgroundColor: '#3B0B17',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});
