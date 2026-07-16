namespace HMS.Application.DischargeSummaries.Commands
{
    public record DeleteDischargeSummaryCommand(Guid DischargeSummaryId) : IRequest;

    public class DeleteDischargeSummaryCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteDischargeSummaryCommand>
    {
        public async Task Handle(DeleteDischargeSummaryCommand request, CancellationToken cancellationToken)
        {
            var summary = await db.DischargeSummaries
                .FirstOrDefaultAsync(d => d.Id == request.DischargeSummaryId, cancellationToken)
                ?? throw new NotFoundException(nameof(DischargeSummary), request.DischargeSummaryId);

            summary.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
