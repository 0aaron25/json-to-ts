import { generateTSType } from "@/utils/typeGenerator";
import { describe, it, expect } from "vitest";

// 辅助函数，用于格式化预期输出
function formatExpected(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1];
  }
  return result.replace(/^\n|\n$/g, "").replace(/^ {6}/gm, "");
}

describe("generateTSType", () => {
  const testCases = [
    {
      name: "Simple object",
      input: { name: "John", age: 30 },
      expected: formatExpected`
      interface RootType {
        name: string;
        age: number;
      }`,
    },
    {
      name: "Nested object",
      input: { person: { name: "John", age: 30 } },
      expected: formatExpected`
      interface RootTypePerson {
        name: string;
        age: number;
      }

      interface RootType {
        person: RootTypePerson;
      }`,
    },
    {
      name: "Array of primitives",
      input: { numbers: [1, 2, 3] },
      expected: formatExpected`
      interface RootType {
        numbers: number[];
      }`,
    },
    {
      name: "Array of objects",
      input: { people: [{ name: "John" }, { name: "Jane" }] },
      expected: formatExpected`
      interface RootTypePeopleItem {
        name: string;
      }

      interface RootType {
        people: RootTypePeopleItem[];
      }`,
    },
    {
      name: "Mixed types",
      input: { id: 1, name: "John", isStudent: true, grades: [95, 87, 92] },
      expected: formatExpected`
      interface RootType {
        id: number;
        name: string;
        isStudent: boolean;
        grades: number[];
      }`,
    },
    {
      name: "Null and undefined",
      input: { nullValue: null, undefinedValue: undefined },
      expected: formatExpected`
      interface RootType {
        nullValue: null;
        undefinedValue: undefined;
      }`,
    },
    {
      name: "Empty object and array",
      input: { emptyObject: {}, emptyArray: [] },
      expected: formatExpected`
      interface RootType {
        emptyObject: {};
        emptyArray: any[];
      }`,
    },
    {
      name: "Deep nested object",
      input: { level1: { level2: { level3: { value: "deep" } } } },
      expected: formatExpected`
      interface RootTypeLevel1Level2Level3 {
        value: string;
      }

      interface RootTypeLevel1Level2 {
        level3: RootTypeLevel1Level2Level3;
      }

      interface RootTypeLevel1 {
        level2: RootTypeLevel1Level2;
      }

      interface RootType {
        level1: RootTypeLevel1;
      }`,
    },
    {
      name: "Array of mixed types",
      input: { mixedArray: [1, "two", true, { key: "value" }] },
      expected: formatExpected`
      interface RootTypeMixedArrayItem {
        key: string;
      }

      interface RootType {
        mixedArray: (number | string | boolean | RootTypeMixedArrayItem)[];
      }`,
    },
    {
      name: "Complex nested arrays",
      input: {
        matrix: [
          [1, 2],
          [3, 4],
        ],
      },
      expected: formatExpected`
      interface RootType {
        matrix: number[][];
      }`,
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.name, () => {
      const result = generateTSType(testCase.input);
      expect(result).toBe(testCase.expected);
    });
  });

  it("Custom root type name", () => {
    const input = { name: "John" };
    const result = generateTSType(input, "CustomType");
    expect(result).toBe(formatExpected`
      interface CustomType {
        name: string;
      }`);
  });
});
