"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { type LlmResponse } from "retell-sdk/resources/llm.mjs";
import { type Call } from "retell-sdk/resources/call.mjs";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type State = LlmResponse.State & { calls: Call.CallResponse[] };

interface NodeModalProps {
  children: React.ReactNode;
  title: string;
  state: State;
}

export function NodeModal({ children, title, state }: NodeModalProps) {
  const [selectedCall, setSelectedCall] = useState<Call.CallResponse | null>(
    null,
  );

  useEffect(() => {
    if (state.calls.length > 0 && !selectedCall && state.calls[0]) {
      setSelectedCall(state.calls[0]);
    }
  }, [selectedCall, state.calls]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-screen-xl p-0">
        <DialogHeader>
          {/* <DialogTitle>{title}</DialogTitle> */}
          <div className="flex h-[75vh] w-full flex-row">
            <div className="flex w-1/4 flex-col gap-2 overflow-y-auto border-r border-input p-2">
              <div className="text-md p-2 font-medium">Calls</div>
              {state.calls.length > 0 ? (
                state.calls.map((call) => (
                  <div
                    key={call.call_id}
                    onClick={() => setSelectedCall(call)}
                    className={cn(
                      "h-[100px] overflow-hidden rounded-md border border-input p-6 shadow-sm",
                      selectedCall?.call_id === call.call_id ? "bg-muted" : "",
                    )}
                  >
                    {call.call_id}
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No calls available
                </div>
              )}
            </div>
            <div className="flex w-3/4 flex-col gap-4 p-4">
              {selectedCall ? (
                <>
                  <div className="rounded-lg border border-input bg-card p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Call ID
                        </div>
                        <div className="mt-1 text-lg">
                          {selectedCall.call_id}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          User ID
                        </div>
                        {/* <div className="mt-1">{selectedCall.user_id}</div> */}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Created At
                        </div>
                        <div className="mt-1">
                          {/* {new Date(selectedCall.created_at).toLocaleString()} */}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Call Status
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              selectedCall.call_analysis?.call_successful
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedCall.call_analysis?.call_successful
                              ? "Successful"
                              : "Failed"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-input bg-card p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          Call Summary
                        </div>
                        <div className="mt-2 leading-relaxed">
                          {selectedCall.call_analysis?.call_summary ??
                            "No summary available"}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No calls selected
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
