export function getPaginationParams(
  params: {
    page?: string;
    limit?: string;
    search?: string;
  }
) {
  return {
    page: Number(params.page ?? 1),
    limit: Number(params.limit ?? 20),
    search: params.search ?? "",
  };
}