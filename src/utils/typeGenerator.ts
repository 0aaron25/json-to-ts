import { ElMessage } from "element-plus";
export function parseInput(input: string): any {
  try {
    return JSON.parse(input);
  } catch (jsonError) {
    return parseJsObject(input);
  }
}

export function generateTSType(data: any, rootTypeName = "RootType"): string {
  const interfaces = new Map<string, string>();
  let rootType = "";

  function generateType(data: any, typeName: string): string {
    if (data === null) return "null";
    if (data === undefined) return "undefined";
    if (Array.isArray(data)) return generateArrayType(data, typeName);
    if (typeof data === "object" && data !== null)
      return generateObjectType(data, typeName);
    return typeof data;
  }

  function generateArrayType(data: any[], typeName: string): string {
    if (data.length === 0) return "any[]";
    const itemTypes = new Set(
      data.map((item) => generateType(item, `${typeName}Item`))
    );
    if (itemTypes.size === 1) return `${Array.from(itemTypes)[0]}[]`;
    return `(${Array.from(itemTypes).join(" | ")})[]`;
  }

  function generateObjectType(
    data: Record<string, any>,
    typeName: string
  ): string {
    if (Object.keys(data).length === 0) return "{}";
    let properties = "";
    for (const [key, value] of Object.entries(data)) {
      const propertyTypeName = `${typeName}${key.charAt(0).toUpperCase() + key.slice(1)
        }`;
      const propertyType = generateType(value, propertyTypeName);
      properties += `  ${key}: ${propertyType};\n`;
    }
    interfaces.set(typeName, `interface ${typeName} {\n${properties}}`);
    return typeName;
  }

  rootType = generateType(data, rootTypeName);

  let result = "";
  for (const [name, interfaceStr] of interfaces) {
    if (name !== rootType) result += interfaceStr + "\n\n";
  }
  result +=
    interfaces.get(rootType) || `interface ${rootType} {\n${rootType}\n}`;

  return result;
}

function parseJsObject(str: string): any {
  try {
    return Function('"use strict";return (' + str + ")")();
  } catch (error) {
    ElMessage.error("Invalid Value");
  }
}


