namespace HMS.Application.Notifications.Commands
{
    public record MarkAllNotificationsAsReadCommand(Guid CurrentUserId) : IRequest;

    public class MarkAllNotificationsAsReadCommandHandler(IAppDbContext db)
        : IRequestHandler<MarkAllNotificationsAsReadCommand>
    {
        public async Task Handle(MarkAllNotificationsAsReadCommand request, CancellationToken cancellationToken)
        {
            await db.Notifications
                .Where(n => n.UserId == request.CurrentUserId && !n.IsRead)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true), cancellationToken);
        }
    }
}
