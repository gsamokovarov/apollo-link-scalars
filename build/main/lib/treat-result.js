"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fragment_reducer_1 = require("./fragment-reducer");
const node_types_1 = require("./node-types");
const parser_1 = require("./parser");
function rootTypeFor(operationDefinitionNode, schema) {
    if (operationDefinitionNode.operation === "query") {
        return schema.getQueryType() || null;
    }
    if (operationDefinitionNode.operation === "mutation") {
        return schema.getMutationType() || null;
    }
    if (operationDefinitionNode.operation === "subscription") {
        return schema.getSubscriptionType() || null;
    }
    return null;
}
function treatResult({ schema, functionsMap, operation, result, validateEnums }) {
    const data = result.data;
    if (!data)
        return result;
    const operationDefinitionNode = fragment_reducer_1.fragmentReducer(operation.query);
    if (!operationDefinitionNode)
        return result;
    const rootType = rootTypeFor(operationDefinitionNode, schema);
    if (!rootType)
        return result;
    const parser = new parser_1.Parser(schema, functionsMap, validateEnums);
    const rootSelections = operationDefinitionNode.selectionSet.selections.filter(node_types_1.isFieldNode);
    const newData = parser.parseObjectWithSelections(data, rootType, rootSelections);
    return Object.assign(Object.assign({}, result), { data: newData });
}
exports.treatResult = treatResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlYXQtcmVzdWx0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi90cmVhdC1yZXN1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSx5REFBcUQ7QUFDckQsNkNBQTJDO0FBQzNDLHFDQUFrQztBQUVsQyxTQUFTLFdBQVcsQ0FDbEIsdUJBQWdELEVBQ2hELE1BQXFCO0lBRXJCLElBQUksdUJBQXVCLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRTtRQUNqRCxPQUFPLE1BQU0sQ0FBQyxZQUFZLEVBQUUsSUFBSSxJQUFJLENBQUM7S0FDdEM7SUFFRCxJQUFJLHVCQUF1QixDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7UUFDcEQsT0FBTyxNQUFNLENBQUMsZUFBZSxFQUFFLElBQUksSUFBSSxDQUFDO0tBQ3pDO0lBRUQsSUFBSSx1QkFBdUIsQ0FBQyxTQUFTLEtBQUssY0FBYyxFQUFFO1FBQ3hELE9BQU8sTUFBTSxDQUFDLG1CQUFtQixFQUFFLElBQUksSUFBSSxDQUFDO0tBQzdDO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBVUQsU0FBZ0IsV0FBVyxDQUFDLEVBQzFCLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxFQUNULE1BQU0sRUFDTixhQUFhLEVBQ0s7SUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUN6QixJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU8sTUFBTSxDQUFDO0lBRXpCLE1BQU0sdUJBQXVCLEdBQUcsa0NBQWUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsSUFBSSxDQUFDLHVCQUF1QjtRQUFFLE9BQU8sTUFBTSxDQUFDO0lBRTVDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RCxJQUFJLENBQUMsUUFBUTtRQUFFLE9BQU8sTUFBTSxDQUFDO0lBRTdCLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDL0QsTUFBTSxjQUFjLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQzNFLHdCQUFXLENBQ1osQ0FBQztJQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FDOUMsSUFBSSxFQUNKLFFBQVEsRUFDUixjQUFjLENBQ2YsQ0FBQztJQUNGLHVDQUFZLE1BQU0sS0FBRSxJQUFJLEVBQUUsT0FBTyxJQUFHO0FBQ3RDLENBQUM7QUExQkQsa0NBMEJDIn0=