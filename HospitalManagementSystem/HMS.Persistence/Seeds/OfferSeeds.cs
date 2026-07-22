namespace HMS.Persistence.Seeds
{
    /// <summary>
    /// Seeds the default "What CareFlow Offers" cards shown on the public home page so the
    /// section isn't empty out of the box. Admins can edit/replace these from the Offers CMS page.
    /// </summary>
    public static class OfferSeeds
    {
        public static async Task SeedAsync(IServiceProvider sp)
        {
            var db = sp.GetRequiredService<AppDbContext>();

            if (await db.Offers.AnyAsync()) return;

            db.Offers.AddRange(
                new Offer { Title = "Easy Appointment Booking", Description = "Book, reschedule, or cancel appointments with your doctor in a few clicks, with automatic conflict detection.", Icon = "CalendarCheck", DisplayOrder = 0, IsActive = true },
                new Offer { Title = "Complete Medical Records", Description = "Prescriptions, lab results, discharge summaries, and visit history, all in one place for you and your care team.", Icon = "Stethoscope", DisplayOrder = 1, IsActive = true },
                new Offer { Title = "Lab Results, Fast", Description = "See your results the moment they are ready, with clear status flags so nothing important gets missed.", Icon = "FlaskConical", DisplayOrder = 2, IsActive = true },
                new Offer { Title = "Secure Messaging", Description = "Message your doctor directly and get notified the moment they reply, all inside the portal.", Icon = "MessageSquare", DisplayOrder = 3, IsActive = true },
                new Offer { Title = "Built for Every Role", Description = "Purpose-built dashboards for admins, doctors, nurses, and patients, each seeing exactly what they need.", Icon = "Users", DisplayOrder = 4, IsActive = true },
                new Offer { Title = "Secure & Audited", Description = "Role-based access control and a full audit trail keep every record protected and accountable.", Icon = "ShieldCheck", DisplayOrder = 5, IsActive = true }
            );

            await db.SaveChangesAsync();
        }
    }
}
