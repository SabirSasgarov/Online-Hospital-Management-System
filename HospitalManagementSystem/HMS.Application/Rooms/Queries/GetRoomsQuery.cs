using HMS.Application.Rooms.RoomsDTOs;

namespace HMS.Application.Rooms.Queries
{
    public record GetRoomsQuery(
        Guid? WardId,
        string? Search,
        RoomType? Type,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<RoomSummaryDto>>;

    public class GetRoomsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetRoomsQuery, PaginatedResult<RoomSummaryDto>>
    {
        public async Task<PaginatedResult<RoomSummaryDto>> Handle(
            GetRoomsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Rooms
                .Include(r => r.Ward)
                .Include(r => r.Beds)
                .AsNoTracking()
                .AsQueryable();

            if (request.WardId.HasValue)
                query = query.Where(r => r.WardId == request.WardId.Value);

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var s = request.Search.ToLower();
                query = query.Where(r => r.RoomNumber.ToLower().Contains(s) ||
                                         r.Ward.Name.ToLower().Contains(s));
            }

            if (request.Type.HasValue)
                query = query.Where(r => r.Type == request.Type.Value);

            var total = await query.CountAsync(cancellationToken);
            var rooms = await query
                .OrderBy(r => r.Ward.Name).ThenBy(r => r.RoomNumber)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<RoomSummaryDto>
            {
                Items      = mapper.Map<List<RoomSummaryDto>>(rooms),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
