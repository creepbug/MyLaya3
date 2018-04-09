/**
* name 
*/
module com.fw.test{
	import Stage = Laya.Stage;
	import TiledMap = Laya.TiledMap;
	import MapLayer = Laya.MapLayer;
	import Rectangle = Laya.Rectangle;
	import Browser = Laya.Browser;
	import Handler = Laya.Handler;
	import Stat = Laya.Stat;
	import WebGL = Laya.WebGL;
	export class TestMap{
		private tiledMap: TiledMap;
		private mLastMouseX: number = 0;
		private mLastMouseY: number = 0;

		private mX: number = 0;
		private mY: number = 0;
		private player:Laya.Animation;

		constructor() {
			console.log("fuck ");
			// 不支持WebGL时自动切换至Canvas
			Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);
			Laya.stage.scaleMode = Stage.SCALE_FULL;
			Stat.show();

			this.createMap();

			Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);//注册鼠标事件
			Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
			Laya.stage.on(Laya.Event.KEY_DOWN, this, this.keyDown);

		}

		//创建地图
		private createMap() {
			//创建地图对象
			this.tiledMap = new TiledMap();
			this.tiledMap.autoCacheType= 'normal';
			this.mX = this.mY = 0;
			//创建地图，适当的时候调用destory销毁地图
			console.debug("w:"+Browser.width, "h:"+Browser.height);
			this.tiledMap.createMap("../bin/res/tiledMap/untitled.json", new Rectangle(0, 0, Browser.width, Browser.height), new Handler(this, this.completeHandler));
		}

		/**
		 * 地图加载完成的回调
		 */
		private completeHandler(): void {
			console.log("地图创建完成");
			console.log("ClientW:" + Browser.clientWidth + " ClientH:" + Browser.clientHeight);
			Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
			// this.addPlayer();
			this.resize();
			this.findObject();
		}

		private findObject():void {
            //tiledMap.
            var mapLayer:MapLayer = this.tiledMap.getLayerByName("object1");
            console.debug("n:"+mapLayer.layerName);
            console.debug("n:"+mapLayer.getLayerProperties("name"));

            	
            var p:laya.map.GridSprite = this.tiledMap.getLayerObject("object1","p1");
            var arr = p.aniSpriteArray;
            console.debug("arr:"+arr);
            for (var key in arr) {
              console.debug("k:"+key +":"+arr[key]);
            }

            console.debug(p.toString());
            p = this.tiledMap.getLayerObject("object1","hellotext");
            console.debug(p.toString())
            p.show();

            p = this.tiledMap.getLayerObject("object1","water");
            console.debug(p.toString())
            
            // var gs:laya.map.GridSprite = this.tiledMap.getSprite("hellotext");

            // console.debug(gs.toString());

        }

		//鼠标按下拖动地图
		private mouseDown(): void {
			this.mLastMouseX = Laya.stage.mouseX;
			this.mLastMouseY = Laya.stage.mouseY;

		
		
			// p.aniSpriteArray[0].hide();
			// p.hide();

			var layer:laya.map.MapLayer = this.tiledMap.getLayerByIndex(0);
			var point:laya.maths.Point = new laya.maths.Point(0,0);

			layer.getTilePositionByScreenPos(Laya.stage.mouseX,Laya.stage.mouseY,point);
			var index = layer.getTileDataByScreenPos(Laya.stage.mouseX,Laya.stage.mouseY);

			

			console.debug("point:"+point +" num:"+index +" m:x "+Laya.stage.mouseX+" y:"+Laya.stage.mouseY);
			Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
		}

		private mouseMove(): void {
			//移动地图视口
			this.tiledMap.moveViewPort(this.mX - (Laya.stage.mouseX - this.mLastMouseX), this.mY - (Laya.stage.mouseY - this.mLastMouseY));
		}

		private mouseUp(): void {
			this.mX = this.mX - (Laya.stage.mouseX - this.mLastMouseX);
			this.mY = this.mY - (Laya.stage.mouseY - this.mLastMouseY);
		
			Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
		}

		private keyDown(event:KeyboardEvent): void {
			console.debug("key:"+event.keyCode+" :"+event.key);
			var vx:number = 0;
			var vy:number = 0;
			switch (event.keyCode) {
				case EKeyCode.UP:
					vy -= 10;
					break;
				case EKeyCode.DOWN:
					vy += 10;
					break;
				case EKeyCode.LEFT:
					vx -= 10;
					break;
				case EKeyCode.RIGHT:
					vx += 10;
					break;
				default:
					return;
			}

			var p:laya.map.GridSprite = this.tiledMap.getLayerObject("object1","p1");
			console.debug("p.pos1:"+p.x+" : "+p.y); 
			// p.pos(100,100,true);
			p.relativeX += vx;
			p.relativeY += vy;
			p.isAloneObject = false;
			// p.x += 100;
			// p.y += 100;
			console.debug("p.pos2:"+p.x+" : "+p.y); 
			p.updatePos();
			console.debug("p.pos3:"+p.x+" : "+p.y); 
		}

		// 窗口大小改变，把地图的视口区域重设下
		private resize(): void {
			//改变地图视口大小
			this.tiledMap.changeViewPort(this.mX, this.mY, Browser.width, Browser.height);
		}

		//加载玩家
		private addPlayer():void{
			this.player = new Laya.Animation();
			this.player.loadAtlas("../bin/res/texture/CP003G.atlas",Laya.Handler.create(this,this.playerLoaded));
			console.debug("addPlayer");
		}

		private playerLoaded():void{
			Laya.stage.addChild(this.player);
			console.debug("playerLoaded");
			this.player.pos(0,0);
			this.player.play();
			
		}
	}
}
