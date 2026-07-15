using FluentValidation;
using HMS.Application.Doctors.Commands;

namespace HMS.Application.Doctors.Validators
{
    public class UpdateDoctorCommandValidator : AbstractValidator<UpdateDoctorCommand>
    {
        public UpdateDoctorCommandValidator()
        {
            RuleFor(x => x.DoctorId).NotEmpty();

            RuleFor(x => x.Dto.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Specialization)
                .NotEmpty().WithMessage("Specialization is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Phone)
                .NotEmpty().WithMessage("Phone is required.")
                .MaximumLength(20);
        }
    }
}
