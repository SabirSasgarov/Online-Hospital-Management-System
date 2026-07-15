using HMS.Application.Patients.PatientsDTOs;

namespace HMS.Application.Patients.Queries
{
    public record GetPatientMedicalHistoryQuery(Guid PatientId) : IRequest<PatientMedicalHistoryDto>;

    public class GetPatientMedicalHistoryQueryHandler(IAppDbContext db, IMapper mapper)
        : IRequestHandler<GetPatientMedicalHistoryQuery, PatientMedicalHistoryDto>
    {
        public async Task<PatientMedicalHistoryDto> Handle(
            GetPatientMedicalHistoryQuery request, CancellationToken cancellationToken)
        {
            var patient = await db.Patients
                .Include(p => p.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == request.PatientId, cancellationToken)
                ?? throw new NotFoundException(nameof(Patient), request.PatientId);

            var visits = await db.Visits
                .Include(v => v.Doctor).ThenInclude(d => d.User)
                .AsNoTracking()
                .Where(v => v.PatientId == request.PatientId)
                .OrderByDescending(v => v.AdmissionDate)
                .ToListAsync(cancellationToken);

            var prescriptions = await db.Prescriptions
                .Include(rx => rx.Doctor).ThenInclude(d => d.User)
                .Include(rx => rx.Medications)
                .AsNoTracking()
                .Where(rx => rx.PatientId == request.PatientId)
                .OrderByDescending(rx => rx.IssuedAt)
                .ToListAsync(cancellationToken);

            var labResults = await db.LabResults
                .AsNoTracking()
                .Where(lr => lr.PatientId == request.PatientId)
                .OrderByDescending(lr => lr.TestedAt)
                .ToListAsync(cancellationToken);

            return new PatientMedicalHistoryDto
            {
                PatientId     = patient.Id,
                FullName      = patient.User.FirstName + " " + patient.User.LastName,
                BloodType     = patient.BloodType,
                Conditions    = patient.Conditions,
                Allergies     = patient.Allergies,
                Visits        = mapper.Map<List<VisitSummaryDto>>(visits),
                Prescriptions = mapper.Map<List<PrescriptionSummaryDto>>(prescriptions),
                LabResults    = mapper.Map<List<LabResultSummaryDto>>(labResults)
            };
        }
    }
}
