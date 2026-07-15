using FluentValidation;
using HMS.Application.Appointments.Commands;

namespace HMS.Application.Appointments.Validators
{
    public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
    {
        public CreateAppointmentCommandValidator()
        {
            RuleFor(x => x.Dto.PatientId)
                .NotEmpty().WithMessage("Patient is required.");

            RuleFor(x => x.Dto.DoctorId)
                .NotEmpty().WithMessage("Doctor is required.");

            RuleFor(x => x.Dto.ScheduledAt)
                .NotEmpty().WithMessage("Appointment date/time is required.")
                .GreaterThan(DateTime.UtcNow).WithMessage("Appointment must be scheduled in the future.");

            RuleFor(x => x.Dto.Type)
                .IsInEnum().WithMessage("Invalid appointment type.");

            RuleFor(x => x.Dto.Notes)
                .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters.")
                .When(x => x.Dto.Notes is not null);
        }
    }
}
