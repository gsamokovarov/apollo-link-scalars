import { every, flatMap, fromPairs, isArray, map, uniqBy } from "lodash";
import { isFieldNode, isInlineFragmentNode } from "./node-types";
export function uniqueNodes(nodes) {
    return uniqBy(nodes, fn => JSON.stringify([fn.alias && fn.alias.value, fn.name.value]));
}
function getCleanedSelections(selections, fragmentMap) {
    return flatMap(selections, sn => {
        if (isFieldNode(sn))
            return [sn];
        if (isInlineFragmentNode(sn))
            return sn.selectionSet.selections;
        const nodeOrSelectionList = fragmentMap[sn.name.value];
        if (!nodeOrSelectionList)
            return [];
        return isArray(nodeOrSelectionList)
            ? nodeOrSelectionList
            : nodeOrSelectionList.selectionSet.selections; // fragment node
    });
}
function getResolvedFieldNodes(fieldNodes, fragmentMap) {
    return fieldNodes.map(fn => {
        const { selectionSet, ...restFn } = fn;
        if (!selectionSet ||
            !selectionSet.selections ||
            !selectionSet.selections.length) {
            return { ...restFn };
        }
        const replacedSelections = replaceFragmentsOn(selectionSet.selections, fragmentMap);
        return {
            ...restFn,
            selectionSet: { ...selectionSet, selections: replacedSelections }
        };
    });
}
export function replaceFragmentsOn(selections, fragmentMap) {
    const cleaned = getCleanedSelections(selections, fragmentMap);
    if (!every(cleaned, isFieldNode)) {
        return replaceFragmentsOn(cleaned, fragmentMap);
    }
    const resolved = getResolvedFieldNodes(cleaned, fragmentMap);
    return uniqueNodes(resolved);
}
export function fragmentMapFrom(fragments) {
    const initialMap = fromPairs(map(fragments, f => [f.name.value, f]));
    return fromPairs(map(fragments, f => {
        const fieldNodes = replaceFragmentsOn(f.selectionSet.selections, initialMap);
        return [f.name.value, fieldNodes];
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhZ21lbnQtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2ZyYWdtZW50LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFFTCxLQUFLLEVBQ0wsT0FBTyxFQUNQLFNBQVMsRUFDVCxPQUFPLEVBQ1AsR0FBRyxFQUNILE1BQU0sRUFDUCxNQUFNLFFBQVEsQ0FBQztBQUVoQixPQUFPLEVBQ0wsV0FBVyxFQUNYLG9CQUFvQixFQUVyQixNQUFNLGNBQWMsQ0FBQztBQUV0QixNQUFNLFVBQVUsV0FBVyxDQUFzQixLQUFVO0lBQ3pELE9BQU8sTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRSxDQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQzVELENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxvQkFBb0IsQ0FDM0IsVUFBb0MsRUFDcEMsV0FBb0U7SUFFcEUsT0FBTyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQzlCLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQztZQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJLG9CQUFvQixDQUFDLEVBQUUsQ0FBQztZQUFFLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFFaEUsTUFBTSxtQkFBbUIsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsbUJBQW1CO1lBQUUsT0FBTyxFQUFFLENBQUM7UUFFcEMsT0FBTyxPQUFPLENBQUMsbUJBQW1CLENBQUM7WUFDakMsQ0FBQyxDQUFDLG1CQUFtQjtZQUNyQixDQUFDLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGdCQUFnQjtJQUNuRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUM1QixVQUF1QixFQUN2QixXQUFvRTtJQUVwRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDekIsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUN2QyxJQUNFLENBQUMsWUFBWTtZQUNiLENBQUMsWUFBWSxDQUFDLFVBQVU7WUFDeEIsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFDL0I7WUFDQSxPQUFPLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQztTQUN0QjtRQUVELE1BQU0sa0JBQWtCLEdBQUcsa0JBQWtCLENBQzNDLFlBQVksQ0FBQyxVQUFVLEVBQ3ZCLFdBQVcsQ0FDWixDQUFDO1FBQ0YsT0FBTztZQUNMLEdBQUcsTUFBTTtZQUNULFlBQVksRUFBRSxFQUFFLEdBQUcsWUFBWSxFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRTtTQUNsRSxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxVQUFVLGtCQUFrQixDQUNoQyxVQUFvQyxFQUNwQyxXQUFvRTtJQUVwRSxNQUFNLE9BQU8sR0FBRyxvQkFBb0IsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFOUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLEVBQUU7UUFDaEMsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDakQ7SUFFRCxNQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxPQUFzQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVFLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUM3QixTQUFtQztJQUVuQyxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sU0FBUyxDQUNkLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDakIsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLENBQ25DLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUN6QixVQUFVLENBQ1gsQ0FBQztRQUNGLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0FBQ0osQ0FBQyJ9