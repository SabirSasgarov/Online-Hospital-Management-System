namespace HMS.Persistence.Configurations
{
	public class OfferConfiguration : IEntityTypeConfiguration<Offer>
	{
		public void Configure(EntityTypeBuilder<Offer> builder)
		{
			builder.HasKey(o => o.Id);

			builder.Property(o => o.Title).IsRequired().HasMaxLength(200);
			builder.Property(o => o.Description).IsRequired().HasMaxLength(500);
			builder.Property(o => o.Icon).IsRequired().HasMaxLength(100);

			builder.HasIndex(o => new { o.IsActive, o.DisplayOrder });

			builder.HasQueryFilter(o => !o.IsDeleted);
		}
	}
}
