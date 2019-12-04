import { GraphQLError, isEnumType, isInputObjectType, isListType, isObjectType, isScalarType } from "graphql";
import { isArray, reduce } from "lodash";
import { ensureNullableType } from "./ensure-nullable-type";
import { isNone } from "./is-none";
export class Parser {
    constructor(schema, functionsMap, validateEnums) {
        this.schema = schema;
        this.functionsMap = functionsMap;
        this.validateEnums = validateEnums;
    }
    parseObjectWithSelections(data, type, selections) {
        const fieldMap = type.getFields();
        const fn = (d, fieldNode) => this.treatSelection(d, fieldMap, fieldNode);
        return reduce(selections, fn, data);
    }
    treatSelection(data, fieldMap, fieldNode) {
        const name = fieldNode.name.value;
        const field = fieldMap[name];
        if (!field)
            return data;
        const key = fieldNode.alias ? fieldNode.alias.value : fieldNode.name.value;
        data[key] = this.treatValue(data[key], field.type, fieldNode);
        return data;
    }
    treatValue(value, givenType, fieldNode) {
        const type = ensureNullableType(value, givenType, fieldNode);
        if (isNone(value))
            return value;
        if (isScalarType(type)) {
            return this.parseScalar(value, type);
        }
        if (isEnumType(type)) {
            this.validateEnum(value, type);
            return value;
        }
        if (isListType(type)) {
            return this.parseArray(value, type, fieldNode);
        }
        return this.parseNestedObject(value, type, fieldNode);
    }
    parseScalar(value, type) {
        const fns = this.functionsMap[type.name] || type;
        return fns.parseValue(value);
    }
    validateEnum(value, type) {
        if (!this.validateEnums || !value)
            return;
        const enumValues = type.getValues().map(v => v.value);
        if (!enumValues.includes(value)) {
            throw new GraphQLError(`enum "${type.name}" with invalid value`);
        }
    }
    parseArray(value, type, fieldNode) {
        return isArray(value)
            ? value.map(v => this.treatValue(v, type.ofType, fieldNode))
            : value;
    }
    parseNestedObject(value, givenType, fieldNode) {
        if (!value ||
            !fieldNode ||
            !fieldNode.selectionSet ||
            !fieldNode.selectionSet.selections.length) {
            return value;
        }
        const type = this.getObjectTypeFrom(value, givenType);
        return type
            ? this.parseObjectWithSelections(value, type, fieldNode.selectionSet.selections)
            : value;
    }
    getObjectTypeFrom(value, type) {
        if (isInputObjectType(type) || isObjectType(type))
            return type;
        if (!value.__typename)
            return null;
        const valueType = this.schema.getType(value.__typename);
        return isInputObjectType(valueType) || isObjectType(valueType)
            ? valueType
            : null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFlBQVksRUFZWixVQUFVLEVBQ1YsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUNiLE1BQU0sU0FBUyxDQUFDO0FBQ2pCLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBR3pDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzVELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFLbkMsTUFBTSxPQUFPLE1BQU07SUFDakIsWUFDVyxNQUFxQixFQUNyQixZQUEwQixFQUMxQixhQUFzQjtRQUZ0QixXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ3JCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLGtCQUFhLEdBQWIsYUFBYSxDQUFTO0lBQzlCLENBQUM7SUFFRyx5QkFBeUIsQ0FDOUIsSUFBVSxFQUNWLElBQWdELEVBQ2hELFVBQXVDO1FBRXZDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNsQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQU8sRUFBRSxTQUEyQixFQUFFLEVBQUUsQ0FDbEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVTLGNBQWMsQ0FDdEIsSUFBVSxFQUNWLFFBQStELEVBQy9ELFNBQTJCO1FBRTNCLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2xDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUUzRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM5RCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFUyxVQUFVLENBQ2xCLEtBQVUsRUFDVixTQUErQyxFQUMvQyxTQUEyQjtRQUUzQixNQUFNLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRWhDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdEM7UUFFRCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDaEQ7UUFFRCxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFUyxXQUFXLENBQUMsS0FBVSxFQUFFLElBQXVCO1FBQ3ZELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztRQUNqRCxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVTLFlBQVksQ0FBQyxLQUFVLEVBQUUsSUFBcUI7UUFDdEQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUUxQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQy9CLE1BQU0sSUFBSSxZQUFZLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxDQUFDO1NBQ2xFO0lBQ0gsQ0FBQztJQUVTLFVBQVUsQ0FDbEIsS0FBVSxFQUNWLElBQW9DLEVBQ3BDLFNBQTJCO1FBRTNCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQztZQUNuQixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNaLENBQUM7SUFFUyxpQkFBaUIsQ0FDekIsS0FBVSxFQUNWLFNBSTBCLEVBQzFCLFNBQTJCO1FBRTNCLElBQ0UsQ0FBQyxLQUFLO1lBQ04sQ0FBQyxTQUFTO1lBQ1YsQ0FBQyxTQUFTLENBQUMsWUFBWTtZQUN2QixDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFDekM7WUFDQSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV0RCxPQUFPLElBQUk7WUFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUM1QixLQUFLLEVBQ0wsSUFBSSxFQUNKLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUNsQztZQUNILENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDWixDQUFDO0lBRVMsaUJBQWlCLENBQ3pCLEtBQVUsRUFDVixJQUkwQjtRQUUxQixJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7WUFBRSxPQUFPLElBQUksQ0FBQztRQUVuQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEQsT0FBTyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxZQUFZLENBQUMsU0FBUyxDQUFDO1lBQzVELENBQUMsQ0FBQyxTQUFTO1lBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNYLENBQUM7Q0FDRiJ9