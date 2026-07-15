using FluentValidation;
using HMS.Application.Patients.Commands;

namespace HMS.Application.Patients.Validators
{
    public class UpdateMedicalHistoryCommandValidator : AbstractValidator<UpdateMedicalHistoryCommand>
    {
        private static readonly string[] ValidBloodTypes =
            ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

        public UpdateMedicalHistoryCommandValidator()
        {
            RuleFor(x => x.PatientId)
                .NotEmpty().WithMessage("Patient ID is required.");

            RuleFor(x => x.Dto.BloodType)
                .Must(b => string.IsNullOrEmpty(b) || ValidBloodTypes.Contains(b))
                    .WithMessage($"Blood type must be one of: {string.Join(", ", ValidBloodTypes)}.");

            RuleFor(x => x.Dto.Conditions)
                .MaximumLength(1000).WithMessage("Conditions must not exceed 1000 characters.");

            RuleFor(x => x.Dto.Allergies)
                .MaximumLength(500).WithMessage("Allergies must not exceed 500 characters.");
        }
    }
}
