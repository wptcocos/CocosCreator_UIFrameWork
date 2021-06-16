import { Bound } from "../Components/QuadTree";
import { Intersection } from "./LightStruct";

const {ccclass, property} = cc._decorator;

export enum LightType {
    Round,      // 圆形
    Sector,     // 扇形
}

@ccclass
export default class Light extends cc.Component {
    /** 画笔 */
    @property(cc.Graphics)
    graphics: cc.Graphics = null;
    @property({type: cc.Enum(LightType)})
    lightType: LightType = 0;


    canvasSize: cc.Size = null;
    visiableSize: cc.Size = null;

    radius = 150;
    fade = 1;

    // graphics
    private _material: cc.Material = null;

    onLoad () {
        this._material = this.graphics.getMaterial(0);
        
        // Light.ts:34 Size {width: 568, height: 320} Size {width: 1065, height: 600}
        this.canvasSize = cc.view.getCanvasSize();
        this.visiableSize = cc.view.getVisibleSize();
        
        this.node.setContentSize(this.canvasSize);

        this._material.setProperty("screen", cc.v2(this.canvasSize.width, this.canvasSize.height));


        let r = this.radius / this.canvasSize.width;
        this._material.setProperty("maxRadius", r);
    }

    
    start () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchMove(e: cc.Event.EventTouch) {
        this.node.x += e.getDeltaX();
        this.node.y += e.getDeltaY();
    }

    public getBound() {
        let pos = this.node.getPosition();
        return new Bound(pos.x-this.radius/2, pos.y-this.radius/2, this.radius, this.radius);
    }
    

    public draw(intersections: Intersection[]) {
        let lightPos = this.node.getPosition();
        this._doDraw(this.graphics, lightPos, intersections);
        this._material.setProperty("lightPos", cc.v2(lightPos.x/this.visiableSize.width, lightPos.y/this.visiableSize.height));
    }

    /** 绘制light */
    private _doDraw(graphics: cc.Graphics, light: cc.Vec2, intersects: Intersection[]) {
        
        graphics.clear();
        graphics.moveTo(intersects[0].x, intersects[0].y);
        for(let i=1; i<intersects.length; i++) {
            let intersect = intersects[i];
            graphics.lineTo(intersect.x, intersect.y);
        }
        graphics.moveTo(intersects[0].x, intersects[0].y);
        
        graphics.fill();

        // for(let i=0; i<intersects.length; i++) {
        //     let intersect = intersects[i];
        //     graphics.moveTo(light.x, light.y);
        //     graphics.lineTo(intersect.x, intersect.y);
        //     graphics.stroke();
        // }
    }
        
    // update (dt) {}
}