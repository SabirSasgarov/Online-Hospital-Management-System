using HMS.Application.Announcements.AnnouncementsDTOs;

namespace HMS.Application.Announcements.Commands
{
    public record CreateAnnouncementCommand(CreateAnnouncementDto Dto) : IRequest<Guid>;

    public class CreateAnnouncementCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateAnnouncementCommand, Guid>
    {
        public async Task<Guid> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Dto.Title))
                throw new ValidationException(new Dictionary<string, string[]> { ["Title"] = ["Title is required."] });

            var announcement = mapper.Map<Announcement>(request.Dto);
            announcement.PublishedAt = announcement.IsPublished ? DateTime.UtcNow : null;

            db.Announcements.Add(announcement);
            await db.SaveChangesAsync(cancellationToken);
            return announcement.Id;
        }
    }
}
