using HMS.Application.Beds.BedsDTOs;

namespace HMS.Application.Beds.Queries
{
    public record GetBedsQuery(
        Guid? RoomId,
        Guid? WardId,
        BedStatus? Status,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<BedDto>>;

    public class GetBedsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetBedsQuery, PaginatedResult<BedDto>>
    {
        public async Task<PaginatedResult<BedDto>> Handle(
            GetBedsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Beds
                .Include(b => b.Room).ThenInclude(r => r.Ward)
                .Include(b => b.Patient).ThenInclude(p => p!.User)
                .AsNoTracking()
                .AsQueryable();

            if (request.RoomId.HasValue)
                query = query.Where(b => b.RoomId == request.RoomId.Value);

            if (request.WardId.HasValue)
                query = query.Where(b => b.Room.WardId == request.WardId.Value);

            if (request.Status.HasValue)
                query = query.Where(b => b.Status == request.Status.Value);

            var total = await query.CountAsync(cancellationToken);
            var beds = await query
                .OrderBy(b => b.Room.Ward.Name).ThenBy(b => b.Room.RoomNumber).ThenBy(b => b.BedNumber)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<BedDto>
            {
                Items      = mapper.Map<List<BedDto>>(beds),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
