"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_1 = require("apollo-link");
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const map_if_array_1 = require("./map-if-array");
const node_types_1 = require("./node-types");
const serializer_1 = require("./serializer");
const treat_result_1 = require("./treat-result");
class ScalarApolloLink extends apollo_link_1.ApolloLink {
    constructor(pars) {
        super();
        this.schema = pars.schema;
        this.typesMap = pars.typesMap || {};
        this.validateEnums = pars.validateEnums || false;
        this.removeTypenameFromInputs = pars.removeTypenameFromInputs || false;
        const leafTypesMap = lodash_1.pickBy(this.schema.getTypeMap(), graphql_1.isLeafType);
        this.functionsMap = Object.assign(Object.assign({}, leafTypesMap), this.typesMap);
        this.serializer = new serializer_1.Serializer(this.schema, this.functionsMap, this.removeTypenameFromInputs);
    }
    // ApolloLink code based on https://github.com/with-heart/apollo-link-response-resolver
    request(givenOperation, forward) {
        const operation = this.cleanVariables(givenOperation);
        return new apollo_link_1.Observable(observer => {
            let sub;
            try {
                sub = forward(operation).subscribe({
                    next: result => {
                        try {
                            observer.next(this.parse(operation, result));
                        }
                        catch (treatError) {
                            const errors = result.errors || [];
                            observer.next({ errors: [...errors, treatError] });
                        }
                    },
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer)
                });
            }
            catch (e) {
                observer.error(e);
            }
            return () => {
                if (sub)
                    sub.unsubscribe();
            };
        });
    }
    parse(operation, result) {
        return treat_result_1.treatResult({
            operation,
            result,
            functionsMap: this.functionsMap,
            schema: this.schema,
            validateEnums: this.validateEnums
        });
    }
    /**
     * mutate the operation object with the serialized variables
     * @param operation
     */
    cleanVariables(operation) {
        const o = operation.query.definitions.find(node_types_1.isOperationDefinitionNode);
        const varDefs = (o && o.variableDefinitions) || [];
        varDefs.forEach(vd => {
            const key = vd.variable.name.value;
            operation.variables[key] = this.serialize(operation.variables[key], vd.type);
        });
        return operation;
    }
    serialize(value, typeNode) {
        if (node_types_1.isNonNullTypeNode(typeNode)) {
            return this.serialize(value, typeNode.type);
        }
        if (node_types_1.isListTypeNode(typeNode)) {
            return map_if_array_1.mapIfArray(value, v => this.serialize(v, typeNode.type));
        }
        return this.serializeNamed(value, typeNode);
    }
    serializeNamed(value, typeNode) {
        const typeName = typeNode.name.value;
        const schemaType = this.schema.getType(typeName);
        return schemaType && graphql_1.isInputType(schemaType)
            ? this.serializer.serialize(value, schemaType)
            : value;
    }
}
exports.ScalarApolloLink = ScalarApolloLink;
exports.withScalars = (pars) => {
    return new ScalarApolloLink(pars);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQU1xQjtBQUNyQixxQ0FNaUI7QUFDakIsbUNBQWdDO0FBR2hDLGlEQUE0QztBQUM1Qyw2Q0FJc0I7QUFDdEIsNkNBQTBDO0FBQzFDLGlEQUE2QztBQVM3QyxNQUFhLGdCQUFpQixTQUFRLHdCQUFVO0lBUTlDLFlBQVksSUFBNEI7UUFDdEMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksS0FBSyxDQUFDO1FBQ2pELElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLElBQUksS0FBSyxDQUFDO1FBRXZFLE1BQU0sWUFBWSxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLG9CQUFVLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsWUFBWSxtQ0FBUSxZQUFZLEdBQUssSUFBSSxDQUFDLFFBQVEsQ0FBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSx1QkFBVSxDQUM5QixJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxZQUFZLEVBQ2pCLElBQUksQ0FBQyx3QkFBd0IsQ0FDOUIsQ0FBQztJQUNKLENBQUM7SUFFRCx1RkFBdUY7SUFDaEYsT0FBTyxDQUNaLGNBQXlCLEVBQ3pCLE9BQWlCO1FBRWpCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFdEQsT0FBTyxJQUFJLHdCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0Is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