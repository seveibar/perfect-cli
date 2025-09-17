export const stringifyOptions = (
  options: Record<string, any>,
  positionalArgs: string[] = []
) => {
  const flags = Object.entries(options)
    .filter(([key]) => key !== "_")
    .flatMap(([key, value]) => {
      if (value === true) return [`--${key}`]       
      if (value === false || value === undefined) return [] 
      return [`--${key}`, String(value)]      
    });

  return [...flags, ...positionalArgs].join(" ");
};
