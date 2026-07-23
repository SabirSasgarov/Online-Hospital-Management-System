using HMS.Application.Messages.DTOs;

namespace HMS.Application.Messages.Commands
{
    public record SendMessageCommand(Guid SenderId, SendMessageDto Dto) : IRequest<Guid>;

    public class SendMessageCommandHandler(IAppDbContext db, IMapper mapper, IChatNotifier chatNotifier)
        : IRequestHandler<SendMessageCommand, Guid>
    {
        public async Task<Guid> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var receiverExists = await db.Users.AnyAsync(
                u => u.Id == request.Dto.ReceiverId, cancellationToken);
            if (!receiverExists)
                throw new NotFoundException(nameof(AppUser), request.Dto.ReceiverId);

            var message = new Message
            {
                SenderId    = request.SenderId,
                ReceiverId  = request.Dto.ReceiverId,
                Content     = request.Dto.Content,
                SentAt      = DateTime.UtcNow
            };

            db.Messages.Add(message);
            await db.SaveChangesAsync(cancellationToken);

            // Push to the receiver in real time instead of relying on the client to poll.
            var saved = await db.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .AsNoTracking()
                .FirstAsync(m => m.Id == message.Id, cancellationToken);
            await chatNotifier.NotifyNewMessageAsync(mapper.Map<MessageDto>(saved), cancellationToken);

            return message.Id;
        }
    }
}
