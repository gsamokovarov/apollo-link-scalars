import { FragmentDefinitionNode } from "graphql";
import { Dictionary } from "lodash";
import { ReducedFieldNode } from "../node-types";
export declare const fragments: FragmentDefinitionNode[];
export declare const flatten: Dictionary<ReducedFieldNode[]>;
