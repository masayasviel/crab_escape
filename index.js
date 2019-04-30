// phina.js をグローバル領域に展開
phina.globalize();

// 定数
const ASSETS = {
  image: {
      crab:"https://4.bp.blogspot.com/-sgajyTFca4w/U820D46PUzI/AAAAAAAAjRE/Rpt5Vwp6dho/s800/takaashi_gani.png",
      footPrint:"https://3.bp.blogspot.com/-GV97aHpYy6I/UNQkHIwCoQI/AAAAAAAAI2Q/sIA67uE5YM8/s1600/mark_footprint.png",
      st:"./images/start.png",
      ed:"./images/finish.png"
  }
};
const SCREEN_WIDTH  = 640; // 画面横サイズ
const SCREEN_HEIGHT = 960; // 画面縦サイズ

// タイトルシーン
phina.define("TitleScene", {
  superClass:"DisplayScene",
  init: function(){
    this.superInit();

    Sprite("st").addChildTo(this).setPosition(this.gridX.center(), 550);

    Label({
      text:"crab escape !",
      fontSize:64,
      fill:"white",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(4));

    Label({
      text:"TOUCH START",
      fontSize:32,
      fill:"white",
    }).addChildTo(this)
      .setPosition(this.gridX.center(), this.gridY.span(14))
      .tweener.fadeOut(1000).fadeIn(500).setLoop(true).play();
    
    this.on("pointend", function(){
      this.exit();
    });
  },
});

// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    this.timeCount = 0; // 時間リセット
    // 蟹インスタンス
    this.escape = Crab().addChildTo(this);
    // 足跡インスタンス
    this.capture = FootPrint().addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
  },
  onpointstart: function(e){
    // スプライトをタッチ位置に
    this.capture.x = e.pointer.x;
    this.capture.y = e.pointer.y;
    this.hitTestTreadOn();
  },
  hitTestTreadOn: function(){
    const escape = this.escape;
    const capture = this.capture;
    const self = this;
    // 判定用の円
    const captureCircle = Circle(capture.x, capture.y, 50);
    const escapeCircle = Circle(escape.x, escape.y, 60);
    // 円判定
    if(Collision.testCircleCircle(captureCircle, escapeCircle)){
      self.exit({
        timeCount: this.timeCount,
      });
    }
  },
  update: function(app){
    this.timeCount += app.deltaTime;
  }
});

// 蟹クラスを定義
phina.define("Crab", {
  superClass: "Sprite",
  init:function(){
    this.superInit("crab", 150, 150);
    this.x = Random.randint(80, 560);
    this.y = Random.randint(80, 880);
    this.physical.force(Math.randint(-30, 30), Math.randint(-30, 30));
  },
  update:function(){
    // 画面端との判定
    if(this.left < 0){
      this.left = 0;
      this.physical.velocity.x *= -1;
    }else if(this.right > SCREEN_WIDTH){
      this.right = SCREEN_WIDTH;
      this.physical.velocity.x *= -1;
    }
    if(this.top < 0){
      this.top = 0;
      this.physical.velocity.y *= -1;
    }else if (this.bottom > SCREEN_HEIGHT) {
      this.bottom = SCREEN_HEIGHT;
      this.physical.velocity.y *= -1;
    }
  },
});

// 足跡クラスを定義
phina.define("FootPrint", {
  superClass: "Sprite",
  init:function(){
    this.superInit("footPrint", 100, 100);
    this.setInteractive(true);
  },
});

//resultScene クラスを定義
phina.define("ResultScene", {
  superClass: "DisplayScene",
  init: function(param){
    this.superInit(param);
    // 背景追加
    Sprite("ed").addChildTo(this).setPosition(this.gridX.center(),500);
    
    Label({
      text: "TIME：" + param.timeCount + "[ms]",
      fontSize: 60,
      fill: "white",
    }).addChildTo(this).setPosition(320, 240);

    this.restartButton = RestartButton().addChildTo(this).setPosition(320,800);
    this.restartButton.onpointend = ()=>this.exit();
  },
});

// RestartButtoクラスを定義
phina.define("RestartButton", {
  superClass: "Button",
  init: function(){
    this.superInit({
      width: 300, // 横サイズ
      height: 155, // 縦サイズ
      text: "restart",  // 表示文字
      fontSize: 70, // 文字サイズ
      fontColor: "black", // 文字色
      cornerRadius: 5,  // 角丸み
      fill: "white", // ボタン色
      stroke: "black",  // 枠色
      strokeWidth: 5,   // 枠太さ
    });
  },
});

// メイン処理
phina.main(function(){
  // アプリケーション生成
  const app = GameApp({ 
    assets: ASSETS,
    backgroundColor: "#3B0B17",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  // アプリケーション実行
  app.run();
});
