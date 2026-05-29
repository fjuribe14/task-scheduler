import { format } from "date-fns";

export function getEnumObjectFromArray<
  T extends Readonly<Array<string | number>>,
  U extends T[number],
>(array: T) {
  return Object.freeze(
    array?.reduce(
      // biome-ignore lint/performance/noAccumulatingSpread: false positive
      (acc, cur) => ({ ...acc, [cur]: cur }),
      {} as { [K in U]: K },
    ),
  );
}

export function getCurrentDate(formatString: string = "yyyy-MM-dd"): string {
  return format(new Date(), formatString);
}
