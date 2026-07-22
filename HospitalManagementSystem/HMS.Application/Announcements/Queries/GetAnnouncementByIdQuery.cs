using HMS.Application.Announcements.AnnouncementsDTOs;

namespace HMS.Application.Announcements.Queries
{
    public record GetAnnouncementByIdQuery(Guid AnnouncementId) : IRequest<AnnouncementDto>;

    public class GetAnnouncementByIdQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetAnnouncementByIdQuery, AnnouncementDto>
    {
        public async Task<AnnouncementDto> Handle(
            GetAnnouncementByIdQuery request, CancellationToken cancellationToken)
        {
            var announcement = await db.Announcements
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Id == request.AnnouncementId, cancellationToken)
                ?? throw new NotFoundException(nameof(Announcement), request.AnnouncementId);

            return mapper.Map<AnnouncementDto>(announcement);
        }
    }
}
