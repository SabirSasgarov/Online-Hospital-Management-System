namespace HMS.Application.LabResults.Commands
{
    public record DeleteLabResultCommand(Guid LabResultId) : IRequest;

    public class DeleteLabResultCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteLabResultCommand>
    {
        public async Task Handle(DeleteLabResultCommand request, CancellationToken cancellationToken)
        {
            var labResult = await db.LabResults
                .FirstOrDefaultAsync(l => l.Id == request.LabResultId, cancellationToken)
                ?? throw new NotFoundException(nameof(LabResult), request.LabResultId);

            labResult.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
