using FluentValidation;
using HMS.Application.Doctors.Commands;

namespace HMS.Application.Doctors.Validators
{
    public class UpdateDoctorScheduleCommandValidator : AbstractValidator<UpdateDoctorScheduleCommand>
    {
        public UpdateDoctorScheduleCommandValidator()
        {
            RuleFor(x => x.DoctorId).NotEmpty();

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
