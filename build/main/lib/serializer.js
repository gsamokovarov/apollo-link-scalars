"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const is_none_1 = require("./is-none");
const map_if_array_1 = require("./map-if-array");
class Serializer {
    constructor(schema, functionsMap, removeTypenameFromInputs) {
        this.schema = schema;
        this.functionsMap = functionsMap;
        this.removeTypenameFromInputs = removeTypenameFromInputs;
    }
    serialize(value, type) {
        if (is_none_1.isNone(value))
            return value;
        return this.serializeNullable(value, graphql_1.getNullableType(type));
    }
    serializeNullable(value, type) {
        if (graphql_1.isScalarType(type) || graphql_1.isEnumType(type)) {
            return this.serializeLeaf(value, type);
        }
        if (graphql_1.isListType(type)) {
            return map_if_array_1.mapIfArray(value, v => this.serialize(v, type.ofType));
        }
        return this.serializeInputObject(value, type);
    }
    serializeLeaf(value, type) {
        const fns = this.functionsMap[type.name] || type;
        return fns.serialize(value);
    }
    serializeInputObject(value, type) {
        if (this.removeTypenameFromInputs && lodash_1.has(value, "__typename")) {
            delete value.__typename;
        }
        const fields = type.getFields();
        return lodash_1.mapValues(value, (v, key) => {
            const f = fields[key];
            return f ? this.serialize(v, f.type) : v;
        });
    }
}
exports.Serializer = Serializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQVVpQjtBQUNqQixtQ0FBd0M7QUFFeEMsdUNBQW1DO0FBQ25DLGlEQUE0QztBQUU1QyxNQUFhLFVBQVU7SUFDckIsWUFDVyxNQUFxQixFQUNyQixZQUEwQixFQUMxQix3QkFBaUM7UUFGakMsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQVM7SUFDekMsQ0FBQztJQUVHLFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBc0I7UUFDakQsSUFBSSxnQkFBTSxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRWhDLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSx5QkFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVTLGlCQUFpQixDQUFDLEtBQVUsRUFBRSxJQUFzQjtRQUM1RCxJQUFJLHNCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMxQyxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxvQkFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BCLE9BQU8seUJBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMvRDtRQUVELE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRVMsYUFBYSxDQUNyQixLQUFVLEVBQ1YsSUFBeUM7UUFFekMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDO1FBQ2pELE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRVMsb0JBQW9CLENBQzVCLEtBQVUsRUFDVixJQUE0QjtRQUU1QixJQUFJLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxZQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxFQUFFO1lBQzdELE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQztTQUN6QjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQyxPQUFPLGtCQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUEvQ0QsZ0NBK0NDIn0=