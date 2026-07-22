using HMS.Application.Announcements.AnnouncementsDTOs;

namespace HMS.Application.Announcements.Queries
{
    /// <summary>Admin CMS list — includes drafts unless <see cref="Published"/> filters to one state.</summary>
    public record GetAnnouncementsQuery(
        bool? Published,
        string? Search,
        int Page = 1,
        int PageSize = 20
    ) : IRequest<PaginatedResult<AnnouncementDto>>;

    public class GetAnnouncementsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetAnnouncementsQuery, PaginatedResult<AnnouncementDto>>
    {
        public async Task<PaginatedResult<AnnouncementDto>> Handle(
            GetAnnouncementsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Announcements.AsNoTracking().AsQueryable();

            if (request.Published.HasValue)
                query = query.Where(a => a.IsPublished == request.Published.Value);

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var s = request.Search.ToLower();
                query = query.Where(a => a.Title.ToLower().Contains(s) || a.Summary.ToLower().Contains(s));
            }

            var total = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<AnnouncementDto>
            {
                Items      = mapper.Map<List<AnnouncementDto>>(items),
                TotalCount = total,
                Page       = request.Page,
                PageSize   = request.PageSize
            };
        }
    }
}
