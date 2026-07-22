using HMS.Application.Announcements.AnnouncementsDTOs;

namespace HMS.Application.Announcements.Queries
{
    /// <summary>Unauthenticated home-page feed — published announcements only, newest first.</summary>
    public record GetPublicAnnouncementsQuery(
        int Page = 1,
        int PageSize = 10
    ) : IRequest<PaginatedResult<AnnouncementDto>>;

    public class GetPublicAnnouncementsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetPublicAnnouncementsQuery, PaginatedResult<AnnouncementDto>>
    {
        public async Task<PaginatedResult<AnnouncementDto>> Handle(
            GetPublicAnnouncementsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Announcements.AsNoTracking().Where(a => a.IsPublished);

            var total = await query.CountAsync(cancellationToken);
            var items = await query
                .OrderByDescending(a => a.PublishedAt)
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
