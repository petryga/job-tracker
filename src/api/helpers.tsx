export const providesList = <
  R extends { _id: string | number }[],
  T extends string
>(
  resultsWithIds: R | undefined,
  tagType: T
) => {
  return Array.isArray(resultsWithIds)
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ _id }) => ({ type: tagType, id: _id })),
      ]
    : [{ type: tagType, id: "LIST" }];
};
