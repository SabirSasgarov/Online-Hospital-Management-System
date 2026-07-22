using HMS.Application.Announcements.AnnouncementsDTOs;
using HMS.Application.Announcements.Commands;
using HMS.Application.Announcements.Queries;

namespace HMS.API.Controllers
{
    [Authorize]
    public class AnnouncementController(ISender sender) : BaseApiController
    {
        // GET /api/announcement/public?page=1&pageSize=10 — unauthenticated home-page feed
        [AllowAnonymous]
        [HttpGet("public")]
        public async Task<IActionResult> GetPublic(
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
        {
            var result = await sender.Send(new GetPublicAnnouncementsQuery(page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/announcement?published=&search=&page=1&pageSize=20 — admin CMS list (includes drafts)
        [HttpGet]
        [HasPermission(Permissions.Announcements.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] bool? published,
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetAnnouncementsQuery(published, search, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/announcement/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Announcements.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetAnnouncementByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/announcement
        [HttpPost]
        [HasPermission(Permissions.Announcements.Create)]
        public async Task<IActionResult> Create([FromBody] CreateAnnouncementDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateAnnouncementCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/announcement/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Announcements.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAnnouncementDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateAnnouncementCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/announcement/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Announcements.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteAnnouncementCommand(id), ct);
            return NoContent();
        }
    }
}
