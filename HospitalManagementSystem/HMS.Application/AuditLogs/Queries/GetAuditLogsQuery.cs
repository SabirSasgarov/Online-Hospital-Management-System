using HMS.Application.AuditLogs.DTOs;

namespace HMS.Application.AuditLogs.Queries
{
    public record GetAuditLogsQuery(
        string? UserId,
        string? Resource,
        string? Action,
        DateTime? From,
        DateTime? To,
        int Page = 1,
        int PageSize = 50
    ) : IRequest<PaginatedResult<AuditLogDto>>;

    public class GetAuditLogsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetAuditLogsQuery, PaginatedResult<AuditLogDto>>
    {
        public async Task<PaginatedResult<AuditLogDto>> Handle(
            GetAuditLogsQuery request, CancellationToken cancellationToken)
        {
            var query = db.AuditLogs.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.UserId))
                query = query.Where(l => l.UserId == request.UserId);

            if (!string.IsNullOrWhiteSpace(request.Resource))
                query = query.Where(l => l.Resource.ToLower().Contains(request.Resource.ToLower()));

            if (!string.IsNullOrWhiteSpace(request.Action))
                query = query.Where(l => l.Action.ToLower().Contains(request.Action.ToLower()));

            if (request.From.HasValue)
                query = query.Where(l => l.Timestamp >= request.From.Value);

            if (request.To.HasValue)
                query = query.Where(l => l.Timestamp <= request.To.Value);

            var total = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderByDescending(l => l.Timestamp)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<AuditLogDto>
            {
                Items      = mapper.Map<List<AuditLogDto>>(items),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
