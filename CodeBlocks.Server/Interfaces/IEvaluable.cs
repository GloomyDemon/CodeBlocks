namespace CodeBlocks.Server.Interfaces;

public interface IEvaluable<T>: IValue, IComparable<IEvaluable<T>>, IEquatable<IEvaluable<T>>
{
    public T Evaluate();
}
