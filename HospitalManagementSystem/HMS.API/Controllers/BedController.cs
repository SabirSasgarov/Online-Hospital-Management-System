using HMS.Application.Beds.BedsDTOs;
using HMS.Application.Beds.Commands;
using HMS.Application.Beds.Queries;

namespace HMS.API.Controllers
{
    [Authorize]
    public class BedController(ISender sender) : BaseApiController
    {
        // GET /api/bed?roomId=&wardId=&status=&page=1&pageSize=20
        [HttpGet]
        [HasPermission(Permissions.Beds.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] Guid? roomId,
            [FromQuery] Guid? wardId,
            [FromQuery] BedStatus? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetBedsQuery(roomId, wardId, status, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/bed/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Beds.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetBedByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/bed
        [HttpPost]
        [HasPermission(Permissions.Beds.Create)]
        public async Task<IActionResult> Create([FromBody] CreateBedDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateBedCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PATCH /api/bed/{id}/status
        [HttpPatch("{id:guid}/status")]
        [HasPermission(Permissions.Beds.EditStatus)]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateBedStatusDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateBedStatusCommand(id, dto), ct);
            return NoContent();
        }

        // POST /api/bed/{id}/assign
        [HttpPost("{id:guid}/assign")]
        [HasPermission(Permissions.Beds.AssignPatient)]
        public async Task<IActionResult> Assign(Guid id, [FromBody] AssignPatientToBedDto dto, CancellationToken ct)
        {
            await sender.Send(new AssignPatientToBedCommand(id, dto), ct);
            return NoContent();
        }

        // POST /api/bed/{id}/release
        [HttpPost("{id:guid}/release")]
        [HasPermission(Permissions.Beds.Release)]
        public async Task<IActionResult> Release(Guid id, CancellationToken ct)
        {
            await sender.Send(new ReleaseBedCommand(id), ct);
            return NoContent();
        }

        // DELETE /api/bed/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Beds.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteBedCommand(id), ct);
            return NoContent();
        }
    }
}
