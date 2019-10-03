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
import { GitgraphCore, MergeStyle, Mode, Orientation, TemplateName, templateExtend, toSvgPath, arrowSvgPath, } from "@gitgraph/core";
import { BranchLabel } from "./BranchLabel";
import { Tooltip } from "./Tooltip";
import { Dot } from "./Dot";
import { Tag, TAG_PADDING_X } from "./Tag";
export { Gitgraph, TemplateName, templateExtend, MergeStyle, Mode, Orientation, };
function isPropsWithGraph(props) {
    return "graph" in props;
}
var Gitgraph = /** @class */ (function (_super) {
    __extends(Gitgraph, _super);
    function Gitgraph(props) {
        var _this = _super.call(this, props) || this;
        _this.$graph = React.createRef();
        _this.$commits = React.createRef();
        _this.$tooltip = null;
        _this.commitsElements = {};
        _this.state = {
            commits: [],
            branchesPaths: new Map(),
            commitMessagesX: 0,
            commitYWithOffsets: {},
            shouldRecomputeOffsets: true,
            currentCommitOver: null,
        };
        _this.gitgraph = isPropsWithGraph(props)
            ? props.graph
            : new GitgraphCore(props.options);
        _this.gitgraph.subscribe(function (data) {
            var commits = data.commits, branchesPaths = data.branchesPaths, commitMessagesX = data.commitMessagesX;
            _this.setState({
                commits: commits,
                branchesPaths: branchesPaths,
                commitMessagesX: commitMessagesX,
                shouldRecomputeOffsets: true,
            });
        });
        return _this;
    }
    Gitgraph.prototype.render = function () {
        return (React.createElement("svg", { ref: this.$graph },
            React.createElement("g", { transform: "translate(" + BranchLabel.paddingX + ", " + Tooltip.padding + ")" },
                this.renderBranchesPaths(),
                this.renderCommits(),
                this.$tooltip)));
    };
    Gitgraph.prototype.componentDidMount = function () {
        if (isPropsWithGraph(this.props))
            return;
        this.props.children(this.gitgraph.getUserApi());
    };
    Gitgraph.prototype.componentDidUpdate = function () {
        if (this.$graph.current) {
            var _a = this.$graph.current.getBBox(), height = _a.height, width = _a.width;
            this.$graph.current.setAttribute("width", 
            // Add `Tooltip.padding` so we don't crop the tooltip text.
            // Add `BranchLabel.paddingX` so we don't cut branch label.
            (width + Tooltip.padding + BranchLabel.paddingX).toString());
            this.$graph.current.setAttribute("height", 
            // Add `Tooltip.padding` so we don't crop tooltip text
            // Add `BranchLabel.paddingY` so we don't crop branch label.
            (height + Tooltip.padding + BranchLabel.paddingY).toString());
        }
        if (!this.state.shouldRecomputeOffsets)
            return;
        if (!this.$commits.current)
            return;
        this.positionCommitsElements();
        var commits = Array.from(this.$commits.current.children);
        this.setState({
            commitYWithOffsets: this.computeOffsets(commits),
            shouldRecomputeOffsets: false,
        });
    };
    Gitgraph.prototype.renderBranchesPaths = function () {
        var _this = this;
        var offset = this.gitgraph.template.commit.dot.size;
        var isBezier = this.gitgraph.template.branch.mergeStyle === MergeStyle.Bezier;
        return Array.from(this.state.branchesPaths).map(function (_a) {
            var branch = _a[0], coordinates = _a[1];
            return (React.createElement("path", { key: branch.name, d: toSvgPath(coordinates.map(function (a) { return a.map(function (b) { return _this.getWithCommitOffset(b); }); }), isBezier, _this.gitgraph.isVertical), fill: "transparent", stroke: branch.computedColor, strokeWidth: branch.style.lineWidth, transform: "translate(" + offset + ", " + offset + ")" }));
        });
    };
    Gitgraph.prototype.renderCommits = function () {
        var _this = this;
        return (React.createElement("g", { ref: this.$commits }, this.state.commits.map(function (commit) { return _this.renderCommit(commit); })));
    };
    Gitgraph.prototype.renderCommit = function (commit) {
        var _a = this.getWithCommitOffset(commit), x = _a.x, y = _a.y;
        var shouldRenderTooltip = this.state.currentCommitOver === commit &&
            (this.gitgraph.isHorizontal ||
                (this.gitgraph.mode === Mode.Compact &&
                    commit.style.hasTooltipInCompactMode));
        if (shouldRenderTooltip) {
            this.$tooltip = (React.createElement("g", { key: commit.hashAbbrev, transform: "translate(" + x + ", " + y + ")" }, this.renderTooltip(commit)));
        }
        return (React.createElement("g", { key: commit.hashAbbrev, transform: "translate(" + x + ", " + y + ")" },
            this.renderDot(commit),
            this.gitgraph.template.arrow.size && this.renderArrows(commit),
            React.createElement("g", { transform: "translate(" + -x + ", 0)" },
                commit.style.message.display && this.renderMessage(commit),
                this.renderBranchLabels(commit),
                this.renderTags(commit))));
    };
    Gitgraph.prototype.renderTooltip = function (commit) {
        if (commit.renderTooltip) {
            return commit.renderTooltip(commit);
        }
        return (React.createElement(Tooltip, { commit: commit },
            commit.hashAbbrev,
            " - ",
            commit.subject));
    };
    Gitgraph.prototype.renderDot = function (commit) {
        var _this = this;
        if (commit.renderDot) {
            return commit.renderDot(commit);
        }
        return (React.createElement(Dot, { commit: commit, onMouseOver: function () {
                _this.setState({ currentCommitOver: commit });
                commit.onMouseOver();
            }, onMouseOut: function () {
                _this.setState({ currentCommitOver: null });
                _this.$tooltip = null;
                commit.onMouseOut();
            } }));
    };
    Gitgraph.prototype.renderArrows = function (commit) {
        var _this = this;
        var commitRadius = commit.style.dot.size;
        return commit.parents.map(function (parentHash) {
            var parent = _this.state.commits.find(function (_a) {
                var hash = _a.hash;
                return hash === parentHash;
            });
            if (!parent)
                return null;
            // Starting point, relative to commit
            var origin = _this.gitgraph.reverseArrow
                ? {
                    x: commitRadius + (parent.x - commit.x),
                    y: commitRadius + (parent.y - commit.y),
                }
                : { x: commitRadius, y: commitRadius };
            return (React.createElement("g", { transform: "translate(" + origin.x + ", " + origin.y + ")" },
                React.createElement("path", { d: arrowSvgPath(_this.gitgraph, parent, commit), fill: _this.gitgraph.template.arrow.color })));
        });
    };
    Gitgraph.prototype.renderMessage = function (commit) {
        var ref = this.createMessageRef(commit);
        if (commit.renderMessage) {
            return React.createElement("g", { ref: ref }, commit.renderMessage(commit));
        }
        var body = null;
        if (commit.body) {
            body = (React.createElement("foreignObject", { width: "600", x: "10" },
                React.createElement("p", null, commit.body)));
        }
        // Use commit dot radius to align text with the middle of the dot.
        var y = commit.style.dot.size;
        return (React.createElement("g", { ref: ref, transform: "translate(0, " + y + ")" },
            React.createElement("text", { alignmentBaseline: "central", fill: commit.style.message.color, style: { font: commit.style.message.font }, onClick: commit.onMessageClick }, commit.message),
            body));
    };
    Gitgraph.prototype.renderBranchLabels = function (commit) {
        var _this = this;
        // @gitgraph/core could compute branch labels into commits directly.
        // That will make it easier to retrieve them, just like tags.
        var branches = Array.from(this.gitgraph.branches.values());
        return branches.map(function (branch) {
            if (!branch.style.label.display)
                return null;
            if (!_this.gitgraph.branchLabelOnEveryCommit) {
                var commitHash = _this.gitgraph.refs.getCommit(branch.name);
                if (commit.hash !== commitHash)
                    return null;
            }
            // For the moment, we don't handle multiple branch labels.
            // To do so, we'd need to reposition each of them appropriately.
            if (commit.branchToDisplay !== branch.name)
                return null;
            var ref = _this.createBranchLabelRef(commit);
            var branchLabel = branch.renderLabel ? (branch.renderLabel(branch)) : (React.createElement(BranchLabel, { branch: branch, commit: commit }));
            if (_this.gitgraph.isVertical) {
                return (React.createElement("g", { key: branch.name, ref: ref }, branchLabel));
            }
            else {
                var commitDotSize = commit.style.dot.size * 2;
                var horizontalMarginTop = 2;
                var y = commitDotSize + horizontalMarginTop;
                return (React.createElement("g", { key: branch.name, ref: ref, transform: "translate(" + commit.x + ", " + y + ")" }, branchLabel));
            }
        });
    };
    Gitgraph.prototype.renderTags = function (commit) {
        var _this = this;
        if (!commit.tags)
            return null;
        if (this.gitgraph.isHorizontal)
            return null;
        return commit.tags.map(function (tag) {
            var ref = _this.createTagRef(commit);
            return (React.createElement("g", { key: commit.hashAbbrev + "-" + tag.name, ref: ref, transform: "translate(0, " + commit.style.dot.size + ")" }, tag.render ? tag.render(tag.name, tag.style) : React.createElement(Tag, { tag: tag })));
        });
    };
    Gitgraph.prototype.createBranchLabelRef = function (commit) {
        var ref = React.createRef();
        if (!this.commitsElements[commit.hashAbbrev]) {
            this.initCommitElements(commit);
        }
        this.commitsElements[commit.hashAbbrev].branchLabel = ref;
        return ref;
    };
    Gitgraph.prototype.createMessageRef = function (commit) {
        var ref = React.createRef();
        if (!this.commitsElements[commit.hashAbbrev]) {
            this.initCommitElements(commit);
        }
        this.commitsElements[commit.hashAbbrev].message = ref;
        return ref;
    };
    Gitgraph.prototype.createTagRef = function (commit) {
        var ref = React.createRef();
        if (!this.commitsElements[commit.hashAbbrev]) {
            this.initCommitElements(commit);
        }
        this.commitsElements[commit.hashAbbrev].tags.push(ref);
        return ref;
    };
    Gitgraph.prototype.initCommitElements = function (commit) {
        this.commitsElements[commit.hashAbbrev] = {
            branchLabel: null,
            tags: [],
            message: null,
        };
    };
    Gitgraph.prototype.positionCommitsElements = function () {
        var _this = this;
        if (this.gitgraph.isHorizontal) {
            // Elements don't appear on horizontal mode, yet.
            return;
        }
        var padding = 10;
        // Ensure commits elements (branch labels, message…) are well positionned.
        // It can't be done at render time since elements size is dynamic.
        Object.keys(this.commitsElements).forEach(function (commitHash) {
            var _a = _this.commitsElements[commitHash], branchLabel = _a.branchLabel, tags = _a.tags, message = _a.message;
            // We'll store X position progressively and translate elements.
            var x = _this.state.commitMessagesX;
            if (branchLabel && branchLabel.current) {
                moveElement(branchLabel.current, x);
                // For some reason, one paddingX is missing in BBox width.
                var branchLabelWidth = branchLabel.current.getBBox().width + BranchLabel.paddingX;
                x += branchLabelWidth + padding;
            }
            tags.forEach(function (tag) {
                if (!tag || !tag.current)
                    return;
                moveElement(tag.current, x);
                // For some reason, one paddingX is missing in BBox width.
                var tagWidth = tag.current.getBBox().width + TAG_PADDING_X;
                x += tagWidth + padding;
            });
            if (message && message.current) {
                moveElement(message.current, x);
            }
        });
    };
    Gitgraph.prototype.computeOffsets = function (commits) {
        var totalOffsetY = 0;
        // In VerticalReverse orientation, commits are in the same order in the DOM.
        var orientedCommits = this.gitgraph.orientation === Orientation.VerticalReverse
            ? commits
            : commits.reverse();
        return orientedCommits.reduce(function (newOffsets, commit) {
            var commitY = parseInt(commit
                .getAttribute("transform")
                .split(",")[1]
                .slice(0, -1), 10);
            var firstForeignObject = commit.getElementsByTagName("foreignObject")[0];
            var customHtmlMessage = firstForeignObject && firstForeignObject.firstElementChild;
            var messageHeight = 0;
            if (customHtmlMessage) {
                var height = customHtmlMessage.getBoundingClientRect().height;
                var marginTopInPx = window.getComputedStyle(customHtmlMessage).marginTop || "0px";
                var marginTop = parseInt(marginTopInPx.replace("px", ""), 10);
                messageHeight = height + marginTop;
            }
            // Force the height of the foreignObject (browser issue)
            if (firstForeignObject) {
                firstForeignObject.setAttribute("height", messageHeight + "px");
            }
            newOffsets[commitY] = commitY + totalOffsetY;
            // Increment total offset after setting the offset
            // => offset next commits accordingly.
            totalOffsetY += messageHeight;
            return newOffsets;
        }, {});
    };
    Gitgraph.prototype.getWithCommitOffset = function (_a) {
        var x = _a.x, y = _a.y;
        return { x: x, y: this.state.commitYWithOffsets[y] || y };
    };
    Gitgraph.defaultProps = {
        options: {},
    };
    return Gitgraph;
}(React.Component));
function moveElement(target, x) {
    var transform = target.getAttribute("transform") || "translate(0, 0)";
    target.setAttribute("transform", transform.replace(/translate\(([\d\.]+),/, "translate(" + x + ","));
}
//# sourceMappingURL=Gitgraph.js.map