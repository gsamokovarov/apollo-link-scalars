import { ApolloLink, Observable } from "apollo-link";
import { isInputType, isLeafType } from "graphql";
import { pickBy } from "lodash";
import { mapIfArray } from "./map-if-array";
import { isListTypeNode, isNonNullTypeNode, isOperationDefinitionNode } from "./node-types";
import { Serializer } from "./serializer";
import { treatResult } from "./treat-result";
export class ScalarApolloLink extends ApolloLink {
    constructor(pars) {
        super();
        this.schema = pars.schema;
        this.typesMap = pars.typesMap || {};
        this.validateEnums = pars.validateEnums || false;
        this.removeTypenameFromInputs = pars.removeTypenameFromInputs || false;
        const leafTypesMap = pickBy(this.schema.getTypeMap(), isLeafType);
        this.functionsMap = { ...leafTypesMap, ...this.typesMap };
        this.serializer = new Serializer(this.schema, this.functionsMap, this.removeTypenameFromInputs);
    }
    // ApolloLink code based on https://github.com/with-heart/apollo-link-response-resolver
    request(givenOperation, forward) {
        const operation = this.cleanVariables(givenOperation);
        return new Observable(observer => {
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
        return treatResult({
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
        const o = operation.query.definitions.find(isOperationDefinitionNode);
        const varDefs = (o && o.variableDefinitions) || [];
        varDefs.forEach(vd => {
            const key = vd.variable.name.value;
            operation.variables[key] = this.serialize(operation.variables[key], vd.type);
        });
        return operation;
    }
    serialize(value, typeNode) {
        if (isNonNullTypeNode(typeNode)) {
            return this.serialize(value, typeNode.type);
        }
        if (isListTypeNode(typeNode)) {
            return mapIfArray(value, v => this.serialize(v, typeNode.type));
        }
        return this.serializeNamed(value, typeNode);
    }
    serializeNamed(value, typeNode) {
        const typeName = typeNode.name.value;
        const schemaType = this.schema.getType(typeName);
        return schemaType && isInputType(schemaType)
            ? this.serializer.serialize(value, schemaType)
            : value;
    }
}
export const withScalars = (pars) => {
    return new ScalarApolloLink(pars);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbGluay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsVUFBVSxFQUdWLFVBQVUsRUFFWCxNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBRUwsV0FBVyxFQUNYLFVBQVUsRUFHWCxNQUFNLFNBQVMsQ0FBQztBQUNqQixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBR2hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLGlCQUFpQixFQUNqQix5QkFBeUIsRUFDMUIsTUFBTSxjQUFjLENBQUM7QUFDdEIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFTN0MsTUFBTSxPQUFPLGdCQUFpQixTQUFRLFVBQVU7SUFROUMsWUFBWSxJQUE0QjtRQUN0QyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUM7UUFDakQsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxLQUFLLENBQUM7UUFFdkUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLEdBQUcsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFELElBQUks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