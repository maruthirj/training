package com.mydomain;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;

public class ThreadPool
{
	static Runnable runner = new Runnable(){
		public void run() {
			for(int i=0; i< 10000; i++){
				System.out.println("Thread: "+Thread.currentThread().getName());
			}
		};
	};
	
	public static void main(String[] args) {
		//ThreadPool tp = new ThreadPool(5);
		Executor executor = Executors.newFixedThreadPool(5);
		for(int i=0; i<100; i++){
			//tp.addTask(runner);
			executor.execute(runner);
		}
		for(int i=0; i<100; i++){
			runner.run();
		}
	}
    private final BlockingQueue<Runnable> workerQueue;
    private final Thread[] workerThreads;
    private volatile boolean shutdown;
 
    public ThreadPool(int N)
    {
        workerQueue = new LinkedBlockingQueue<Runnable>();
        workerThreads = new Thread[N];
 
        //Start N Threads and keep them running
        for (int i = 0; i < N; i++) {
            workerThreads[i] = new Worker("Pool Thread " + i);
            workerThreads[i].start();
        }
    }
 
    public void addTask(Runnable r)
    {
        try {
            workerQueue.put(r);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
 
    public void shutdown()
    {
        while (!workerQueue.isEmpty()) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                //interruption
            }
        }
        shutdown = true;
        for (Thread workerThread : workerThreads) {
            workerThread.interrupt();
        }
    }
 
    private class Worker
            extends Thread
    {
        public Worker(String name)
        {
            super(name);
        }
 
        public void run()
        {
            while (!shutdown) {
                try {
                    //each thread waits for next runnable and executes it's run method
                    Runnable r = workerQueue.take();
                    r.run();
                } catch (InterruptedException e) {
                    //ignore
                }
            }
        }
    }
 
}
