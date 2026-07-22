using HMS.Application.Analytics.DTOs;

namespace HMS.Application.Analytics.Queries
{
    public record GetAdmissionsAnalyticsQuery(DateTime From, DateTime To) : IRequest<AdmissionsAnalyticsDto>;

    public class GetAdmissionsAnalyticsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetAdmissionsAnalyticsQuery, AdmissionsAnalyticsDto>
    {
        public async Task<AdmissionsAnalyticsDto> Handle(
            GetAdmissionsAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var visits = await db.Visits
                .Where(v => v.AdmissionDate >= request.From && v.AdmissionDate <= request.To)
                .Select(v => new { v.AdmissionDate, v.DischargeDate, v.Status })
                .ToListAsync(cancellationToken);

            var discharged = visits.Where(v => v.Status == VisitStatus.Discharged && v.DischargeDate.HasValue).ToList();
            var avgStay = discharged.Count > 0
                ? discharged.Average(v => (v.DischargeDate!.Value - v.AdmissionDate).TotalDays)
                : 0;

            var byDay = visits
                .GroupBy(v => DateOnly.FromDateTime(v.AdmissionDate))
                .Select(g => new DailyCountDto { Date = g.Key, Count = g.Count() })
                .OrderBy(d => d.Date)
                .ToList();

            return new AdmissionsAnalyticsDto
            {
                TotalAdmissions          = visits.Count,
                TotalDischarges          = discharged.Count,
                CurrentlyAdmitted        = visits.Count(v => v.Status == VisitStatus.Ongoing),
                AverageLengthOfStayDays  = Math.Round(avgStay, 1),
                AdmissionsByDay          = byDay
            };
        }
    }
}
