FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Ecoture/Ecoture.csproj", "Ecoture/"]
RUN dotnet restore "Ecoture/Ecoture.csproj"
COPY . .
WORKDIR "/src/Ecoture"
RUN dotnet publish "Ecoture.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Ecoture.dll"]
