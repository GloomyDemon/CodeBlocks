var builder = DistributedApplication.CreateBuilder(args);

var server = builder.AddProject<Projects.CodeBlocks_Server>("codeblocks-server");

builder.AddExecutable("codeblocks-client", "npm", "../codeblocks.client", "run", "dev")
    .WithEnvironment("services__codeblocks-server__https__0", server.GetEndpoint("https"))
    .WithHttpEndpoint(port: 62408);

builder.Build().Run();
