"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const is_none_1 = require("./is-none");
function ensureNullableType(value, type, fieldNode) {
    if (!graphql_1.isNonNullType(type))
        return type;
    if (is_none_1.isNone(value)) {
        const where = fieldNode.alias
            ? `"${fieldNode.name.value}" (alias "${fieldNode.alias.value}")`
            : `"${fieldNode.name.value}"`;
        throw new graphql_1.GraphQLError(`non-null field ${where} with null value`);
    }
    return graphql_1.getNullableType(type);
}
exports.ensureNullableType = ensureNullableType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5zdXJlLW51bGxhYmxlLXR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2Vuc3VyZS1udWxsYWJsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBUWlCO0FBQ2pCLHVDQUFtQztBQUVuQyxTQUFnQixrQkFBa0IsQ0FDaEMsS0FBVSxFQUNWLElBQTBDLEVBQzFDLFNBQW9CO0lBRXBCLElBQUksQ0FBQyx1QkFBYSxDQUFDLElBQUksQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBRXRDLElBQUksZ0JBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNqQixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSztZQUMzQixDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssYUFBYSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSTtZQUNoRSxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDO1FBQ2hDLE1BQU0sSUFBSSxzQkFBWSxDQUFDLGtCQUFrQixLQUFLLGtCQUFrQixDQUFDLENBQUM7S0FDbkU7SUFFRCxPQUFPLHlCQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWZELGdEQWVDIn0=