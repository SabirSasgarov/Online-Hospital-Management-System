using HMS.Application.Messages.DTOs;

namespace HMS.Application.Messages.Queries
{
    public record GetMessagesQuery(
        Guid UserId,
        Guid? WithUserId,
        bool? IsRead,
        int Page = 1,
        int PageSize = 30
    ) : IRequest<PaginatedResult<MessageDto>>;

    public class GetMessagesQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetMessagesQuery, PaginatedResult<MessageDto>>
    {
        public async Task<PaginatedResult<MessageDto>> Handle(
            GetMessagesQuery request, CancellationToken cancellationToken)
        {
            var query = db.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == request.UserId || m.ReceiverId == request.UserId)
                .AsNoTracking().AsQueryable();

            if (request.WithUserId.HasValue)
                query = query.Where(m =>
                    m.SenderId   == request.WithUserId.Value ||
                    m.ReceiverId == request.WithUserId.Value);

            if (request.IsRead.HasValue)
                query = query.Where(m => m.IsRead == request.IsRead.Value);

            var total = await query.CountAsync(cancellationToken);
            var items = await query.OrderByDescending(m => m.SentAt)
                .Skip((request.Page - 1) * request.PageSize).Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResult<MessageDto>
            {
                Items = mapper.Map<List<MessageDto>>(items),
                TotalCount = total, Page = request.Page, PageSize = request.PageSize
            };
        }
    }
}
