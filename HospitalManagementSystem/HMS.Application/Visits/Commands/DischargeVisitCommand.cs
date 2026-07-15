using HMS.Application.Visits.VisitsDTOs;

namespace HMS.Application.Visits.Commands
{
    public record DischargeVisitCommand(Guid VisitId, DischargeVisitDto Dto) : IRequest;

    public class DischargeVisitCommandHandler(IAppDbContext db)
        : IRequestHandler<DischargeVisitCommand>
    {
        public async Task Handle(DischargeVisitCommand request, CancellationToken cancellationToken)
        {
            var visit = await db.Visits
                .Include(v => v.Bed)
                .FirstOrDefaultAsync(v => v.Id == request.VisitId, cancellationToken)
                ?? throw new NotFoundException(nameof(Visit), request.VisitId);

            if (visit.Status == VisitStatus.Discharged)
                throw new ConflictException("Visit is already discharged.");

            visit.Status        = VisitStatus.Discharged;
            visit.DischargeDate = request.Dto.DischargeDate;

            if (request.Dto.FinalDiagnosis is not null)
                visit.Diagnosis = request.Dto.FinalDiagnosis;

            if (request.Dto.FinalTreatment is not null)
                visit.Treatment = request.Dto.FinalTreatment;

            // Release the bed
            if (visit.Bed is not null)
            {
                visit.Bed.PatientId = null;
                visit.Bed.Status    = BedStatus.Available;
            }

            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
