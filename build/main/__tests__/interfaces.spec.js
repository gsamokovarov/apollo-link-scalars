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
    listA: [IntA]
    listB: [IntB]
  }

  interface IntA {
    day: Date
  }

  interface IntB {
    morning: StartOfDay!
  }

  type TypeA implements IntA {
    day: Date
    extraA: Date
    nestedB: IntB
  }

  type TypeOtherA implements IntA {
    day: Date
    morning: StartOfDay!
    nestedList: [IntA]
  }

  type TypeB implements IntB {
    morning: StartOfDay!
    extraB: Date
    nestedA: IntA
  }

  type TypeOtherB implements IntB {
    morning: StartOfDay!
    stop: String!
  }

  "represents a Date with time"
  scalar Date

  "represents a Date at the beginning of the UTC day"
  scalar StartOfDay
`;
class CustomDate {
    constructor(date) {
        this.date = date;
    }
    toISOString() {
        return this.date.toISOString();
    }
}
const rawDay = "2018-02-03T12:13:14.000Z";
const rawDay2 = "2019-02-03T12:13:14.000Z";
const rawMorning = "2018-02-03T00:00:00.000Z";
const rawMorning2 = "2019-02-03T00:00:00.000Z";
const parsedDay = new Date(rawDay);
const parsedDay2 = new Date(rawDay2);
const parsedMorning = new Date(rawMorning);
const parsedMorning2 = new Date(rawMorning2);
const parsedMorningCustom = new CustomDate(parsedMorning);
const parsedMorningCustom2 = new CustomDate(parsedMorning2);
const resolvers = {
    Query: {
        listA: () => [
            null,
            {
                __typename: "TypeA",
                day: parsedDay,
                extraA: parsedDay2,
                nestedB: {
                    __typename: "TypeB",
                    morning: parsedMorning,
                    extraB: parsedDay2,
                    nestedA: null
                }
            },
            {
                __typename: "TypeOtherA",
                day: parsedDay2,
                morning: parsedMorning,
                nestedList: [
                    null,
                    {
                        __typename: "TypeA",
                        day: parsedDay2,
                        extraA: parsedDay,
                        nestedB: null
                    }
                ]
            }
        ],
        listB: () => [
            null,
            {
                __typename: "TypeOtherB",
                morning: parsedMorning2,
                stop: "STOP"
            },
            {
                __typename: "TypeB",
                morning: parsedMorning,
                extraB: parsedDay2,
                nestedA: {
                    __typename: "TypeOtherA",
                    day: parsedDay,
                    morning: parsedMorning2,
                    nestedList: [
                        {
                            __typename: "TypeOtherA",
                            day: parsedDay2,
                            morning: parsedMorning,
                            nestedList: []
                        }
                    ]
                }
            },
            null
        ]
    },
    IntA: {
        __resolveType: (x) => (x.morning ? "TypeOtherA" : "TypeA")
    },
    IntB: {
        __resolveType: (x) => (x.stop ? "TypeOtherB" : "TypeB")
    },
    Date: new graphql_1.GraphQLScalarType({
        name: "Date",
        serialize: (parsed) => parsed && parsed.toISOString(),
        parseValue: (raw) => raw && new Date(raw),
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING || ast.kind === graphql_1.Kind.INT) {
                return new Date(ast.value);
            }
            return null;
        }
    }),
    StartOfDay: new graphql_1.GraphQLScalarType({
        name: "StartOfDay",
        serialize: (parsed) => parsed && parsed.toISOString(),
        parseValue: (raw) => {
            if (!raw)
                return null;
            const d = new Date(raw);
            d.setUTCHours(0);
            d.setUTCMinutes(0);
            d.setUTCSeconds(0);
            d.setUTCMilliseconds(0);
            return d;
        },
        parseLiteral(ast) {
            if (ast.kind === graphql_1.Kind.STRING || ast.kind === graphql_1.Kind.INT) {
                return new Date(ast.value);
            }
            return null;
        }
    })
};
const typesMap = {
    StartOfDay: {
        serialize: (parsed) => parsed && parsed.toISOString(),
        parseValue: (raw) => {
            if (!raw)
                return null;
            const d = new Date(raw);
            d.setUTCHours(0);
            d.setUTCMinutes(0);
            d.setUTCSeconds(0);
            d.setUTCMilliseconds(0);
            return new CustomDate(d);
        }
    }
};
const schema = graphql_tools_1.makeExecutableSchema({
    typeDefs,
    resolvers
});
const querySource = `
  query MyQuery {
    listA { ...IntA }
    listB { ...IntB }
  }

  fragment IntA on IntA {
    __typename
    day
    ... on TypeA {
      extraA
      nestedB {
        ...NestedB
      }
    }
    ... on TypeOtherA {
      morning
      nestedList {
        ...NestedA
      }
    }
  }

  fragment NestedA on IntA {
    __typename
    day
    ... on TypeA {
      extraA
    }
    ... on TypeOtherA {
      morning
    }
  }

  fragment IntB on IntB {
    __typename
    morning
    ... on TypeB {
      extraB
      nestedA {
        ...NestedA
      }
    }
    ... on TypeOtherB {
      stop
    }
  }

  fragment NestedB on IntB {
    __typename
    morning
    ... on TypeB {
      extraB
    }
    ... on TypeOtherB {
      stop
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
    variables: {},
    operationName: queryOperationName
};
const response = {
    data: {
        listA: [
            null,
            {
                __typename: "TypeA",
                day: rawDay,
                extraA: rawDay2,
                nestedB: {
                    __typename: "TypeB",
                    morning: rawMorning,
                    extraB: rawDay2
                }
            },
            {
                __typename: "TypeOtherA",
                day: rawDay2,
                morning: rawMorning,
                nestedList: [
                    null,
                    {
                        __typename: "TypeA",
                        day: rawDay2,
                        extraA: rawDay
                    }
                ]
            }
        ],
        listB: [
            null,
            {
                __typename: "TypeOtherB",
                morning: rawMorning2,
                stop: "STOP"
            },
            {
                __typename: "TypeB",
                morning: rawMorning,
                extraB: rawDay2,
                nestedA: {
                    __typename: "TypeOtherA",
                    day: rawDay,
                    morning: rawMorning2
                }
            },
            null
        ]
    }
};
describe("scalar returned directly from first level queries", () => {
    it("can compare 2 custom dates ok", () => {
        const a = new CustomDate(new Date("2018-01-01T00:00:00.000Z"));
        const b = new CustomDate(new Date("2018-01-01T00:00:00.000Z"));
        const c = new CustomDate(new Date("2018-02-03T00:00:00.000Z"));
        expect(a).toEqual(b);
        expect(a).not.toEqual(c);
    });
    it("ensure the response fixture is valid (ensure that in the response we have the RAW, the Server is converting from Date to STRING)", async () => {
        expect.assertions(1);
        const queryResponse = await graphql_1.graphql(schema, querySource);
        expect(queryResponse).toEqual(response);
    });
    it("use the scalar resolvers in the schema to parse back", done => {
        const link = apollo_link_1.ApolloLink.from([
            __1.withScalars({ schema }),
            new apollo_link_1.ApolloLink(() => {
                return apollo_link_1.Observable.of(response);
            })
        ]);
        const expectedResponse = {
            data: {
                listA: [
                    null,
                    {
                        __typename: "TypeA",
                        day: parsedDay,
                        extraA: parsedDay2,
                        nestedB: {
                            __typename: "TypeB",
                            morning: parsedMorning,
                            extraB: parsedDay2
                        }
                    },
                    {
                        __typename: "TypeOtherA",
                        day: parsedDay2,
                        morning: parsedMorning,
                        nestedList: [
                            null,
                            {
                                __typename: "TypeA",
                                day: parsedDay2,
                                extraA: parsedDay
                            }
                        ]
                    }
                ],
                listB: [
                    null,
                    {
                        __typename: "TypeOtherB",
                        morning: parsedMorning2,
                        stop: "STOP"
                    },
                    {
                        __typename: "TypeB",
                        morning: parsedMorning,
                        extraB: parsedDay2,
                        nestedA: {
                            __typename: "TypeOtherA",
                            day: parsedDay,
                            morning: parsedMorning2
                        }
                    },
                    null
                ]
            }
        };
        const observable = apollo_link_1.execute(link, request);
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(1);
    });
    it("override the scala resolvers with the custom functions map (removes `__typename` of inputs)", done => {
        const link = apollo_link_1.ApolloLink.from([
            __1.withScalars({ schema, typesMap }),
            new apollo_link_1.ApolloLink(() => {
                return apollo_link_1.Observable.of(response);
            })
        ]);
        const expectedResponse = {
            data: {
                listA: [
                    null,
                    {
                        __typename: "TypeA",
                        day: parsedDay,
                        extraA: parsedDay2,
                        nestedB: {
                            __typename: "TypeB",
                            morning: parsedMorningCustom,
                            extraB: parsedDay2
                        }
                    },
                    {
                        __typename: "TypeOtherA",
                        day: parsedDay2,
                        morning: parsedMorningCustom,
                        nestedList: [
                            null,
                            {
                                __typename: "TypeA",
                                day: parsedDay2,
                                extraA: parsedDay
                            }
                        ]
                    }
                ],
                listB: [
                    null,
                    {
                        __typename: "TypeOtherB",
                        morning: parsedMorningCustom2,
                        stop: "STOP"
                    },
                    {
                        __typename: "TypeB",
                        morning: parsedMorningCustom,
                        extraB: parsedDay2,
                        nestedA: {
                            __typename: "TypeOtherA",
                            day: parsedDay,
                            morning: parsedMorningCustom2
                        }
                    },
                    null
                ]
            }
        };
        const observable = apollo_link_1.execute(link, request);
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL19fdGVzdHNfXy9pbnRlcmZhY2VzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2Q0FPcUI7QUFDckIscUNBQTJEO0FBQzNELDhEQUE4QjtBQUM5QixpREFBcUQ7QUFDckQsMEJBQWlDO0FBRWpDLE1BQU0sUUFBUSxHQUFHLHFCQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTBDbkIsQ0FBQztBQUVGLE1BQU0sVUFBVTtJQUNkLFlBQXFCLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBQUcsQ0FBQztJQUU1QixXQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE1BQU0sR0FBRywwQkFBMEIsQ0FBQztBQUMxQyxNQUFNLE9BQU8sR0FBRywwQkFBMEIsQ0FBQztBQUMzQyxNQUFNLFVBQVUsR0FBRywwQkFBMEIsQ0FBQztBQUM5QyxNQUFNLFdBQVcsR0FBRywwQkFBMEIsQ0FBQztBQUUvQyxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyxNQUFNLGFBQWEsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQyxNQUFNLGNBQWMsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3QyxNQUFNLG1CQUFtQixHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFNUQsTUFBTSxTQUFTLEdBQUc7SUFDaEIsS0FB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