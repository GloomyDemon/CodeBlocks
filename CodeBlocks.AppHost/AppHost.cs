var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.CodeBlocks_Server>("codeblocks-server");

builder.Build().Run();
