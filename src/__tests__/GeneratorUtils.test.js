import {
  parsePatern,
  getDefaultLabel,
} from "../utils/GeneratorUtils";

describe("parsePattern", () => {
  it("returns a string with keys mapped to their values in the data object", () => {
    const data = {
      costType: "Stockage",
      amount: 320,
      currency: "eur",
    };
    const keys = ["$.costType", " : ", "$.amount", " ", "$.currency"];
    const expectedResult = "Stockage : 320 eur";
    const result = parsePatern(data, keys);
    expect(result).toEqual(expectedResult);
  });

  it("returns a string with keys mapped to their nested values in the data object", () => {
    const data = {
      person: {
        firstName: "brahmi",
        lastName: "amine",
      },
      role: "developer",
    };
    const keys = ["$.person.firstName", " ", "$.person.lastName ", " (", "$.role", ")"];
    const expectedResult = "brahmi amine (developer)";
    const result = parsePatern(data, keys);

    expect(result).toEqual(expectedResult);
  });
});

describe("getDefaultLabel", () => {
  const temp = {
    funder: {
      label: {
        fr_FR: "Temp label",
      },
    },
  };
  const form = {
    estimatedVolume: "12",
  };

  test("should return the fr_FR label from temp object", () => {
    const result = getDefaultLabel(temp, form, "funder");
    expect(result).toEqual("Temp label");
  });

  test("should return the string value from temp", () => {
    const result = getDefaultLabel({ ...temp, costType: "Temp string" }, form, "costType");
    expect(result).toEqual("Temp string");
  });

  test("should return the form value if temp is falsy", () => {
    const result = getDefaultLabel(null, form, "estimatedVolume");
    expect(result).toEqual("12");
  });
});
