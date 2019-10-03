import * as React from "react";
import { Branch, Commit } from "@gitgraph/core";
interface Props {
    branch: Branch<React.ReactElement<SVGElement>>;
    commit: Commit<React.ReactElement<SVGElement>>;
}
interface State {
    textWidth: number;
    textHeight: number;
}
export declare class BranchLabel extends React.Component<Props, State> {
    static readonly paddingX = 5;
    static readonly paddingY = 3;
    readonly state: {
        textWidth: number;
        textHeight: number;
    };
    private $text;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
