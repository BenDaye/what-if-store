import { ListItemSchema, ListOutputSchema } from '../schemas/list';

export const formatListArgs = (
  limit = 20,
  skip = 0,
  cursor?: string,
): { take: number; skip: number; cursor?: { id: string } } => ({
  take: limit + 1,
  skip: cursor ? 0 : skip,
  cursor: cursor ? { id: cursor } : undefined,
});

export const formatListResponse = <T extends ListItemSchema>(
  items: T[],
  limit = 20,
  total = 0,
): ListOutputSchema<T> => {
  let nextCursor: string | undefined = undefined;
  if (items.length > limit) {
    // Remove the last item and use it as next cursor
    const nextItem = items.pop()!;
    nextCursor = nextItem.id;
  }

  return {
    items,
    nextCursor,
    total,
  };
};
