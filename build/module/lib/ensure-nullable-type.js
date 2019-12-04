import { getNullableType, GraphQLError, isNonNullType } from "graphql";
import { isNone } from "./is-none";
export function ensureNullableType(value, type, fieldNode) {
    if (!isNonNullType(type))
        return type;
    if (isNone(value)) {
        const where = fieldNode.alias
            ? `"${fieldNode.name.value}" (alias "${fieldNode.alias.value}")`
            : `"${fieldNode.name.value}"`;
        throw new GraphQLError(`non-null field ${where} with null value`);
    }
    return getNullableType(type);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5zdXJlLW51bGxhYmxlLXR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2Vuc3VyZS1udWxsYWJsZS10eXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxlQUFlLEVBQ2YsWUFBWSxFQUlaLGFBQWEsRUFDZCxNQUFNLFNBQVMsQ0FBQztBQUNqQixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRW5DLE1BQU0sVUFBVSxrQkFBa0IsQ0FDaEMsS0FBVSxFQUNWLElBQTBDLEVBQzFDLFNBQW9CO0lBRXBCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFdEMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDakIsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUs7WUFDM0IsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLGFBQWEsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUk7WUFDaEUsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQztRQUNoQyxNQUFNLElBQUksWUFBWSxDQUFDLGtCQUFrQixLQUFLLGtCQUFrQixDQUFDLENBQUM7S0FDbkU7SUFFRCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQixDQUFDIn0=