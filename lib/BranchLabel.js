var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from "react";
var BranchLabel = /** @class */ (function (_super) {
    __extends(BranchLabel, _super);
    function BranchLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { textWidth: 0, textHeight: 0 };
        _this.$text = React.createRef();
        return _this;
    }
    BranchLabel.prototype.componentDidMount = function () {
        var box = this.$text.current.getBBox();
        this.setState({ textWidth: box.width, textHeight: box.height });
    };
    BranchLabel.prototype.render = function () {
        var _a = this.props, branch = _a.branch, commit = _a.commit;
        var boxWidth = this.state.textWidth + 2 * BranchLabel.paddingX;
        var boxHeight = this.state.textHeight + 2 * BranchLabel.paddingY;
        return (React.createElement("g", null,
            React.createElement("rect", { stroke: branch.style.label.strokeColor || commit.style.color, fill: branch.style.label.bgColor, rx: branch.style.label.borderRadius, width: boxWidth, height: boxHeight }),
            React.createElement("text", { ref: this.$text, fill: branch.style.label.color || commit.style.color, style: { font: branch.style.label.font }, alignmentBaseline: "middle", dominantBaseline: "middle", x: BranchLabel.paddingX, y: boxHeight / 2 }, branch.name)));
    };
    BranchLabel.paddingX = 5;
    BranchLabel.paddingY = 3;
    return BranchLabel;
}(React.Component));
export { BranchLabel };
//# sourceMappingURL=BranchLabel.js.map