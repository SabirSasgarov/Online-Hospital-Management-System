using HMS.Application.Wards.WardsDTOs;

namespace HMS.Application.Wards.Queries
{
    public record GetWardsQuery(
        string? Search,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<WardSummaryDto>>;

    public class GetWardsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetWardsQuery, PaginatedResult<WardSummaryDto>>
    {
        public async Task<PaginatedResult<WardSummaryDto>> Handle(
            GetWardsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Wards
                .Include(w => w.Rooms).ThenInclude(r => r.Beds)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var s = request.Search.ToLower();
                query = query.Where(w =>
                    w.Name.ToLower().Contains(s) ||
                    w.Type.ToLower().Contains(s));
            }

            var total = await query.CountAsync(cancellationToken);
            var wards = await query
                .OrderBy(w => w.Floor).ThenBy(w => w.Name)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<WardSummaryDto>
            {
                Items      = mapper.Map<List<WardSummaryDto>>(wards),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
