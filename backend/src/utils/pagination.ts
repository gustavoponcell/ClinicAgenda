export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function getPagination(params: PaginationParams) {
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
}

export function paginate<T>(items: T[], total: number, page: number, limit: number) {
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
