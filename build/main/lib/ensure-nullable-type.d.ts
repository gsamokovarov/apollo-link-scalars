import { FieldNode, GraphQLInputType, GraphQLNullableType, GraphQLOutputType } from "graphql";
export declare function ensureNullableType(value: any, type: GraphQLOutputType | GraphQLInputType, fieldNode: FieldNode): GraphQLNullableType;
