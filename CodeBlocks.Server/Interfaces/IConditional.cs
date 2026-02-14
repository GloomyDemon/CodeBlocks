namespace CodeBlocks.Server.Interfaces;

public interface IConditional: IBlock
{
    IEvaluable<bool> Condition { get; }
}
