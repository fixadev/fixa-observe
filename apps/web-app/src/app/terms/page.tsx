"use client";

import { useEffect } from "react";

export default function TermsPage() {
  useEffect(() => {
    window.location.href =
      "https://fixa-docs.s3.us-east-1.amazonaws.com/fixa+terms+(1).pdf";
  }, []);

  return null;
}
