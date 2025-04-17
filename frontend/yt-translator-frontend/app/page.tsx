"use client";
import * as React from "react";
import { Button, Input } from "@material-tailwind/react";
import { CloudUpload, NavArrowRight } from "iconoir-react";
import { Typography } from "@material-tailwind/react";
import { useAuth } from "react-oidc-context";
import UserJobsTable from "@/components/UserJobsTable";
require("dotenv").config("../.env");
export default function Home() {
  const signOutRedirect = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain =
      "https://us-west-27i0e8mdwo.auth.us-west-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };
  const auth = useAuth();
  console.log(auth.user?.profile.sub);
  console.log(auth.user?.profile.email);
  const [videoUrl, setVideoUrl] = React.useState("");

  const startJob = async () => {
    const userId = auth.user?.profile?.sub;
    const userEmail = auth.user?.profile?.email;
  
    if (!videoUrl || !userId || !userEmail) {
      alert("Missing required fields.");
      return;
    }
  
    try {
      const res = await fetch('/api/start-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          userId,
          userEmail,
        }),
      });
      console.log("Sending job with:", { videoUrl, userId, userEmail });

      const data = await res.json();
      if (res.ok) {
        console.log('Job started for video:', data.videoId);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error("Error sending job:", err);
    }
  };
  

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }
  if (auth.isAuthenticated) {
    return (
      <div>
        <div className="mx-auto max-w-4xl sm:px-10 mt-10 text-center">
          <div className="border p-2 rounded-lg shadow-2xl">
            <Typography type="h1">
              Welcome to YT-Translator {auth.user?.profile.email}!
            </Typography>
            <p className="mt-2">
              Paste your link below and click Start to begin a translation job.
            </p>
          </div>
        </div>

        <div className=" mt-6 mx-auto max-w-md">
          <form className=" w-full flex justify-center gap-2">
            <Input
              size="lg"
              placeholder="YouTube Link"
              className="p-1 mb-2 w-90"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
<Button
  variant="ghost"
  size="xs"
  className="rounded-lg w-25 p-1 mb-2"
  onClick={startJob}
  disabled={!videoUrl || !auth.user?.profile?.sub || !auth.user?.profile?.email}
>
  Start
</Button>
          </form>
        </div>
        <div className="mt-2 mx-auto max-w-lg">
          <UserJobsTable userId={auth.user?.profile.sub} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-4xl text-center mt-2">Please sign in first!</h1>
      <div className="flex justify-center gap-4 mt-2">
        <Button
          size="lg"
          className="px-2 rounded-lg"
          onClick={() => auth.signinRedirect()}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
