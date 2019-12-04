import { ApolloLink, execute, getOperationName, Observable } from "apollo-link";
import { graphql, GraphQLScalarType, Kind } from "graphql";
import gql from "graphql-tag";
import { makeExecutableSchema } from "graphql-tools";
import { withScalars } from "..";
const typeDefs = gql `
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
        const observable = execute(link, request);
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(1);
    });
    it("override the scala resolvers with the custom functions map", done => {
        const link = ApolloLink.from([
            withScalars({ schema, typesMap }),
            new ApolloLink(() => {
                return Observable.of(response);
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
        const observable = execute(link, request);
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGFyLWZyb20tb2JqZWN0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX190ZXN0c19fL3NjYWxhci1mcm9tLW9iamVjdC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBRVYsT0FBTyxFQUNQLGdCQUFnQixFQUVoQixVQUFVLEVBQ1gsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDM0QsT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFDO0FBQzlCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBRWpDLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXlCbkIsQ0FBQztBQUVGLE1BQU0sVUFBVTtJQUNkLFlBQXFCLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO0lBQUcsQ0FBQztJQUU1QixXQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE1BQU0sR0FBRywwQkFBMEIsQ0FBQztBQUMxQyxNQUFNLE9BQU8sR0FBRywwQkFBMEIsQ0FBQztBQUMzQyxNQUFNLFVBQVUsR0FBRywwQkFBMEIsQ0FBQztBQUM5QyxNQUFNLFdBQVcsR0FBRywwQkFBMEIsQ0FBQztBQUUvQyxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyxNQUFNLGFBQWEsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQyxN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