namespace HMS.Persistence.Configurations
{
    public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> builder)
        {
            builder.HasKey(d => d.Id);

            builder.HasOne(d => d.User)
                   .WithOne()
                   .HasForeignKey<Doctor>(d => d.UserId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(d => d.UserId).IsUnique();

            builder.Property(d => d.Specialization).IsRequired().HasMaxLength(100);
            builder.Property(d => d.Phone).HasMaxLength(20);

            builder.HasQueryFilter(d => !d.IsDeleted);
        }
    }
}
