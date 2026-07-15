using FluentValidation;
using HMS.Application.Visits.Commands;

namespace HMS.Application.Visits.Validators
{
    public class CreateVisitCommandValidator : AbstractValidator<CreateVisitCommand>
    {
        public CreateVisitCommandValidator()
        {
            RuleFor(x => x.Dto.PatientId)
                .NotEmpty().WithMessage("Patient is required.");

            RuleFor(x => x.Dto.DoctorId)
                .NotEmpty().WithMessage("Doctor is required.");

            RuleFor(x => x.Dto.AdmissionDate)
                .NotEmpty().WithMessage("Admission date is required.")
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Admission date cannot be in the future.");

            RuleFor(x => x.Dto.Diagnosis)
                .NotEmpty().WithMessage("Diagnosis is required.")
                .MaximumLength(1000);

            RuleFor(x => x.Dto.Treatment)
                .NotEmpty().WithMessage("Treatment is required.")
                .MaximumLength(2000);
        }
    }

    public class UpdateVisitCommandValidator : AbstractValidator<UpdateVisitCommand>
    {
        public UpdateVisitCommandValidator()
        {
            RuleFor(x => x.VisitId)
                .NotEmpty().WithMessage("Visit ID is required.");

            RuleFor(x => x.Dto.Diagnosis)
                .MaximumLength(1000)
                .When(x => x.Dto.Diagnosis is not null);

            RuleFor(x => x.Dto.Treatment)
                .MaximumLength(2000)
                .When(x => x.Dto.Treatment is not null);
        }
    }

    public class DischargeVisitCommandValidator : AbstractValidator<DischargeVisitCommand>
    {
        public DischargeVisitCommandValidator()
        {
            RuleFor(x => x.VisitId)
                .NotEmpty().WithMessage("Visit ID is required.");

            RuleFor(x => x.Dto.DischargeDate)
                .NotEmpty().WithMessage("Discharge date is required.")
                .LessThanOrEqualTo(DateTime.UtcNow).WithMessage("Discharge date cannot be in the future.");

            RuleFor(x => x.Dto.FinalDiagnosis)
                .MaximumLength(1000)
                .When(x => x.Dto.FinalDiagnosis is not null);

            RuleFor(x => x.Dto.FinalTreatment)
                .MaximumLength(2000)
                .When(x => x.Dto.FinalTreatment is not null);
        }
    }
}
