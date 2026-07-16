using HMS.Application.Notifications.DTOs;

namespace HMS.Application.Notifications.Queries
{
    public record GetNotificationsQuery(
        Guid UserId,
        bool? IsRead,
        NotificationType? Type,
        int Page = 1,
        int PageSize = 30
    ) : IRequest<PaginatedResult<NotificationDto>>;

    public class GetNotificationsQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetNotificationsQuery, PaginatedResult<NotificationDto>>
    {
        public async Task<PaginatedResult<NotificationDto>> Handle(
            GetNotificationsQuery request, CancellationToken cancellationToken)
        {
            var query = db.Notifications
                .Where(n => n.UserId == request.UserId)
                .AsNoTracking().AsQueryable();

            if (request.IsRead.HasValue) query = query.Where(n => n.IsRead == request.IsRead.Value);
            if (request.Type.HasValue)   query = query.Where(n => n.Type   == request.Type.Value);

            var total = await query.CountAsync(cancellationToken);
            var items = await query.OrderByDescending(n => n.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<NotificationDto>
            {
                Items = mapper.Map<List<NotificationDto>>(items),
                TotalCount = total, Page = request.Page, PageSize = request.PageSize
            };
        }
    }
}
