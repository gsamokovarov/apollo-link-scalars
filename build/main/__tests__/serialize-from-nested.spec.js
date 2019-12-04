"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_1 = require("apollo-link");
const graphql_1 = require("graphql");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const graphql_tools_1 = require("graphql-tools");
const lodash_1 = require("lodash");
const __1 = require("..");
const typeDefs = graphql_tag_1.default `
  type Query {
    convert(input: MyInput!): MyResponse!
  }

  input MyInput {
    first: Date!
    second: MyNested!
  }

  input MyNested {
    morning: StartOfDay!
    list: [StartOfDay!]!
  }

  type MyResponse {
    first: StartOfDay!
    nested: MyNestedResponse
  }

  type MyNestedResponse {
    nestedDay: Date!
    days: [Date!]!
  }

  "represents a Date with time"
  scalar Date

  "represents a Date at the beginning of the UTC day"
  scalar StartOfDay
`;
class CustomDate {
    constructor(s) {
        this.internalDate = new Date(s);
    }
    toISOString() {
        return this.internalDate.toISOString();
    }
    getNewDate() {
        return new Date(this.internalDate);
    }
}
// tslint:disable-next-line:max-classes-per-file
class MainDate {
    constructor(s) {
        this.internalDate = new Date(s);
    }
    toISOString() {
        return this.internalDate.toISOString();
    }
    getNewDate() {
        return new Date(this.internalDate);
    }
}
const rawDay = "2018-02-03T12:13:14.000Z";
const rawMorning = "2018-02-03T00:00:00.000Z";
const parsedDay = new MainDate(rawDay);
const parsedMorning = new MainDate(rawMorning);
const parsedMorningCustom = new CustomDate(rawMorning);
const rawDay2 = "2018-03-04T12:13:14.000Z";
const rawMorning2 = "2018-03-04T00:00:00.000Z";
const parsedDay2 = new MainDate(rawDay2);
const parsedMorning2 = new MainDate(rawMorning2);
// const parsedMorningCustom2 = new CustomDate(rawMorning2);
function toStartOfDay(givenDate) {
    const d = givenDate.getNewDate();
    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);
    return new MainDate(d.toISOString());
}
function toDay(givenDate) {
    const d = givenDate.getNewDate();
    d.setUTCHours(12);
    d.setUTCMinutes(13);
    d.setUTCSeconds(14);
    d.setUTCMilliseconds(0);
    return new MainDate(d.toISOString());
}
const resolvers = {
    Query: {
        convert: (_root, { input }) => {
            return {
                first: toStartOfDay(input.first),
                nested: {
                    nestedDay: toDay(input.second.morning),
                    days: input.second.list.map(toDay)
                }
            };
        }
    },
    Date: new graphql_1.GraphQLScalarType({
        name: "Date",
        serialize: (parsed) => {
            if (!parsed)
                return parsed;
            // @ts-ignore
            if (!parsed instanceof MainDate) {
                throw new Error(`given date is not a MainDate!!: ${parsed}`);
            }
            return parsed.toISOString();
        },
        parseValue: (raw) => {
            if (!raw)
                return raw;
            if (lodash_1.isString(raw) || lodash_1.isNumber(raw)) {
                return new MainDate(raw);
            }
            throw new Error(`given date to parse is not a string or a number!!: ${raw}`);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING || ast.kind === graphql_1.Kind.INT) {
                return new MainDate(ast.value);
            }
            return null;
        }
    }),
    StartOfDay: new graphql_1.GraphQLScalarType({
        name: "StartOfDay",
        serialize: (parsed) => {
            if (!parsed)
                return parsed;
            // @ts-ignore
            if (!parsed instanceof MainDate) {
                throw new Error(`given date is not a Date!!: ${parsed}`);
            }
            return parsed.toISOString();
        },
        parseValue: (raw) => {
            if (!raw)
                return raw;
            if (lodash_1.isString(raw) || lodash_1.isNumber(raw)) {
                const d = new Date(raw);
                d.setUTCHours(0);
                d.setUTCMinutes(0);
                d.setUTCSeconds(0);
                d.setUTCMilliseconds(0);
                return new MainDate(d.toISOString());
            }
            throw new Error(`given date to parse is not a string or a number!!: ${raw}`);
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING || ast.kind === graphql_1.Kind.INT) {
                const d = new Date(ast.value);
                d.setUTCHours(0);
                d.setUTCMinutes(0);
                d.setUTCSeconds(0);
                d.setUTCMilliseconds(0);
                return new MainDate(d.toISOString());
            }
            return null;
        }
    })
};
const typesMap = {
    StartOfDay: {
        serialize: (parsed) => {
            if (!parsed)
                return parsed;
            // @ts-ignore
            if (!parsed instanceof CustomDate) {
                throw new Error(`given date is not a Date!!: ${parsed}`);
            }
            return parsed.toISOString();
        },
        parseValue: (raw) => {
            if (!raw)
                return null;
            const d = new Date(raw);
            d.setUTCHours(0);
            d.setUTCMinutes(0);
            d.setUTCSeconds(0);
            d.setUTCMilliseconds(0);
            return new CustomDate(d.toISOString());
        }
    }
};
const schema = graphql_tools_1.makeExecutableSchema({
    typeDefs,
    resolvers
});
const querySource = `
  query MyQuery($input: MyInput!) {
    convert(input: $input) {
      first
      nested {
        nestedDay
        days
      }
    }
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
    variables: {
        input: {
            __typename: "MyInput",
            first: parsedDay,
            second: {
                __typename: "MyNested",
                morning: parsedMorning,
                list: [parsedMorning, parsedMorning2]
            }
        }
    },
    operationName: queryOperationName
};
const response = {
    data: {
        convert: {
            first: rawMorning,
            nested: { nestedDay: rawDay, days: [rawDay, rawDay2] }
        }
    }
};
describe("scalars in nested input objects", () => {
    it("stringify of custom dates is not the same as toISOString()", () => {
        expect(JSON.stringify(parsedDay)).not.toEqual(rawDay);
    });
    it("can compare 2 custom dates ok", () => {
        const a = new CustomDate("2018-01-01T00:00:00.000Z");
        const b = new CustomDate("2018-01-01T00:00:00.000Z");
        const c = new CustomDate("2018-02-03T00:00:00.000Z");
        expect(a).toEqual(b);
        expect(a).not.toEqual(c);
    });
    it("can compare 2 MainDates ok", () => {
        const a = new MainDate("2018-01-01T00:00:00.000Z");
        const b = new MainDate("2018-01-01T00:00:00.000Z");
        const c = new MainDate("2018-02-03T00:00:00.000Z");
        expect(a).toEqual(b);
        expect(a).not.toEqual(c);
    });
    it("ensure the response and request fixtures are valid", async () => {
        expect.assertions(1);
        const queryResponse = await graphql_1.graphql({
            schema,
            source: querySource,
            variableValues: {
                input: {
                    first: rawDay,
                    second: { morning: rawMorning, list: [rawMorning, rawMorning2] }
                }
            }
        });
        expect(queryResponse).toEqual(response);
    });
    it("use the scalar resolvers in the schema to serialize (without removeTypenameFromInputs)", done => {
        const link = apollo_link_1.ApolloLink.from([
            __1.withScalars({ schema }),
            new apollo_link_1.ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    input: {
                        __typename: "MyInput",
                        first: rawDay,
                        second: {
                            __typename: "MyNested",
                            morning: rawMorning,
                            list: [rawMorning, rawMorning2]
                        }
                    }
                });
                return apollo_link_1.Observable.of(lodash_1.cloneDeep(response));
            })
        ]);
        const expectedResponse = {
            data: {
                convert: {
                    first: parsedMorning,
                    nested: { nestedDay: parsedDay, days: [parsedDay, parsedDay2] }
                }
            }
        };
        const observable = apollo_link_1.execute(link, lodash_1.cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
    it("use the scalar resolvers in the schema to serialize (with removeTypenameFromInputs -> removes __typename)", done => {
        const link = apollo_link_1.ApolloLink.from([
            __1.withScalars({ schema, removeTypenameFromInputs: true }),
            new apollo_link_1.ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    input: {
                        first: rawDay,
                        second: {
                            morning: rawMorning,
                            list: [rawMorning, rawMorning2]
                        }
                    }
                });
                return apollo_link_1.Observable.of(lodash_1.cloneDeep(response));
            })
        ]);
        const expectedResponse = {
            data: {
                convert: {
                    first: parsedMorning,
                    nested: { nestedDay: parsedDay, days: [parsedDay, parsedDay2] }
                }
            }
        };
        const observable = apollo_link_1.execute(link, lodash_1.cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
    it("override the scala resolvers with the custom functions map (without removeTypenameFromInputs)", done => {
        const link = apollo_link_1.ApolloLink.from([
            __1.withScalars({ schema, typesMap }),
            new apollo_link_1.ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    input: {
                        __typename: "MyInput",
                        first: rawDay,
                        second: {
                            __typename: "MyNested",
                            morning: rawMorning,
                            list: [rawMorning, rawMorning2]
                        }
                    }
                });
                return apollo_link_1.Observable.of(lodash_1.cloneDeep(response));
            })
        ]);
        const expectedResponse = {
            data: {
                convert: {
                    first: parsedMorningCustom,
                    nested: { nestedDay: parsedDay, days: [parsedDay, parsedDay2] }
                }
            }
        };
        const observable = apollo_link_1.execute(link, lodash_1.cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
    it("override the scala resolvers with the custom functions map (with removeTypenameFromInputs -> removes __typename)", done => {
        const link = apollo_link_1.ApolloLink.from([
            __1.withScalars({ schema, typesMap, removeTypenameFromInputs: true }),
            new apollo_link_1.ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    input: {
                        first: rawDay,
                        second: { morning: rawMorning, list: [rawMorning, rawMorning2] }
                    }
                });
                return apollo_link_1.Observable.of(lodash_1.cloneDeep(response));
            })
        ]);
        const expectedResponse = {
            data: {
                convert: {
                    first: parsedMorningCustom,
                    nested: { nestedDay: parsedDay, days: [parsedDay, parsedDay2] }
                }
            }
        };
        const observable = apollo_link_1.execute(link, lodash_1.cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLWZyb20tbmVzdGVkLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX190ZXN0c19fL3NlcmlhbGl6ZS1mcm9tLW5lc3RlZC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBT3FCO0FBQ3JCLHFDQUEyRDtBQUMzRCw4REFBOEI7QUFDOUIsaURBQXFEO0FBQ3JELG1DQUF1RDtBQUN2RCwwQkFBaUM7QUFFakMsTUFBTSxRQUFRLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBOEJuQixDQUFDO0FBT0YsTUFBTSxVQUFVO0lBRWQsWUFBWSxDQUFTO1FBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFTSxVQUFVO1FBQ2YsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckMsQ0FBQztDQUNGO0FBRUQsZ0RBQWdEO0FBQ2hELE1BQU0sUUFBUTtJQUVaLFlBQVksQ0FBa0I7UUFDNUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVNLFVBQVU7UUFDZixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE1BQU0sR0FBRywwQkFBMEIsQ0FBQztBQUMxQyxNQUFNLFVBQVUsR0FBRywwQkFBMEIsQ0FBQztBQUU5QyxNQUFNLFNBQVMsR0FBRyxJQUFJLFFB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