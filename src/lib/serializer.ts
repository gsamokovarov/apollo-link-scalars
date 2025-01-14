import {
  getNullableType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLScalarType,
  GraphQLSchema,
  isEnumType,
  isListType,
  isScalarType
} from "graphql";
import { mapValues } from "lodash";
import { FunctionsMap } from "..";
import { isNone } from "./is-none";
import { mapIfArray } from "./map-if-array";

export class Serializer {
  constructor(
    readonly schema: GraphQLSchema,
    readonly functionsMap: FunctionsMap
  ) {}

  public serialize(value: any, type: GraphQLInputType): any {
    if (isNone(value)) return value;

    return this.serializeNullable(value, getNullableType(type));
  }

  protected serializeNullable(value: any, type: GraphQLInputType): any {
    if (isScalarType(type) || isEnumType(type)) {
      return this.serializeLeaf(value, type);
    }

    if (isListType(type)) {
      return mapIfArray(value, v => this.serialize(v, type.ofType));
    }

    return this.serializeInputObject(value, type);
  }

  protected serializeLeaf(
    value: any,
    type: GraphQLScalarType | GraphQLEnumType
  ): any {
    const fns = this.functionsMap[type.name] || type;
    return fns.serialize(value);
  }

  protected serializeInputObject(
    value: any,
    type: GraphQLInputObjectType
  ): any {
    const fields = type.getFields();
    return mapValues(value, (v, key) => {
      const f = fields[key];
      return f ? this.serialize(v, f.type) : v;
    });
  }
}
