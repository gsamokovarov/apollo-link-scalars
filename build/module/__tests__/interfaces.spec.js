import { ApolloLink, execute, getOperationName, Observable } from "apollo-link";
import { graphql, GraphQLScalarType, Kind } from "graphql";
import gql from "graphql-tag";
import { makeExecutableSchema } from "graphql-tools";
import { withScalars } from "..";
const typeDefs = gql `
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
    Date: new GraphQLScalarType({
        name: "Date",
        serialize: (parsed) => parsed && parsed.toISOString(),
        parseValue: (raw) => raw && new Date(raw),
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
                return new Date(ast.value);
            }
            return null;
        }
    }),
    StartOfDay: new GraphQLScalarType({
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
            if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
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
const schema = makeExecutableSchema({
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
        const queryResponse = await graphql(schema, querySource);
        expect(queryResponse).toEqual(response);
    });
    it("use the scalar resolvers in the schema to parse back", done => {
        const link = ApolloLink.from([
            withScalars({ schema }),
            new ApolloLink(() => {
                return Observable.of(response);
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
        const observable = execute(link, request);
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(1);
    });
    it("override the scala resolvers with the custom functions map (removes `__typename` of inputs)", done => {
        const link = ApolloLink.from([
            withScalars({ schema, typesMap }),
            new ApolloLink(() => {
                return Observable.of(response);
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
        const observable = execute(link, request);
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL19fdGVzdHNfXy9pbnRlcmZhY2VzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFVBQVUsRUFFVixPQUFPLEVBQ1AsZ0JBQWdCLEVBRWhCLFVBQVUsRUFDWCxNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUMzRCxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUM7QUFDOUIsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFakMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0EwQ25CLENBQUM7QUFFRixNQUFNLFVBQVU7SUFDZCxZQUFxQixJQUFVO1FBQVYsU0FBSSxHQUFKLElBQUksQ0FBTTtJQUFHLENBQUM7SUFFNUIsV0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDakMsQ0FBQztDQUNGO0FBRUQsTUFBTSxNQUFNLEdBQUcsMEJBQTBCLENBQUM7QUFDMUMsTUFBTSxPQUFPLEdBQUcsMEJBQTBCLENBQUM7QUFDM0MsTUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQUM7QUFDOUMsTUFBTSxXQUFXLEdBQUcsMEJBQTBCLENBQUM7QUFFL0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkMsTUFBTSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0Ms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