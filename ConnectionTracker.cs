public class ConnectionTracker
{
    private int _count = 0;

    public int Increment() => Interlocked.Increment(ref _count);
    public int Decrement() => Interlocked.Decrement(ref _count);
    public int Count        => Volatile.Read(ref _count);
}