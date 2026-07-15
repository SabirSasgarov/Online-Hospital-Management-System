using FluentValidation;
using HMS.Application.Patients.Commands;

namespace HMS.Application.Patients.Validators
{
    public class UpdatePatientCommandValidator : AbstractValidator<UpdatePatientCommand>
    {
        public UpdatePatientCommandValidator()
        {
            RuleFor(x => x.PatientId)
                .NotEmpty().WithMessage("Patient ID is required.");

            RuleFor(x => x.Dto.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

            RuleFor(x => x.Dto.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");

            RuleFor(x => x.Dto.Phone)
                .NotEmpty().WithMessage("Phone number is required.")
                .MaximumLength(20).WithMessage("Phone number must not exceed 20 characters.");

            RuleFor(x => x.Dto.Address)
                .MaximumLength(500).WithMessage("Address must not exceed 500 characters.");

            RuleFor(x => x.Dto.EmergencyContactName)
                .MaximumLength(200).WithMessage("Emergency contact name must not exceed 200 characters.");

            RuleFor(x => x.Dto.EmergencyContactPhone)
                .MaximumLength(20).WithMessage("Emergency contact phone must not exceed 20 characters.");
        }
    }
}
