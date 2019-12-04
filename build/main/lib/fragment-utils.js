"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const node_types_1 = require("./node-types");
function uniqueNodes(nodes) {
    return lodash_1.uniqBy(nodes, fn => JSON.stringify([fn.alias && fn.alias.value, fn.name.value]));
}
exports.uniqueNodes = uniqueNodes;
function getCleanedSelections(selections, fragmentMap) {
    return lodash_1.flatMap(selections, sn => {
        if (node_types_1.isFieldNode(sn))
            return [sn];
        if (node_types_1.isInlineFragmentNode(sn))
            return sn.selectionSet.selections;
        const nodeOrSelectionList = fragmentMap[sn.name.value];
        if (!nodeOrSelectionList)
            return [];
        return lodash_1.isArray(nodeOrSelectionList)
            ? nodeOrSelectionList
            : nodeOrSelectionList.selectionSet.selections; // fragment node
    });
}
function getResolvedFieldNodes(fieldNodes, fragmentMap) {
    return fieldNodes.map(fn => {
        const { selectionSet } = fn, restFn = __rest(fn, ["selectionSet"]);
        if (!selectionSet ||
            !selectionSet.selections ||
            !selectionSet.selections.length) {
            return Object.assign({}, restFn);
        }
        const replacedSelections = replaceFragmentsOn(selectionSet.selections, fragmentMap);
        return Object.assign(Object.assign({}, restFn), { selectionSet: Object.assign(Object.assign({}, selectionSet), { selections: replacedSelections }) });
    });
}
function replaceFragmentsOn(selections, fragmentMap) {
    const cleaned = getCleanedSelections(selections, fragmentMap);
    if (!lodash_1.every(cleaned, node_types_1.isFieldNode)) {
        return replaceFragmentsOn(cleaned, fragmentMap);
    }
    const resolved = getResolvedFieldNodes(cleaned, fragmentMap);
    return uniqueNodes(resolved);
}
exports.replaceFragmentsOn = replaceFragmentsOn;
function fragmentMapFrom(fragments) {
    const initialMap = lodash_1.fromPairs(lodash_1.map(fragments, f => [f.name.value, f]));
    return lodash_1.fromPairs(lodash_1.map(fragments, f => {
        const fieldNodes = replaceFragmentsOn(f.selectionSet.selections, initialMap);
        return [f.name.value, fieldNodes];
    }));
}
exports.fragmentMapFrom = fragmentMapFrom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhZ21lbnQtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2ZyYWdtZW50LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxtQ0FRZ0I7QUFFaEIsNkNBSXNCO0FBRXRCLFNBQWdCLFdBQVcsQ0FBc0IsS0FBVTtJQUN6RCxPQUFPLGVBQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUM1RCxDQUFDO0FBQ0osQ0FBQztBQUpELGtDQUlDO0FBRUQsU0FBUyxvQkFBb0IsQ0FDM0IsVUFBb0MsRUFDcEMsV0FBb0U7SUFFcEUsT0FBTyxnQkFBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUM5QixJQUFJLHdCQUFXLENBQUMsRUFBRSxDQUFDO1lBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksaUNBQW9CLENBQUMsRUFBRSxDQUFDO1lBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUVoRSxNQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxtQkFBbUI7WUFBRSxPQUFPLEVBQUUsQ0FBQztRQUVwQyxPQUFPLGdCQUFPLENBQUMsbUJBQW1CLENBQUM7WUFDakMsQ0FBQyxDQUFDLG1CQUFtQjtZQUNyQixDQUFDLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLGdCQUFnQjtJQUNuRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUM1QixVQUF1QixFQUN2QixXQUFvRTtJQUVwRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDekIsTUFBTSxFQUFFLFlBQVksS0FBZ0IsRUFBRSxFQUFoQixxQ0FBZ0IsQ0FBQztRQUN2QyxJQUNFLENBQUMsWUFBWTtZQUNiLENBQUMsWUFBWSxDQUFDLFVBQVU7WUFDeEIsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFDL0I7WUFDQSx5QkFBWSxNQUFNLEVBQUc7U0FDdEI7UUFFRCxNQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUMzQyxZQUFZLENBQUMsVUFBVSxFQUN2QixXQUFXLENBQ1osQ0FBQztRQUNGLHVDQUNLLE1BQU0sS0FDVCxZQUFZLGtDQUFPLFlBQVksS0FBRSxVQUFVLEVBQUUsa0JBQWtCLE9BQy9EO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQ2hDLFVBQW9DLEVBQ3BDLFdBQW9FO0lBRXBFLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU5RCxJQUFJLENBQUMsY0FBSyxDQUFDLE9BQU8sRUFBRSx3QkFBVyxDQUFDLEVBQUU7UUFDaEMsT0FBTyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDakQ7SUFFRCxNQUFNLFFBQVEsR0FBRyxxQkFBcUIsQ0FBQyxPQUFzQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVFLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFaRCxnREFZQztBQUVELFNBQWdCLGVBQWUsQ0FDN0IsU0FBbUM7SUFFbkMsTUFBTSxVQUFVLEdBQUcsa0JBQVMsQ0FBQyxZQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsT0FBTyxrQkFBUyxDQUNkLFlBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDakIsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLENBQ25DLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUN6QixVQUFVLENBQ1gsQ0FBQztRQUNGLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FDSCxDQUFDO0FBQ0osQ0FBQztBQWJELDBDQWFDIn0=