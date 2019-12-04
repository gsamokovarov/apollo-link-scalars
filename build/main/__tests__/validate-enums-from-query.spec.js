"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_1 = require("apollo-link");
const graphql_1 = require("graphql");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const graphql_tools_1 = require("graphql-tools");
const __1 = require("..");
const typeDefs = graphql_tag_1.default `
  type Query {
    first: MyEnum
    second: MyEnum!
    third: MyEnum
  }

  enum MyEnum {
    a
    b
    c
  }
`;
const resolvers = {
    Query: {
        first: () => "a",
        second: () => "b",
        third: () => null
    }
};
const schema = graphql_tools_1.makeExecutableSchema({
    typeDefs,
    resolvers
});
const querySource = `
  query MyQuery {
    first
    second
    third
    otherFirst: first
    otherSecond: second
    otherThird: third
  }
`;
const queryDocument = graphql_tag_1.default `
  ${querySource}
`;
const queryOperationName = apollo_link_1.getOperationName(queryDocument);
if (!queryOperationName)
    throw new Error("invalid query operation name");
const request = {
    query: queryDocument,
    variables: {},
    operationName: queryOperationName
};
const validResponse = {
    data: {
        first: "a",
        second: "b",
        third: null,
        otherFirst: "a",
        otherSecond: "b",
        otherThird: null
    }
};
const invalidResponse = {
    data: {
        first: "a",
        second: "b",
        third: null,
        otherFirst: "invalid",
        otherSecond: "b",
        otherThird: null
    }
};
const badNullsWithAliasResponse = {
    data: {
        first: null,
        second: "b",
        third: null,
        otherFirst: null,
        otherSecond: null,
        otherThird: null
    }
};
const badNullsResponse = {
    data: {
        first: null,
        second: null,
        third: null,
        otherFirst: null,
        otherSecond: "b",
        otherThird: null
    }
};
describe("enum returned directly from first level queries", () => {
    it("ensure the response fixture is valid (ensure that in the response we have the RAW, the Server is converting from Date to STRING)", async () => {
        expect.assertions(1);
        const queryResponse = await graphql_1.graphql(schema, querySource);
        expect(queryResponse).toEqual(validResponse);
    });
    describe("with valid enum values", () => {
        it("validateEnums false (or missing) => return response", done => {
            const link = apollo_link_1.ApolloLink.from([
                __1.withScalars({ schema, validateEnums: false }),
                new apollo_link_1.ApolloLink(() => {
                    return apollo_link_1.Observable.of(validResponse);
                })
            ]);
            const observable = apollo_link_1.execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual(validResponse);
                done();
            });
            expect.assertions(1);
        });
        it("validateEnums false (or missing) => return response", done => {
            const link = apollo_link_1.ApolloLink.from([
                __1.withScalars({ schema, validateEnums: true }),
                new apollo_link_1.ApolloLink(() => {
                    return apollo_link_1.Observable.of(validResponse);
                })
            ]);
            const observable = apollo_link_1.execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual(validResponse);
                done();
            });
            expect.assertions(1);
        });
    });
    describe("with invalid enum values", () => {
        it("validateEnums false (or missing) => return invalid response", done => {
            const link = apollo_link_1.ApolloLink.from([
                __1.withScalars({ schema, validateEnums: false }),
                new apollo_link_1.ApolloLink(() => {
                    return apollo_link_1.Observable.of(invalidResponse);
                })
            ]);
            const observable = apollo_link_1.execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual(invalidResponse);
                done();
            });
            expect.assertions(1);
        });
        it("validateEnums true => return error", done => {
            const link = apollo_link_1.ApolloLink.from([
                __1.withScalars({ schema, validateEnums: true }),
                new apollo_link_1.ApolloLink(() => {
                    return apollo_link_1.Observable.of(invalidResponse);
                })
            ]);
            const observable = apollo_link_1.execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual({
                    errors: [
                        {
                            message: `enum "MyEnum" with invalid value`
                        }
                    ]
                });
                done();
            });
            expect.assertions(1);
        });
    });
    describe("null values on non-null field", () => {
        it("no alias", done => {
            const link = apollo_link_1.ApolloLink.from([
                __1.withScalars({ schema, validateEnums: true }),
                new apollo_link_1.ApolloLink(() => {
                    return apollo_link_1.Observable.of(badNullsResponse);
                })
            ]);
            const observable = apollo_link_1.execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual({
                    errors: [
                        {
                            message: `non-null field "second" with null value`
                        }
                    ]
                });
                done();
            });
            expect.assertions(1);
        });
        it("with alias", done => {
            const link = apollo_link_1.ApolloLink.from([
                __1.withScalars({ schema, validateEnums: true }),
                new apollo_link_1.ApolloLink(() => {
                    return apollo_link_1.Observable.of(badNullsWithAliasResponse);
                })
            ]);
            const observable = apollo_link_1.execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual({
                    errors: [
                        {
                            message: `non-null field "second" (alias "otherSecond") with null value`
                        }
                    ]
                });
                done();
            });
            expect.assertions(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZW51bXMtZnJvbS1xdWVyeS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL19fdGVzdHNfXy92YWxpZGF0ZS1lbnVtcy1mcm9tLXF1ZXJ5LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2Q0FPcUI7QUFDckIscUNBQWtDO0FBQ2xDLDhEQUE4QjtBQUM5QixpREFBcUQ7QUFDckQsMEJBQWlDO0FBRWpDLE1BQU0sUUFBUSxHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7OztDQVluQixDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUc7SUFDaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDakIsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDbEI7Q0FDRixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsb0NBQW9CLENBQUM7SUFDbEMsUUFBUTtJQUNSLFNBQVM7Q0FDVixDQUFDLENBQUM7QUFFSCxNQUFNLFdBQVcsR0FBRzs7Ozs7Ozs7O0NBU25CLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBaUIscUJBQUcsQ0FBQTtJQUNuQyxXQUFXO0NBQ2QsQ0FBQztBQUNGLE1BQU0sa0JBQWtCLEdBQUcsOEJBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0QsSUFBSSxDQUFDLGtCQUFrQjtJQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUV6RSxNQUFNLE9BQU8sR0FBbUI7SUFDOUIsS0FBSyxFQUFFLGFBQWE7SUFDcEIsU0FBUyxFQUFFLEVBQUU7SUFDYixhQUFhLEVBQUUsa0JBQWtCO0NBQ2xDLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBRztJQUNwQixJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsR0FBRztRQUNWLE1BQU0sRUFBRSxHQUFHO1FBQ1gs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