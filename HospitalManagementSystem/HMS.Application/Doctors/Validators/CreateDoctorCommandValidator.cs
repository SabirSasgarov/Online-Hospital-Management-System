using FluentValidation;
using HMS.Application.Doctors.Commands;

namespace HMS.Application.Doctors.Validators
{
    public class CreateDoctorCommandValidator : AbstractValidator<CreateDoctorCommand>
    {
        public CreateDoctorCommandValidator()
        {
            RuleFor(x => x.Dto.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email is required.");

            RuleFor(x => x.Dto.UserName)
                .NotEmpty().WithMessage("Username is required.")
                .MinimumLength(3)
                .MaximumLength(50)
                .Matches(@"^[a-zA-Z0-9._-]+$").WithMessage("Username may only contain letters, digits, '.', '_', and '-'.");

            RuleFor(x => x.Dto.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(8)
                .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches(@"[0-9]").WithMessage("Password must contain at least one digit.")
                .Matches(@"[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");

            RuleFor(x => x.Dto.Specialization)
                .NotEmpty().WithMessage("Specialization is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Phone)
                .NotEmpty().WithMessage("Phone is required.")
                .MaximumLength(20);

            RuleForEach(x => x.Dto.Schedules).ChildRules(s =>
            {
                s.RuleFor(sc => sc.StartTime)
                    .LessThan(sc => sc.EndTime).WithMessage("Start time must be before end time.");
            });

            RuleFor(x => x.Dto.Schedules)
                .Must(list => list.Select(s => s.Day).Distinct().Count() == list.Count)
                .WithMessage("Each day can only appear once in the schedule.");
        }
    }
}
