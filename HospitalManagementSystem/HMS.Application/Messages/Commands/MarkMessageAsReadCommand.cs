namespace HMS.Application.Messages.Commands
{
    public record MarkMessageAsReadCommand(Guid MessageId, Guid CurrentUserId) : IRequest;

    public class MarkMessageAsReadCommandHandler(IAppDbContext db)
        : IRequestHandler<MarkMessageAsReadCommand>
    {
        public async Task Handle(MarkMessageAsReadCommand request, CancellationToken cancellationToken)
        {
            var message = await db.Messages
                .FirstOrDefaultAsync(m => m.Id == request.MessageId, cancellationToken)
                ?? throw new NotFoundException(nameof(Message), request.MessageId);

            if (message.ReceiverId != request.CurrentUserId)
                throw new ForbiddenException("You can only mark your own messages as read.");

            message.IsRead = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
