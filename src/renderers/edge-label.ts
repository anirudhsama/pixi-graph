import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { BitmapText } from "@pixi/text-bitmap";
import "@pixi/mixin-get-child-by-name";
import { colorToPixi } from "../utils/color";
import { EdgeStyle } from "../utils/style";
import { textToPixi } from "../utils/text";
import { TextureCache } from "../texture-cache";

const DELIMETER = "::";

const NODE_LABEL_TEXT = "NODE_LABEL_TEXT";

export function createEdgeLabel(nodeLabelGfx: Container) {
  // nodeLabelGfx -> nodeLabelText
  const nodeLabelText = new Sprite();
  nodeLabelText.name = NODE_LABEL_TEXT;
  nodeLabelText.anchor.set(0.5);
  nodeLabelGfx.addChild(nodeLabelText);
}

export function updateEdgeLabelStyle(
  nodeLabelGfx: Container,
  nodeStyle: EdgeStyle,
  textureCache: TextureCache
) {
  const nodeLabelTextTextureKey = [
    NODE_LABEL_TEXT,
    nodeStyle.label.fontFamily,
    nodeStyle.label.fontSize,
    nodeStyle.label.content,
  ].join(DELIMETER);

  const nodeLabelTextTexture = textureCache.get(nodeLabelTextTextureKey, () => {
    const text = textToPixi(nodeStyle.label.type, nodeStyle.label.content, {
      fontFamily: nodeStyle.label.fontFamily,
      fontSize: nodeStyle.label.fontSize,
    });
    return text;
  });

  // nodeLabelGfx -> nodeLabelText
  const nodeLabelText = nodeLabelGfx.getChildByName!(NODE_LABEL_TEXT) as Sprite;
  nodeLabelText.texture = nodeLabelTextTexture;

  [nodeLabelText.tint, nodeLabelText.alpha] = colorToPixi(
    nodeStyle.label.color
  );
}

export function updateEdgeLabelVisibility(
  nodeLabelGfx: Container,
  zoomStep: number
) {
  // nodeLabelGfx -> nodeLabelText
  const nodeLabelText = nodeLabelGfx.getChildByName!(
    NODE_LABEL_TEXT
  ) as BitmapText;
  nodeLabelText.visible = nodeLabelText.visible && zoomStep >= 3;
}
