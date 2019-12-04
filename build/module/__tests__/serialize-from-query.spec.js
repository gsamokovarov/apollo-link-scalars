import { ApolloLink, execute, getOperationName, Observable } from "apollo-link";
import { graphql, GraphQLScalarType, Kind } from "graphql";
import gql from "graphql-tag";
import { makeExecutableSchema } from "graphql-tools";
import { cloneDeep, isNumber, isString } from "lodash";
import { withScalars } from "..";
const typeDefs = gql `
  type Query {
    "returns a Date object with time"
    convertToMorning(date: Date!): StartOfDay!
    convertToDay(date: StartOfDay!): Date!
    convertToDays(dates: [StartOfDay!]!): [Date!]!
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
const parsedMorningCustom2 = new CustomDate(rawMorning2);
const resolvers = {
    Query: {
        convertToMorning: (_root, { date }) => {
            const d = date.getNewDate();
            d.setUTCHours(0);
            d.setUTCMinutes(0);
            d.setUTCSeconds(0);
            d.setUTCMilliseconds(0);
            return new MainDate(d.toISOString());
        },
        convertToDay: (_root, { date }) => {
            const d = date.getNewDate();
            d.setUTCHours(12);
            d.setUTCMinutes(13);
            d.setUTCSeconds(14);
            d.setUTCMilliseconds(0);
            return new MainDate(d.toISOString());
        },
        convertToDays: (_root, { dates }) => {
            return dates.map(date => {
                const d = date.getNewDate();
                d.setUTCHours(12);
                d.setUTCMinutes(13);
                d.setUTCSeconds(14);
                d.setUTCMilliseconds(0);
                return new MainDate(d.toISOString());
            });
        }
    },
    Date: new GraphQLScalarType({
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
            if (isString(raw) || isNumber(raw)) {
                return new MainDate(raw);
            }
            throw new Error(`given date to parse is not a string or a number!!: ${raw}`);
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
                return new MainDate(ast.value);
            }
            return null;
        }
    }),
    StartOfDay: new GraphQLScalarType({
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
            if (isString(raw) || isNumber(raw)) {
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
            if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
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
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const querySource = `
  query MyQuery($morning: StartOfDay!, $mornings: [StartOfDay!]!, $day: Date!) {
    convertToMorning(date: $day)
    convertToDay(date: $morning)
    convertToDays(dates: $mornings)
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
    variables: {
        day: parsedDay,
        morning: parsedMorning,
        mornings: [parsedMorning, parsedMorning2]
    },
    operationName: queryOperationName
};
const response = {
    data: {
        convertToMorning: rawMorning,
        convertToDay: rawDay,
        convertToDays: [rawDay, rawDay2]
    }
};
describe("scalar returned directly from first level queries", () => {
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
        const queryResponse = await graphql({
            schema,
            source: querySource,
            variableValues: {
                morning: rawMorning,
                day: rawDay,
                mornings: [rawMorning, rawMorning2]
            }
        });
        expect(queryResponse).toEqual(response);
    });
    it("use the scalar resolvers in the schema to serialize", done => {
        const link = ApolloLink.from([
            withScalars({ schema }),
            new ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    morning: rawMorning,
                    day: rawDay,
                    mornings: [rawMorning, rawMorning2]
                });
                return Observable.of(cloneDeep(response));
            })
        ]);
        const expectedResponse = {
            data: {
                convertToDay: parsedDay,
                convertToDays: [parsedDay, parsedDay2],
                convertToMorning: parsedMorning
            }
        };
        const observable = execute(link, cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
    it("override the scala resolvers with the custom functions map", done => {
        const customRequest = {
            query: { ...queryDocument },
            variables: {
                morning: parsedMorningCustom,
                mornings: [parsedMorningCustom, parsedMorningCustom2],
                day: parsedDay
            },
            operationName: queryOperationName
        };
        const link = ApolloLink.from([
            withScalars({ schema, typesMap }),
            new ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    morning: rawMorning,
                    mornings: [rawMorning, rawMorning2],
                    day: rawDay
                });
                return Observable.of(cloneDeep(response));
            })
        ]);
        const expectedResponse = {
            data: {
                convertToDay: parsedDay,
                convertToDays: [parsedDay, parsedDay2],
                convertToMorning: parsedMorningCustom
            }
        };
        const observable = execute(link, cloneDeep(customRequest));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLWZyb20tcXVlcnkuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9fX3Rlc3RzX18vc2VyaWFsaXplLWZyb20tcXVlcnkuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsVUFBVSxFQUVWLE9BQU8sRUFDUCxnQkFBZ0IsRUFFaEIsVUFBVSxFQUNYLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzNELE9BQU8sR0FBRyxNQUFNLGFBQWEsQ0FBQztBQUM5QixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFFakMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFBOzs7Ozs7Ozs7Ozs7O0NBYW5CLENBQUM7QUFFRixNQUFNLFVBQVU7SUFFZCxZQUFZLENBQVM7UUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVNLFVBQVU7UUFDZixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBQ0Y7QUFFRCxnREFBZ0Q7QUFDaEQsTUFBTSxRQUFRO0lBRVosWUFBWSxDQUFrQjtRQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxXQUFXO1FBQ2hCLE9BQU8sSUFBSSxD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