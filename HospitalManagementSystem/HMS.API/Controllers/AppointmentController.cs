
namespace HMS.API.Controllers
{
    [Authorize]
    public class AppointmentController(ISender sender) : BaseApiController
    {
        // GET /api/appointment?patientId=&doctorId=&status=&type=&from=&to=&page=1&pageSize=10
        [HttpGet]
        [HasPermission(Permissions.Appointments.View)]
        public async Task<IActionResult> GetAppointments(
            [FromQuery] Guid? patientId,
            [FromQuery] Guid? doctorId,
            [FromQuery] AppointmentStatus? status,
            [FromQuery] AppointmentType? type,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = await sender.Send(
                new GetAppointmentsQuery(patientId, doctorId, status, type, from, to, page, pageSize));
            return Ok(result);
        }

        // GET /api/appointment/{id}
        [HttpGet("{id:guid}")]
        [HasPermission(Permissions.Appointments.View)]
        public async Task<IActionResult> GetAppointmentById(Guid id)
        {
            var result = await sender.Send(new GetAppointmentByIdQuery(id));
            return Ok(result);
        }

        // POST /api/appointment
        [HttpPost]
        [HasPermission(Permissions.Appointments.Create)]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDto dto)
        {
            var id = await sender.Send(new CreateAppointmentCommand(dto));
            return CreatedAtAction(nameof(GetAppointmentById), new { id }, new { id });
        }

        // PUT /api/appointment/{id}  — reschedule
        [HttpPut("{id:guid}")]
        [HasPermission(Permissions.Appointments.Edit)]
        public async Task<IActionResult> UpdateAppointment(Guid id, [FromBody] UpdateAppointmentDto dto)
        {
            await sender.Send(new UpdateAppointmentCommand(id, dto));
            return NoContent();
        }

        // PATCH /api/appointment/{id}/status  — cancel / complete / no-show
        [HttpPatch("{id:guid}/status")]
        [HasPermission(Permissions.Appointments.Cancel)] 
        public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] ChangeAppointmentStatusDto dto)
        {
            await sender.Send(new ChangeAppointmentStatusCommand(id, dto));
            return NoContent();
        }

        // DELETE /api/appointment/{id}  — admin hard-delete (soft via IsDeleted)
        [HttpDelete("{id:guid}")]
        [HasPermission(Permissions.Appointments.Cancel)]
        public async Task<IActionResult> DeleteAppointment(Guid id)
        {
            await sender.Send(new DeleteAppointmentCommand(id));
            return NoContent();
        }
    }
}
