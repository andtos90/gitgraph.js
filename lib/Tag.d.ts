import * as React from "react";
import { Tag as CoreTag } from "@gitgraph/core";
interface Props {
    tag: CoreTag<React.ReactElement<SVGElement>>;
}
export declare const TAG_PADDING_X = 10;
export declare const TAG_PADDING_Y = 5;
export declare function Tag(props: Props): JSX.Element;
export {};
