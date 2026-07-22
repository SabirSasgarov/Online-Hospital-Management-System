using HMS.Application.Analytics.DTOs;

namespace HMS.Application.Analytics.Queries
{
    public record GetAppointmentsAnalyticsQuery(DateTime From, DateTime To) : IRequest<AppointmentsAnalyticsDto>;

    public class GetAppointmentsAnalyticsQueryHandler(IAppDbContext db)
        : IRequestHandler<GetAppointmentsAnalyticsQuery, AppointmentsAnalyticsDto>
    {
        public async Task<AppointmentsAnalyticsDto> Handle(
            GetAppointmentsAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var appts = await db.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.ScheduledAt >= request.From && a.ScheduledAt <= request.To)
                .Select(a => new { a.Status, a.ScheduledAt, a.Doctor.Specialization })
                .ToListAsync(cancellationToken);

            var total     = appts.Count;
            var completed = appts.Count(a => a.Status == AppointmentStatus.Completed);
            var cancelled = appts.Count(a => a.Status == AppointmentStatus.Cancelled);
            var noShow    = appts.Count(a => a.Status == AppointmentStatus.NoShow);
            var scheduled = appts.Count(a => a.Status == AppointmentStatus.Scheduled);

            var byDay = appts
                .GroupBy(a => DateOnly.FromDateTime(a.ScheduledAt))
                .Select(g => new DailyCountDto { Date = g.Key, Count = g.Count() })
                .OrderBy(d => d.Date)
                .ToList();

            var bySpec = appts
                .GroupBy(a => a.Specialization)
                .Select(g => new SpecializationCountDto { Specialization = g.Key, Count = g.Count() })
                .OrderByDescending(s => s.Count)
                .ToList();

            return new AppointmentsAnalyticsDto
            {
                TotalAppointments  = total,
                Scheduled          = scheduled,
                Completed          = completed,
                Cancelled          = cancelled,
                NoShow             = noShow,
                CompletionRate     = total > 0 ? Math.Round((double)completed / total * 100, 1) : 0,
                AppointmentsByDay  = byDay,
                BySpecialization   = bySpec
            };
        }
    }
}
