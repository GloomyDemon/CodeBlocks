using System.Collections;

namespace CodeBlocks.Server.Interfaces;

public interface IContainer<T>: IBlock, IEnumerable<T> where T: IBlock
{
    List<T> Blocks { get; }
    IEnumerator<T> IEnumerable<T>.GetEnumerator() => Blocks.GetEnumerator();
    IEnumerator IEnumerable.GetEnumerator() => ((IEnumerable<T>)this).GetEnumerator();
}
