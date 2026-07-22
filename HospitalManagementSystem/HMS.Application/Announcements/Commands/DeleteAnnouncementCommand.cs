namespace HMS.Application.Announcements.Commands
{
    public record DeleteAnnouncementCommand(Guid AnnouncementId) : IRequest;

    public class DeleteAnnouncementCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteAnnouncementCommand>
    {
        public async Task Handle(DeleteAnnouncementCommand request, CancellationToken cancellationToken)
        {
            var announcement = await db.Announcements
                .FirstOrDefaultAsync(a => a.Id == request.AnnouncementId, cancellationToken)
                ?? throw new NotFoundException(nameof(Announcement), request.AnnouncementId);

            announcement.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
