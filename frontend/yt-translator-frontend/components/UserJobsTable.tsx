'use client';

import { useEffect, useState } from 'react';

type Job = {
  videoid: string;
  createdAt: string;
  status: string;
};

export default function UserJobsTable({ userId }: { userId: string }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

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

  const handleDeleteJobs = async () => {
    if (!confirm("Are you sure you want to delete all job history?")) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/delete-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setJobs([]);
      } else {
        const errData = await res.json();
        console.error('Failed to delete jobs:', errData.error);
      }
    } catch (err) {
      console.error('Delete request failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!jobs.length) return <p>No jobs found.</p>;

  return (
    <div className="p-4 border rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Your Translation Jobs</h2>
        <button
          onClick={handleDeleteJobs}
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete All'}
        </button>
      </div>
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
              <td className="border-b p-2">{job.videoid}</td>
              <td className="border-b p-2">{new Date(job.createdAt).toLocaleString()}</td>
              <td className="border-b p-2">{job.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
