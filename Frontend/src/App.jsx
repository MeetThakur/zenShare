import React, { useEffect, useState, useRef } from "react";
import { Textarea } from "./components/ui/textarea.jsx";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "./components/ui/dialog.jsx";

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [checkPassword, setCheckPassword] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const textareaRef = useRef(null);

  const unlock = () => {
    if (inputPassword === "meet") {
      setIsEditing(true);
      setCheckPassword(false);
      setIsDialogOpen(false);
    } else {
      alert("Incorrect password");
    }
  };

  const sendReq = async () => {
    const text = textareaRef.current.value;
    await fetch("https://zens.onrender.com/setText", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ text }])
    });
    setIsEditing(false);
  };

  const getText = async () => {
    const response = await fetch("https://zens.onrender.com/getText");
    const data = await response.text();
    textareaRef.current.value = data;
  };

  useEffect(() => {
    getText();
  }, []);

  return (
    <>
      <div className="w-full text-center text-xl mt-2 text-[white] head">zenShare.</div>
      <div className="w-full flex items-center flex-col gap-[2vw]">
        <Textarea
          ref={textareaRef}
          className="text-[white] w-[90vw] h-[80vh] mt-4 text-[12px] font-mono disabled:text-[white] disabled:opacity-100 disabled:cursor-auto"
          disabled={!isEditing}
        />
        <div className="justify-start">
          {isEditing ? (
            <button
              className="text-black bg-white px-2 rounded-md"
              onClick={sendReq}
            >
              Save
            </button>
          ) : (
            <button
              className="text-black bg-white px-2 rounded-md"
              onClick={checkPassword ? () => setIsDialogOpen(true) : () => setIsEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="hidden">Open Dialog</button>
        </DialogTrigger>
        <DialogContent className="bg-[#09090b]">
          <DialogTitle>Enter Password</DialogTitle>
          <DialogDescription className="text-white">
            Please enter the password to unlock editing.
          </DialogDescription>
          <input
            type="text"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="rounded-lg p-2 w-full"
          />
          <div className="mt-4 flex justify-end">
            <button
              className="text-black bg-white px-2 rounded-md mr-2"
              onClick={unlock}
            >
              Unlock
            </button>
            <DialogClose asChild>
              <button className="text-black bg-white px-2 rounded-md">
                Cancel
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
