import * as React from "react";
import { GitgraphCore, GitgraphOptions, GitgraphUserApi, GitgraphCommitOptions, GitgraphBranchOptions, GitgraphTagOptions, GitgraphMergeOptions, BranchUserApi, Commit, MergeStyle, Mode, Orientation, TemplateName, templateExtend, BranchesPaths } from "@gitgraph/core";
declare type ReactSvgElement = React.ReactElement<SVGElement>;
declare type CommitOptions = GitgraphCommitOptions<ReactSvgElement>;
declare type BranchOptions = GitgraphBranchOptions<ReactSvgElement>;
declare type TagOptions = GitgraphTagOptions<ReactSvgElement>;
declare type MergeOptions = GitgraphMergeOptions<ReactSvgElement>;
declare type Branch = BranchUserApi<ReactSvgElement>;
export { Gitgraph, GitgraphProps, GitgraphState, CommitOptions, BranchOptions, TagOptions, MergeOptions, Branch, TemplateName, templateExtend, MergeStyle, Mode, Orientation, };
declare type GitgraphProps = GitgraphPropsWithChildren | GitgraphPropsWithGraph;
interface GitgraphPropsWithChildren {
    options?: GitgraphOptions;
    children: (gitgraph: GitgraphUserApi<ReactSvgElement>) => void;
}
interface GitgraphPropsWithGraph {
    graph: GitgraphCore<ReactSvgElement>;
}
interface GitgraphState {
    commits: Array<Commit<ReactSvgElement>>;
    branchesPaths: BranchesPaths<ReactSvgElement>;
    commitMessagesX: number;
    commitYWithOffsets: {
        [key: number]: number;
    };
    shouldRecomputeOffsets: boolean;
    currentCommitOver: Commit<ReactSvgElement> | null;
}
declare class Gitgraph extends React.Component<GitgraphProps, GitgraphState> {
    static defaultProps: Partial<GitgraphProps>;
    private gitgraph;
    private $graph;
    private $commits;
    private $tooltip;
    private commitsElements;
    constructor(props: GitgraphProps);
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private renderBranchesPaths;
    private renderCommits;
    private renderCommit;
    private renderTooltip;
    private renderDot;
    private renderArrows;
    private renderMessage;
    private renderBranchLabels;
    private renderTags;
    private createBranchLabelRef;
    private createMessageRef;
    private createTagRef;
    private initCommitElements;
    private positionCommitsElements;
    private computeOffsets;
    private getWithCommitOffset;
}
