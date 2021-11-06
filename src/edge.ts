import { Container } from "@pixi/display";
import { InteractionEvent } from "@pixi/interaction";
import { IPointData } from "@pixi/math";
import { TypedEmitter } from "tiny-typed-emitter";
import {
  createEdge,
  updateEdgeStyle,
  updateEdgeVisibility,
} from "./renderers/edge";
import {
  createEdgeLabel,
  updateEdgeLabelStyle,
  updateEdgeLabelVisibility,
} from "./renderers/edge-label";
import { EdgeStyle } from "./utils/style";
import { TextureCache } from "./texture-cache";

interface PixiEdgeEvents {
  mousemove: (event: MouseEvent) => void;
  mouseover: (event: MouseEvent) => void;
  mouseout: (event: MouseEvent) => void;
  mousedown: (event: MouseEvent) => void;
  mouseup: (event: MouseEvent) => void;
}

export class PixiEdge extends TypedEmitter<PixiEdgeEvents> {
  edgeGfx: Container;
  edgePlaceholderGfx: Container;
  edgeLabelGfx: Container;
  edgeLabelPlaceholderGfx: Container;

  hovered: boolean = false;

  constructor() {
    super();

    this.edgeGfx = this.createEdge();
    this.edgePlaceholderGfx = new Container();

    this.edgeLabelGfx = this.createEdgeLabel();
    this.edgeLabelPlaceholderGfx = new Container();
  }

  createEdge() {
    const edgeGfx = new Container();
    edgeGfx.interactive = true;
    edgeGfx.buttonMode = false;
    edgeGfx.on("pointermove", (event: InteractionEvent) =>
      this.emit("mousemove", event.data.originalEvent as MouseEvent)
    );
    edgeGfx.on("pointerover", (event: InteractionEvent) =>
      this.emit("mouseover", event.data.originalEvent as MouseEvent)
    );
    edgeGfx.on("pointerout", (event: InteractionEvent) =>
      this.emit("mouseout", event.data.originalEvent as MouseEvent)
    );
    edgeGfx.on("pointerdown", (event: InteractionEvent) =>
      this.emit("mousedown", event.data.originalEvent as MouseEvent)
    );
    edgeGfx.on("pointerup", (event: InteractionEvent) =>
      this.emit("mouseup", event.data.originalEvent as MouseEvent)
    );
    createEdge(edgeGfx);
    return edgeGfx;
  }

  private createEdgeLabel() {
    const edgeLabelGfx = new Container();
    edgeLabelGfx.interactive = false;
    edgeLabelGfx.buttonMode = false;
    createEdgeLabel(edgeLabelGfx);
    return edgeLabelGfx;
  }

  updatePosition(
    sourceNodePosition: IPointData,
    targetNodePosition: IPointData
  ) {
    const position = {
      x: (sourceNodePosition.x + targetNodePosition.x) / 2,
      y: (sourceNodePosition.y + targetNodePosition.y) / 2,
    };
    const rotation = -Math.atan2(
      targetNodePosition.x - sourceNodePosition.x,
      targetNodePosition.y - sourceNodePosition.y
    );
    const length = Math.hypot(
      targetNodePosition.x - sourceNodePosition.x,
      targetNodePosition.y - sourceNodePosition.y
    );

    this.edgeGfx.position.copyFrom(position);
    this.edgeGfx.rotation = rotation;
    this.edgeGfx.height = length;

    this.edgeLabelGfx.position.copyFrom(position);
  }

  updateStyle(edgeStyle: EdgeStyle, textureCache: TextureCache) {
    updateEdgeStyle(this.edgeGfx, edgeStyle, textureCache);
    updateEdgeLabelStyle(this.edgeLabelGfx, edgeStyle, textureCache);
  }

  updateVisibility(zoomStep: number) {
    updateEdgeVisibility(this.edgeGfx, zoomStep);
    updateEdgeLabelVisibility(this.edgeLabelGfx, zoomStep);
  }
}
