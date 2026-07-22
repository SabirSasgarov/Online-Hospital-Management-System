using HMS.Application.Announcements.AnnouncementsDTOs;

namespace HMS.Application.Announcements.Commands
{
    public record UpdateAnnouncementCommand(Guid AnnouncementId, UpdateAnnouncementDto Dto) : IRequest;

    public class UpdateAnnouncementCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<UpdateAnnouncementCommand>
    {
        public async Task Handle(UpdateAnnouncementCommand request, CancellationToken cancellationToken)
        {
            var announcement = await db.Announcements
                .FirstOrDefaultAsync(a => a.Id == request.AnnouncementId, cancellationToken)
                ?? throw new NotFoundException(nameof(Announcement), request.AnnouncementId);

            var wasPublished = announcement.IsPublished;
            mapper.Map(request.Dto, announcement);

            // Stamp PublishedAt the first time it goes live; keep it once set so history/order stays stable.
            if (announcement.IsPublished && !wasPublished)
                announcement.PublishedAt = DateTime.UtcNow;
            else if (!announcement.IsPublished)
                announcement.PublishedAt = null;

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
