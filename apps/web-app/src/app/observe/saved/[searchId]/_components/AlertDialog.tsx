"use client";
import { type AlertWithDetails } from "@repo/types/src/index";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { WarningDialog } from "~/app/_components/WarningDialog";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { isTempId } from "~/lib/utils";
import { AlertCard } from "./AlertDetailsCard";
import { instantiateAlert } from "~/lib/instantiate";
import Spinner from "~/components/Spinner";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useObserveState } from "~/components/hooks/useObserveState";

export function CreateEditAlertDialog({
  open,
  setOpen,
  savedSearchId,
  selectedAlert,
  voidSelectedAlert,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  savedSearchId: string;
  selectedAlert: AlertWithDetails | null;
  voidSelectedAlert: () => void;
}) {
  const { setSavedSearch } = useObserveState();
  const [alert, setAlert] = useState<AlertWithDetails | null>(null);

  useEffect(() => {
    console.log("selectedAlert", selectedAlert);
    if (selectedAlert) {
      setAlert(selectedAlert);
    } else {
      setAlert(instantiateAlert({ savedSearchId }));
    }
  }, [selectedAlert, savedSearchId]);

  const { mutate: createAlert, isPending: isCreating } =
    api.search.createAlert.useMutation({
      onSuccess: (data) => {
        setSavedSearch((prev) =>
          prev
            ? {
                ...prev,
                alerts: prev.alerts ? [...prev.alerts, data] : [data],
              }
            : prev,
        );
        voidSelectedAlert();
        setOpen(false);
      },
    });

  const { mutate: updateAlert, isPending: isUpdating } =
    api.search.updateAlert.useMutation({
      onSuccess: (data) => {
        setSavedSearch((prev) =>
          prev
            ? {
                ...prev,
                alerts: prev.alerts?.map((a) => (a.id === data.id ? data : a)),
              }
            : prev,
        );
        voidSelectedAlert();
        setOpen(false);
      },
    });

  const { mutate: deleteAlert, isPending: isDeleting } =
    api.search.deleteAlert.useMutation({
      onSuccess: () => {
        setSavedSearch((prev) =>
          prev
            ? {
                ...prev,
                alerts: prev.alerts?.filter((a) => a.id !== alert?.id),
              }
            : prev,
        );
        voidSelectedAlert();
        setOpen(false);
      },
    });

  const handleSubmit = () => {
    if (!alert) return;
    if (isTempId(alert.id)) {
      console.log("creating alert", alert);
      createAlert(alert);
    } else {
      updateAlert(alert);
    }
  };

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex min-h-[400px] min-w-[600px] flex-col">
        <DialogHeader>
          <DialogTitle>alert details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <AlertCard
            alert={alert}
            onUpdate={setAlert}
            searchId={savedSearchId}
          />
        </div>
        <DialogFooter className="mt-auto flex flex-row justify-between sm:justify-between">
          <WarningDialog
            title="delete alert"
            message="are you sure you want to delete this alert?"
            onConfirm={() => deleteAlert({ id: alert.id })}
            isPending={isDeleting}
          >
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-500"
              disabled={isCreating || isUpdating || isDeleting}
            >
              {isDeleting ? (
                <Spinner />
              ) : (
                <TrashIcon className="size-5 text-black" />
              )}
            </Button>
          </WarningDialog>
          <div className="flex flex-row gap-3">
            {/* <Button
              variant="outline"
              onClick={() => voidSelectedAlert()}
              disabled={isCreating || isUpdating || isDeleting}
            >
              cancel
            </Button> */}
            <Button
              className="w-20"
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || isDeleting}
            >
              {isCreating || isUpdating ? <Spinner /> : "save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
