import { ApolloLink, execute, getOperationName, Observable } from "apollo-link";
import { graphql, GraphQLScalarType, Kind } from "graphql";
import gql from "graphql-tag";
import { makeExecutableSchema } from "graphql-tools";
import { cloneDeep, isNumber, isString } from "lodash";
import { withScalars } from "..";
const typeDefs = gql `
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
const queryDocument = gql `
  ${querySource}
`;
const queryOperationName = getOperationName(queryDocument);
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
        const queryResponse = await graphql({
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
        const link = ApolloLink.from([
            withScalars({ schema }),
            new ApolloLink(operation => {
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
                return Observable.of(cloneDeep(response));
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
        const observable = execute(link, cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
    it("use the scalar resolvers in the schema to serialize (with removeTypenameFromInputs -> removes __typename)", done => {
        const link = ApolloLink.from([
            withScalars({ schema, removeTypenameFromInputs: true }),
            new ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    input: {
                        first: rawDay,
                        second: {
                            morning: rawMorning,
                            list: [rawMorning, rawMorning2]
                        }
                    }
                });
                return Observable.of(cloneDeep(response));
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
        const observable = execute(link, cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
    it("override the scala resolvers with the custom functions map (without removeTypenameFromInputs)", done => {
        const link = ApolloLink.from([
            withScalars({ schema, typesMap }),
            new ApolloLink(operation => {
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
                return Observable.of(cloneDeep(response));
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
        const observable = execute(link, cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
    it("override the scala resolvers with the custom functions map (with removeTypenameFromInputs -> removes __typename)", done => {
        const link = ApolloLink.from([
            withScalars({ schema, typesMap, removeTypenameFromInputs: true }),
            new ApolloLink(operation => {
                expect(operation.variables).toEqual({
                    input: {
                        first: rawDay,
                        second: { morning: rawMorning, list: [rawMorning, rawMorning2] }
                    }
                });
                return Observable.of(cloneDeep(response));
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
        const observable = execute(link, cloneDeep(request));
        observable.subscribe(value => {
            expect(value).toEqual(expectedResponse);
            done();
        });
        expect.assertions(2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplLWZyb20tbmVzdGVkLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX190ZXN0c19fL3NlcmlhbGl6ZS1mcm9tLW5lc3RlZC5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxVQUFVLEVBRVYsT0FBTyxFQUNQLGdCQUFnQixFQUVoQixVQUFVLEVBQ1gsTUFBTSxhQUFhLENBQUM7QUFDckIsT0FBTyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDM0QsT0FBTyxHQUFHLE1BQU0sYUFBYSxDQUFDO0FBQzlCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDdkQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLElBQUksQ0FBQztBQUVqQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQThCbkIsQ0FBQztBQU9GLE1BQU0sVUFBVTtJQUVkLFlBQVksQ0FBUztRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTSxXQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRU0sVUFBVTtRQUNmLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7Q0FDRjtBQUVELGdEQUFnRDtBQUNoRCxNQUFNLFFBQVE7SUFFWixZQUFZLENBQWtCO1FBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLFdB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