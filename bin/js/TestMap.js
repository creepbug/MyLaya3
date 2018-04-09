/**
* name
*/
var com;
(function (com) {
    var fw;
    (function (fw) {
        var test;
        (function (test) {
            var Stage = Laya.Stage;
            var TiledMap = Laya.TiledMap;
            var Rectangle = Laya.Rectangle;
            var Browser = Laya.Browser;
            var Handler = Laya.Handler;
            var Stat = Laya.Stat;
            var WebGL = Laya.WebGL;
            var TestMap = /** @class */ (function () {
                function TestMap() {
                    this.mLastMouseX = 0;
                    this.mLastMouseY = 0;
                    this.mX = 0;
                    this.mY = 0;
                    console.log("fuck ");
                    // 不支持WebGL时自动切换至Canvas
                    Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);
                    Laya.stage.scaleMode = Stage.SCALE_FULL;
                    Stat.show();
                    this.createMap();
                    Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown); //注册鼠标事件
                    Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
                    Laya.stage.on(Laya.Event.KEY_DOWN, this, this.keyDown);
                }
                //创建地图
                TestMap.prototype.createMap = function () {
                    //创建地图对象
                    this.tiledMap = new TiledMap();
                    this.tiledMap.autoCacheType = 'normal';
                    this.mX = this.mY = 0;
                    //创建地图，适当的时候调用destory销毁地图
                    console.debug("w:" + Browser.width, "h:" + Browser.height);
                    this.tiledMap.createMap("../bin/res/tiledMap/untitled.json", new Rectangle(0, 0, Browser.width, Browser.height), new Handler(this, this.completeHandler));
                };
                /**
                 * 地图加载完成的回调
                 */
                TestMap.prototype.completeHandler = function () {
                    console.log("地图创建完成");
                    console.log("ClientW:" + Browser.clientWidth + " ClientH:" + Browser.clientHeight);
                    Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
                    // this.addPlayer();
                    this.resize();
                    this.findObject();
                };
                TestMap.prototype.findObject = function () {
                    //tiledMap.
                    var mapLayer = this.tiledMap.getLayerByName("object1");
                    console.debug("n:" + mapLayer.layerName);
                    console.debug("n:" + mapLayer.getLayerProperties("name"));
                    var p = this.tiledMap.getLayerObject("object1", "p1");
                    var arr = p.aniSpriteArray;
                    console.debug("arr:" + arr);
                    for (var key in arr) {
                        console.debug("k:" + key + ":" + arr[key]);
                    }
                    console.debug(p.toString());
                    p = this.tiledMap.getLayerObject("object1", "hellotext");
                    console.debug(p.toString());
                    p.show();
                    p = this.tiledMap.getLayerObject("object1", "water");
                    console.debug(p.toString());
                    // var gs:laya.map.GridSprite = this.tiledMap.getSprite("hellotext");
                    // console.debug(gs.toString());
                };
                //鼠标按下拖动地图
                TestMap.prototype.mouseDown = function () {
                    this.mLastMouseX = Laya.stage.mouseX;
                    this.mLastMouseY = Laya.stage.mouseY;
                    // p.aniSpriteArray[0].hide();
                    // p.hide();
                    var layer = this.tiledMap.getLayerByIndex(0);
                    var point = new laya.maths.Point(0, 0);
                    layer.getTilePositionByScreenPos(Laya.stage.mouseX, Laya.stage.mouseY, point);
                    var index = layer.getTileDataByScreenPos(Laya.stage.mouseX, Laya.stage.mouseY);
                    console.debug("point:" + point + " num:" + index + " m:x " + Laya.stage.mouseX + " y:" + Laya.stage.mouseY);
                    Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
                };
                TestMap.prototype.mouseMove = function () {
                    //移动地图视口
                    this.tiledMap.moveViewPort(this.mX - (Laya.stage.mouseX - this.mLastMouseX), this.mY - (Laya.stage.mouseY - this.mLastMouseY));
                };
                TestMap.prototype.mouseUp = function () {
                    this.mX = this.mX - (Laya.stage.mouseX - this.mLastMouseX);
                    this.mY = this.mY - (Laya.stage.mouseY - this.mLastMouseY);
                    Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
                };
                TestMap.prototype.keyDown = function (event) {
                    console.debug("key:" + event.keyCode + " :" + event.key);
                    var vx = 0;
                    var vy = 0;
                    switch (event.keyCode) {
                        case test.EKeyCode.UP:
                            vy -= 10;
                            break;
                        case test.EKeyCode.DOWN:
                            vy += 10;
                            break;
                        case test.EKeyCode.LEFT:
                            vx -= 10;
                            break;
                        case test.EKeyCode.RIGHT:
                            vx += 10;
                            break;
                        default:
                            return;
                    }
                    var p = this.tiledMap.getLayerObject("object1", "p1");
                    console.debug("p.pos1:" + p.x + " : " + p.y);
                    // p.pos(100,100,true);
                    p.relativeX += vx;
                    p.relativeY += vy;
                    p.isAloneObject = false;
                    // p.x += 100;
                    // p.y += 100;
                    console.debug("p.pos2:" + p.x + " : " + p.y);
                    p.updatePos();
                    console.debug("p.pos3:" + p.x + " : " + p.y);
                };
                // 窗口大小改变，把地图的视口区域重设下
                TestMap.prototype.resize = function () {
                    //改变地图视口大小
                    this.tiledMap.changeViewPort(this.mX, this.mY, Browser.width, Browser.height);
                };
                //加载玩家
                TestMap.prototype.addPlayer = function () {
                    this.player = new Laya.Animation();
                    this.player.loadAtlas("../bin/res/texture/CP003G.atlas", Laya.Handler.create(this, this.playerLoaded));
                    console.debug("addPlayer");
                };
                TestMap.prototype.playerLoaded = function () {
                    Laya.stage.addChild(this.player);
                    console.debug("playerLoaded");
                    this.player.pos(0, 0);
                    this.player.play();
                };
                return TestMap;
            }());
            test.TestMap = TestMap;
        })(test = fw.test || (fw.test = {}));
    })(fw = com.fw || (com.fw = {}));
})(com || (com = {}));
//# sourceMappingURL=TestMap.js.map