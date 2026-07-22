using HMS.Application.AuditLogs.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HMS.API.Controllers
{
    [Authorize]
    public class AuditLogController(ISender sender) : BaseApiController
    {
        // GET /api/auditlog?userId=&resource=&action=&from=&to=&page=1&pageSize=50
        [HttpGet]
        [HasPermission(Permissions.AuditLogs.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? userId,
            [FromQuery] string? resource,
            [FromQuery] string? action,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            CancellationToken ct = default)
        {
            var result = await sender.Send(
                new GetAuditLogsQuery(userId, resource, action, from, to, page, pageSize), ct);
            return Ok(result);
        }
    }
}
