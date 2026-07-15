using FluentValidation;
using HMS.Application.Appointments.Commands;

namespace HMS.Application.Appointments.Validators
{
    public class UpdateAppointmentCommandValidator : AbstractValidator<UpdateAppointmentCommand>
    {
        public UpdateAppointmentCommandValidator()
        {
            RuleFor(x => x.AppointmentId)
                .NotEmpty().WithMessage("Appointment ID is required.");

            RuleFor(x => x.Dto.ScheduledAt)
                .NotEmpty().WithMessage("Appointment date/time is required.")
                .GreaterThan(DateTime.UtcNow).WithMessage("Appointment must be rescheduled to a future date.");

            RuleFor(x => x.Dto.Type)
                .IsInEnum().WithMessage("Invalid appointment type.");

            RuleFor(x => x.Dto.Notes)
                .MaximumLength(1000)
                .When(x => x.Dto.Notes is not null);
        }
    }
}
