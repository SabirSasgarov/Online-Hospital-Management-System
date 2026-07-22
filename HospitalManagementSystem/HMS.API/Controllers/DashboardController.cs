using HMS.Application.Dashboard.Queries;
using HMS.Application.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class DashboardController(ISender sender, ICurrentUserService currentUser) : BaseApiController
    {
        private Guid CurrentUserId => Guid.Parse(currentUser.UserId!);

        // GET /api/dashboard/admin
        [HttpGet("admin")]
        [HasPermission(Permissions.Dashboard.ViewAdmin)]
        public async Task<IActionResult> Admin(CancellationToken ct)
        {
            var result = await sender.Send(new GetAdminDashboardQuery(), ct);
            return Ok(result);
        }

        // GET /api/dashboard/doctor/{doctorId}
        [HttpGet("doctor/{doctorId:guid}")]
        [HasPermission(Permissions.Dashboard.ViewDoctor)]
        public async Task<IActionResult> Doctor(Guid doctorId, CancellationToken ct)
        {
            var result = await sender.Send(new GetDoctorDashboardQuery(doctorId), ct);
            return Ok(result);
        }

        // GET /api/dashboard/patient/{patientId}
        [HttpGet("patient/{patientId:guid}")]
        [HasPermission(Permissions.Dashboard.ViewPatient)]
        public async Task<IActionResult> Patient(Guid patientId, CancellationToken ct)
        {
            var result = await sender.Send(new GetPatientDashboardQuery(patientId, CurrentUserId), ct);
            return Ok(result);
        }
    }
}
