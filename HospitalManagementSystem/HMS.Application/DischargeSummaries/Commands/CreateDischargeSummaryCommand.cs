using HMS.Application.DischargeSummaries.DTOs;

namespace HMS.Application.DischargeSummaries.Commands
{
    public record CreateDischargeSummaryCommand(CreateDischargeSummaryDto Dto) : IRequest<Guid>;

    public class CreateDischargeSummaryCommandHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<CreateDischargeSummaryCommand, Guid>
    {
        public async Task<Guid> Handle(CreateDischargeSummaryCommand request, CancellationToken cancellationToken)
        {
            var visit = await db.Visits
                .FirstOrDefaultAsync(v => v.Id == request.Dto.VisitId, cancellationToken)
                ?? throw new NotFoundException(nameof(Visit), request.Dto.VisitId);

            if (visit.Status != VisitStatus.Discharged)
                throw new ConflictException("Discharge summary can only be created for a discharged visit.");

            var alreadyExists = await db.DischargeSummaries
                .AnyAsync(d => d.VisitId == request.Dto.VisitId, cancellationToken);
            if (alreadyExists)
                throw new ConflictException("A discharge summary already exists for this visit.");

            var summary = mapper.Map<DischargeSummary>(request.Dto);
            summary.PatientId = visit.PatientId;
            summary.DoctorId  = visit.DoctorId;

            db.DischargeSummaries.Add(summary);
            await db.SaveChangesAsync(cancellationToken);
            return summary.Id;
        }
    }
}
