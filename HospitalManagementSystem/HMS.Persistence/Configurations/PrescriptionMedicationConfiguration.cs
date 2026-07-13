using HMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HMS.Persistence.Configurations
{
    public class PrescriptionMedicationConfiguration : IEntityTypeConfiguration<PrescriptionMedication>
    {
        public void Configure(EntityTypeBuilder<PrescriptionMedication> builder)
        {
            builder.HasKey(m => m.Id);

            builder.HasOne(m => m.Prescription)
                   .WithMany(p => p.Medications)
                   .HasForeignKey(m => m.PrescriptionId)
                   .OnDelete(DeleteBehavior.Cascade); // medications are meaningless without the prescription

            builder.Property(m => m.Name).IsRequired().HasMaxLength(100);
            builder.Property(m => m.Dosage).IsRequired().HasMaxLength(50);
            builder.Property(m => m.Frequency).IsRequired().HasMaxLength(100);
            builder.Property(m => m.Duration).IsRequired().HasMaxLength(50);
            builder.Property(m => m.Instructions).HasMaxLength(500);
        }
    }
}
