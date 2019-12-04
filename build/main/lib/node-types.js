"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function isOperationDefinitionNode(node) {
    return node.kind === graphql_1.Kind.OPERATION_DEFINITION;
}
exports.isOperationDefinitionNode = isOperationDefinitionNode;
function isFragmentDefinitionNode(node) {
    return node.kind === graphql_1.Kind.FRAGMENT_DEFINITION;
}
exports.isFragmentDefinitionNode = isFragmentDefinitionNode;
function isFieldNode(node) {
    return node.kind === graphql_1.Kind.FIELD;
}
exports.isFieldNode = isFieldNode;
function isFragmentSpreadNode(node) {
    return node.kind === graphql_1.Kind.FRAGMENT_SPREAD;
}
exports.isFragmentSpreadNode = isFragmentSpreadNode;
function isInlineFragmentNode(node) {
    return node.kind === graphql_1.Kind.INLINE_FRAGMENT;
}
exports.isInlineFragmentNode = isInlineFragmentNode;
function isNamedTypeNode(node) {
    return node.kind === graphql_1.Kind.NAMED_TYPE;
}
exports.isNamedTypeNode = isNamedTypeNode;
function isListTypeNode(node) {
    return node.kind === graphql_1.Kind.LIST_TYPE;
}
exports.isListTypeNode = isListTypeNode;
function isNonNullTypeNode(node) {
    return node.kind === graphql_1.Kind.NON_NULL_TYPE;
}
exports.isNonNullTypeNode = isNonNullTypeNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS10eXBlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbm9kZS10eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQWNpQjtBQWtCakIsU0FBZ0IseUJBQXlCLENBQ3ZDLElBQW9CO0lBRXBCLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxjQUFJLENBQUMsb0JBQW9CLENBQUM7QUFDakQsQ0FBQztBQUpELDhEQUlDO0FBRUQsU0FBZ0Isd0JBQXdCLENBQ3RDLElBQW9CO0lBRXBCLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxjQUFJLENBQUMsbUJBQW1CLENBQUM7QUFDaEQsQ0FBQztBQUpELDREQUlDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLElBQW1CO0lBQzdDLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxjQUFJLENBQUMsS0FBSyxDQUFDO0FBQ2xDLENBQUM7QUFGRCxrQ0FFQztBQUVELFNBQWdCLG9CQUFvQixDQUNsQyxJQUFtQjtJQUVuQixPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssY0FBSSxDQUFDLGVBQWUsQ0FBQztBQUM1QyxDQUFDO0FBSkQsb0RBSUM7QUFFRCxTQUFnQixvQkFBb0IsQ0FDbEMsSUFBbUI7SUFFbkIsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLGNBQUksQ0FBQyxlQUFlLENBQUM7QUFDNUMsQ0FBQztBQUpELG9EQUlDO0FBQ0QsU0FBZ0IsZUFBZSxDQUFDLElBQWM7SUFDNUMsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLGNBQUksQ0FBQyxVQUFVLENBQUM7QUFDdkMsQ0FBQztBQUZELDBDQUVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLElBQWM7SUFDM0MsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLGNBQUksQ0FBQyxTQUFTLENBQUM7QUFDdEMsQ0FBQztBQUZELHdDQUVDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsSUFBYztJQUM5QyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssY0FBSSxDQUFDLGFBQWEsQ0FBQztBQUMxQyxDQUFDO0FBRkQsOENBRUMifQ==