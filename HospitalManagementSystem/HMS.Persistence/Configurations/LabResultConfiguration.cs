using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class LabResultConfiguration : IEntityTypeConfiguration<LabResult>
    {
        public void Configure(EntityTypeBuilder<LabResult> builder)
        {
            builder.HasKey(l => l.Id);

            builder.HasOne(l => l.Patient)
                   .WithMany(p => p.LabResults)
                   .HasForeignKey(l => l.PatientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(l => l.Visit)
                   .WithMany(v => v.LabResults)
                   .HasForeignKey(l => l.VisitId)
                   .OnDelete(DeleteBehavior.Restrict);

            // The staff member who ordered the result — no navigation collection on AppUser side
            builder.HasOne(l => l.OrderedBy)
                   .WithMany()
                   .HasForeignKey(l => l.OrderedById)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.Property(l => l.TestName).IsRequired().HasMaxLength(150);
            builder.Property(l => l.Result).IsRequired().HasMaxLength(200);
            builder.Property(l => l.NormalRange).HasMaxLength(100);
            builder.Property(l => l.Notes).HasMaxLength(500);

            builder.Property(l => l.Status)
                   .HasConversion<string>()
                   .HasMaxLength(20);

            builder.HasQueryFilter(l => !l.IsDeleted);
        }
    }
}
