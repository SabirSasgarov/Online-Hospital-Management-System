namespace HMS.Persistence.Configurations
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.Id);

            // One AppUser → one Patient profile
            builder.HasOne(p => p.User)
                   .WithOne()
                   .HasForeignKey<Patient>(p => p.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(p => p.UserId).IsUnique();

            builder.Property(p => p.Gender)
                   .HasConversion<string>()
                   .HasMaxLength(10);

            builder.Property(p => p.BloodType).HasMaxLength(5);
            builder.Property(p => p.Phone).HasMaxLength(20);
            builder.Property(p => p.Address).HasMaxLength(300);
            builder.Property(p => p.EmergencyContactName).HasMaxLength(100);
            builder.Property(p => p.EmergencyContactPhone).HasMaxLength(20);
            builder.Property(p => p.Conditions).HasMaxLength(1000);
            builder.Property(p => p.Allergies).HasMaxLength(500);

            // Soft-delete filter — all queries automatically exclude deleted records
            builder.HasQueryFilter(p => !p.IsDeleted);
        }
    }
}
