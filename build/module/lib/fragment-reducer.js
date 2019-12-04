import { fragmentMapFrom, replaceFragmentsOn } from "./fragment-utils";
import { isFragmentDefinitionNode, isOperationDefinitionNode } from "./node-types";
export function fragmentReducer(doc) {
    if (!doc || !doc.definitions || !doc.definitions.length)
        return null;
    const operationNode = doc.definitions.find(isOperationDefinitionNode) || null;
    if (!operationNode)
        return null;
    const fragments = doc.definitions.filter(isFragmentDefinitionNode);
    const fragmentMap = fragmentMapFrom(fragments);
    const { selections, ...selectionSet } = operationNode.selectionSet;
    const list = replaceFragmentsOn(selections, fragmentMap);
    return {
        ...operationNode,
        selectionSet: { ...selectionSet, selections: list }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhZ21lbnQtcmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZnJhZ21lbnQtcmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDdkUsT0FBTyxFQUNMLHdCQUF3QixFQUN4Qix5QkFBeUIsRUFFMUIsTUFBTSxjQUFjLENBQUM7QUFFdEIsTUFBTSxVQUFVLGVBQWUsQ0FDN0IsR0FBaUI7SUFFakIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU07UUFBRSxPQUFPLElBQUksQ0FBQztJQUNyRSxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUM5RSxJQUFJLENBQUMsYUFBYTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBRWhDLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDbkUsTUFBTSxXQUFXLEdBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDO0lBQ25FLE1BQU0sSUFBSSxHQUFHLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6RCxPQUFPO1FBQ0wsR0FBRyxhQUFhO1FBQ2hCLFlBQVksRUFBRSxFQUFFLEdBQUcsWUFBWSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7S0FDcEQsQ0FBQztBQUNKLENBQUMifQ==