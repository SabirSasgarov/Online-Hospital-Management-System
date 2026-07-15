using FluentValidation;
using HMS.Application.Wards.Commands;
namespace HMS.Application.Wards.Validators
{
    public class CreateWardCommandValidator : AbstractValidator<CreateWardCommand>
    {
        public CreateWardCommandValidator()
        {
            RuleFor(x => x.Dto.Name)
                .NotEmpty().WithMessage("Ward name is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Type)
                .NotEmpty().WithMessage("Ward type/specialty is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Floor)
                .GreaterThanOrEqualTo(0).WithMessage("Floor must be 0 or higher.");
        }
    }

    public class UpdateWardCommandValidator : AbstractValidator<UpdateWardCommand>
    {
        public UpdateWardCommandValidator()
        {
            RuleFor(x => x.WardId).NotEmpty();

            RuleFor(x => x.Dto.Name)
                .NotEmpty().WithMessage("Ward name is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Type)
                .NotEmpty().WithMessage("Ward type/specialty is required.")
                .MaximumLength(100);

            RuleFor(x => x.Dto.Floor)
                .GreaterThanOrEqualTo(0).WithMessage("Floor must be 0 or higher.");
        }
    }
}
