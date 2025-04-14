'use client';

import { useEffect, useState } from 'react';

type Job = {
  videoId: string;
  createdAt: string;
  status: string;
};

export default function UserJobsTable({ userId }: { userId: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/user-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        if (res.ok) {
          setJobs(data.items);
        } else {
          console.error('Error fetching jobs:', data.error);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchJobs();
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!jobs.length) return <p>No jobs found.</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Your Translation Jobs</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Video ID</th>
            <th className="border-b p-2">Date Created</th>
            <th className="border-b p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, idx) => (
            <tr key={idx}>
              <td className="border-b p-2">{job.videoId}</td>
              <td className="border-b p-2">{new Date(job.createdAt).toLocaleString()}</td>
              <td className="border-b p-2">{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
