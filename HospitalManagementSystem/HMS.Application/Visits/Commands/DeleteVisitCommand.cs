namespace HMS.Application.Visits.Commands
{
    public record DeleteVisitCommand(Guid VisitId) : IRequest;

    public class DeleteVisitCommandHandler(IAppDbContext db)
        : IRequestHandler<DeleteVisitCommand>
    {
        public async Task Handle(DeleteVisitCommand request, CancellationToken cancellationToken)
        {
            var visit = await db.Visits
                .Include(v => v.Bed)
                .FirstOrDefaultAsync(v => v.Id == request.VisitId, cancellationToken)
                ?? throw new NotFoundException(nameof(Visit), request.VisitId);

            if (visit.Status == VisitStatus.Ongoing)
                throw new ConflictException("Cannot delete an ongoing visit. Discharge it first.");

            visit.IsDeleted = true;
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
