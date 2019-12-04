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
    object: MyObject
    sure: MyObject!
    list: [MyObject!]
    listMaybe: [MyObject]
    sureList: [MyObject]!
    reallySureList: [MyObject!]!
  }

  type MyObject {
    day: Date
    morning: StartOfDay!
    days: [Date]!
    sureDays: [Date!]!
    mornings: [StartOfDay!]!
    empty: [Date]!
    nested: MyObject
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
        object: () => ({}),
        sure: () => ({ nested: {} }),
        list: () => [{}],
        listMaybe: () => [{}],
        sureList: () => [{}],
        reallySureList: () => [{}]
    },
    MyObject: {
        day: () => parsedDay,
        morning: () => parsedMorning,
        days: () => [parsedDay, parsedDay2],
        sureDays: () => [parsedDay, parsedDay2],
        mornings: () => [parsedMorning, parsedMorning2],
        empty: () => []
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
    object {
      ...MyObjectFragment
    }
    sure {
      ...MyObjectFragment
      nested {
        ...MyObjectFragment
      }
    }
    list {
      ...MyObjectFragment
    }
    listMaybe {
      ...MyObjectFragment
    }
    sureList {
      ...MyObjectFragment
    }
    reallySureList {
      ...MyObjectFragment
    }
  }

  fragment MyObjectFragment on MyObject {
    __typename
    day
    morning
    days
    sureDays
    mornings
    myMornings: mornings
    empty
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
        object: {
            __typename: "MyObject",
            day: rawDay,
            morning: rawMorning,
            days: [rawDay, rawDay2],
            sureDays: [rawDay, rawDay2],
            mornings: [rawMorning, rawMorning2],
            myMornings: [rawMorning, rawMorning2],
            empty: []
        },
        sure: {
            __typename: "MyObject",
            day: rawDay,
            morning: rawMorning,
            days: [rawDay, rawDay2],
            sureDays: [rawDay, rawDay2],
            mornings: [rawMorning, rawMorning2],
            myMornings: [rawMorning, rawMorning2],
            empty: [],
            nested: {
                __typename: "MyObject",
                day: rawDay,
                morning: rawMorning,
                days: [rawDay, rawDay2],
                sureDays: [rawDay, rawDay2],
                mornings: [rawMorning, rawMorning2],
                myMornings: [rawMorning, rawMorning2],
                empty: []
            }
        },
        list: [
            {
                __typename: "MyObject",
                day: rawDay,
                morning: rawMorning,
                days: [rawDay, rawDay2],
                sureDays: [rawDay, rawDay2],
                mornings: [rawMorning, rawMorning2],
                myMornings: [rawMorning, rawMorning2],
                empty: []
            }
        ],
        listMaybe: [
            {
                __typename: "MyObject",
                day: rawDay,
                morning: rawMorning,
                days: [rawDay, rawDay2],
                sureDays: [rawDay, rawDay2],
                mornings: [rawMorning, rawMorning2],
                myMornings: [rawMorning, rawMorning2],
                empty: []
            }
        ],
        sureList: [
            {
                __typename: "MyObject",
                day: rawDay,
                morning: rawMorning,
                days: [rawDay, rawDay2],
                sureDays: [rawDay, rawDay2],
                mornings: [rawMorning, rawMorning2],
                myMornings: [rawMorning, rawMorning2],
                empty: []
            }
        ],
        reallySureList: [
            {
                __typename: "MyObject",
                day: rawDay,
                morning: rawMorning,
                days: [rawDay, rawDay2],
                sureDays: [rawDay, rawDay2],
                mornings: [rawMorning, rawMorning2],
                myMornings: [rawMorning, rawMorning2],
                empty: []
            }
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
                object: {
                    __typename: "MyObject",
                    day: parsedDay,
                    morning: parsedMorning,
                    days: [parsedDay, parsedDay2],
                    sureDays: [parsedDay, parsedDay2],
                    mornings: [parsedMorning, parsedMorning2],
                    myMornings: [parsedMorning, parsedMorning2],
                    empty: []
                },
                sure: {
                    __typename: "MyObject",
                    day: parsedDay,
                    morning: parsedMorning,
                    days: [parsedDay, parsedDay2],
                    sureDays: [parsedDay, parsedDay2],
                    mornings: [parsedMorning, parsedMorning2],
                    myMornings: [parsedMorning, parsedMorning2],
                    empty: [],
                    nested: {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorning,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorning, parsedMorning2],
                        myMornings: [parsedMorning, parsedMorning2],
                        empty: []
                    }
                },
                list: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorning,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorning, parsedMorning2],
                        myMornings: [parsedMorning, parsedMorning2],
                        empty: []
                    }
                ],
                listMaybe: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorning,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorning, parsedMorning2],
                        myMornings: [parsedMorning, parsedMorning2],
                        empty: []
                    }
                ],
                sureList: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorning,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorning, parsedMorning2],
                        myMornings: [parsedMorning, parsedMorning2],
                        empty: []
                    }
                ],
                reallySureList: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorning,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorning, parsedMorning2],
                        myMornings: [parsedMorning, parsedMorning2],
                        empty: []
                    }
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
                object: {
                    __typename: "MyObject",
                    day: parsedDay,
                    morning: parsedMorningCustom,
                    days: [parsedDay, parsedDay2],
                    sureDays: [parsedDay, parsedDay2],
                    mornings: [parsedMorningCustom, parsedMorningCustom2],
                    myMornings: [parsedMorningCustom, parsedMorningCustom2],
                    empty: []
                },
                sure: {
                    __typename: "MyObject",
                    day: parsedDay,
                    morning: parsedMorningCustom,
                    days: [parsedDay, parsedDay2],
                    sureDays: [parsedDay, parsedDay2],
                    mornings: [parsedMorningCustom, parsedMorningCustom2],
                    myMornings: [parsedMorningCustom, parsedMorningCustom2],
                    empty: [],
                    nested: {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorningCustom,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorningCustom, parsedMorningCustom2],
                        myMornings: [parsedMorningCustom, parsedMorningCustom2],
                        empty: []
                    }
                },
                list: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorningCustom,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorningCustom, parsedMorningCustom2],
                        myMornings: [parsedMorningCustom, parsedMorningCustom2],
                        empty: []
                    }
                ],
                listMaybe: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorningCustom,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorningCustom, parsedMorningCustom2],
                        myMornings: [parsedMorningCustom, parsedMorningCustom2],
                        empty: []
                    }
                ],
                sureList: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorningCustom,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorningCustom, parsedMorningCustom2],
                        myMornings: [parsedMorningCustom, parsedMorningCustom2],
                        empty: []
                    }
                ],
                reallySureList: [
                    {
                        __typename: "MyObject",
                        day: parsedDay,
                        morning: parsedMorningCustom,
                        days: [parsedDay, parsedDay2],
                        sureDays: [parsedDay, parsedDay2],
                        mornings: [parsedMorningCustom, parsedMorningCustom2],
                        myMornings: [parsedMorningCustom, parsedMorningCustom2],
                        empty: []
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGFyLWZyb20tb2JqZWN0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX190ZXN0c19fL3NjYWxhci1mcm9tLW9iamVjdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBT3FCO0FBQ3JCLHFDQUEyRDtBQUMzRCw4REFBOEI7QUFDOUIsaURBQXFEO0FBQ3JELDBCQUFpQztBQUVqQyxNQUFNLFFBQVEsR0FBRyxxQkFBRyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBeUJuQixDQUFDO0FBRUYsTUFBTSxVQUFVO0lBQ2QsWUFBcUIsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07SUFBRyxDQUFDO0lBRTVCLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQUVELE1BQU0sTUFBTSxHQUFHLDBCQUEwQixDQUFDO0FBQzFDLE1BQU0sT0FBTyxHQUFHLDBCQUEwQixDQUFDO0FBQzNDLE1BQU0sVUFBVSxHQUFHLDBCQUEwQixDQUFDO0FBQzlDLE1BQU0sV0FBVyxHQUFHLDBCQUEwQixDQUFDO0FBRS9DLE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLE1BQU0sVUFBVSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sYUFBYSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sY0FBYyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUU1RCxNQUFNLFNBQVMsR0FBRztJQUNoQixLQUFL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