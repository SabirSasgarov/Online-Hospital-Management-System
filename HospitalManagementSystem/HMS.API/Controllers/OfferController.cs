using HMS.Application.Offers.Commands;
using HMS.Application.Offers.OffersDTOs;
using HMS.Application.Offers.Queries;

namespace HMS.API.Controllers
{
    [Authorize]
    public class OfferController(ISender sender) : BaseApiController
    {
        // GET /api/offer/public — unauthenticated home-page "What CareFlow Offers" section
        [AllowAnonymous]
        [HttpGet("public")]
        public async Task<IActionResult> GetPublic(CancellationToken ct)
        {
            var result = await sender.Send(new GetPublicOffersQuery(), ct);
            return Ok(result);
        }

        // GET /api/offer?active=&page=1&pageSize=50 — admin CMS list (includes inactive)
        [HttpGet]
        [HasPermission(Permissions.Offers.View)]
        public async Task<IActionResult> GetAll(
            [FromQuery] bool? active,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            CancellationToken ct = default)
        {
            var result = await sender.Send(new GetOffersQuery(active, page, pageSize), ct);
            return Ok(result);
        }

        // GET /api/offer/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Offers.View)]
        public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        {
            var result = await sender.Send(new GetOfferByIdQuery(id), ct);
            return Ok(result);
        }

        // POST /api/offer
        [HttpPost]
        [HasPermission(Permissions.Offers.Create)]
        public async Task<IActionResult> Create([FromBody] CreateOfferDto dto, CancellationToken ct)
        {
            var id = await sender.Send(new CreateOfferCommand(dto), ct);
            return CreatedAtAction(nameof(GetById), new { id }, new { id });
        }

        // PUT /api/offer/{id}
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Offers.Edit)]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateOfferDto dto, CancellationToken ct)
        {
            await sender.Send(new UpdateOfferCommand(id, dto), ct);
            return NoContent();
        }

        // DELETE /api/offer/{id}
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Offers.Delete)]
        public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        {
            await sender.Send(new DeleteOfferCommand(id), ct);
            return NoContent();
        }
    }
}
