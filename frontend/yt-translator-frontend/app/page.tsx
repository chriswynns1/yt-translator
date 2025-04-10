import { Button, Input } from "@material-tailwind/react";
import { CloudUpload, NavArrowRight } from "iconoir-react";
import { Typography } from "@material-tailwind/react";


export default function Home() {
  return (
    <div className="">
<div className="mx-auto max-w-4xl sm:px-10 mt-10 text-center">
  <Typography type="h1">Welcome to YT-Translator.</Typography>
<Typography type="h5">YT-Translator uses AI to transcribe, translate, and voice-over YouTube videos—making global content accessible in your language.</Typography>
</div>

<div className=" mt-10 mx-auto max-w-md">
  <form className=" w-full flex justify-center gap-2" >
    <Input size="lg" placeholder="YouTube Link" className="p-1 mb-2 w-90"/>
    <Button variant="ghost" size='xs' className="rounded-lg w-25 p-1 mb-2">
          Start
        </Button>
  </form>
</div>


    </div>
  );
}
