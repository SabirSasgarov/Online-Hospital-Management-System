using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class DischargeSummaryConfiguration : IEntityTypeConfiguration<DischargeSummary>
    {
        public void Configure(EntityTypeBuilder<DischargeSummary> builder)
        {
            builder.HasKey(ds => ds.Id);

            // One-to-one with Visit — enforced by unique index on VisitId
            builder.HasOne(ds => ds.Visit)
                   .WithOne(v => v.DischargeSummary)
                   .HasForeignKey<DischargeSummary>(ds => ds.VisitId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ds => ds.Patient)
                   .WithMany()
                   .HasForeignKey(ds => ds.PatientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ds => ds.Doctor)
                   .WithMany(d => d.DischargeSummaries)
                   .HasForeignKey(ds => ds.DoctorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(ds => ds.FollowUpInstructions).HasMaxLength(2000);

            builder.HasQueryFilter(ds => !ds.IsDeleted);
        }
    }
}
