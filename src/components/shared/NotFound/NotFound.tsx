import { SearchX } from "lucide-react";
import React from "react";

interface Props {
  message: string;
}

const NotFound = ({ message }: Props) => {
  return (
    <div className="w-full">
      <div className="bg-primary/5 h-[360px] w-full flex flex-col items-center justify-center rounded-[20px] border border-dashed border-primary/20">
        {/* Icon */}
        <div className="mb-6 p-6 rounded-full bg-primary/10">
          <SearchX className="w-24 h-24 text-primary opacity-50" strokeWidth={1.5} />
        </div>

        {/* Text Animation applied to message string only */}
        <div className="text-lg font-bold text-[#00253E] text-center max-w-[400px]">
          {message}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
