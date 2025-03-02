using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Models.Order;

namespace backend.Utility
{
    public class NSDbContext : DbContext
    {
        public NSDbContext(DbContextOptions<NSDbContext> options) : base(options)
        { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Orders> Orders { get; set; } = null!;
        public DbSet<OrderDetails> OrderDetails { get; set; } = null!;
        IConfiguration configuration = (new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build());

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
       => optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id).HasColumnName("user_id");
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(100).HasColumnName("phone");
                entity.Property(e => e.Password).IsRequired().HasMaxLength(100);
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(100).HasColumnName("full_name");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Manufacturer).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).IsRequired();
                entity.Property(e => e.Quantity).IsRequired();
            });

            modelBuilder.Entity<Orders>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("order_id");

                entity.Property(e => e.OrderDate)
                    .IsRequired()
                    .HasColumnName("created_date");

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasColumnName("user_id");

                entity.Property(e => e.OrderDescription)
                    .IsRequired()
                    .HasColumnName("order_description");

                entity.Property(e => e.OrderCustomerFullname)
                    .IsRequired()
                    .HasColumnName("order_customer_fullname");

                entity.Property(e => e.OrderAddress)
                    .IsRequired()
                    .HasColumnName("order_address");

                entity.Property(e => e.OrderCustomerPhone)
                    .IsRequired()
                    .HasColumnName("order_customer_phone");

                entity.Property(e => e.OrderTotal)
                    .IsRequired()
                    .HasColumnName("order_total");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasColumnName("status")
                    .HasConversion<int>();

                entity.HasMany(e => e.OrderDetailsList)
                    .WithOne(e => e.Order)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderDetails>(entity =>
            {
                entity.HasKey(e => new { e.OrderId, e.ProductId });

                entity.Property(e => e.OrderId)
                    .IsRequired()
                    .HasColumnName("order_id");

                entity.Property(e => e.ProductId)
                    .IsRequired()
                    .HasColumnName("product_id");

                entity.HasOne(e => e.Order)
                    .WithMany(e => e.OrderDetailsList)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.Quantity).IsRequired();
            });


        }
    }
}
