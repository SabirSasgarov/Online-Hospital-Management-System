using FluentValidation;
using HMS.Application.Patients.Commands;

namespace HMS.Application.Patients.Validators
{
    public class CreatePatientCommandValidator : AbstractValidator<CreatePatientCommand>
    {
        private static readonly string[] ValidBloodTypes =
            ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

        public CreatePatientCommandValidator()
        {
            RuleFor(x => x.Dto.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(100).WithMessage("First name must not exceed 100 characters.");

            RuleFor(x => x.Dto.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(100).WithMessage("Last name must not exceed 100 characters.");

            RuleFor(x => x.Dto.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email address is required.")
                .MaximumLength(256).WithMessage("Email must not exceed 256 characters.");

            RuleFor(x => x.Dto.UserName)
                .NotEmpty().WithMessage("Username is required.")
                .MinimumLength(3).WithMessage("Username must be at least 3 characters.")
                .MaximumLength(50).WithMessage("Username must not exceed 50 characters.")
                .Matches(@"^[a-zA-Z0-9._-]+$").WithMessage("Username may only contain letters, digits, '.', '_', and '-'.");

            RuleFor(x => x.Dto.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"[0-9]").WithMessage("Password must contain at least one digit.")
                .Matches(@"[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

            RuleFor(x => x.Dto.DateOfBirth)
                .NotEmpty().WithMessage("Date of birth is required.")
                .Must(d => d < DateOnly.FromDateTime(DateTime.Today))
                    .WithMessage("Date of birth must be in the past.")
                .Must(d => d >= new DateOnly(1900, 1, 1))
                    .WithMessage("Date of birth is not realistic.");

            RuleFor(x => x.Dto.Gender)
                .IsInEnum().WithMessage("Invalid gender value.");

            RuleFor(x => x.Dto.BloodType)
                .NotEmpty().WithMessage("Blood type is required.")
                .Must(b => ValidBloodTypes.Contains(b))
                    .WithMessage($"Blood type must be one of: {string.Join(", ", ValidBloodTypes)}.");

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
