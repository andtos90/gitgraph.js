import * as React from "react";
import { useState, useEffect, useRef } from "react";
export var TAG_PADDING_X = 10;
export var TAG_PADDING_Y = 5;
export function Tag(props) {
    var _a = useState({ textWidth: 0, textHeight: 0 }), state = _a[0], setState = _a[1];
    var $text = useRef(null);
    useEffect(function () {
        var box = $text.current.getBBox();
        setState({ textWidth: box.width, textHeight: box.height });
    }, []);
    var tag = props.tag;
    var offset = tag.style.pointerWidth;
    var radius = tag.style.borderRadius;
    var boxWidth = offset + state.textWidth + 2 * TAG_PADDING_X;
    var boxHeight = state.textHeight + 2 * TAG_PADDING_Y;
    var path = [
        "M 0,0",
        "L " + offset + "," + boxHeight / 2,
        "V " + boxHeight / 2,
        "Q " + offset + "," + boxHeight / 2 + " " + (offset + radius) + "," + boxHeight / 2,
        "H " + (boxWidth - radius),
        "Q " + boxWidth + "," + boxHeight / 2 + " " + boxWidth + "," + (boxHeight / 2 - radius),
        "V -" + (boxHeight / 2 - radius),
        "Q " + boxWidth + ",-" + boxHeight / 2 + " " + (boxWidth - radius) + ",-" + boxHeight / 2,
        "H " + (offset + radius),
        "Q " + offset + ",-" + boxHeight / 2 + " " + offset + ",-" + boxHeight / 2,
        "V -" + boxHeight / 2,
        "z",
    ].join(" ");
    return (React.createElement("g", null,
        React.createElement("path", { d: path, fill: tag.style.bgColor, stroke: tag.style.strokeColor }),
        React.createElement("text", { ref: $text, fill: tag.style.color, style: { font: tag.style.font }, alignmentBaseline: "middle", dominantBaseline: "middle", x: offset + TAG_PADDING_X, y: 0 }, tag.name)));
}
//# sourceMappingURL=Tag.js.map