"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import BookCallDialog from "./BookCallDialog";

export function RequestApiAccessBtn() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button variant="ghost" onClick={handleClick}>
        request api access
      </Button>
      <BookCallDialog
        title="request api access"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
