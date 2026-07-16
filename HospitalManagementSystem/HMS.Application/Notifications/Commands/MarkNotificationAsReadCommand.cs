namespace HMS.Application.Notifications.Commands
{
    public record MarkNotificationAsReadCommand(Guid NotificationId, Guid CurrentUserId) : IRequest;

    public class MarkNotificationAsReadCommandHandler(IAppDbContext db)
        : IRequestHandler<MarkNotificationAsReadCommand>
    {
        public async Task Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
        {
            var notification = await db.Notifications
                .FirstOrDefaultAsync(n => n.Id == request.NotificationId, cancellationToken)
                ?? throw new NotFoundException(nameof(Notification), request.NotificationId);

            if (notification.UserId != request.CurrentUserId)
                throw new ForbiddenException("You can only mark your own notifications as read.");

            notification.IsRead = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
