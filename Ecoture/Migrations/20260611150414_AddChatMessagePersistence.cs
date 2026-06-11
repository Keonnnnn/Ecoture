using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ecoture.Migrations
{
    /// <inheritdoc />
    public partial class AddChatMessagePersistence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LivechatMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Sender = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDelivered = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LivechatMessages", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2042), new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2043) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2052), new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2053) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2056), new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2057) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2060), new DateTime(2026, 6, 11, 15, 4, 12, 962, DateTimeKind.Utc).AddTicks(2060) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LivechatMessages");

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3631), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3632) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3636), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3636) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3639), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3640) });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3642), new DateTime(2026, 6, 11, 9, 13, 32, 910, DateTimeKind.Utc).AddTicks(3643) });
        }
    }
}
