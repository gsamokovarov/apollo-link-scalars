"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const ensure_nullable_type_1 = require("./ensure-nullable-type");
const is_none_1 = require("./is-none");
class Parser {
    constructor(schema, functionsMap, validateEnums) {
        this.schema = schema;
        this.functionsMap = functionsMap;
        this.validateEnums = validateEnums;
    }
    parseObjectWithSelections(data, type, selections) {
        const fieldMap = type.getFields();
        const fn = (d, fieldNode) => this.treatSelection(d, fieldMap, fieldNode);
        return lodash_1.reduce(selections, fn, data);
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
        const type = ensure_nullable_type_1.ensureNullableType(value, givenType, fieldNode);
        if (is_none_1.isNone(value))
            return value;
        if (graphql_1.isScalarType(type)) {
            return this.parseScalar(value, type);
        }
        if (graphql_1.isEnumType(type)) {
            this.validateEnum(value, type);
            return value;
        }
        if (graphql_1.isListType(type)) {
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
            throw new graphql_1.GraphQLError(`enum "${type.name}" with invalid value`);
        }
    }
    parseArray(value, type, fieldNode) {
        return lodash_1.isArray(value)
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
        if (graphql_1.isInputObjectType(type) || graphql_1.isObjectType(type))
            return type;
        if (!value.__typename)
            return null;
        const valueType = this.schema.getType(value.__typename);
        return graphql_1.isInputObjectType(valueType) || graphql_1.isObjectType(valueType)
            ? valueType
            : null;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FtQmlCO0FBQ2pCLG1DQUF5QztBQUd6QyxpRUFBNEQ7QUFDNUQsdUNBQW1DO0FBS25DLE1BQWEsTUFBTTtJQUNqQixZQUNXLE1BQXFCLEVBQ3JCLFlBQTBCLEVBQzFCLGFBQXNCO1FBRnRCLFdBQU0sR0FBTixNQUFNLENBQWU7UUFDckIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsa0JBQWEsR0FBYixhQUFhLENBQVM7SUFDOUIsQ0FBQztJQUVHLHlCQUF5QixDQUM5QixJQUFVLEVBQ1YsSUFBZ0QsRUFDaEQsVUFBdUM7UUFFdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBTyxFQUFFLFNBQTJCLEVBQUUsRUFBRSxDQUNsRCxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDOUMsT0FBTyxlQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRVMsY0FBYyxDQUN0QixJQUFVLEVBQ1YsUUFBK0QsRUFDL0QsU0FBMkI7UUFFM0IsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDbEMsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRTNFLElBQUks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