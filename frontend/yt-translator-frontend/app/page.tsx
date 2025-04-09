import { Button, Input } from "@material-tailwind/react";
import { CloudUpload, NavArrowRight } from "iconoir-react";


export default function Home() {
  return (
    <div className="flex justify-center mt-40">
      
        

<form className=" mt-40 text-3xl">
  <Input size="lg" placeholder="YouTube Link" className="p-4 mb-4"/>
  <div className="flex flex-wrap justify-center gap-4">
  <Button variant="gradient" className="rounded-lg">
        Start Translation Job
        <NavArrowRight className="ml-1 h-4 w-4 stroke-2" />
      </Button>
      </div>
</form>


    </div>
  );
}
