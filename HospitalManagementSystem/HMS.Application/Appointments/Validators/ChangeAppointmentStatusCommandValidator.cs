using FluentValidation;
using HMS.Application.Appointments.Commands;

namespace HMS.Application.Appointments.Validators
{
    public class ChangeAppointmentStatusCommandValidator : AbstractValidator<ChangeAppointmentStatusCommand>
    {
        private static readonly AppointmentStatus[] AllowedTransitions =
            [AppointmentStatus.Cancelled, AppointmentStatus.Completed, AppointmentStatus.NoShow];

        public ChangeAppointmentStatusCommandValidator()
        {
            RuleFor(x => x.AppointmentId)
                .NotEmpty().WithMessage("Appointment ID is required.");

            RuleFor(x => x.Dto.Status)
                .Must(s => AllowedTransitions.Contains(s))
                .WithMessage($"Status must be one of: {string.Join(", ", AllowedTransitions.Select(s => s.ToString()))}.");

            RuleFor(x => x.Dto.Reason)
                .MaximumLength(500)
                .When(x => x.Dto.Reason is not null);
        }
    }
}
