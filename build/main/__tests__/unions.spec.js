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

  type TypeA {
    day: Date
    extraA: Date
    nestedB: IntB
  }

  type TypeOtherA {
    day: Date
    morning: StartOfDay!
    nestedList: [IntA]
  }

  type TypeB {
    morning: StartOfDay!
    extraB: Date
    nestedA: IntA
  }

  type TypeOtherB {
    morning: StartOfDay!
    stop: String!
  }

  union IntA = TypeA | TypeOtherA
  union IntB = TypeB | TypeOtherB

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
    ... on TypeA {
      day
      extraA
      nestedB {
        ...NestedB
      }
    }
    ... on TypeOtherA {
      day
      morning
      nestedList {
        ...NestedA
      }
    }
  }

  fragment NestedA on IntA {
    __typename
    ... on TypeA {
      day
      extraA
    }
    ... on TypeOtherA {
      day
      morning
    }
  }

  fragment IntB on IntB {
    __typename
    ... on TypeB {
      morning
      extraB
      nestedA {
        ...NestedA
      }
    }
    ... on TypeOtherB {
      morning
      stop
    }
  }

  fragment NestedB on IntB {
    __typename
    ... on TypeB {
      morning
      extraB
    }
    ... on TypeOtherB {
      morning
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
    it("override the scala resolvers with the custom functions map", done => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pb25zLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX190ZXN0c19fL3VuaW9ucy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBT3FCO0FBQ3JCLHFDQUEyRDtBQUMzRCw4REFBOEI7QUFDOUIsaURBQXFEO0FBQ3JELDBCQUFpQztBQUVqQyxNQUFNLFFBQVEsR0FBRyxxQkFBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBcUNuQixDQUFDO0FBRUYsTUFBTSxVQUFVO0lBQ2QsWUFBcUIsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07SUFBRyxDQUFDO0lBRTVCLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQUVELE1BQU0sTUFBTSxHQUFHLDBCQUEwQixDQUFDO0FBQzFDLE1BQU0sT0FBTyxHQUFHLDBCQUEwQixDQUFDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLDBCQUEwQixDQUFDO0FBQzlDLE1BQU0sV0FBVyxHQUFHLDBCQUEwQixDQUFDO0FBRS9DLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUU1RCxNQUFNLFNBQVMsR0FBRztJQUNoQixLQUFLLEVBQUU7UUFDTCxL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