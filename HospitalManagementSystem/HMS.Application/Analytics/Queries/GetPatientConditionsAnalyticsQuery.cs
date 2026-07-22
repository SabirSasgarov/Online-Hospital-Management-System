using HMS.Application.Analytics.DTOs;

namespace HMS.Application.Analytics.Queries
{
    public record GetPatientConditionsAnalyticsQuery(int TopN = 10) : IRequest<PatientConditionsAnalyticsDto>;

    public class GetPatientConditionsAnalyticsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetPatientConditionsAnalyticsQuery, PatientConditionsAnalyticsDto>
    {
        public async Task<PatientConditionsAnalyticsDto> Handle(
            GetPatientConditionsAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var topDiagnoses = await db.Visits
                .GroupBy(v => v.Diagnosis)
                .Select(g => new ConditionCountDto { Label = g.Key, Count = g.Count() })
                .OrderByDescending(c => c.Count)
                .Take(request.TopN)
                .ToListAsync(cancellationToken);

            var labStatuses = await db.LabResults
                .GroupBy(l => l.Status)
                .Select(g => new ConditionCountDto { Label = g.Key.ToString(), Count = g.Count() })
                .ToListAsync(cancellationToken);

            var prescriptionStatuses = await db.Prescriptions
                .GroupBy(p => p.Status)
                .Select(g => new ConditionCountDto { Label = g.Key.ToString(), Count = g.Count() })
                .ToListAsync(cancellationToken);

            return new PatientConditionsAnalyticsDto
            {
                TopDiagnoses          = topDiagnoses,
                LabResultStatuses     = labStatuses,
                PrescriptionStatuses  = prescriptionStatuses
            };
        }
    }
}
