using HMS.Application.Analytics.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class AnalyticsController(ISender sender) : BaseApiController
    {
        // GET /api/analytics/admissions?from=&to=
        [HttpGet("admissions")]
        [HasPermission(Permissions.Analytics.ViewAdmissions)]
        public async Task<IActionResult> Admissions(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            CancellationToken ct)
        {
            var result = await sender.Send(
                new GetAdmissionsAnalyticsQuery(
                    from ?? DateTime.UtcNow.AddDays(-30),
                    to   ?? DateTime.UtcNow), ct);
            return Ok(result);
        }

        // GET /api/analytics/bed-occupancy
        [HttpGet("bed-occupancy")]
        [HasPermission(Permissions.Analytics.ViewBedOccupancy)]
        public async Task<IActionResult> BedOccupancy(CancellationToken ct)
        {
            var result = await sender.Send(new GetBedOccupancyAnalyticsQuery(), ct);
            return Ok(result);
        }

        // GET /api/analytics/appointments?from=&to=
        [HttpGet("appointments")]
        [HasPermission(Permissions.Analytics.ViewAppointments)]
        public async Task<IActionResult> Appointments(
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            CancellationToken ct)
        {
            var result = await sender.Send(
                new GetAppointmentsAnalyticsQuery(
                    from ?? DateTime.UtcNow.AddDays(-30),
                    to   ?? DateTime.UtcNow), ct);
            return Ok(result);
        }

        // GET /api/analytics/patient-conditions?topN=10
        [HttpGet("patient-conditions")]
        [HasPermission(Permissions.Analytics.ViewPatientConditions)]
        public async Task<IActionResult> PatientConditions(
            [FromQuery] int topN = 10,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetPatientConditionsAnalyticsQuery(topN), ct);
            return Ok(result);
        }
    }
}
