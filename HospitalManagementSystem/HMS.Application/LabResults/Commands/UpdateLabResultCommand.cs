using HMS.Application.LabResults.DTOs;

namespace HMS.Application.LabResults.Commands
{
    public record UpdateLabResultCommand(Guid LabResultId, UpdateLabResultDto Dto) : IRequest;

    public class UpdateLabResultCommandHandler(IAppDbContext db)
        : IRequestHandler<UpdateLabResultCommand>
    {
        public async Task Handle(UpdateLabResultCommand request, CancellationToken cancellationToken)
        {
            var labResult = await db.LabResults
                .FirstOrDefaultAsync(l => l.Id == request.LabResultId, cancellationToken)
                ?? throw new NotFoundException(nameof(LabResult), request.LabResultId);

            if (request.Dto.Result is not null)      labResult.Result      = request.Dto.Result;
            if (request.Dto.NormalRange is not null) labResult.NormalRange = request.Dto.NormalRange;
            if (request.Dto.Status.HasValue)         labResult.Status      = request.Dto.Status.Value;
            if (request.Dto.Notes is not null)       labResult.Notes       = request.Dto.Notes;

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
