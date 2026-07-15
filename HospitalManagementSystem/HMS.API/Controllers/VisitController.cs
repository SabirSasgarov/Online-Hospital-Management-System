using HMS.Application.Visits.Commands;
using HMS.Application.Visits.Queries;
using HMS.Application.Visits.VisitsDTOs;

namespace HMS.API.Controllers
{
    [Authorize]
    public class VisitController(ISender sender) : BaseApiController
    {
        // GET /api/visit?patientId=&doctorId=&status=&from=&to=&page=1&pageSize=20
        [HttpGet]
        [HasPermission(Permissions.Visits.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? patientId,
            [FromQuery] Guid? doctorId,
            [FromQuery] VisitStatus? status,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(
                new GetVisitsQuery(patientId, doctorId, status, from, to, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/visit/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Visits.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetVisitByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/visit
        [HttpPost]
        [HasPermission(Permissions.Visits.Admit)]
        public async Task<IActionResult> Create([FromBody] CreateVisitDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateVisitCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/visit/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Visits.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateVisitDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateVisitCommand(id, dto), ct);
            return NoContent();
        }

        // POST /api/visit/{id}/discharge
        [HttpPost("{id:guid}/discharge")]
        [HasPermission(Permissions.Visits.Discharge)]
        public async Task<IActionResult> Discharge(Guid id, [FromBody] DischargeVisitDto dto, CancellationToken ct)
        {
            await sender.Send(new DischargeVisitCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/visit/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Visits.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteVisitCommand(id), ct);
            return NoContent();
        }
    }
}
