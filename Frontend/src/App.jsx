import { useEffect, useState, useRef } from "react";
import { Textarea } from "./components/ui/textarea.jsx";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const idRef = useRef(null);

  const sendReq = async () => {
    const id = idRef.current.value;
    if (!id) {
      toast.error("Please enter a code!", {
        style: {
          borderRadius: "10px",
          background: "#f9b17a",
          color: "black",
        },
      });
      return;
    }
    const text = textareaRef.current.value;
    await fetch("https://zenshare.onrender.com/setText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ id, text }]),
    });
    toast.success("Saved!", {
      style: {
        borderRadius: "10px",
        background: "#f9b17a",
        color: "black",
      },
    });

    setIsEditing(false);
  };

  const setEdit = () => {
    const id = idRef.current.value;
    if (!id) {
      toast.error("Please enter a code!", {
        style: {
          borderRadius: "10px",
          background: "#f9b17a",
          color: "black",
        },
      });
      return;
    }
    getText(id);
    setIsEditing(true);
  };

  const getText = async (id) => {
    const response = await fetch("https://zenshare.onrender.com/getText?id=" + id);
    const data = await response.text();
    textareaRef.current.value = data;
  };

  useEffect(() => {
    getText();
  }, []);

  return (
    <>
      <Toaster />
      <div className="w-full text-center text-xl mt-2 text-[#f9b17a] head">
        zenShare.
      </div>
      <div className="w-full flex items-center flex-col gap-[2vw]">
        <Textarea
          ref={textareaRef}
          className="text-[white] bg-[#2d3250] w-[95vw] h-[80vh] mt-4 text-[13px] font-bold font-mono disabled:text-[white] disabled:opacity-100 disabled:cursor-auto border-[#f9b17a] body"
          disabled={!isEditing}
        />
        <div className="flex justify-center items-center gap-6">
          <div className="w-fit">
            <input
              type="text"
              placeholder="Enter code"
              className="text-white text-[20px] w-[150px] focus:outline-none bg-[#2d3250] border-[1px] border-[#f9b17a] rounded-md p-1 text-center h-[35px]"
              ref={idRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  {
                    getText(e.target.value);
                  }
                }
              }}
            />
          </div>
          <div className="justify-start">
            {isEditing ? (
              <button
                className="text-black bg-[#f9b17a] px-4 rounded-md h-[35px]"
                onClick={sendReq}
              >
                Save
              </button>
            ) : (
              <button
                className="text-black bg-[#f9b17a] px-4 rounded-md h-[35px]"
                onClick={setEdit}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
