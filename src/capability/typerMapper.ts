interface TypeMapper {
  (value: unknown): string;
}

const typeMappers = new Map<string, TypeMapper>();
export function initTypeMapper() {
  typeMappers.set("default", (v) => {
      return Object.getPrototypeOf(v).toString();
  });
}
export function getTypeMapper(type: string): TypeMapper {
  if (typeMappers.get(type)) {
    return <TypeMapper>typeMappers.get(type);
  } else {
    return <TypeMapper>typeMappers.get("default");
  }
}
