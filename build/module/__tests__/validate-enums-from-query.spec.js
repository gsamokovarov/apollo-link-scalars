import { ApolloLink, execute, getOperationName, Observable } from "apollo-link";
import { graphql } from "graphql";
import gql from "graphql-tag";
import { makeExecutableSchema } from "graphql-tools";
import { withScalars } from "..";
const typeDefs = gql `
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
const schema = makeExecutableSchema({
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
const queryDocument = gql `
  ${querySource}
`;
const queryOperationName = getOperationName(queryDocument);
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
        const queryResponse = await graphql(schema, querySource);
        expect(queryResponse).toEqual(validResponse);
    });
    describe("with valid enum values", () => {
        it("validateEnums false (or missing) => return response", done => {
            const link = ApolloLink.from([
                withScalars({ schema, validateEnums: false }),
                new ApolloLink(() => {
                    return Observable.of(validResponse);
                })
            ]);
            const observable = execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual(validResponse);
                done();
            });
            expect.assertions(1);
        });
        it("validateEnums false (or missing) => return response", done => {
            const link = ApolloLink.from([
                withScalars({ schema, validateEnums: true }),
                new ApolloLink(() => {
                    return Observable.of(validResponse);
                })
            ]);
            const observable = execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual(validResponse);
                done();
            });
            expect.assertions(1);
        });
    });
    describe("with invalid enum values", () => {
        it("validateEnums false (or missing) => return invalid response", done => {
            const link = ApolloLink.from([
                withScalars({ schema, validateEnums: false }),
                new ApolloLink(() => {
                    return Observable.of(invalidResponse);
                })
            ]);
            const observable = execute(link, request);
            observable.subscribe(value => {
                expect(value).toEqual(invalidResponse);
                done();
            });
            expect.assertions(1);
        });
        it("validateEnums true => return error", done => {
            const link = ApolloLink.from([
                withScalars({ schema, validateEnums: true }),
                new ApolloLink(() => {
                    return Observable.of(invalidResponse);
                })
            ]);
            const observable = execute(link, request);
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
            const link = ApolloLink.from([
                withScalars({ schema, validateEnums: true }),
                new ApolloLink(() => {
                    return Observable.of(badNullsResponse);
                })
            ]);
            const observable = execute(link, request);
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
            const link = ApolloLink.from([
                withScalars({ schema, validateEnums: true }),
                new ApolloLink(() => {
                    return Observable.of(badNullsWithAliasResponse);
                })
            ]);
            const observable = execute(link, request);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUtZW51bXMtZnJvbS1xdWVyeS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL19fdGVzdHNfXy92YWxpZGF0ZS1lbnVtcy1mcm9tLXF1ZXJ5LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFVBQVUsRUFFVixPQUFPLEVBQ1AsZ0JBQWdCLEVBRWhCLFVBQVUsRUFDWCxNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2xDLE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQztBQUM5QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLElBQUksQ0FBQztBQUVqQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7Ozs7OztDQVluQixDQUFDO0FBRUYsTUFBTSxTQUFTLEdBQUc7SUFDaEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDaEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUc7UUFDakIsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUk7S0FDbEI7Q0FDRixDQUFDO0FBRUYsTUFBTSxNQUFNLEdBQUcsb0JBQW9CLENBQUM7SUFDbEMsUUFBUTtJQUNSLFNBQVM7Q0FDVixDQUFDLENBQUM7QUFFSCxNQUFNLFdBQVcsR0FBRzs7Ozs7Ozs7O0NBU25CLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBaUIsR0FBRyxDQUFBO0lBQ25DLFdBQVc7Q0FDZCxDQUFDO0FBQ0YsTUFBTSxrQkFBa0IsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzRCxJQUFJLENBQUMsa0JBQWtCO0lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sT0FBTyxHQUFt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