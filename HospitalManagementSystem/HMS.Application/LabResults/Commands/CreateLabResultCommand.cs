using HMS.Application.LabResults.DTOs;

namespace HMS.Application.LabResults.Commands
{
    public record CreateLabResultCommand(CreateLabResultDto Dto) : IRequest<Guid>;

    public class CreateLabResultCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateLabResultCommand, Guid>
    {
        public async Task<Guid> Handle(CreateLabResultCommand request, CancellationToken cancellationToken)
        {
            var visitExists = await db.Visits.AnyAsync(v => v.Id == request.Dto.VisitId, cancellationToken);
            if (!visitExists) throw new NotFoundException(nameof(Visit), request.Dto.VisitId);

            var labResult = mapper.Map<LabResult>(request.Dto);
            db.LabResults.Add(labResult);
            await db.SaveChangesAsync(cancellationToken);
            return labResult.Id;
        }
    }
}
