export const resultHandlerStrategy = new Map<string, ResultHandler>();

export function initialResultHandlerStrategy() {
  resultHandlerStrategy.set("ResultSetHeader", () => {
      
  });
}

interface ResultHandler {
  (): void;
}
